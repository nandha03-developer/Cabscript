import { nanoid } from 'nanoid';

/**
 * Generate a secure CSRF token
 */
export function generateCSRFToken(): string {
  return nanoid(32);
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken && token.length === 32;
}

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate a secure random string
 */
export function generateSecureToken(length: number = 32): string {
  return nanoid(length);
}

/**
 * Hash sensitive data (for storing in database)
 */
export async function hashData(data: string): Promise<string> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.hash(data, 12);
}

/**
 * Verify hashed data
 */
export async function verifyHash(data: string, hash: string): Promise<boolean> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.compare(data, hash);
}

/**
 * Check if request is from allowed origin
 */
export function isAllowedOrigin(origin: string | null): boolean {
  const allowedOrigins = [
    'https://cabscript.com',
    'https://www.cabscript.com',
    process.env.NEXT_PUBLIC_SITE_URL || '',
  ];

  if (process.env.NODE_ENV === 'development') {
    allowedOrigins.push('http://localhost:3000');
  }

  return origin ? allowedOrigins.includes(origin) : false;
}

/**
 * Generate secure headers for API responses
 */
export function getSecurityHeaders() {
  const headers: Record<string, string> = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };

  // Add HSTS in production
  if (process.env.NODE_ENV === 'production') {
    headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
  }

  // Add CSP header
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://embed.tawk.to https://va.tawk.to",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://www.google-analytics.com https://va.tawk.to wss://va.tawk.to",
    "frame-src 'self' https://embed.tawk.to",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ];
  headers['Content-Security-Policy'] = cspDirectives.join('; ');

  return headers;
}

/**
 * Mask sensitive data for logging
 */
export function maskSensitiveData(data: string, visibleChars: number = 4): string {
  if (data.length <= visibleChars) {
    return '*'.repeat(data.length);
  }
  return data.slice(0, visibleChars) + '*'.repeat(data.length - visibleChars);
}

/**
 * Rate limiting check (simple in-memory implementation)
 * For production, use Redis or a dedicated rate limiting service
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    // Create new record
    const resetTime = now + windowMs;
    rateLimitStore.set(identifier, { count: 1, resetTime });
    return { allowed: true, remaining: maxRequests - 1, resetTime };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  // Increment count
  record.count++;
  rateLimitStore.set(identifier, record);
  return { allowed: true, remaining: maxRequests - record.count, resetTime: record.resetTime };
}

/**
 * Clean up expired rate limit records
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Run cleanup every 10 minutes
if (typeof window === 'undefined') {
  setInterval(cleanupRateLimitStore, 10 * 60 * 1000);
}
