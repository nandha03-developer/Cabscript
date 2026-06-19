/**
 * Admin Logout API Route
 * POST /api/crads/auth/logout
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession, deleteSession } from '@/lib/admin-session';
import { logAdminActivity } from '@/lib/admin-auth';
import { getSecurityHeaders } from '@/lib/security';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Get current session
    const session = await getSession();

    if (session) {
      // Get client IP
      const clientIP = request.headers.get('x-forwarded-for') || 
                       request.headers.get('x-real-ip') || 
                       'unknown';

      // Log logout activity
      await logAdminActivity(
        session.id,
        'logout',
        'admin_user',
        session.id,
        `Admin ${session.name} logged out`,
        clientIP,
        request.headers.get('user-agent') || undefined
      );
    }

    // Delete session
    await deleteSession();

    return NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully',
      },
      { status: 200, headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred during logout',
      },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...getSecurityHeaders(),
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
