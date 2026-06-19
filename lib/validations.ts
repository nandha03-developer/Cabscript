import { z } from 'zod';

/**
 * Contact Form Validation Schema
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase(),
  subject: z
    .string()
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject must be less than 200 characters'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters'),
  recaptchaToken: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Newsletter Subscription Schema
 */
export const newsletterSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase(),
  recaptchaToken: z.string().optional(),
});

export type NewsletterData = z.infer<typeof newsletterSchema>;

/**
 * Demo Request Schema
 */
export const demoRequestSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
  company: z
    .string()
    .max(100, 'Company name must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  preferredDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'Date must be today or in the future'),
  preferredTime: z
    .string()
    .min(1, 'Please select a time slot')
    .regex(/^\d{2}:\d{2}-\d{2}:\d{2}$/, 'Invalid time format'),
  recaptchaToken: z.string().optional(),
});

export type DemoRequestData = z.infer<typeof demoRequestSchema>;

/**
 * Payment Checkout Schema
 */
export const checkoutSchema = z.object({
  planId: z.enum(['startup', 'professional', 'enterprise'], {
    message: 'Invalid plan selected',
  }),
  customerInfo: z.object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be less than 100 characters'),
    email: z
      .string()
      .email('Invalid email address')
      .toLowerCase(),
    phone: z
      .string()
      .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
    company: z
      .string()
      .min(2, 'Company name must be at least 2 characters')
      .max(100, 'Company name must be less than 100 characters')
      .optional(),
    country: z
      .string()
      .min(2, 'Country is required')
      .max(100, 'Country name too long'),
  }),
  paymentMethod: z.enum(['stripe', 'razorpay'], {
    message: 'Invalid payment method',
  }),
  recaptchaToken: z.string().optional(),
});

export type CheckoutData = z.infer<typeof checkoutSchema>;

/**
 * Admin Login Schema
 */
export const adminLoginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
});

export type AdminLoginData = z.infer<typeof adminLoginSchema>;

/**
 * Price Plans Configuration
 */
export const pricePlans = {
  startup: {
    id: 'startup',
    name: 'Startup License',
    price: 2999,
    currency: 'USD',
    features: [
      'Source Code (Web + Apps)',
      'Admin Panel',
      'Installation Support',
      '30 Days Technical Support',
    ],
  },
  professional: {
    id: 'professional',
    name: 'Professional License',
    price: 4999,
    currency: 'USD',
    features: [
      'Everything in Startup',
      'Rebranding + Play Store Upload',
      'White Label Branding',
      '90 Days Support',
    ],
    popular: true,
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise License',
    price: 9999,
    currency: 'USD',
    features: [
      'Everything in Professional',
      'Lifetime Updates',
      'Dedicated Server Setup',
      'Priority Support',
    ],
  },
} as const;

export type PlanId = keyof typeof pricePlans;

/**
 * Generic API Response Schema
 */
export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.any().optional(),
  error: z.string().optional(),
});

export type ApiResponse = z.infer<typeof apiResponseSchema>;

/**
 * Validate reCAPTCHA token
 */
export async function validateRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.warn('reCAPTCHA secret key not configured');
    return true; // Allow in development if not configured
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();
    return data.success && data.score >= 0.5; // Score threshold
  } catch (error) {
    console.error('reCAPTCHA validation error:', error);
    return false;
  }
}
