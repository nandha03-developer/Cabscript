import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/admin-session";
import { getSecurityHeaders } from "@/lib/security";

/**
 * GET /api/admin/reports/customers
 * Get customer analytics data
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

    // Fetch new customers
    const newCustomers = await prisma.customers.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Group by month/day
    const groupedData = new Map<string, number>();
    
    newCustomers.forEach((customer: any) => {
      const date = new Date(customer.createdAt);
      let key: string;

      if (range === "7d") {
        key = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      } else {
        key = date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
      }

      const current = groupedData.get(key) || 0;
      groupedData.set(key, current + 1);
    });

    const labels = Array.from(groupedData.keys());
    const data = Array.from(groupedData.values());

    // Calculate totals and growth
    const totalNewCustomers = newCustomers.length;
    const totalActiveCustomers = await prisma.customers.count();

    // Previous period comparison
    const prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const prevNewCustomers = await prisma.customers.count({
      where: {
        createdAt: {
          gte: prevStartDate,
          lt: startDate,
        },
      },
    });

    const growth = prevNewCustomers > 0 
      ? ((totalNewCustomers - prevNewCustomers) / prevNewCustomers) * 100 
      : 0;

    // Customer country distribution
    const countryGroups = await prisma.customers.groupBy({
      by: ["country"],
      _count: true,
      orderBy: {
        _count: {
          country: "desc",
        },
      },
      take: 5,
    });

    const countryDistribution = {
      labels: countryGroups.map((c: any) => c.country || "Unknown"),
      data: countryGroups.map((c: any) => c._count),
    };

    return NextResponse.json({
      newCustomers: {
        labels,
        data,
        total: totalNewCustomers,
        growth: parseFloat(growth.toFixed(2)),
      },
      activeCustomers: totalActiveCustomers,
      countryDistribution,
    });
  } catch (error) {
    console.error("Customer analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer data" },
      { status: 500 }
    );
  }
}
