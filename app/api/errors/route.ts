/**

// Force dynamic rendering
export const dynamic = 'force-dynamic';
 * API Route: Error Logging Endpoint
 * Receives and stores client-side errors
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/security';

interface ErrorLog {
  message: string;
  stack?: string;
  component?: string;
  url?: string;
  userAgent?: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Rate limiting: 20 error reports per minute (prevent spam)
    const rateLimitResult = checkRateLimit(ip, 20, 60 * 1000);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429 }
      );
    }

    // Parse error data
    const errorData: ErrorLog = await request.json();

    // Validate required fields
    if (!errorData.message || !errorData.severity) {
      return NextResponse.json(
        { success: false, error: 'Invalid error data' },
        { status: 400 }
      );
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Client Error Logged:', {
        message: errorData.message,
        severity: errorData.severity,
        url: errorData.url,
        timestamp: errorData.timestamp,
      });
    }

    // Store in database
    const { prisma } = await import('@/lib/prisma');
    try {
      await prisma.error_logs.create({
        data: {
          id: crypto.randomUUID(),
          message: errorData.message,
          stackTrace: errorData.stack,
          severity: errorData.severity,
          url: errorData.url,
          userAgent: errorData.userAgent || request.headers.get('user-agent') || undefined,
          metadata: errorData.context ? JSON.parse(JSON.stringify(errorData.context)) : undefined,
        },
      });
    } catch (dbError) {
      console.error('Failed to store error in database:', dbError);
      // Continue - don't fail the request
    }

    // TODO: Send critical errors to admin via email/Slack
    // if (errorData.severity === 'critical') {
    //   await sendAdminNotification(errorData);
    // }

    // TODO: Forward to error tracking service (Sentry)
    // await forwardToSentry(errorData);

    return NextResponse.json({
      success: true,
      message: 'Error logged successfully',
    });

  } catch (error) {
    console.error('Error logging endpoint failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to log error' },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to retrieve error logs (admin only)
export async function GET(request: NextRequest) {
  // TODO: Implement authentication check
  // const isAdmin = await verifyAdminAuth(request);
  // if (!isAdmin) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  // TODO: Retrieve recent errors from database
  // const errors = await db.errors.findMany({
  //   orderBy: { timestamp: 'desc' },
  //   take: 100,
  // });

  return NextResponse.json({
    success: true,
    errors: [],
    message: 'Error retrieval not yet implemented',
  });
}
