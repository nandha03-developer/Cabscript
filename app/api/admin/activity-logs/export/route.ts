/**
 * Export Activity Logs API
 * Export activity logs as CSV
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/admin-session";
import { getSecurityHeaders } from "@/lib/security";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const headers = {
    ...getSecurityHeaders(),
    "Content-Type": "text/csv",
    "Content-Disposition": `attachment; filename="activity-logs-${new Date().toISOString().split("T")[0]}.csv"`,
  };

  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    
    // Filters (same as GET)
    const action = searchParams.get("action");
    const entityType = searchParams.get("entityType");
    const adminEmail = searchParams.get("adminEmail");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build where clause
    const where: any = {};

    if (action) where.action = action;
    if (entityType) where.entityType = entityType;
    if (adminEmail) where.adminEmail = { contains: adminEmail, mode: "insensitive" };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    // Get all logs matching filters (limit to 10000 for performance)
    const logs = await prisma.activity_logs.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 10000,
    });

    // Generate CSV
    const csvHeaders = [
      "Timestamp",
      "Admin",
      "Email",
      "Action",
      "Entity Type",
      "Entity ID",
      "Description",
      "IP Address",
    ];

    const csvRows = logs.map((log) => [
      new Date(log.createdAt).toISOString(),
      log.adminName,
      log.adminEmail,
      log.action,
      log.entityType,
      log.entityId,
      log.description.replace(/"/g, '""'), // Escape quotes
      log.ipAddress || "",
    ]);

    const csv = [
      csvHeaders.join(","),
      ...csvRows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    return new NextResponse(csv, { headers });
  } catch (error) {
    console.error("Export activity logs error:", error);
    return NextResponse.json(
      { error: "Failed to export activity logs" },
      { status: 500 }
    );
  }
}
