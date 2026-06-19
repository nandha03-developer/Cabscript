/**
 * Error Logging Utility
 * Centralized error logging for the application
 */

interface ErrorLogData {
  message: string;
  stack?: string;
  component?: string;
  userId?: string;
  url?: string;
  userAgent?: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
}

/**
 * Log error to console and external service
 */
export function logError(
  error: Error,
  severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
  context?: Record<string, any>
) {
  const errorData: ErrorLogData = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    severity,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
    context,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.group(`🔴 Error [${severity.toUpperCase()}]`);
    console.error('Message:', errorData.message);
    console.error('Stack:', errorData.stack);
    if (context) console.error('Context:', context);
    console.groupEnd();
  }

  // TODO: Send to error tracking service in production
  // Example integrations:
  
  // Sentry
  // if (typeof window !== 'undefined' && window.Sentry) {
  //   window.Sentry.captureException(error, {
  //     level: severity,
  //     extra: context,
  //   });
  // }

  // LogRocket
  // if (typeof window !== 'undefined' && window.LogRocket) {
  //   window.LogRocket.captureException(error, {
  //     tags: { severity },
  //     extra: context,
  //   });
  // }

  // Custom API endpoint
  // if (process.env.NODE_ENV === 'production') {
  //   fetch('/api/errors', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(errorData),
  //   }).catch(err => console.error('Failed to log error:', err));
  // }

  return errorData;
}

/**
 * Log custom application error
 */
export function logAppError(
  message: string,
  severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
  context?: Record<string, any>
) {
  const error = new Error(message);
  return logError(error, severity, context);
}

/**
 * Log API error
 */
export function logApiError(
  endpoint: string,
  status: number,
  responseBody: any,
  context?: Record<string, any>
) {
  return logAppError(
    `API Error: ${endpoint} returned ${status}`,
    status >= 500 ? 'high' : 'medium',
    {
      endpoint,
      status,
      responseBody,
      ...context,
    }
  );
}

/**
 * Log payment error
 */
export function logPaymentError(
  paymentMethod: string,
  error: Error,
  context?: Record<string, any>
) {
  return logError(error, 'critical', {
    type: 'payment_error',
    paymentMethod,
    ...context,
  });
}

/**
 * Log form submission error
 */
export function logFormError(
  formName: string,
  error: Error,
  formData?: Record<string, any>
) {
  return logError(error, 'low', {
    type: 'form_error',
    formName,
    formData,
  });
}

/**
 * Track error metrics
 */
export function trackErrorMetric(errorType: string, metadata?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description: errorType,
      fatal: false,
      ...metadata,
    });
  }

  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'Error', {
      error_type: errorType,
      ...metadata,
    });
  }
}

/**
 * Error boundary logger
 */
export function logBoundaryError(
  error: Error,
  errorInfo: { componentStack: string }
) {
  return logError(error, 'high', {
    type: 'boundary_error',
    componentStack: errorInfo.componentStack,
  });
}

// Types for window objects
// Note: gtag and fbq types are already declared in lib/analytics.ts
declare global {
  interface Window {
    Sentry?: any;
    LogRocket?: any;
  }
}
