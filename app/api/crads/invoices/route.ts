import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/admin-session';

const prisma = new PrismaClient();

/**
 * GET /api/crads/invoices - Get all invoices (based on orders)
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { billingEmail: { contains: search, mode: 'insensitive' } },
        { billingName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      // Map invoice status to order status
      if (status === 'PAID') {
        where.status = 'COMPLETED';
      } else if (status === 'PENDING' || status === 'SENT') {
        where.status = 'PROCESSING';
      } else if (status === 'DRAFT') {
        where.status = 'PENDING';
      } else if (status === 'OVERDUE') {
        where.status = 'PENDING';
        where.createdAt = { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }; // 30 days old
      } else if (status === 'CANCELLED') {
        where.status = 'CANCELLED';
      } else if (status === 'REFUNDED') {
        where.status = 'REFUNDED';
      }
    }

    // Get total count
    const total = await prisma.orders.count({ where });

    // Get orders (which represent invoices)
    const orders = await prisma.orders.findMany({
      where,
      include: {
        customers: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Transform orders to invoice format
    const invoices = orders.map((order) => {
      const isOverdue = 
        order.status === 'PENDING' && 
        new Date(order.createdAt).getTime() < Date.now() - 30 * 24 * 60 * 60 * 1000;

      const invoiceStatus = 
        order.status === 'COMPLETED' ? 'PAID' :
        order.status === 'PROCESSING' ? 'SENT' :
        order.status === 'PENDING' ? (isOverdue ? 'OVERDUE' : 'DRAFT') :
        order.status === 'REFUNDED' ? 'REFUNDED' :
        order.status === 'CANCELLED' ? 'CANCELLED' :
        'PENDING';

      return {
        id: order.id.toString(),
        invoiceNumber: order.orderNumber,
        customerId: order.customerId.toString(),
        customerName: order.billingName,
        customerEmail: order.billingEmail,
        subtotal: order.amount,
        taxAmount: 0,
        discount: 0,
        totalAmount: order.amount,
        currency: order.currency,
        status: invoiceStatus,
        paymentMethod: order.paymentMethod,
        paymentDate: order.paidAt?.toISOString() || null,
        dueDate: new Date(new Date(order.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from creation
        sentToCustomer: order.status !== 'PENDING',
        sentAt: order.status !== 'PENDING' ? order.createdAt.toISOString() : null,
        createdAt: order.createdAt.toISOString(),
        order: {
          id: order.id.toString(),
          orderNumber: order.orderNumber,
          plan: order.plan,
          status: order.status,
        },
      };
    });

    // Calculate pagination
    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      invoices,
      pagination: {
        total,
        page,
        limit,
        pages,
      },
    });
  } catch (error: any) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices', details: error.message },
      { status: 500 }
    );
  }
}
