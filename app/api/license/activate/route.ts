/**
 * License Key Activation API
 * Public endpoint for activating license keys
 */

import { NextRequest, NextResponse } from "next/server";
import { activateLicenseKey } from "@/lib/license-key";
import { getSecurityHeaders } from "@/lib/security";

export async function POST(request: NextRequest) {
  const headers = getSecurityHeaders();

  try {
    const { licenseKey, deviceInfo } = await request.json();

    if (!licenseKey || !deviceInfo) {
      return NextResponse.json(
        { success: false, message: "License key and device info are required" },
        { status: 400, headers }
      );
    }

    // Get IP address for tracking
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

    // Activate license key
    const result = await activateLicenseKey(licenseKey, `${deviceInfo}|${ipAddress}`);

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
      headers,
    });
  } catch (error) {
    console.error("License activation API error:", error);
    return NextResponse.json(
      { success: false, message: "Error activating license key" },
      { status: 500, headers }
    );
  }
}
