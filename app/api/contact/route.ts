import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
import { contactFormSchema } from '@/lib/validations';
import { checkRateLimit, sanitizeInput, getSecurityHeaders } from '@/lib/security';
import { ZodError } from 'zod';

/**
 * POST /api/contact
 * Handle contact form submissions with security validation
 */
export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    // Rate limiting: 10 requests per 10 minutes per IP (more reasonable for legitimate use)
    const rateLimitResult = checkRateLimit(`contact:${clientIP}`, 10, 10 * 60 * 1000);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many requests. Please try again later.',
          resetTime: rateLimitResult.resetTime,
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
    const validatedData = contactFormSchema.parse(body);

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(validatedData.name),
      email: validatedData.email.toLowerCase().trim(),
      subject: sanitizeInput(validatedData.subject),
      message: sanitizeInput(validatedData.message),
    };

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
    const { createContact } = await import('@/lib/db/contacts');
    const { createOrGetCustomer } = await import('@/lib/db/customers');
    
    // Create or get customer (non-blocking, for analytics)
    let customerId: number | undefined;
    try {
      const customerResult = await createOrGetCustomer({
        email: sanitizedData.email,
        name: sanitizedData.name,
      });
      
      if (customerResult.success && customerResult.customer?.id) {
        customerId = customerResult.customer.id;
      } else {
        console.warn('Customer creation failed (non-critical):', customerResult.error);
      }
    } catch (customerError) {
      console.warn('Customer creation error (non-critical):', customerError);
    }
    
    // Create contact record - THIS IS CRITICAL
    const contactResult = await createContact({
      name: sanitizedData.name,
      email: sanitizedData.email,
      subject: sanitizedData.subject,
      message: sanitizedData.message,
      type: 'general',
      priority: 'medium',
      customerId: customerId ? customerId.toString() : undefined,
      source: 'website',
      ipAddress: clientIP,
      userAgent: request.headers.get('user-agent') || undefined,
    });
    
    // CRITICAL: Check if contact was saved successfully
    if (!contactResult.success) {
      console.error('❌ CRITICAL: Failed to save contact to database:', contactResult.error);
      
      // Return error to user so they know something went wrong
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to save your message. Please try again or contact us directly.',
          details: process.env.NODE_ENV === 'development' ? contactResult.error : undefined,
        },
        { status: 500, headers: getSecurityHeaders() }
      );
    }
    
    // Log success
    console.log('✅ Contact saved successfully. ID:', contactResult.contact?.id);

    // Send email notification to admin
    try {
      const { sendContactNotificationEmail } = await import('@/lib/email');
      const emailResult = await sendContactNotificationEmail({
        name: sanitizedData.name,
        email: sanitizedData.email,
        message: sanitizedData.message,
        submittedAt: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      });
      
      if (emailResult.success) {
        console.log('Contact notification email sent successfully');
      } else {
        console.error('Failed to send contact notification:', emailResult.error);
      }
    } catch (emailError) {
      console.error('Error importing or sending email:', emailError);
    }

    // Success response
    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for contacting us! We will get back to you soon.',
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
    console.error('Contact form error:', error);
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
