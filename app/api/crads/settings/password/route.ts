import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/admin-session";
import { getSecurityHeaders } from "@/lib/security";
import bcrypt from "bcryptjs";

/**
 * PUT /api/crads/settings/password
 * Change admin password
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

    const { currentPassword, newPassword } = await request.json();

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current and new password are required" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Get current admin with password
    const admin = await prisma.admin_users.findUnique({
      where: { id: session.adminId },
      select: {
        id: true,
        passwordHash: true,
      },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Admin not found" },
        { status: 404, headers: getSecurityHeaders() }
      );
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, admin.passwordHash);

    if (!isValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.admin_users.update({
      where: { id: session.adminId },
      data: {
        passwordHash: hashedPassword,
        updatedAt: new Date(),
      },
    });

    // Log activity
    await prisma.activity_logs.create({
      data: {
        id: crypto.randomUUID(),
        adminUserId: session.adminId,
        adminName: session.name,
        adminEmail: session.email,
        action: "updated",
        entityType: "password",
        entityId: session.adminId,
        description: "Changed account password",
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    });

    return NextResponse.json(
      { success: true, message: "Password changed successfully" },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
