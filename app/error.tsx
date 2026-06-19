/**
 * Global Error Page
 * Handles runtime errors throughout the application
 */

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { FaExclamationTriangle, FaHome, FaRedo, FaLifeRing } from 'react-icons/fa';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    console.error('Application Error:', error);
    
    // TODO: Log to error tracking service (Sentry, LogRocket, etc.)
    // Example: Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Error Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6 animate-pulse">
            <FaExclamationTriangle className="text-red-600 text-5xl" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Oops! Something Went Wrong
          </h1>
          
          <p className="text-xl text-gray-600 mb-2">
            We encountered an unexpected error
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
              <p className="text-sm font-mono text-red-800 wrap-break-word">
                <strong>Error:</strong> {error.message}
              </p>
              {error.digest && (
                <p className="text-sm font-mono text-red-600 mt-2">
                  <strong>Digest:</strong> {error.digest}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Error Card */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            What can you do?
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-yellow-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Try Again
                </h3>
                <p className="text-gray-600 text-sm">
                  This might be a temporary issue. Click the "Try Again" button below to retry.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-yellow-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Go Back Home
                </h3>
                <p className="text-gray-600 text-sm">
                  Return to our homepage and try navigating to your desired page again.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-yellow-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Contact Support
                </h3>
                <p className="text-gray-600 text-sm">
                  If the problem persists, our support team is here to help.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg"
          >
            <FaRedo />
            Try Again
          </button>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-black border-2 border-black rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            <FaHome />
            Go Home
          </Link>
          
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-yellow-400 text-gray-900 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
          >
            <FaLifeRing />
            Contact Support
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Error ID: {error.digest || 'N/A'} • Time: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
