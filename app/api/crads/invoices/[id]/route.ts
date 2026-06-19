import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/admin-session';

const prisma = new PrismaClient();

/**
 * GET /api/crads/invoices/[id] - Get a single invoice (based on order)
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

    const { id } = await context.params;
    const orderId = parseInt(id);

    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'Invalid invoice ID' }, { status: 400 });
    }

    // Get order (which represents the invoice)
    const order = await prisma.orders.findUnique({
      where: { id: orderId },
      include: {
        customers: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            company: true,
            country: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Transform order to invoice format
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

    const invoice = {
      id: order.id.toString(),
      invoiceNumber: order.orderNumber,
      customerId: order.customerId.toString(),
      customerName: order.billingName,
      customerEmail: order.billingEmail,
      customerPhone: order.billingPhone,
      customerAddress: order.billingAddress ? 
        `${order.billingAddress || ''}${order.billingCity ? '\n' + order.billingCity : ''}${order.billingCountry ? '\n' + order.billingCountry : ''}${order.billingZip ? '\n' + order.billingZip : ''}`.trim() 
        : null,
      billingAddress: order.billingAddress,
      billingCity: order.billingCity,
      billingCountry: order.billingCountry,
      billingZip: order.billingZip,
      subtotal: order.amount,
      taxRate: 0,
      taxAmount: 0,
      discount: 0,
      totalAmount: order.amount,
      currency: order.currency,
      status: invoiceStatus,
      paymentMethod: order.paymentMethod,
      paymentId: order.paymentId,
      paymentStatus: order.paymentStatus,
      paymentDate: order.paidAt?.toISOString() || null,
      dueDate: new Date(new Date(order.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      pdfUrl: null,
      pdfGenerated: false,
      sentToCustomer: order.status !== 'PENDING',
      sentAt: order.status !== 'PENDING' ? order.createdAt.toISOString() : null,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      notes: order.notes,
      termsConditions: 'All sales are final. License keys are non-transferable. Support is provided for 1 year from purchase date.',
      items: [
        {
          id: '1',
          description: `CabScript ${order.plan.charAt(0).toUpperCase() + order.plan.slice(1)} Plan`,
          quantity: 1,
          unitPrice: order.amount,
          total: order.amount,
        },
      ],
      order: {
        id: order.id.toString(),
        orderNumber: order.orderNumber,
        plan: order.plan,
        status: order.status,
        licenseKey: order.licenseKey,
        downloadUrl: order.downloadUrl,
        deliveredAt: order.deliveredAt?.toISOString() || null,
        customers: {
          id: order.customers.id.toString(),
          name: order.customers.name,
          email: order.customers.email,
        },
      },
    };

    return NextResponse.json({ invoice });
  } catch (error: any) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoice', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/crads/invoices/[id] - Update invoice status
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

    const { id } = await context.params;
    const orderId = parseInt(id);

    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'Invalid invoice ID' }, { status: 400 });
    }

    const body = await request.json();
    const { status, notes } = body;

    // Map invoice status to order status
    const updateData: any = {};
    
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    if (status) {
      if (status === 'PAID') {
        updateData.status = 'COMPLETED';
        updateData.paidAt = new Date();
      } else if (status === 'CANCELLED') {
        updateData.status = 'CANCELLED';
      } else if (status === 'REFUNDED') {
        updateData.status = 'REFUNDED';
      }
    }

    // Update order
    const order = await prisma.orders.update({
      where: { id: orderId },
      data: updateData,
      include: {
        customers: true,
      },
    });

    return NextResponse.json({ 
      message: 'Invoice updated successfully',
      invoice: {
        id: order.id.toString(),
        status: order.status,
      },
    });
  } catch (error: any) {
    console.error('Error updating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to update invoice', details: error.message },
      { status: 500 }
    );
  }
}
