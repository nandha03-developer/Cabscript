import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/admin-session';

const prisma = new PrismaClient();

/**
 * GET /api/crads/support - Get all support tickets (contacts)
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized - Please login again' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    if (type) {
      where.type = type;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get support tickets (contacts) with pagination
    const [tickets, total] = await Promise.all([
      prisma.contacts.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
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
      }),
      prisma.contacts.count({ where }),
    ]);

    // Add computed fields that frontend expects
    const ticketsWithMeta = tickets.map((ticket) => ({
      ...ticket,
      ticketNumber: `TKT-${ticket.id.toString().padStart(8, "0")}`,
      category: ticket.type, // Map type to category for frontend compatibility
      customerName: ticket.name,
      customerEmail: ticket.email,
      lastResponseAt: ticket.updatedAt,
      _count: {
        messages: ticket.adminNotes ? ticket.adminNotes.split('\n\n').length : 0,
      },
    }));

    return NextResponse.json({
      tickets: ticketsWithMeta,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching support tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch support tickets', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/crads/support - Create a new support ticket
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      customerId,
      name,
      customerName,
      email,
      customerEmail,
      phone,
      subject,
      message,
      description,
      type,
      category,
      priority,
      status,
      source,
    } = body;

    // Support both field naming conventions
    const ticketName = name || customerName;
    const ticketEmail = email || customerEmail;
    const ticketMessage = message || description;
    const ticketType = type || category;

    // Validate required fields
    if (!ticketName || !ticketEmail || !subject || !ticketMessage) {
      return NextResponse.json(
        { error: 'Name, email, subject, and message are required' },
        { status: 400 }
      );
    }

    // Create support ticket
    const ticket = await prisma.contacts.create({
      data: {
        customerId: customerId || null,
        name: ticketName,
        email: ticketEmail,
        phone: phone || null,
        subject,
        message: ticketMessage,
        type: ticketType || 'GENERAL',
        priority: priority || 'MEDIUM',
        status: status || 'NEW',
        source: source || 'admin',
      },
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
      category: ticket.type, // Map type to category for frontend compatibility
      customerName: ticket.name,
      customerEmail: ticket.email,
      lastResponseAt: ticket.updatedAt,
      _count: {
        messages: 0,
      },
    };

    return NextResponse.json(ticketWithMeta, { status: 201 });
  } catch (error: any) {
    console.error('Error creating support ticket:', error);
    return NextResponse.json(
      { error: 'Failed to create support ticket', details: error.message },
      { status: 500 }
    );
  }
}
