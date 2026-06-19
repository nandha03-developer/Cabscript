"use client";

import { useState, useEffect } from 'react';
import { FaTimes, FaRocket, FaCheckCircle } from 'react-icons/fa';

interface ExitIntentPopupProps {
  enabled?: boolean;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
  discountCode?: string;
  onClose?: () => void;
  onConvert?: () => void;
}

export default function ExitIntentPopup({
  enabled = true,
  title = "Wait! Don't Miss Out on This Exclusive Offer! 🎉",
  description = "Get 10% off your first purchase when you sign up now!",
  ctaText = "Claim My 10% Discount",
  ctaUrl = "/pricing",
  discountCode = "WELCOME10",
  onClose,
  onConvert,
}: ExitIntentPopupProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    // Check if popup was already shown in this session
    const popupShown = sessionStorage.getItem('exit_intent_shown');
    if (popupShown) {
      setHasShown(true);
      return;
    }

    // Check if user dismissed popup recently (7 days)
    const dismissedUntil = localStorage.getItem('exit_intent_dismissed_until');
    if (dismissedUntil && Date.now() < parseInt(dismissedUntil)) {
      setHasShown(true);
      return;
    }

    let mouseY = 0;
    let isExiting = false;

    const handleMouseMove = (e: MouseEvent) => {
      mouseY = e.clientY;
    };

    const handleMouseLeave = (e: MouseEvent) => {
      // Detect if mouse is leaving from top of viewport (exit intent)
      if (
        e.clientY <= 0 &&
        !isExiting &&
        !hasShown &&
        !showPopup &&
        mouseY <= 50 // Mouse was near top
      ) {
        isExiting = true;
        setShowPopup(true);
        setHasShown(true);
        sessionStorage.setItem('exit_intent_shown', 'true');

        // Track exit intent event
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'exit_intent_shown', {
            event_category: 'conversion',
            event_label: 'Exit Intent Popup Displayed',
          });
        }
      }
    };

    // Add delay before activating (prevent false positives)
    const timer = setTimeout(() => {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 5000); // Wait 5 seconds before activating

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enabled, hasShown, showPopup]);

  const handleClose = () => {
    setShowPopup(false);
    
    // Store dismissal for 7 days
    const dismissUntil = Date.now() + 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem('exit_intent_dismissed_until', dismissUntil.toString());

    // Track dismissal
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exit_intent_dismissed', {
        event_category: 'conversion',
        event_label: 'Exit Intent Popup Closed',
      });
    }

    if (onClose) onClose();
  };

  const handleCTA = () => {
    setShowPopup(false);

    // Track conversion
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exit_intent_converted', {
        event_category: 'conversion',
        event_label: 'Exit Intent CTA Clicked',
        value: 1,
      });
    }

    if (onConvert) onConvert();

    // Navigate to CTA URL
    if (ctaUrl) {
      window.location.href = ctaUrl;
    }
  };

  if (!showPopup) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 z-50 animate-fade-in"
        onClick={handleClose}
      />

      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full pointer-events-auto animate-scale-in overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            aria-label="Close popup"
          >
            <FaTimes className="w-6 h-6" />
          </button>

          {/* Header with Gradient */}
          <div className="bg-linear-to-r from-[#FFD300] to-[#FFA500] p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
              <FaRocket className="w-8 h-8 text-[#FFD300]" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
          </div>

          {/* Content */}
          <div className="p-8">
            <p className="text-xl text-gray-700 text-center mb-6">
              {description}
            </p>

            {/* Benefits */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                What You'll Get:
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-700">
                  <FaCheckCircle className="text-green-500 shrink-0 mt-1" />
                  <span><strong>10% Discount</strong> on any plan (Startup, Professional, or Enterprise)</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <FaCheckCircle className="text-green-500 shrink-0 mt-1" />
                  <span><strong>Complete Source Code</strong> - Full ownership with white-label rights</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <FaCheckCircle className="text-green-500 shrink-0 mt-1" />
                  <span><strong>Free 6 Months Updates</strong> - Stay current with latest features</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <FaCheckCircle className="text-green-500 shrink-0 mt-1" />
                  <span><strong>24/7 Premium Support</strong> - We're here to help you succeed</span>
                </li>
              </ul>
            </div>

            {/* Discount Code */}
            {discountCode && (
              <div className="bg-yellow-50 border-2 border-[#FFD300] rounded-lg p-4 mb-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Use code at checkout:</p>
                <div className="flex items-center justify-center gap-3">
                  <code className="text-2xl font-bold text-gray-900 tracking-wider">
                    {discountCode}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(discountCode);
                      // Show toast or feedback
                    }}
                    className="text-sm text-[#FFD300] hover:text-[#E6BE00] font-semibold"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}

            {/* CTA Button */}
            <button
              onClick={handleCTA}
              className="w-full bg-[#FFD300] hover:bg-[#E6BE00] text-gray-900 font-bold text-lg py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl mb-4"
            >
              {ctaText} →
            </button>

            {/* Secondary Action */}
            <button
              onClick={handleClose}
              className="w-full text-gray-500 hover:text-gray-700 text-sm transition-colors"
            >
              No thanks, I'll pay full price
            </button>

            {/* Trust Indicators */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  <span>30-Day Money Back</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  <span>500+ Happy Customers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
