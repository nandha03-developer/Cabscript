/**
 * Admin Session Check API Route
 * GET /api/crads/auth/session
 */

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/admin-session';
import { getSecurityHeaders } from '@/lib/security';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        {
          authenticated: false,
        },
        { status: 200, headers: getSecurityHeaders() }
      );
    }

    return NextResponse.json(
      {
        authenticated: true,
        admin: {
          id: session.id,
          email: session.email,
          name: session.name,
          role: session.role,
        },
      },
      { status: 200, headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      {
        authenticated: false,
      },
      { status: 200, headers: getSecurityHeaders() }
    );
  }
}
