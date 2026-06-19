import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/admin-session';
import { getSecurityHeaders } from '@/lib/security';

export const dynamic = 'force-dynamic';

/**
 * GET /api/crads/customers
 * List all customers with filtering, search, and pagination
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
    const country = searchParams.get('country') || '';
    const hasOrders = searchParams.get('hasOrders');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    // Search across name, email, phone, company
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filter by country
    if (country) {
      where.country = country;
    }

    // Filter by customers with orders
    if (hasOrders === 'true') {
      where.orders = {
        some: {},
      };
    } else if (hasOrders === 'false') {
      where.orders = {
        none: {},
      };
    }

    // Get customers with order counts and support ticket counts
    const [customers, total] = await Promise.all([
      prisma.customers.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              orders: true,
              contacts: true,
            },
          },
        },
      }),
      prisma.customers.count({ where }),
    ]);

    return NextResponse.json(
      {
        customers,
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
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

/**
 * POST /api/crads/customers
 * Create a new customer manually
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin session
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const body = await request.json();
    const { email, name, phone, company, country } = body;

    // Validate required fields
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Check if customer already exists
    const existing = await prisma.customers.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Customer with this email already exists' },
        { status: 409, headers: getSecurityHeaders() }
      );
    }

    // Create customer
    const customer = await prisma.customers.create({
      data: {
        email,
        name,
        phone: phone || null,
        company: company || null,
        country: country || null,
      },
      include: {
        _count: {
          select: {
            orders: true,
            contacts: true,
          },
        },
      },
    });

    // Log activity
    const { logAdminActivity } = await import('@/lib/admin-auth');
    await logAdminActivity(
      session.id,
      'CREATE',
      'customer',
      customer.id.toString(),
      `Created customer: ${customer.name} (${customer.email})`
    );

    return NextResponse.json(
      { customer },
      { status: 201, headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
