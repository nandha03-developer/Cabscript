/**
 * API Route: Razorpay Webhook Handler
 * Handles Razorpay payment events
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/payments';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing razorpay signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
    const crypto = require('crypto');
    
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(body))
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle different event types
    const { event, payload } = body;

    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(payload.payment.entity);
        break;

      case 'payment.failed':
        await handlePaymentFailed(payload.payment.entity);
        break;

      case 'refund.created':
        await handleRefundCreated(payload.refund.entity);
        break;

      case 'order.paid':
        await handleOrderPaid(payload.order.entity);
        break;

      default:
        console.log(`Unhandled Razorpay event: ${event}`);
    }

    return NextResponse.json({ status: 'ok' });

  } catch (error) {
    console.error('Razorpay webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle captured payment
 */
async function handlePaymentCaptured(payment: any) {

  const amount = payment.amount / 100; // Convert paise to rupees
  const currency = payment.currency;
  const orderId = payment.order_id;
  const email = payment.email;
  const notes = payment.notes;

  // TODO: Store order in database
  // TODO: Send confirmation email
  // TODO: Generate license key
  // TODO: Trigger analytics event

  console.log('Payment Details:', {
    paymentId: payment.id,
    orderId,
    email,
    amount,
    currency,
    planName: notes?.planName,
    customerName: notes?.customerName,
  });
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(payment: any) {
  console.log('❌ Razorpay payment failed:', payment.id);

  const errorCode = payment.error_code;
  const errorDescription = payment.error_description;

  // TODO: Send failure notification
  // TODO: Log failed attempt
  // TODO: Trigger analytics event

  console.log('Payment Failure:', {
    paymentId: payment.id,
    errorCode,
    errorDescription,
  });
}

/**
 * Handle refund created
 */
async function handleRefundCreated(refund: any) {
  console.log('💰 Razorpay refund created:', refund.id);

  const amount = refund.amount / 100;
  const paymentId = refund.payment_id;

  // TODO: Update order status
  // TODO: Send refund confirmation
  // TODO: Revoke license
  // TODO: Trigger analytics event

  console.log('Refund Details:', {
    refundId: refund.id,
    paymentId,
    amount,
  });
}

/**
 * Handle order paid
 */
async function handleOrderPaid(order: any) {
  console.log('✅ Razorpay order paid:', order.id);

  const amount = order.amount / 100;
  const currency = order.currency;
  const notes = order.notes;

  console.log('Order Details:', {
    orderId: order.id,
    amount,
    currency,
    notes,
  });
}
