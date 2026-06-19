import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/admin-session';

const prisma = new PrismaClient();

/**
 * POST /api/crads/support/[id]/messages - Add a message to support ticket
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: idParam } = await context.params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ticket ID' }, { status: 400 });
    }
    
    const body = await request.json();
    const { message, isAdmin } = body;

    // Validate message
    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Check if ticket exists
    const ticket = await prisma.contacts.findUnique({
      where: { id },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Support ticket not found' }, { status: 404 });
    }

    // For now, we'll append the message to the adminNotes field
    // In a real app, you'd have a separate messages table
    const updatedTicket = await prisma.contacts.update({
      where: { id },
      data: {
        adminNotes: ticket.adminNotes
          ? `${ticket.adminNotes}\n\n[${new Date().toISOString()}] ${isAdmin ? 'Admin' : 'Customer'}: ${message}`
          : `[${new Date().toISOString()}] ${isAdmin ? 'Admin' : 'Customer'}: ${message}`,
        status: isAdmin && ticket.status === 'NEW' ? 'IN_PROGRESS' : ticket.status,
      },
      include: {
        customers: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Add computed fields
    const ticketWithMeta = {
      ...updatedTicket,
      ticketNumber: `TKT-${updatedTicket.id.toString().padStart(8, '0')}`,
      category: updatedTicket.type,
      customerName: updatedTicket.name,
      customerEmail: updatedTicket.email,
      lastResponseAt: updatedTicket.updatedAt,
      _count: {
        messages: updatedTicket.adminNotes ? updatedTicket.adminNotes.split('\n\n').length : 0,
      },
    };

    return NextResponse.json(ticketWithMeta);
  } catch (error: any) {
    console.error('Error adding message to support ticket:', error);
    return NextResponse.json(
      { error: 'Failed to add message', details: error.message },
      { status: 500 }
    );
  }
}
