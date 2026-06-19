/**
 * A/B Testing Infrastructure
 * 
 * Provides utilities for running A/B tests with:
 * - Consistent variant assignment (hash-based)
 * - Cookie persistence across sessions
 * - Google Analytics integration
 * - Statistical significance calculation
 * - Multi-variant testing support
 */

import { cookies } from 'next/headers';

export interface ABTestConfig {
  testId: string;
  variants: string[]; // e.g., ['control', 'variant-a', 'variant-b']
  weights?: number[]; // Optional custom weights (must sum to 1.0)
  description?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface ABTestResult {
  testId: string;
  variant: string;
  isNewAssignment: boolean;
}

/**
 * Simple hash function for consistent variant assignment
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Assign a variant to a user based on their ID and test configuration
 */
export function assignVariant(
  userId: string,
  config: ABTestConfig
): string {
  const { testId, variants, weights } = config;

  if (variants.length === 0) {
    throw new Error(`Test ${testId} has no variants`);
  }

  // Use hash for deterministic assignment
  const hash = hashString(`${userId}-${testId}`);
  const normalized = (hash % 10000) / 10000; // 0.0000 to 0.9999

  // Apply weights if provided
  if (weights && weights.length === variants.length) {
    let cumulative = 0;
    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (normalized < cumulative) {
        return variants[i];
      }
    }
  }

  // Default: equal distribution
  const index = Math.floor(normalized * variants.length);
  return variants[index];
}

/**
 * Get or assign a variant for the current user
 * Server-side version using cookies
 */
export async function getVariant(config: ABTestConfig): Promise<ABTestResult> {
  const { testId } = config;
  const cookieStore = await cookies();
  
  // Check if test is active
  const now = new Date();
  if (config.startDate && now < config.startDate) {
    return {
      testId,
      variant: config.variants[0], // Return control before test starts
      isNewAssignment: false,
    };
  }
  if (config.endDate && now > config.endDate) {
    return {
      testId,
      variant: config.variants[0], // Return control after test ends
      isNewAssignment: false,
    };
  }

  // Check for existing assignment
  const cookieName = `ab_${testId}`;
  const existingVariant = cookieStore.get(cookieName)?.value;

  if (existingVariant && config.variants.includes(existingVariant)) {
    return {
      testId,
      variant: existingVariant,
      isNewAssignment: false,
    };
  }

  // Generate user ID if needed
  let userId = cookieStore.get('ab_user_id')?.value;
  if (!userId) {
    userId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    cookieStore.set('ab_user_id', userId, {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: '/',
      sameSite: 'lax',
    });
  }

  // Assign new variant
  const variant = assignVariant(userId, config);

  // Store in cookie
  cookieStore.set(cookieName, variant, {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/',
    sameSite: 'lax',
  });

  return {
    testId,
    variant,
    isNewAssignment: true,
  };
}

/**
 * Client-side variant assignment
 */
export function getVariantClient(config: ABTestConfig): ABTestResult {
  const { testId } = config;

  if (typeof window === 'undefined') {
    return {
      testId,
      variant: config.variants[0],
      isNewAssignment: false,
    };
  }

  // Check if test is active
  const now = new Date();
  if (config.startDate && now < config.startDate) {
    return {
      testId,
      variant: config.variants[0],
      isNewAssignment: false,
    };
  }
  if (config.endDate && now > config.endDate) {
    return {
      testId,
      variant: config.variants[0],
      isNewAssignment: false,
    };
  }

  // Check localStorage for existing assignment
  const storageKey = `ab_${testId}`;
  const existingVariant = localStorage.getItem(storageKey);

  if (existingVariant && config.variants.includes(existingVariant)) {
    return {
      testId,
      variant: existingVariant,
      isNewAssignment: false,
    };
  }

  // Generate user ID if needed
  let userId = localStorage.getItem('ab_user_id');
  if (!userId) {
    userId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('ab_user_id', userId);
  }

  // Assign new variant
  const variant = assignVariant(userId, config);

  // Store in localStorage
  localStorage.setItem(storageKey, variant);

  return {
    testId,
    variant,
    isNewAssignment: true,
  };
}

/**
 * Track A/B test events in Google Analytics
 */
export function trackABTestEvent(
  testId: string,
  variant: string,
  eventName: string,
  eventData?: Record<string, any>
) {
  if (typeof window === 'undefined') return;

  const gtag = (window as any).gtag;
  if (!gtag) {
    console.warn('Google Analytics not loaded');
    return;
  }

  gtag('event', eventName, {
    event_category: 'ab_test',
    ab_test_id: testId,
    ab_test_variant: variant,
    ...eventData,
  });
}

/**
 * Track A/B test assignment (call when user is assigned to a variant)
 */
export function trackABTestAssignment(testId: string, variant: string) {
  trackABTestEvent(testId, variant, 'ab_test_assigned');
}

/**
 * Track A/B test conversion (call when user completes goal)
 */
export function trackABTestConversion(
  testId: string,
  variant: string,
  conversionType: string = 'default',
  value?: number
) {
  trackABTestEvent(testId, variant, 'ab_test_conversion', {
    conversion_type: conversionType,
    value,
  });
}

/**
 * Calculate statistical significance using Chi-Square test
 */
export interface VariantStats {
  variant: string;
  visitors: number;
  conversions: number;
  conversionRate: number;
}

export interface SignificanceResult {
  isSignificant: boolean;
  confidenceLevel: number;
  winner?: string;
  improvement?: number;
  chiSquare?: number;
}

export function calculateSignificance(
  controlStats: VariantStats,
  variantStats: VariantStats,
  confidenceThreshold: number = 0.95
): SignificanceResult {
  const { visitors: n1, conversions: x1 } = controlStats;
  const { visitors: n2, conversions: x2 } = variantStats;

  // Need minimum sample size
  if (n1 < 30 || n2 < 30) {
    return {
      isSignificant: false,
      confidenceLevel: 0,
    };
  }

  // Calculate observed and expected values
  const totalVisitors = n1 + n2;
  const totalConversions = x1 + x2;
  const expectedRate = totalConversions / totalVisitors;

  const expected1 = n1 * expectedRate;
  const expected2 = n2 * expectedRate;

  // Chi-square calculation
  const chiSquare =
    Math.pow(x1 - expected1, 2) / expected1 +
    Math.pow(x2 - expected2, 2) / expected2 +
    Math.pow((n1 - x1) - (n1 - expected1), 2) / (n1 - expected1) +
    Math.pow((n2 - x2) - (n2 - expected2), 2) / (n2 - expected2);

  // Critical value for 95% confidence (df=1) is 3.841
  // Critical value for 99% confidence (df=1) is 6.635
  const criticalValue95 = 3.841;
  const criticalValue99 = 6.635;

  const isSignificant = chiSquare > criticalValue95;
  const confidenceLevel = chiSquare > criticalValue99 ? 0.99 : chiSquare > criticalValue95 ? 0.95 : 0;

  // Determine winner and improvement
  const controlRate = controlStats.conversionRate;
  const variantRate = variantStats.conversionRate;
  
  const winner = variantRate > controlRate ? variantStats.variant : controlStats.variant;
  const improvement = Math.abs((variantRate - controlRate) / controlRate) * 100;

  return {
    isSignificant: isSignificant && confidenceLevel >= confidenceThreshold,
    confidenceLevel,
    winner: isSignificant ? winner : undefined,
    improvement: isSignificant ? improvement : undefined,
    chiSquare,
  };
}

/**
 * Example test configurations
 */
export const ACTIVE_TESTS: Record<string, ABTestConfig> = {
  pricing_cta: {
    testId: 'pricing_cta',
    variants: ['control', 'urgent', 'trust'],
    description: 'Test different CTA styles on pricing page',
  },
  hero_headline: {
    testId: 'hero_headline',
    variants: ['control', 'benefit_focused', 'problem_solution'],
    description: 'Test different hero headline approaches',
  },
  exit_popup_discount: {
    testId: 'exit_popup_discount',
    variants: ['10_percent', '15_percent', '200_dollars'],
    weights: [0.4, 0.3, 0.3], // More traffic to 10%
    description: 'Test different discount amounts in exit popup',
  },
};

/**
 * Helper hook for client-side A/B testing
 */
export function useABTest(testId: string) {
  if (typeof window === 'undefined') {
    return {
      variant: 'control',
      isReady: false,
    };
  }

  const config = ACTIVE_TESTS[testId];
  if (!config) {
    console.warn(`A/B test "${testId}" not found in ACTIVE_TESTS`);
    return {
      variant: 'control',
      isReady: false,
    };
  }

  const result = getVariantClient(config);

  // Track assignment on first load
  if (result.isNewAssignment) {
    trackABTestAssignment(testId, result.variant);
  }

  return {
    variant: result.variant,
    isReady: true,
    trackConversion: (conversionType?: string, value?: number) => {
      trackABTestConversion(testId, result.variant, conversionType, value);
    },
  };
}
