import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/admin-session';
import { getSecurityHeaders } from '@/lib/security';

export const dynamic = 'force-dynamic';

/**
 * GET /api/crads/orders
 * List all orders with filtering, search, and pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin session
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const plan = searchParams.get('plan') || '';
    const customerId = searchParams.get('customerId') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    // Search across order number, customer name, email, billing details
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { billingName: { contains: search, mode: 'insensitive' } },
        { billingEmail: { contains: search, mode: 'insensitive' } },
        { customers: { name: { contains: search, mode: 'insensitive' } } },
        { customers: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    // Filter by status
    if (status) {
      where.status = status;
    }

    // Filter by plan
    if (plan) {
      where.plan = plan;
    }

    // Filter by customer
    if (customerId) {
      where.customerId = customerId;
    }

    // Get orders with customer and invoice
    const [ordersRaw, total] = await Promise.all([
      prisma.orders.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          customers: {
            select: {
              id: true,
              name: true,
              email: true,
              company: true,
            },
          },
        },
      }),
      prisma.orders.count({ where }),
    ]);

    // Map customers field to customer for frontend compatibility
    const orders = ordersRaw.map(order => ({
      ...order,
      customer: order.customers, // Map customers to customer
      invoice: null, // No actual invoice table exists yet
      customers: undefined, // Remove the original field
    }));

    return NextResponse.json(
      {
        orders,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
