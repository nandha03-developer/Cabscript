/**
 * API Route: Stripe Webhook Handler
 * Handles Stripe payment events
 */

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/payments';
import Stripe from 'stripe';

// Disable body parsing for webhook
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Handle different event types
  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSuccess(paymentIntent);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailure(paymentIntent);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        await handleRefund(charge);
        break;
      }

      case 'charge.dispute.created': {
        const dispute = event.data.object as Stripe.Dispute;
        await handleDispute(dispute);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle successful payment
 */
async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  console.log('✅ Payment succeeded:', paymentIntent.id);
  
  const customerEmail = paymentIntent.receipt_email;
  const amount = paymentIntent.amount / 100;
  const currency = paymentIntent.currency.toUpperCase();
  const metadata = paymentIntent.metadata;

  // TODO: Store order in database
  // TODO: Send confirmation email with license details
  // TODO: Generate license key
  // TODO: Trigger analytics event

  console.log('Order Details:', {
    paymentId: paymentIntent.id,
    customerEmail,
    amount,
    currency,
    planName: metadata.planName,
    customerName: metadata.customerName,
  });

  // For now, just log. Will implement database storage in next task
}

/**
 * Handle failed payment
 */
async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  console.log('❌ Payment failed:', paymentIntent.id);
  
  const customerEmail = paymentIntent.receipt_email;
  const lastError = paymentIntent.last_payment_error;

  // TODO: Send failure notification email
  // TODO: Log failed attempt to database
  // TODO: Trigger analytics event

  console.log('Payment Failure:', {
    paymentId: paymentIntent.id,
    customerEmail,
    error: lastError?.message,
  });
}

/**
 * Handle refund
 */
async function handleRefund(charge: Stripe.Charge) {
  console.log('💰 Refund issued:', charge.id);
  
  // TODO: Update order status in database
  // TODO: Send refund confirmation email
  // TODO: Revoke license key
  // TODO: Trigger analytics event

  console.log('Refund Details:', {
    chargeId: charge.id,
    amount: charge.amount_refunded / 100,
    currency: charge.currency.toUpperCase(),
  });
}

/**
 * Handle dispute/chargeback
 */
async function handleDispute(dispute: Stripe.Dispute) {
  console.log('⚠️ Dispute created:', dispute.id);
  
  // TODO: Alert admin
  // TODO: Update order status
  // TODO: Prepare dispute evidence

  console.log('Dispute Details:', {
    disputeId: dispute.id,
    amount: dispute.amount / 100,
    reason: dispute.reason,
    status: dispute.status,
  });
}
