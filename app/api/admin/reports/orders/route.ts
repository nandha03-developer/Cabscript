import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/admin-session";
import { getSecurityHeaders } from "@/lib/security";

/**
 * GET /api/admin/reports/orders
 * Get order analytics data
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "30d";

    // Calculate date range
    const endDate = new Date();
    let startDate = new Date();

    switch (range) {
      case "7d":
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(endDate.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(endDate.getDate() - 90);
        break;
      case "1y":
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    // Fetch orders in date range
    const orders = await prisma.orders.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        status: true,
        amount: true,
        createdAt: true,
        plan: true,
      },
    });

    // Order status distribution
    const statusCounts = orders.reduce((acc: Record<string, number>, order: any) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusDistribution = {
      labels: Object.keys(statusCounts),
      data: Object.values(statusCounts),
    };

    // Revenue by plan
    const planRevenue = orders.reduce((acc: Record<string, number>, order: any) => {
      if (order.status === "COMPLETED") {
        acc[order.plan] = (acc[order.plan] || 0) + order.amount;
      }
      return acc;
    }, {} as Record<string, number>);

    const planRevenueData = {
      labels: Object.keys(planRevenue),
      data: Object.values(planRevenue),
    };

    // Orders over time
    const ordersOverTime = new Map<string, number>();
    
    orders.forEach((order: any) => {
      const date = new Date(order.createdAt);
      let key: string;

      if (range === "7d") {
        key = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      } else {
        key = date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
      }

      const current = ordersOverTime.get(key) || 0;
      ordersOverTime.set(key, current + 1);
    });

    const orderTrend = {
      labels: Array.from(ordersOverTime.keys()),
      data: Array.from(ordersOverTime.values()),
    };

    // Calculate metrics
    const totalOrders = orders.length;
    const completedOrders = orders.filter((o: any) => o.status === "COMPLETED").length;
    const totalRevenue = orders
      .filter((o: any) => o.status === "COMPLETED")
      .reduce((sum: number, o: any) => sum + o.amount, 0);
    const avgOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0;

    // Previous period comparison
    const prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const prevOrders = await prisma.orders.count({
      where: {
        createdAt: {
          gte: prevStartDate,
          lt: startDate,
        },
      },
    });

    const growth = prevOrders > 0 ? ((totalOrders - prevOrders) / prevOrders) * 100 : 0;

    return NextResponse.json({
      statusDistribution,
      planRevenue: planRevenueData,
      orderTrend,
      metrics: {
        totalOrders,
        completedOrders,
        totalRevenue,
        avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
        growth: parseFloat(growth.toFixed(2)),
      },
    });
  } catch (error) {
    console.error("Order analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch order data" },
      { status: 500 }
    );
  }
}
