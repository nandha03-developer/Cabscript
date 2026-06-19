/**
 * Payment Gateway Integration
 * Handles Stripe and Razorpay payment processing with proper security
 */

import Stripe from 'stripe';
import Razorpay from 'razorpay';

// Lazy initialization to avoid build-time errors
let stripeInstance: Stripe | null = null;
let razorpayInstance: Razorpay | null = null;

function getStripeInstance(): Stripe {
  if (!stripeInstance) {
    const apiKey = process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key_for_build';
    stripeInstance = new Stripe(apiKey, {
      apiVersion: '2025-10-29.clover',
      typescript: true,
    });
  }
  return stripeInstance;
}

function getRazorpayInstance(): Razorpay {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'mock_secret',
    });
  }
  return razorpayInstance;
}

// Export getters instead of instances
export const stripe = new Proxy({} as Stripe, {
  get: (target, prop) => {
    const instance = getStripeInstance();
    const value = (instance as any)[prop];
    return typeof value === 'function' ? value.bind(instance) : value;
  }
});

export const razorpay = new Proxy({} as Razorpay, {
  get: (target, prop) => {
    const instance = getRazorpayInstance();
    const value = (instance as any)[prop];
    return typeof value === 'function' ? value.bind(instance) : value;
  }
});

// Payment Gateway Types
export type PaymentGateway = 'stripe' | 'razorpay';

export interface PaymentIntentData {
  amount: number; // in cents for Stripe, paise for Razorpay
  currency: string;
  customerEmail: string;
  customerName: string;
  planName: string;
  metadata?: Record<string, string>;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  clientSecret?: string;
  orderId?: string;
  error?: string;
}

/**
 * Create Stripe Payment Intent
 */
export async function createStripePaymentIntent(
  data: PaymentIntentData
): Promise<PaymentResult> {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: data.amount,
      currency: data.currency.toLowerCase(),
      receipt_email: data.customerEmail,
      description: `CabScript ${data.planName} License`,
      metadata: {
        customerName: data.customerName,
        planName: data.planName,
        ...data.metadata,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      success: true,
      paymentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret || undefined,
    };
  } catch (error) {
    console.error('Stripe Payment Intent Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment creation failed',
    };
  }
}

/**
 * Create Razorpay Order
 */
export async function createRazorpayOrder(
  data: PaymentIntentData
): Promise<PaymentResult> {
  try {
    const order = await razorpay.orders.create({
      amount: data.amount,
      currency: data.currency.toUpperCase(),
      receipt: `receipt_${Date.now()}`,
      notes: {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        planName: data.planName,
        ...data.metadata,
      },
    });

    return {
      success: true,
      orderId: order.id,
      paymentId: order.id,
    };
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Order creation failed',
    };
  }
}

/**
 * Verify Stripe Payment
 */
export async function verifyStripePayment(
  paymentIntentId: string
): Promise<{ verified: boolean; status?: string }> {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return {
      verified: paymentIntent.status === 'succeeded',
      status: paymentIntent.status,
    };
  } catch (error) {
    console.error('Stripe Verification Error:', error);
    return { verified: false };
  }
}

/**
 * Verify Razorpay Payment Signature
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  try {
    const crypto = require('crypto');
    const text = `${orderId}|${paymentId}`;
    const secret = process.env.RAZORPAY_KEY_SECRET || '';
    
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(text)
      .digest('hex');

    return generatedSignature === signature;
  } catch (error) {
    console.error('Razorpay Signature Verification Error:', error);
    return false;
  }
}

/**
 * Get payment gateway configuration for client
 */
export function getPaymentConfig(gateway: PaymentGateway) {
  if (gateway === 'stripe') {
    return {
      publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
      gateway: 'stripe',
    };
  } else if (gateway === 'razorpay') {
    return {
      publicKey: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
      gateway: 'razorpay',
    };
  }
  
  throw new Error('Invalid payment gateway');
}

/**
 * Convert price to smallest currency unit (cents/paise)
 */
export function convertToSmallestUnit(
  amount: number,
  currency: string
): number {
  // For most currencies, multiply by 100
  // Special cases: JPY, KRW (no decimal places)
  const zeroDecimalCurrencies = ['JPY', 'KRW', 'VND'];
  
  if (zeroDecimalCurrencies.includes(currency.toUpperCase())) {
    return Math.round(amount);
  }
  
  return Math.round(amount * 100);
}

/**
 * Format currency for display
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
}
