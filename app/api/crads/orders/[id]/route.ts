import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/admin-session';
import { getSecurityHeaders } from '@/lib/security';
import { logAdminActivity } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/crads/orders/[id]
 * Get order details with customer and invoice
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin session
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const { id } = await params;
    
    // Convert string ID to integer
    const orderId = parseInt(id);
    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Get order with all related data
    const orderRaw = await prisma.orders.findUnique({
      where: { id: orderId },
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

    if (!orderRaw) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404, headers: getSecurityHeaders() }
      );
    }

    // Map customers field to customer for frontend compatibility
    const order = {
      ...orderRaw,
      customer: orderRaw.customers,
      invoice: null, // No actual invoice table exists yet
      customers: undefined,
    };

    return NextResponse.json(
      { order },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

/**
 * PATCH /api/crads/orders/[id]
 * Update order status, notes, license key, etc.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin session
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const { id } = await params;
    
    // Convert string ID to integer
    const orderId = parseInt(id);
    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }
    
    const body = await request.json();
    const { status, notes, licenseKey, downloadUrl, licenseExpiry } = body;

    // Get current order data
    const existingOrder = await prisma.orders.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404, headers: getSecurityHeaders() }
      );
    }

    // Build update data
    const updateData: any = {};
    
    if (status !== undefined) {
      updateData.status = status;
      
      // Update timestamps based on status
      if (status === 'PROCESSING' && !existingOrder.paidAt) {
        updateData.paidAt = new Date();
      } else if (status === 'COMPLETED' && !existingOrder.deliveredAt) {
        updateData.deliveredAt = new Date();
      }
    }

    if (notes !== undefined) updateData.notes = notes || null;
    if (licenseKey !== undefined) updateData.licenseKey = licenseKey || null;
    if (downloadUrl !== undefined) updateData.downloadUrl = downloadUrl || null;
    if (licenseExpiry !== undefined) updateData.licenseExpiry = licenseExpiry ? new Date(licenseExpiry) : null;

    // Update order
    const orderRaw = await prisma.orders.update({
      where: { id: orderId },
      data: updateData,
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

    // Map customers field to customer for frontend compatibility
    const order = {
      ...orderRaw,
      customer: orderRaw.customers,
      invoice: null, // No actual invoice table exists yet
      customers: undefined,
    };

    // Log activity
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined;
    const userAgent = request.headers.get('user-agent') || undefined;

    const changes = [];
    if (status !== undefined) changes.push(`status to ${status}`);
    if (licenseKey !== undefined) changes.push('license key');
    if (notes !== undefined) changes.push('notes');

    await logAdminActivity(
      session.id,
      'UPDATE',
      'order',
      orderId.toString(),
      `Updated order ${order.orderNumber}: ${changes.join(', ')}`,
      ipAddress,
      userAgent
    );

    return NextResponse.json(
      { order },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

/**
 * DELETE /api/crads/orders/[id]
 * Delete an order (use carefully - will also delete invoice)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin session
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const { id } = await params;
    
    // Convert string ID to integer
    const orderId = parseInt(id);
    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Get order details before deletion
    const order = await prisma.orders.findUnique({
      where: { id: orderId },
      select: { orderNumber: true, billingName: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404, headers: getSecurityHeaders() }
      );
    }

    // Delete order (cascade will handle invoice)
    await prisma.orders.delete({
      where: { id: orderId },
    });

    // Log activity
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined;
    const userAgent = request.headers.get('user-agent') || undefined;

    await logAdminActivity(
      session.id,
      'DELETE',
      'order',
      orderId.toString(),
      `Deleted order: ${order.orderNumber} (${order.billingName})`,
      ipAddress,
      userAgent
    );

    return NextResponse.json(
      { message: 'Order deleted successfully' },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
