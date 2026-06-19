import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from './admin-auth';

/**
 * Middleware to protect admin routes
 * Checks for valid admin session cookie
 */
export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  try {
    // Get admin session from cookie
    const adminSession = request.cookies.get('admin_session')?.value;

    if (!adminSession) {
      return NextResponse.json(
        { error: 'Unauthorized - No session' },
        { status: 401 }
      );
    }

    // Parse session data
    const sessionData = JSON.parse(adminSession);
    const { adminId, expiresAt } = sessionData;

    // Check if session expired
    if (Date.now() > expiresAt) {
      return NextResponse.json(
        { error: 'Unauthorized - Session expired' },
        { status: 401 }
      );
    }

    // Verify admin exists and is active
    const isValid = await verifyAdminSession(adminId);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid session' },
        { status: 401 }
      );
    }

    // Session is valid, allow request to proceed
    return null;
  } catch (error) {
    console.error('Admin middleware error:', error);
    return NextResponse.json(
      { error: 'Unauthorized - Invalid session data' },
      { status: 401 }
    );
  }
}

/**
 * Create admin session cookie
 */
export function createAdminSession(adminId: string): string {
  const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
  return JSON.stringify({ adminId, expiresAt });
}
