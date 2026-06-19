import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/admin-session';
import { getSecurityHeaders } from '@/lib/security';
import { logAdminActivity } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/crads/customers/[id]
 * Get customer details with orders, invoices, and support tickets
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

    const { id: idParam } = await params;
    const id = parseInt(idParam, 10);

    // Validate ID
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid customer ID' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Get customer with all related data
    const customer = await prisma.customers.findUnique({
      where: { id },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
        },
        contacts: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            orders: true,
            contacts: true,
          },
        },
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404, headers: getSecurityHeaders() }
      );
    }

    // Calculate customer statistics
    const totalSpent = customer.orders
      .filter((order) => order.status === 'COMPLETED')
      .reduce((sum, order) => sum + order.amount, 0);

    const pendingContacts = customer.contacts.filter(
      (contact) => contact.status === 'NEW' || contact.status === 'IN_PROGRESS'
    ).length;

    return NextResponse.json(
      {
        customer,
        stats: {
          totalSpent,
          pendingContacts,
          totalOrders: customer._count.orders,
          totalContacts: customer._count.contacts,
        },
      },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

/**
 * PATCH /api/crads/customers/[id]
 * Update customer information
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

    const { id: idParam } = await params;
    const id = parseInt(idParam, 10);

    // Validate ID
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid customer ID' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    const body = await request.json();
    const { name, phone, company, country } = body;

    // Get current customer data
    const existingCustomer = await prisma.customers.findUnique({
      where: { id },
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404, headers: getSecurityHeaders() }
      );
    }

    // Update customer
    const customer = await prisma.customers.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone: phone || null }),
        ...(company !== undefined && { company: company || null }),
        ...(country !== undefined && { country: country || null }),
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
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined;
    const userAgent = request.headers.get('user-agent') || undefined;

    await logAdminActivity(
      session.id,
      'UPDATE',
      'customer',
      id.toString(),
      `Updated customer: ${customer.name}`,
      ipAddress,
      userAgent
    );

    return NextResponse.json(
      { customer },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

/**
 * DELETE /api/crads/customers/[id]
 * Delete a customer and all related data
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

    const { id: idParam } = await params;
    const id = parseInt(idParam, 10);

    // Validate ID
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid customer ID' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Get customer details before deletion
    const customer = await prisma.customers.findUnique({
      where: { id },
      select: { name: true, email: true },
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404, headers: getSecurityHeaders() }
      );
    }

    // Delete customer (cascade will handle related records)
    await prisma.customers.delete({
      where: { id },
    });

    // Log activity
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined;
    const userAgent = request.headers.get('user-agent') || undefined;

    await logAdminActivity(
      session.id,
      'DELETE',
      'customer',
      id.toString(),
      `Deleted customer: ${customer.name} (${customer.email})`,
      ipAddress,
      userAgent
    );

    return NextResponse.json(
      { message: 'Customer deleted successfully' },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
