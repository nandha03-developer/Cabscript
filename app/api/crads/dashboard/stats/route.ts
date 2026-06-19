import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/admin-session';
import { prisma } from '@/lib/prisma';
import { getSecurityHeaders } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    // Get current date for comparisons
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Fetch all statistics in parallel
    const [
      totalCustomers,
      customersThisMonth,
      customersLastMonth,
      totalDemoRequests,
      demoRequestsThisMonth,
      demoRequestsLastMonth,
      pendingDemoRequests,
      totalOrders,
      ordersThisMonth,
      ordersLastMonth,
      totalRevenue,
      revenueThisMonth,
      revenueLastMonth,
      totalTickets,
      ticketsThisMonth,
      ticketsLastMonth,
      openTickets,
      upcomingAppointments,
    ] = await Promise.all([
      // Total Customers
      prisma.customers.count(),
      
      // Customers this month
      prisma.customers.count({
        where: {
          createdAt: { gte: startOfMonth },
        },
      }),
      
      // Customers last month
      prisma.customers.count({
        where: {
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
      }),
      
      // Total Demo Requests
      prisma.demo_requests.count(),
      
      // Demo Requests this month
      prisma.demo_requests.count({
        where: {
          createdAt: { gte: startOfMonth },
        },
      }),
      
      // Demo Requests last month
      prisma.demo_requests.count({
        where: {
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
      }),
      
      // Pending Demo Requests
      prisma.demo_requests.count({
        where: {
          status: 'PENDING',
        },
      }),
      
      // Total Orders
      prisma.orders.count(),
      
      // Orders this month
      prisma.orders.count({
        where: {
          createdAt: { gte: startOfMonth },
        },
      }),
      
      // Orders last month
      prisma.orders.count({
        where: {
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
      }),
      
      // Total Revenue
      prisma.orders.aggregate({
        _sum: { amount: true },
        where: { status: 'COMPLETED' },
      }),
      
      // Revenue this month
      prisma.orders.aggregate({
        _sum: { amount: true },
        where: {
          createdAt: { gte: startOfMonth },
          status: 'COMPLETED',
        },
      }),
      
      // Revenue last month
      prisma.orders.aggregate({
        _sum: { amount: true },
        where: {
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
          status: 'COMPLETED',
        },
      }),
      
      // Total Contacts/Support
      prisma.contacts.count(),
      
      // Contacts this month
      prisma.contacts.count({
        where: {
          createdAt: { gte: startOfMonth },
        },
      }),
      
      // Contacts last month
      prisma.contacts.count({
        where: {
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
      }),
      
      // Open Contacts
      prisma.contacts.count({
        where: {
          status: { in: ['NEW', 'IN_PROGRESS'] },
        },
      }),
      
      // Upcoming Demo Requests (next 7 days)
      prisma.demo_requests.count({
        where: {
          scheduledAt: {
            gte: now,
            lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
          },
          status: { in: ['SCHEDULED'] },
        },
      }),
    ]);

    // Calculate percentage changes
    const customerChange = customersLastMonth > 0
      ? ((customersThisMonth - customersLastMonth) / customersLastMonth) * 100
      : customersThisMonth > 0 ? 100 : 0;

    const demoChange = demoRequestsLastMonth > 0
      ? ((demoRequestsThisMonth - demoRequestsLastMonth) / demoRequestsLastMonth) * 100
      : demoRequestsThisMonth > 0 ? 100 : 0;

    const orderChange = ordersLastMonth > 0
      ? ((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100
      : ordersThisMonth > 0 ? 100 : 0;

    const revenueChangeValue = revenueLastMonth._sum.amount && revenueLastMonth._sum.amount > 0
      ? ((Number(revenueThisMonth._sum.amount || 0) - Number(revenueLastMonth._sum.amount)) / Number(revenueLastMonth._sum.amount)) * 100
      : revenueThisMonth._sum.amount && Number(revenueThisMonth._sum.amount) > 0 ? 100 : 0;

    const ticketChange = ticketsLastMonth > 0
      ? ((ticketsThisMonth - ticketsLastMonth) / ticketsLastMonth) * 100
      : ticketsThisMonth > 0 ? 100 : 0;

    // Return statistics
    return NextResponse.json(
      {
        customers: {
          total: totalCustomers,
          thisMonth: customersThisMonth,
          change: Math.round(customerChange * 10) / 10,
        },
        demoRequests: {
          total: totalDemoRequests,
          thisMonth: demoRequestsThisMonth,
          pending: pendingDemoRequests,
          change: Math.round(demoChange * 10) / 10,
        },
        orders: {
          total: totalOrders,
          thisMonth: ordersThisMonth,
          change: Math.round(orderChange * 10) / 10,
        },
        revenue: {
          total: Number(totalRevenue._sum.amount || 0),
          thisMonth: Number(revenueThisMonth._sum.amount || 0),
          change: Math.round(revenueChangeValue * 10) / 10,
        },
        tickets: {
          total: totalTickets,
          thisMonth: ticketsThisMonth,
          open: openTickets,
          change: Math.round(ticketChange * 10) / 10,
        },
        appointments: {
          upcoming: upcomingAppointments,
        },
      },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
