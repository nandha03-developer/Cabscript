/**
 * Global Error Boundary
 * Catches errors in the root layout
 */

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { FaExclamationCircle, FaHome, FaRedo } from 'react-icons/fa';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global Error:', error);
    // TODO: Log to error tracking service
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
          <div className="max-w-xl w-full text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500 rounded-full mb-6">
              <FaExclamationCircle className="text-white text-4xl" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Critical Error
            </h1>
            
            <p className="text-gray-300 mb-8">
              We're experiencing technical difficulties. Our team has been notified.
            </p>

            {process.env.NODE_ENV === 'development' && (
              <div className="mb-8 p-4 bg-red-900 border border-red-700 rounded text-left">
                <p className="text-sm font-mono text-red-200">
                  {error.message}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100"
              >
                <FaRedo />
                Try Again
              </button>
              
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg font-semibold hover:bg-yellow-500"
              >
                <FaHome />
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
