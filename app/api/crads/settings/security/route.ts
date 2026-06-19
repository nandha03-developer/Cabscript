import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/admin-session";
import { getSecurityHeaders } from "@/lib/security";

/**
 * PUT /api/crads/settings/security
 * Update security settings (2FA, notifications, etc.)
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const { twoFactorEnabled } = await request.json();

    // Get admin user
    const updatedAdmin = await prisma.admin_users.findUnique({
      where: { id: session.adminId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
    
    // Note: Two-factor authentication fields not yet in schema
    // This endpoint is a placeholder for future implementation

    // Log activity
    const changes = [];
    if (twoFactorEnabled !== undefined) {
      changes.push(`2FA ${twoFactorEnabled ? "enabled" : "disabled"}`);
    }

    await prisma.activity_logs.create({
      data: {
        id: crypto.randomUUID(),
        adminUserId: session.adminId,
        adminName: session.name,
        adminEmail: session.email,
        action: "updated",
        entityType: "security_settings",
        entityId: session.adminId,
        description: changes.join(", "),
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    });

    return NextResponse.json(
      { success: true, admin: updatedAdmin },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error("Security settings update error:", error);
    return NextResponse.json(
      { error: "Failed to update security settings" },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
