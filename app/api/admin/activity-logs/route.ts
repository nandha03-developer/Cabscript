/**
 * Admin Activity Logs API
 * Fetch and filter activity logs
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/admin-session";
import { getSecurityHeaders } from "@/lib/security";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const headers = getSecurityHeaders();

  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers });
    }

    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    // Filters
    const action = searchParams.get("action");
    const entityType = searchParams.get("entityType");
    const adminEmail = searchParams.get("adminEmail");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const search = searchParams.get("search");

    // Build where clause
    const where: any = {};

    if (action) {
      where.action = action;
    }

    if (entityType) {
      where.entityType = entityType;
    }

    if (adminEmail) {
      where.adminEmail = { contains: adminEmail, mode: "insensitive" };
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    if (search) {
      where.OR = [
        { description: { contains: search, mode: "insensitive" } },
        { adminName: { contains: search, mode: "insensitive" } },
        { adminEmail: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get total count
    const total = await prisma.activity_logs.count({ where });

    // Get logs with pagination
    const logs = await prisma.activity_logs.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        admin_users: {
          select: {
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    // Get stats
    const stats = await prisma.activity_logs.groupBy({
      by: ["action"],
      where: startDate || endDate ? where : {},
      _count: true,
    });

    return NextResponse.json(
      {
        logs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        stats: stats.map((s) => ({
          action: s.action,
          count: s._count,
        })),
      },
      { headers }
    );
  } catch (error) {
    console.error("Get activity logs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity logs" },
      { status: 500, headers }
    );
  }
}
