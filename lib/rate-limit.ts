/**
 * Rate Limiting Middleware
 * Prevent brute force and DDoS attacks
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

// Predefined rate limit configurations
export const RATE_LIMITS = {
  // Strict limits for authentication endpoints
  AUTH: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 attempts per 15 minutes
  
  // Standard API limits
  API: { windowMs: 60 * 1000, maxRequests: 100 }, // 100 requests per minute
  
  // Loose limits for read-only operations
  READ: { windowMs: 60 * 1000, maxRequests: 200 }, // 200 requests per minute
  
  // License validation (public endpoint)
  LICENSE: { windowMs: 60 * 1000, maxRequests: 20 }, // 20 validations per minute
};

/**
 * Check if request exceeds rate limit
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = RATE_LIMITS.API
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // No existing entry or window expired
  if (!entry || now > entry.resetTime) {
    const resetTime = now + config.windowMs;
    rateLimitStore.set(identifier, { count: 1, resetTime });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime,
    };
  }

  // Increment counter
  entry.count++;
  rateLimitStore.set(identifier, entry);

  // Check if limit exceeded
  if (entry.count > config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Get rate limit identifier from request
 * Uses IP address as primary identifier
 */
export function getRateLimitIdentifier(
  request: Request,
  prefix: string = "global"
): string {
  const headers = request.headers;
  const ip =
    headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    headers.get("x-real-ip") ||
    "unknown";
  
  return `${prefix}:${ip}`;
}

/**
 * Rate limit headers for HTTP responses
 */
export function getRateLimitHeaders(result: {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}): Record<string, string> {
  return {
    "X-RateLimit-Limit": "100",
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": new Date(result.resetTime).toISOString(),
  };
}

/**
 * Clean up expired entries (call periodically)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Clean up every 5 minutes
if (typeof window === "undefined") {
  // Server-side only
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}
