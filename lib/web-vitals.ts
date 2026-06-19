/**
 * Core Web Vitals Monitoring
 * 
 * Tracks and reports Core Web Vitals metrics to analytics:
 * - LCP (Largest Contentful Paint) - Target: < 2.5s
 * - FID (First Input Delay) - Target: < 100ms
 * - CLS (Cumulative Layout Shift) - Target: < 0.1
 * - FCP (First Contentful Paint) - Target: < 1.8s
 * - TTFB (Time to First Byte) - Target: < 600ms
 * - INP (Interaction to Next Paint) - Target: < 200ms
 */

import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

export interface WebVitalsMetric {
  id: string;
  name: 'CLS' | 'FCP' | 'INP' | 'LCP' | 'TTFB';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  navigationType: string;
}

/**
 * Rating thresholds based on Google's recommendations
 */
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 600, poor: 1800 },
  INP: { good: 200, poor: 500 },
};

/**
 * Determine metric rating based on value
 */
function getRating(
  name: WebVitalsMetric['name'],
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Send metric to Google Analytics
 */
function sendToAnalytics(metric: WebVitalsMetric) {
  if (typeof window === 'undefined') return;

  const gtag = (window as any).gtag;
  if (!gtag) {
    console.warn('Google Analytics not loaded, metric not sent:', metric);
    return;
  }

  // Send to GA4 as event
  gtag('event', metric.name, {
    event_category: 'Web Vitals',
    event_label: metric.id,
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    metric_id: metric.id,
    metric_value: metric.value,
    metric_delta: metric.delta,
    metric_rating: metric.rating,
    navigation_type: metric.navigationType,
    non_interaction: true,
  });

  // Also send as custom user timing for easier reporting
  gtag('event', 'timing_complete', {
    name: metric.name,
    value: Math.round(metric.value),
    event_category: 'Web Vitals',
    event_label: metric.rating,
  });
}

/**
 * Send metric to custom API endpoint for long-term storage
 */
async function sendToAPI(metric: WebVitalsMetric) {
  if (typeof window === 'undefined') return;

  try {
    // Send to our performance tracking API
    await fetch('/api/analytics/web-vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...metric,
        url: window.location.pathname,
        userAgent: navigator.userAgent,
        connection: (navigator as any).connection?.effectiveType || 'unknown',
        timestamp: new Date().toISOString(),
      }),
      // Don't wait for response (fire and forget)
      keepalive: true,
    });
  } catch (error) {
    // Silently fail - don't impact user experience
    console.error('Failed to send web vitals to API:', error);
  }
}

/**
 * Report Web Vitals metric
 */
function reportMetric(metric: any) {
  const webVitalsMetric: WebVitalsMetric = {
    id: metric.id,
    name: metric.name,
    value: metric.value,
    rating: getRating(metric.name, metric.value),
    delta: metric.delta,
    navigationType: metric.navigationType || 'navigate',
  };

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Web Vitals:', webVitalsMetric);
  }

  // Send to analytics
  sendToAnalytics(webVitalsMetric);

  // Send to API for storage (async, non-blocking)
  sendToAPI(webVitalsMetric);

  // Trigger alert if metric is poor
  if (webVitalsMetric.rating === 'poor') {
    console.warn(`⚠️ Poor ${metric.name} detected:`, webVitalsMetric.value);
    
    // Could trigger alert to monitoring service
    triggerPerformanceAlert(webVitalsMetric);
  }
}

/**
 * Trigger alert for poor performance
 */
function triggerPerformanceAlert(metric: WebVitalsMetric) {
  if (typeof window === 'undefined') return;

  // Send to error tracking service (Sentry)
  if ((window as any).Sentry) {
    (window as any).Sentry.captureMessage(
      `Poor ${metric.name}: ${metric.value.toFixed(2)}`,
      {
        level: 'warning',
        tags: {
          metric: metric.name,
          rating: metric.rating,
        },
        extra: {
          value: metric.value,
          delta: metric.delta,
          url: window.location.pathname,
        },
      }
    );
  }
}

/**
 * Initialize Web Vitals tracking
 * Call this in your root layout or _app.tsx
 */
export function initWebVitals() {
  if (typeof window === 'undefined') return;

  // Track all Core Web Vitals
  onCLS(reportMetric);
  onLCP(reportMetric);
  onFCP(reportMetric);
  onTTFB(reportMetric);
  onINP(reportMetric);

  // Log initialization
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ Web Vitals tracking initialized');
  }
}

/**
 * Get performance summary for current page
 */
export function getPerformanceSummary() {
  if (typeof window === 'undefined' || !window.performance) {
    return null;
  }

  const perfData = window.performance.timing;
  const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

  return {
    // Page load times
    dns: perfData.domainLookupEnd - perfData.domainLookupStart,
    tcp: perfData.connectEnd - perfData.connectStart,
    request: perfData.responseStart - perfData.requestStart,
    response: perfData.responseEnd - perfData.responseStart,
    dom: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
    load: perfData.loadEventEnd - perfData.loadEventStart,
    
    // Total times
    ttfb: perfData.responseStart - perfData.navigationStart,
    domReady: perfData.domContentLoadedEventEnd - perfData.navigationStart,
    pageLoad: perfData.loadEventEnd - perfData.navigationStart,

    // Resource counts
    resources: window.performance.getEntriesByType('resource').length,
    
    // Navigation type
    navigationType: navigation?.type || 'unknown',
  };
}

/**
 * Monitor long tasks (tasks > 50ms)
 */
export function monitorLongTasks() {
  if (typeof window === 'undefined') return;

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const task = entry as PerformanceEntry;
        
        // Alert on very long tasks (> 100ms)
        if (task.duration > 100) {
          console.warn('⚠️ Long task detected:', {
            duration: task.duration.toFixed(2) + 'ms',
            name: task.name,
            startTime: task.startTime.toFixed(2),
          });

          // Send to analytics
          if ((window as any).gtag) {
            (window as any).gtag('event', 'long_task', {
              event_category: 'Performance',
              event_label: task.name,
              value: Math.round(task.duration),
              duration: task.duration,
            });
          }
        }
      }
    });

    observer.observe({ entryTypes: ['longtask'] });
  } catch (error) {
    console.warn('Long task monitoring not supported');
  }
}

/**
 * Monitor resource loading performance
 */
export function monitorResourceLoading() {
  if (typeof window === 'undefined') return;

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const resource = entry as PerformanceResourceTiming;
        
        // Alert on slow resources (> 2s)
        if (resource.duration > 2000) {
          console.warn('⚠️ Slow resource:', {
            name: resource.name,
            duration: resource.duration.toFixed(2) + 'ms',
            size: resource.transferSize || 'unknown',
          });

          // Send to analytics
          if ((window as any).gtag) {
            (window as any).gtag('event', 'slow_resource', {
              event_category: 'Performance',
              event_label: resource.name,
              value: Math.round(resource.duration),
              size: resource.transferSize,
            });
          }
        }
      }
    });

    observer.observe({ entryTypes: ['resource'] });
  } catch (error) {
    console.warn('Resource monitoring not supported');
  }
}

/**
 * Get largest contentful paint element info
 */
export function getLCPElement() {
  if (typeof window === 'undefined') return null;

  try {
    const lcpEntries = window.performance.getEntriesByType('largest-contentful-paint');
    if (lcpEntries.length === 0) return null;

    const lcp = lcpEntries[lcpEntries.length - 1] as any;
    return {
      element: lcp.element?.tagName || 'unknown',
      url: lcp.url || lcp.element?.currentSrc || 'unknown',
      size: lcp.size,
      loadTime: lcp.loadTime,
      renderTime: lcp.renderTime,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Client component to track Web Vitals
 */
export function WebVitalsReporter() {
  if (typeof window !== 'undefined') {
    initWebVitals();
    monitorLongTasks();
    monitorResourceLoading();
  }
  return null;
}
