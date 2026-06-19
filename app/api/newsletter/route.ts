import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
import { newsletterSchema } from '@/lib/validations';
import { checkRateLimit, getSecurityHeaders } from '@/lib/security';
import { ZodError } from 'zod';

/**
 * POST /api/newsletter
 * Handle newsletter subscription with security validation
 */
export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    // Rate limiting: 3 requests per hour per IP
    const rateLimitResult = checkRateLimit(`newsletter:${clientIP}`, 3, 60 * 60 * 1000);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many subscription attempts. Please try again later.',
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
    const validatedData = newsletterSchema.parse(body);

    // Sanitize email
    const email = validatedData.email.toLowerCase().trim();

    // TODO: Validate reCAPTCHA token if provided
    // if (validatedData.recaptchaToken) {
    //   const isValid = await validateRecaptcha(validatedData.recaptchaToken);
    //   if (!isValid) {
    //     return NextResponse.json(
    //       { success: false, error: 'reCAPTCHA validation failed' },
    //       { status: 400, headers: getSecurityHeaders() }
    //     );
    //   }
    // }

    // Store in database
    const { subscribeToNewsletter } = await import('@/lib/db/newsletter');
    const result = await subscribeToNewsletter({
      email,
      source: 'website',
    });
    
    if (!result.success) {
      console.error('Failed to subscribe:', result.error);
      return NextResponse.json(
        { success: false, error: 'Failed to subscribe. Please try again.' },
        { status: 500, headers: getSecurityHeaders() }
      );
    }
    
    // Check if already subscribed
    if (!result.isNew) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'You are already subscribed to our newsletter!',
        },
        { status: 200, headers: getSecurityHeaders() }
      );
    }

    // Add to SendGrid marketing list
    const { addToMarketingList, sendNewsletterConfirmationEmail } = await import('@/lib/email');
    await addToMarketingList(email).catch(err => 
      console.error('Failed to add to marketing list:', err)
    );

    // Send newsletter confirmation email
    await sendNewsletterConfirmationEmail(email).catch(err => 
      console.error('Failed to send confirmation email:', err)
    );

    // Success response
    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to our newsletter!',
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
          error: 'Invalid email address',
          details: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Handle other errors
    console.error('Newsletter subscription error:', error);
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
