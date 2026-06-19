/**
 * Analytics and Tracking Utilities
 * Supports Google Analytics 4, Facebook Pixel, and custom event tracking
 */

// Google Analytics 4
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// Facebook Pixel
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '';

/**
 * Google Analytics - Page View
 */
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

/**
 * Google Analytics - Custom Event
 */
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

/**
 * Track form submission
 */
export const trackFormSubmission = (formName: string, success: boolean = true) => {
  event({
    action: success ? 'form_submit_success' : 'form_submit_error',
    category: 'Form',
    label: formName,
  });

  // Facebook Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: formName,
    });
  }
};

/**
 * Track button click
 */
export const trackButtonClick = (buttonName: string, location: string) => {
  event({
    action: 'button_click',
    category: 'Engagement',
    label: `${buttonName} - ${location}`,
  });
};

/**
 * Track pricing plan view
 */
export const trackPricingView = (planName: string, price: number) => {
  event({
    action: 'view_item',
    category: 'Ecommerce',
    label: planName,
    value: price,
  });

  // Facebook Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_name: planName,
      content_category: 'Pricing Plan',
      value: price,
      currency: 'USD',
    });
  }
};

/**
 * Track checkout start
 */
export const trackCheckoutStart = (planName: string, value: number, currency: string = 'USD') => {
  event({
    action: 'begin_checkout',
    category: 'Ecommerce',
    label: planName,
    value: value,
  });

  // Facebook Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      content_name: planName,
      value: value,
      currency: currency,
    });
  }
};

/**
 * Track purchase/conversion
 */
export const trackPurchase = (transactionId: string, planName: string, value: number, currency: string = 'USD') => {
  event({
    action: 'purchase',
    category: 'Ecommerce',
    label: planName,
    value: value,
  });

  // Facebook Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Purchase', {
      content_name: planName,
      value: value,
      currency: currency,
      transaction_id: transactionId,
    });
  }
};

/**
 * Track demo request
 */
export const trackDemoRequest = () => {
  event({
    action: 'demo_request',
    category: 'Lead Generation',
    label: 'Demo Request Form',
  });

  // Facebook Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Schedule', {
      content_name: 'Demo Request',
    });
  }
};

/**
 * Track newsletter subscription
 */
export const trackNewsletterSubscribe = () => {
  event({
    action: 'newsletter_subscribe',
    category: 'Lead Generation',
    label: 'Newsletter Subscription',
  });

  // Facebook Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Subscribe', {
      content_name: 'Newsletter',
    });
  }
};

/**
 * Track contact form submission
 */
export const trackContactSubmission = () => {
  event({
    action: 'contact_submit',
    category: 'Lead Generation',
    label: 'Contact Form',
  });

  // Facebook Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Contact', {
      content_name: 'Contact Form',
    });
  }
};

/**
 * Track external link clicks
 */
export const trackExternalLink = (url: string, linkText: string) => {
  event({
    action: 'external_link_click',
    category: 'Outbound',
    label: `${linkText} - ${url}`,
  });
};

/**
 * Track video plays (if applicable)
 */
export const trackVideoPlay = (videoName: string) => {
  event({
    action: 'video_play',
    category: 'Engagement',
    label: videoName,
  });
};

/**
 * Track scroll depth
 */
export const trackScrollDepth = (percentage: number) => {
  event({
    action: 'scroll_depth',
    category: 'Engagement',
    label: `${percentage}%`,
    value: percentage,
  });
};

/**
 * Track time on page
 */
export const trackTimeOnPage = (seconds: number, pageName: string) => {
  event({
    action: 'time_on_page',
    category: 'Engagement',
    label: pageName,
    value: seconds,
  });
};

// Type definitions for gtag and fbq
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    fbq: (
      type: string,
      eventName: string,
      data?: Record<string, unknown>
    ) => void;
  }
}
