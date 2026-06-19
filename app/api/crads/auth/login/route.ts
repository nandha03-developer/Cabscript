/**
 * Admin Login API Route
 * POST /api/crads/auth/login
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateAdmin, updateAdminLastLogin, logAdminActivity } from '@/lib/admin-auth';
import { createSession } from '@/lib/admin-session';
import { getSecurityHeaders } from '@/lib/security';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Login schema validation
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid credentials provided',
          details: validation.error.issues,
        },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    const { email, password } = validation.data;

    // Authenticate admin
    const admin = await authenticateAdmin(email, password);

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email or password',
        },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    // Get client IP
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    // Update last login with IP
    await updateAdminLastLogin(admin.id, clientIP);

    // Create session
    const sessionId = await createSession({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      isActive: true,
    });

    // Log login activity
    await logAdminActivity(
      admin.id,
      'login',
      'admin_user',
      admin.id,
      `Admin ${admin.name} logged in`,
      clientIP,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      },
      { status: 200, headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred during login',
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
