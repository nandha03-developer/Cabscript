/**
 * Admin License Key Management API
 * Endpoints for managing license keys (admin only)
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/admin-session";
import { getSecurityHeaders } from "@/lib/security";
import {
  generateLicenseKey,
  revokeLicenseKey,
  deactivateLicenseKey,
  getLicenseKeyDetails,
} from "@/lib/license-key";
import { prisma } from "@/lib/prisma";

/**
 * GET - Get license key details
 */
export async function GET(request: NextRequest) {
  const headers = getSecurityHeaders();

  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers });
    }

    const { searchParams } = new URL(request.url);
    const licenseKey = searchParams.get("key");

    if (!licenseKey) {
      return NextResponse.json(
        { error: "License key parameter is required" },
        { status: 400, headers }
      );
    }

    const details = await getLicenseKeyDetails(licenseKey);

    if (!details.found) {
      return NextResponse.json(
        { error: "License key not found" },
        { status: 404, headers }
      );
    }

    return NextResponse.json(details.data, { headers });
  } catch (error) {
    console.error("Get license details error:", error);
    return NextResponse.json(
      { error: "Failed to get license details" },
      { status: 500, headers }
    );
  }
}

/**
 * POST - Generate new license key for order
 */
export async function POST(request: NextRequest) {
  const headers = getSecurityHeaders();

  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers });
    }

    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400, headers }
      );
    }

    // Check if order exists
    const order = await prisma.orders.findUnique({
      where: { id: orderId },
      include: { customers: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404, headers });
    }

    // Check if license key already exists
    if (order.licenseKey) {
      return NextResponse.json(
        { error: "License key already exists for this order" },
        { status: 400, headers }
      );
    }

    // Generate new license key
    const licenseKey = generateLicenseKey();

    // Calculate expiry (if applicable)
    let licenseExpiry = null;
    if (order.plan.toLowerCase() === "startup") {
      // Startup plan: 1 year license
      licenseExpiry = new Date();
      licenseExpiry.setFullYear(licenseExpiry.getFullYear() + 1);
    }
    // Professional and Enterprise: Lifetime (null expiry)

    // Update order with license key
    const updatedOrder = await prisma.orders.update({
      where: { id: orderId },
      data: {
        licenseKey,
        licenseExpiry,
        status: order.status === "PROCESSING" ? "COMPLETED" : order.status,
        deliveredAt: new Date(),
        metadata: {
          ...(order.metadata as any),
          licenseGeneratedAt: new Date().toISOString(),
          licenseGeneratedBy: session.id,
        },
      },
      include: {
        customers: true,
      },
    });

    // Log activity
    await prisma.activity_logs.create({
      data: {
        id: crypto.randomUUID(),
        adminUserId: session.id,
        adminName: session.name,
        adminEmail: session.email,
        action: "generated_license",
        entityType: "order",
        entityId: order.id.toString(),
        description: `Generated license key for order ${order.orderNumber}`,
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    });

    return NextResponse.json(
      {
        success: true,
        licenseKey,
        order: updatedOrder,
      },
      { headers }
    );
  } catch (error) {
    console.error("Generate license key error:", error);
    return NextResponse.json(
      { error: "Failed to generate license key" },
      { status: 500, headers }
    );
  }
}

/**
 * DELETE - Revoke license key
 */
export async function DELETE(request: NextRequest) {
  const headers = getSecurityHeaders();

  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers });
    }

    const { searchParams } = new URL(request.url);
    const licenseKey = searchParams.get("key");
    const reason = searchParams.get("reason") || "Manual revocation by admin";

    if (!licenseKey) {
      return NextResponse.json(
        { error: "License key parameter is required" },
        { status: 400, headers }
      );
    }

    const result = await revokeLicenseKey(licenseKey, reason);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400, headers });
    }

    // Get order for logging
    const order = await prisma.orders.findUnique({
      where: { licenseKey },
    });

    if (order) {
      // Log activity
      await prisma.activity_logs.create({
        data: {
          id: crypto.randomUUID(),
          adminUserId: session.id,
          adminName: session.name,
          adminEmail: session.email,
          action: "revoked_license",
          entityType: "order",
          entityId: order.id.toString(),
          description: `Revoked license key for order ${order.orderNumber}. Reason: ${reason}`,
          ipAddress: request.headers.get("x-forwarded-for") || "unknown",
          userAgent: request.headers.get("user-agent") || "unknown",
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: result.message,
      },
      { headers }
    );
  } catch (error) {
    console.error("Revoke license key error:", error);
    return NextResponse.json(
      { error: "Failed to revoke license key" },
      { status: 500, headers }
    );
  }
}

/**
 * PATCH - Deactivate license from device
 */
export async function PATCH(request: NextRequest) {
  const headers = getSecurityHeaders();

  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers });
    }

    const { licenseKey, deviceInfo } = await request.json();

    if (!licenseKey || !deviceInfo) {
      return NextResponse.json(
        { error: "License key and device info are required" },
        { status: 400, headers }
      );
    }

    const result = await deactivateLicenseKey(licenseKey, deviceInfo);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400, headers });
    }

    return NextResponse.json(
      {
        success: true,
        message: result.message,
      },
      { headers }
    );
  } catch (error) {
    console.error("Deactivate license key error:", error);
    return NextResponse.json(
      { error: "Failed to deactivate license key" },
      { status: 500, headers }
    );
  }
}
