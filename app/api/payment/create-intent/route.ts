/**
 * API Route: Create Payment Intent
 * Creates a payment intent for Stripe or Razorpay
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/security';
import { checkoutSchema, pricePlans } from '@/lib/validations';
import {
  createStripePaymentIntent,
  createRazorpayOrder,
  convertToSmallestUnit,
} from '@/lib/payments';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Rate limiting: 5 payment attempts per 15 minutes
    const rateLimitResult = checkRateLimit(ip, 5, 15 * 60 * 1000);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Too many payment attempts. Please try again later.',
        },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = checkoutSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid payment data',
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { planId, customerInfo, paymentMethod } = validation.data;
    
    // Get plan details
    const plan = pricePlans[planId];
    if (!plan) {
      return NextResponse.json(
        { success: false, error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    // Convert amount to smallest currency unit
    const amountInSmallestUnit = convertToSmallestUnit(plan.price, plan.currency);

    // Create payment based on gateway
    let result;
    
    if (paymentMethod === 'stripe') {
      result = await createStripePaymentIntent({
        amount: amountInSmallestUnit,
        currency: plan.currency,
        customerEmail: customerInfo.email,
        customerName: customerInfo.name,
        planName: plan.name,
        metadata: {
          planId: plan.id,
          phone: customerInfo.phone,
          company: customerInfo.company || '',
          country: customerInfo.country,
        },
      });
    } else if (paymentMethod === 'razorpay') {
      result = await createRazorpayOrder({
        amount: amountInSmallestUnit,
        currency: plan.currency,
        customerEmail: customerInfo.email,
        customerName: customerInfo.name,
        planName: plan.name,
        metadata: {
          planId: plan.id,
          phone: customerInfo.phone,
          company: customerInfo.company || '',
          country: customerInfo.country,
        },
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid payment gateway' },
        { status: 400 }
      );
    }

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    // Return payment intent/order details
    return NextResponse.json({
      ...result,
      gateway: paymentMethod,
      plan: {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        currency: plan.currency,
      },
    });

  } catch (error) {
    console.error('Payment Intent Creation Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create payment. Please try again.',
      },
      { status: 500 }
    );
  }
}
