/**
 * License Key Validation API
 * Public endpoint for validating license keys
 */

import { NextRequest, NextResponse } from "next/server";
import { validateLicenseKey } from "@/lib/license-key";
import { getSecurityHeaders } from "@/lib/security";

export async function POST(request: NextRequest) {
  const headers = getSecurityHeaders();

  try {
    const { licenseKey, deviceInfo } = await request.json();

    if (!licenseKey) {
      return NextResponse.json(
        { valid: false, message: "License key is required" },
        { status: 400, headers }
      );
    }

    // Validate license key
    const result = await validateLicenseKey(licenseKey, deviceInfo);

    return NextResponse.json(result, {
      status: result.valid ? 200 : 400,
      headers,
    });
  } catch (error) {
    console.error("License validation API error:", error);
    return NextResponse.json(
      { valid: false, message: "Error validating license key" },
      { status: 500, headers }
    );
  }
}
