import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/admin-session";
import { getSecurityHeaders } from "@/lib/security";

/**
 * GET /api/admin/reports/support
 * Get support ticket analytics data
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

    // Fetch contacts/tickets in date range
    const tickets = await prisma.contacts.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        priority: true,
        status: true,
        createdAt: true,
        resolvedAt: true,
      },
    });

    // Priority distribution
    const priorityCounts = tickets.reduce((acc: Record<string, number>, ticket: any) => {
      acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const priorityDistribution = {
      labels: Object.keys(priorityCounts),
      data: Object.values(priorityCounts),
    };

    // Status distribution
    const statusCounts = tickets.reduce((acc: Record<string, number>, ticket: any) => {
      acc[ticket.status] = (acc[ticket.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusDistribution = {
      labels: Object.keys(statusCounts),
      data: Object.values(statusCounts),
    };

    // Calculate resolution times for resolved tickets
    const resolvedTickets = tickets.filter((t: any) => t.resolvedAt);
    const resolutionTimes = resolvedTickets.map((t: any) => {
      const created = new Date(t.createdAt).getTime();
      const resolved = new Date(t.resolvedAt!).getTime();
      return (resolved - created) / (1000 * 60 * 60); // hours
    });

    const avgResolutionTime = resolutionTimes.length > 0
      ? resolutionTimes.reduce((sum: number, time: number) => sum + time, 0) / resolutionTimes.length
      : 0;

    // Tickets over time
    const ticketsOverTime = new Map<string, number>();
    
    tickets.forEach((ticket: any) => {
      const date = new Date(ticket.createdAt);
      let key: string;

      if (range === "7d") {
        key = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      } else {
        key = date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
      }

      const current = ticketsOverTime.get(key) || 0;
      ticketsOverTime.set(key, current + 1);
    });

    const ticketTrend = {
      labels: Array.from(ticketsOverTime.keys()),
      data: Array.from(ticketsOverTime.values()),
    };

    // Calculate metrics
    const totalTickets = tickets.length;
    const openTickets = tickets.filter((t: any) => t.status === "OPEN").length;
    const resolvedCount = resolvedTickets.length;
    const resolutionRate = totalTickets > 0 ? (resolvedCount / totalTickets) * 100 : 0;

    // Previous period comparison
    const prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const prevTickets = await prisma.contacts.count({
      where: {
        createdAt: {
          gte: prevStartDate,
          lt: startDate,
        },
      },
    });

    const growth = prevTickets > 0 ? ((totalTickets - prevTickets) / prevTickets) * 100 : 0;

    return NextResponse.json({
      priorityDistribution,
      statusDistribution,
      ticketTrend,
      metrics: {
        totalTickets,
        openTickets,
        resolvedTickets: resolvedCount,
        avgResolutionTime: parseFloat(avgResolutionTime.toFixed(2)),
        resolutionRate: parseFloat(resolutionRate.toFixed(2)),
        growth: parseFloat(growth.toFixed(2)),
      },
    });
  } catch (error) {
    console.error("Support analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch support data" },
      { status: 500 }
    );
  }
}
