import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/admin-session";
import { getSecurityHeaders } from "@/lib/security";

/**
 * PUT /api/crads/settings/profile
 * Update admin profile information
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

    const { name, email } = await request.json();

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Check if email is already taken by another admin
    const existingAdmin = await prisma.admin_users.findFirst({
      where: {
        email,
        id: { not: session.adminId },
      },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Email is already in use" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Update admin profile
    const updatedAdmin = await prisma.admin_users.update({
      where: { id: session.adminId },
      data: {
        name,
        email,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
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
        entityType: "profile",
        entityId: session.adminId,
        description: `Updated profile information`,
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    });

    return NextResponse.json(
      { success: true, admin: updatedAdmin },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
