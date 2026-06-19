import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/admin-session';
import { getSecurityHeaders } from '@/lib/security';

export const dynamic = 'force-dynamic';

/**
 * GET /api/crads/reports
 * Get comprehensive business reports and analytics
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
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Default to current month if no dates provided
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999); // End of day

    // Build date filter
    const dateFilter = {
      createdAt: {
        gte: start,
        lte: end,
      },
    };

    // Get basic stats
    const [
      totalOrders,
      completedOrders,
      pendingOrders,
      totalCustomers,
      orders,
    ] = await Promise.all([
      // Total orders in date range
      prisma.orders.count({
        where: dateFilter,
      }),
      // Completed orders in date range
      prisma.orders.count({
        where: {
          ...dateFilter,
          status: 'COMPLETED',
        },
      }),
      // Pending orders in date range
      prisma.orders.count({
        where: {
          ...dateFilter,
          status: 'PENDING',
        },
      }),
      // Total unique customers
      prisma.customers.count(),
      // All orders in date range with customer data
      prisma.orders.findMany({
        where: dateFilter,
        include: {
          customers: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10, // Latest 10 orders
      }),
    ]);

    // Calculate total revenue from completed orders
    const revenueResult = await prisma.orders.aggregate({
      where: {
        ...dateFilter,
        status: 'COMPLETED',
      },
      _sum: {
        amount: true,
      },
    });

    const totalRevenue = revenueResult._sum.amount || 0;

    // Get monthly revenue for the chart (last 12 months)
    const monthlyRevenue = [];
    const currentDate = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0);
      monthEnd.setHours(23, 59, 59, 999);
      
      const monthRevenue = await prisma.orders.aggregate({
        where: {
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
          status: 'COMPLETED',
        },
        _sum: {
          amount: true,
        },
      });

      monthlyRevenue.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue: monthRevenue._sum.amount || 0,
      });
    }

    // Get plan distribution
    const planDistribution = await prisma.orders.groupBy({
      by: ['plan'],
      where: dateFilter,
      _count: {
        plan: true,
      },
    });

    const planDistributionWithPercentage = planDistribution.map(item => ({
      plan: item.plan,
      count: item._count.plan,
      percentage: totalOrders > 0 ? (item._count.plan / totalOrders) * 100 : 0,
    }));

    // Format recent orders
    const recentOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customers?.name || 'Unknown Customer',
      plan: order.plan,
      amount: order.amount,
      status: order.status,
      createdAt: order.createdAt.toISOString(),
    }));

    const reportData = {
      totalRevenue,
      totalOrders,
      totalCustomers,
      completedOrders,
      pendingOrders,
      monthlyRevenue,
      planDistribution: planDistributionWithPercentage,
      recentOrders,
    };

    return NextResponse.json(reportData, { headers: getSecurityHeaders() });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}