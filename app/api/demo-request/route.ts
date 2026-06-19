import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
import { demoRequestSchema } from '@/lib/validations';
import { checkRateLimit, sanitizeInput, getSecurityHeaders } from '@/lib/security';
import { prisma } from '@/lib/prisma';
import { sendDemoRequestEmail, sendDemoConfirmationEmail } from '@/lib/email-service';
import { ZodError } from 'zod';

/**
 * POST /api/demo-request
 * Handle demo request submissions with security validation
 */
export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    // Rate limiting: 3 requests per hour per IP
    const rateLimitResult = checkRateLimit(`demo:${clientIP}`, 3, 60 * 60 * 1000);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many demo requests. Please try again later.',
        },
        { 
          status: 429,
          headers: {
            ...getSecurityHeaders(),
            'Retry-After': String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)),
          },
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = demoRequestSchema.parse(body);

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(validatedData.name),
      email: validatedData.email.toLowerCase().trim(),
      phone: validatedData.phone || null,
      company: validatedData.company ? sanitizeInput(validatedData.company) : null,
      preferredDate: new Date(validatedData.preferredDate),
      preferredTime: validatedData.preferredTime,
      interestedIn: 'taxi_script', // Default value
      source: 'website',
      ipAddress: clientIP,
    };

    // Save to database
    try {
      const demoRequest = await prisma.demo_requests.create({
        data: sanitizedData,
      });

      // Send email notification to admin (if email service is configured)
      try {
        await sendDemoRequestEmail({
          ...sanitizedData,
          id: demoRequest.id,
          createdAt: demoRequest.createdAt,
        });
      } catch (emailError) {
        console.warn('Failed to send admin notification email:', emailError);
      }

      // Send confirmation email to user (if email service is configured)
      try {
        await sendDemoConfirmationEmail(sanitizedData.email, sanitizedData.name);
      } catch (emailError) {
        console.warn('Failed to send confirmation email:', emailError);
      }

    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to save demo request. Please try again.',
        },
        { status: 500, headers: getSecurityHeaders() }
      );
    }

    // Success response
    return NextResponse.json(
      {
        success: true,
        message: 'Demo request submitted successfully! We will contact you soon.',
      },
      {
        status: 200,
        headers: getSecurityHeaders(),
      }
    );

  } catch (error) {
    // Handle validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Handle other errors
    console.error('Demo request error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred. Please try again later.',
      },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// Handle OPTIONS requests for CORS
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
