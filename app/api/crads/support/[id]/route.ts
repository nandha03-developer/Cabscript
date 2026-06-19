import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/admin-session';

const prisma = new PrismaClient();

/**
 * GET /api/crads/support/[id] - Get a single support ticket
 */
export async function GET(
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

    // Get support ticket
    const ticket = await prisma.contacts.findUnique({
      where: { id },
      include: {
        customers: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            company: true,
          },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Support ticket not found' }, { status: 404 });
    }

    // Add computed fields
    const ticketWithMeta = {
      ...ticket,
      ticketNumber: `TKT-${ticket.id.toString().padStart(8, "0")}`,
      category: ticket.type,
      customerName: ticket.name,
      customerEmail: ticket.email,
      subject: ticket.subject || 'No subject',
      description: ticket.message || '',
      lastResponseAt: ticket.updatedAt,
      resolvedAt: ticket.status === 'RESOLVED' ? ticket.updatedAt : null,
      closedAt: ticket.status === 'CLOSED' ? ticket.updatedAt : null,
      resolution: ticket.adminNotes || null,
      assignedTo: null,
      messages: [],
      _count: {
        messages: ticket.adminNotes ? ticket.adminNotes.split('\n\n').length : 0,
      },
    };

    return NextResponse.json({ ticket: ticketWithMeta });
  } catch (error: any) {
    console.error('Error fetching support ticket:', error);
    return NextResponse.json(
      { error: 'Failed to fetch support ticket', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/crads/support/[id] - Update a support ticket
 */
export async function PATCH(
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
    const { status, priority, type, assignedTo, adminNotes } = body;

    // Build update data
    const updateData: any = {};

    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (type !== undefined) updateData.type = type;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    // Update support ticket
    const ticket = await prisma.contacts.update({
      where: { id },
      data: updateData,
      include: {
        customers: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    // Add computed fields
    const ticketWithMeta = {
      ...ticket,
      ticketNumber: `TKT-${ticket.id.toString().padStart(8, "0")}`,
      category: ticket.type,
      customerName: ticket.name,
      customerEmail: ticket.email,
      subject: ticket.subject || 'No subject',
      description: ticket.message || '',
      lastResponseAt: ticket.updatedAt,
      resolvedAt: ticket.status === 'RESOLVED' ? ticket.updatedAt : null,
      closedAt: ticket.status === 'CLOSED' ? ticket.updatedAt : null,
      resolution: ticket.adminNotes || null,
      assignedTo: null,
      messages: [],
      _count: {
        messages: ticket.adminNotes ? ticket.adminNotes.split('\n\n').length : 0,
      },
    };

    return NextResponse.json({ ticket: ticketWithMeta });
  } catch (error: any) {
    console.error('Error updating support ticket:', error);
    return NextResponse.json(
      { error: 'Failed to update support ticket', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/crads/support/[id] - Delete a support ticket
 */
export async function DELETE(
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

    // Delete support ticket
    await prisma.contacts.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Support ticket deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting support ticket:', error);
    return NextResponse.json(
      { error: 'Failed to delete support ticket', details: error.message },
      { status: 500 }
    );
  }
}
