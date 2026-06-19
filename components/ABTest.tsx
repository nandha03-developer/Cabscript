"use client";

import { useState, useEffect } from 'react';
import {
  getVariantClient,
  trackABTestAssignment,
  trackABTestConversion,
  ACTIVE_TESTS,
  ABTestConfig,
} from '@/lib/ab-testing';

interface UseABTestResult {
  variant: string;
  isReady: boolean;
  trackConversion: (conversionType?: string, value?: number) => void;
}

/**
 * React hook for client-side A/B testing
 * 
 * Usage:
 * ```tsx
 * const { variant, isReady, trackConversion } = useABTest('pricing_cta');
 * 
 * if (!isReady) return <LoadingSpinner />;
 * 
 * return (
 *   <button onClick={() => {
 *     trackConversion('button_click');
 *     // Handle click
 *   }}>
 *     {variant === 'urgent' ? 'Limited Time Offer!' : 'Get Started'}
 *   </button>
 * );
 * ```
 */
export function useABTest(testId: string): UseABTestResult {
  const [variant, setVariant] = useState<string>('control');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const config = ACTIVE_TESTS[testId];
    if (!config) {
      console.warn(`A/B test "${testId}" not found in ACTIVE_TESTS`);
      setVariant('control');
      setIsReady(true);
      return;
    }

    const result = getVariantClient(config);
    setVariant(result.variant);
    setIsReady(true);

    // Track assignment for new users
    if (result.isNewAssignment) {
      trackABTestAssignment(testId, result.variant);
    }
  }, [testId]);

  const trackConversion = (conversionType: string = 'default', value?: number) => {
    trackABTestConversion(testId, variant, conversionType, value);
  };

  return {
    variant,
    isReady,
    trackConversion,
  };
}

/**
 * Component wrapper for A/B testing
 * Renders different components based on variant
 * 
 * Usage:
 * ```tsx
 * <ABTestSwitch testId="hero_headline">
 *   <ABTestVariant name="control">
 *     <h1>Professional Taxi Booking Software</h1>
 *   </ABTestVariant>
 *   <ABTestVariant name="benefit_focused">
 *     <h1>Launch Your Taxi Business in 24 Hours</h1>
 *   </ABTestVariant>
 *   <ABTestVariant name="problem_solution">
 *     <h1>Stop Losing Customers to Uber - Start Your Own Service</h1>
 *   </ABTestVariant>
 * </ABTestSwitch>
 * ```
 */
interface ABTestSwitchProps {
  testId: string;
  children: React.ReactElement<ABTestVariantProps>[];
  fallback?: React.ReactNode;
}

interface ABTestVariantProps {
  name: string;
  children: React.ReactNode;
}

export function ABTestVariant({ children }: ABTestVariantProps) {
  return <>{children}</>;
}

export function ABTestSwitch({ testId, children, fallback }: ABTestSwitchProps) {
  const { variant, isReady } = useABTest(testId);

  if (!isReady) {
    return fallback || null;
  }

  // Find matching variant
  const variantChild = children.find(
    child => child.props.name === variant
  );

  if (!variantChild) {
    // Fallback to control
    const controlChild = children.find(
      child => child.props.name === 'control'
    );
    return controlChild || (fallback as React.ReactElement) || null;
  }

  return variantChild;
}

/**
 * Example: Pricing CTA Button with A/B testing
 */
export function PricingCTAButton({ planName, price }: { planName: string; price: number }) {
  const { variant, isReady, trackConversion } = useABTest('pricing_cta');

  if (!isReady) {
    return (
      <button className="w-full py-3 px-6 bg-gray-200 rounded-lg animate-pulse">
        Loading...
      </button>
    );
  }

  const handleClick = () => {
    trackConversion('cta_click', price);
    // Navigate to checkout
    window.location.href = `/checkout?plan=${planName.toLowerCase()}`;
  };

  // Different CTA styles based on variant
  const ctaConfig = {
    control: {
      text: 'Get Started',
      className: 'bg-yellow-400 hover:bg-yellow-500 text-black',
      icon: null,
    },
    urgent: {
      text: '🔥 Claim Limited Offer',
      className: 'bg-red-500 hover:bg-red-600 text-white animate-pulse-slow',
      icon: '⚡',
    },
    trust: {
      text: '✓ Start 14-Day Trial',
      className: 'bg-green-500 hover:bg-green-600 text-white',
      icon: '🔒',
    },
  };

  const config = ctaConfig[variant as keyof typeof ctaConfig] || ctaConfig.control;

  return (
    <button
      onClick={handleClick}
      className={`w-full py-3 px-6 rounded-lg font-bold text-lg transition-all ${config.className}`}
    >
      {config.icon && <span className="mr-2">{config.icon}</span>}
      {config.text}
    </button>
  );
}

/**
 * Example: Hero Headline with A/B testing
 */
export function HeroHeadline() {
  return (
    <ABTestSwitch testId="hero_headline">
      <ABTestVariant name="control">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Professional Taxi Booking Software
        </h1>
      </ABTestVariant>
      <ABTestVariant name="benefit_focused">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Launch Your Taxi Business in <span className="text-yellow-400">24 Hours</span>
        </h1>
      </ABTestVariant>
      <ABTestVariant name="problem_solution">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Stop Losing Customers to Uber - <span className="text-yellow-400">Start Your Own</span>
        </h1>
      </ABTestVariant>
    </ABTestSwitch>
  );
}

/**
 * Example: Exit Popup Discount with A/B testing
 */
export function ExitPopupDiscount() {
  const { variant, isReady, trackConversion } = useABTest('exit_popup_discount');

  if (!isReady) return null;

  const discountConfig = {
    '10_percent': {
      code: 'SAVE10',
      description: 'Get 10% off your first purchase',
      highlight: '10%',
    },
    '15_percent': {
      code: 'SAVE15',
      description: 'Get 15% off your first purchase',
      highlight: '15%',
    },
    '200_dollars': {
      code: 'SAVE200',
      description: 'Save $200 on any plan',
      highlight: '$200',
    },
  };

  const config = discountConfig[variant as keyof typeof discountConfig] || discountConfig['10_percent'];

  const handleClaim = () => {
    trackConversion('discount_claimed');
    // Copy to clipboard and navigate
    navigator.clipboard.writeText(config.code);
    window.location.href = '/pricing';
  };

  return (
    <div className="text-center">
      <p className="text-4xl font-bold text-yellow-400 mb-2">
        {config.highlight} OFF
      </p>
      <p className="text-lg text-gray-700 mb-4">{config.description}</p>
      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 mb-4">
        <code className="text-2xl font-bold text-gray-900">{config.code}</code>
      </div>
      <button
        onClick={handleClaim}
        className="w-full py-3 px-6 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-lg transition-all"
      >
        Claim Your Discount
      </button>
    </div>
  );
}
