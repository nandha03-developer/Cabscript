import { compare } from 'bcryptjs';
import { prisma } from './prisma';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Authenticate admin user with email and password
 */
export async function authenticateAdmin(email: string, password: string): Promise<AdminUser | null> {
  try {
    const admin = await prisma.admin_users.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        passwordHash: true,
        isActive: true,
      },
    });

    if (!admin || !admin.isActive) {
      return null;
    }

    // Verify password
    const isValidPassword = await compare(password, admin.passwordHash);
    if (!isValidPassword) {
      return null;
    }

    // Update last login
    await prisma.admin_users.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    // Return admin without password hash
    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    };
  } catch (error) {
    console.error('Admin authentication error:', error);
    return null;
  }
}

/**
 * Get admin user by ID
 */
export async function getAdminById(id: string): Promise<AdminUser | null> {
  try {
    const admin = await prisma.admin_users.findUnique({
      where: { id, isActive: true },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return admin;
  } catch (error) {
    console.error('Get admin by ID error:', error);
    return null;
  }
}

/**
 * Verify admin session
 */
export async function verifyAdminSession(adminId: string): Promise<boolean> {
  try {
    const admin = await prisma.admin_users.findUnique({
      where: { id: adminId, isActive: true },
    });

    return !!admin;
  } catch (error) {
    console.error('Verify admin session error:', error);
    return false;
  }
}

/**
 * Update admin last login with IP address
 */
export async function updateAdminLastLogin(
  adminId: string,
  ipAddress?: string
): Promise<void> {
  try {
    await prisma.admin_users.update({
      where: { id: adminId },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: ipAddress,
      },
    });
  } catch (error) {
    console.error('Error updating last login:', error);
  }
}

/**
 * Log admin activity
 */
export async function logAdminActivity(
  adminId: string,
  action: string,
  entityType: string,
  entityId: string,
  description: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  try {
    const admin = await prisma.admin_users.findUnique({
      where: { id: adminId },
      select: { id: true, name: true, email: true },
    });

    if (!admin) return;

    await prisma.activity_logs.create({
      data: {
        id: crypto.randomUUID(),
        adminUserId: admin.id,
        adminName: admin.name,
        adminEmail: admin.email,
        action,
        entityType,
        entityId,
        description,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error('Error logging admin activity:', error);
  }
}

/**
 * Check if admin has required role
 */
export function hasRole(userRole: string, allowedRoles: string[]): boolean {
  return allowedRoles.includes(userRole);
}
