/**
 * License Key Generation & Validation
 * Enhanced UUID-based license key system with activation tracking
 */

import { randomUUID } from "crypto";
import { prisma } from "./prisma";

export interface LicenseKeyData {
  key: string;
  orderId: number;
  plan: string;
  isActive: boolean;
  activatedAt?: Date;
  expiresAt?: Date;
  activationCount: number;
  maxActivations: number;
  deviceInfo?: string;
}

/**
 * Generate a formatted license key (UUID-based)
 * Format: XXXX-XXXX-XXXX-XXXX (32 chars with hyphens)
 */
export function generateLicenseKey(): string {
  const uuid = randomUUID().replace(/-/g, "").toUpperCase();
  // Format as XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX
  return [
    uuid.slice(0, 4),
    uuid.slice(4, 8),
    uuid.slice(8, 12),
    uuid.slice(12, 16),
    uuid.slice(16, 20),
    uuid.slice(20, 24),
    uuid.slice(24, 28),
    uuid.slice(28, 32),
  ].join("-");
}

/**
 * Validate license key format
 */
export function isValidLicenseKeyFormat(key: string): boolean {
  // Format: XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX (32 hex chars + 7 hyphens)
  const pattern = /^[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$/;
  return pattern.test(key);
}

/**
 * Get max activations based on plan
 */
export function getMaxActivations(plan: string): number {
  const planLimits: Record<string, number> = {
    startup: 1, // Single domain
    professional: 3, // Up to 3 domains
    enterprise: -1, // Unlimited
  };
  return planLimits[plan.toLowerCase()] || 1;
}

/**
 * Validate license key from database
 */
export async function validateLicenseKey(
  key: string,
  deviceInfo?: string
): Promise<{
  valid: boolean;
  message: string;
  data?: LicenseKeyData;
}> {
  try {
    // Check format first
    if (!isValidLicenseKeyFormat(key)) {
      return {
        valid: false,
        message: "Invalid license key format",
      };
    }

    // Find order with this license key
    const order = await prisma.orders.findUnique({
      where: { licenseKey: key },
      include: {
        customers: true,
      },
    });

    if (!order) {
      return {
        valid: false,
        message: "License key not found",
      };
    }

    // Check if order is completed
    if (order.status !== "COMPLETED") {
      return {
        valid: false,
        message: "License key not activated yet. Order must be completed first.",
      };
    }

    // Check expiry (if applicable)
    if (order.licenseExpiry && order.licenseExpiry < new Date()) {
      return {
        valid: false,
        message: "License key has expired",
      };
    }

    // Get activation count from metadata
    const metadata = order.metadata as any;
    const activationCount = metadata?.activationCount || 0;
    const maxActivations = getMaxActivations(order.plan);

    // Check activation limit (if not unlimited)
    if (maxActivations !== -1 && activationCount >= maxActivations) {
      return {
        valid: false,
        message: `License key has reached maximum activations (${maxActivations})`,
      };
    }

    return {
      valid: true,
      message: "License key is valid",
      data: {
        key: order.licenseKey!,
        orderId: order.id,
        plan: order.plan,
        isActive: true,
        activatedAt: order.deliveredAt || undefined,
        expiresAt: order.licenseExpiry || undefined,
        activationCount,
        maxActivations,
        deviceInfo,
      },
    };
  } catch (error) {
    console.error("License validation error:", error);
    return {
      valid: false,
      message: "Error validating license key",
    };
  }
}

/**
 * Activate license key for a device
 */
export async function activateLicenseKey(
  key: string,
  deviceInfo: string
): Promise<{
  success: boolean;
  message: string;
  activationCount?: number;
}> {
  try {
    // Validate first
    const validation = await validateLicenseKey(key, deviceInfo);
    if (!validation.valid) {
      return {
        success: false,
        message: validation.message,
      };
    }

    // Get current order
    const order = await prisma.orders.findUnique({
      where: { licenseKey: key },
    });

    if (!order) {
      return {
        success: false,
        message: "License key not found",
      };
    }

    // Update activation count
    const metadata = (order.metadata as any) || {};
    const activations = metadata.activations || [];
    const activationCount = activations.length;
    const maxActivations = getMaxActivations(order.plan);

    // Check if already activated on this device
    const existingActivation = activations.find(
      (a: any) => a.deviceInfo === deviceInfo
    );

    if (existingActivation) {
      // Update last activated time
      existingActivation.lastActivatedAt = new Date().toISOString();
    } else {
      // Add new activation
      if (maxActivations !== -1 && activationCount >= maxActivations) {
        return {
          success: false,
          message: `Maximum activations (${maxActivations}) reached`,
        };
      }

      activations.push({
        deviceInfo,
        activatedAt: new Date().toISOString(),
        lastActivatedAt: new Date().toISOString(),
        ipAddress: "", // Will be set from API
      });
    }

    // Update order with new activation data
    await prisma.orders.update({
      where: { id: order.id },
      data: {
        metadata: {
          ...metadata,
          activations,
          activationCount: activations.length,
          lastActivation: new Date().toISOString(),
        },
        deliveredAt: order.deliveredAt || new Date(),
      },
    });

    return {
      success: true,
      message: "License key activated successfully",
      activationCount: activations.length,
    };
  } catch (error) {
    console.error("License activation error:", error);
    return {
      success: false,
      message: "Error activating license key",
    };
  }
}

/**
 * Revoke license key
 */
export async function revokeLicenseKey(
  key: string,
  reason?: string
): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const order = await prisma.orders.findUnique({
      where: { licenseKey: key },
    });

    if (!order) {
      return {
        success: false,
        message: "License key not found",
      };
    }

    // Update order metadata to mark as revoked
    const metadata = (order.metadata as any) || {};
    await prisma.orders.update({
      where: { id: order.id },
      data: {
        metadata: {
          ...metadata,
          revoked: true,
          revokedAt: new Date().toISOString(),
          revokedReason: reason || "Manual revocation",
        },
        // Optionally update status
        status: "CANCELLED",
      },
    });

    return {
      success: true,
      message: "License key revoked successfully",
    };
  } catch (error) {
    console.error("License revocation error:", error);
    return {
      success: false,
      message: "Error revoking license key",
    };
  }
}

/**
 * Deactivate license key from a specific device
 */
export async function deactivateLicenseKey(
  key: string,
  deviceInfo: string
): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const order = await prisma.orders.findUnique({
      where: { licenseKey: key },
    });

    if (!order) {
      return {
        success: false,
        message: "License key not found",
      };
    }

    // Remove device from activations
    const metadata = (order.metadata as any) || {};
    const activations = (metadata.activations || []).filter(
      (a: any) => a.deviceInfo !== deviceInfo
    );

    await prisma.orders.update({
      where: { id: order.id },
      data: {
        metadata: {
          ...metadata,
          activations,
          activationCount: activations.length,
        },
      },
    });

    return {
      success: true,
      message: "License key deactivated from device",
    };
  } catch (error) {
    console.error("License deactivation error:", error);
    return {
      success: false,
      message: "Error deactivating license key",
    };
  }
}

/**
 * Get license key details
 */
export async function getLicenseKeyDetails(key: string): Promise<{
  found: boolean;
  data?: {
    key: string;
    order: any;
    activations: any[];
    isRevoked: boolean;
    isExpired: boolean;
    canActivate: boolean;
  };
}> {
  try {
    const order = await prisma.orders.findUnique({
      where: { licenseKey: key },
      include: {
        customers: {
          select: {
            name: true,
            email: true,
            company: true,
          },
        },
      },
    });

    if (!order) {
      return { found: false };
    }

    const metadata = (order.metadata as any) || {};
    const activations = metadata.activations || [];
    const isRevoked = metadata.revoked === true;
    const isExpired = order.licenseExpiry
      ? order.licenseExpiry < new Date()
      : false;
    const maxActivations = getMaxActivations(order.plan);
    const canActivate =
      !isRevoked &&
      !isExpired &&
      order.status === "COMPLETED" &&
      (maxActivations === -1 || activations.length < maxActivations);

    return {
      found: true,
      data: {
        key: order.licenseKey!,
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          plan: order.plan,
          status: order.status,
          customer: order.customers,
          createdAt: order.createdAt,
          paidAt: order.paidAt,
          deliveredAt: order.deliveredAt,
          licenseExpiry: order.licenseExpiry,
        },
        activations,
        isRevoked,
        isExpired,
        canActivate,
      },
    };
  } catch (error) {
    console.error("Get license details error:", error);
    return { found: false };
  }
}
