import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/admin-session";
import { getSecurityHeaders } from "@/lib/security";

/**
 * GET /api/admin/reports/revenue
 * Get revenue analytics data
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

    // Fetch revenue data from orders
    const orders = await prisma.orders.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        status: "COMPLETED",
      },
      select: {
        amount: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Group by month/day depending on range
    const groupedData = new Map<string, number>();
    
    orders.forEach((order: any) => {
      const date = new Date(order.createdAt);
      let key: string;

      if (range === "7d") {
        // Group by day for 7 days
        key = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      } else {
        // Group by month for longer ranges
        key = date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
      }

      const current = groupedData.get(key) || 0;
      groupedData.set(key, current + order.amount);
    });

    // Convert to array format for charts
    const labels = Array.from(groupedData.keys());
    const data = Array.from(groupedData.values());

    // Calculate total and growth
    const totalRevenue = data.reduce((sum, val) => sum + val, 0);
    
    // Calculate previous period for comparison
    const prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const prevOrders = await prisma.orders.findMany({
      where: {
        createdAt: {
          gte: prevStartDate,
          lt: startDate,
        },
        status: "COMPLETED",
      },
      select: {
        amount: true,
      },
    });

    const prevRevenue = prevOrders.reduce((sum: number, order: any) => sum + order.amount, 0);
    const growth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;

    return NextResponse.json({
      labels,
      data,
      totalRevenue,
      growth: parseFloat(growth.toFixed(2)),
    });
  } catch (error) {
    console.error("Revenue analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch revenue data" },
      { status: 500 }
    );
  }
}
