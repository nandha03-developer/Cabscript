"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaCookie, FaTimes, FaCog } from 'react-icons/fa';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Show banner after 2 seconds
      setTimeout(() => setShowBanner(true), 2000);
    } else {
      // Load saved preferences
      try {
        const saved = JSON.parse(consent);
        setPreferences(saved);
        applyConsent(saved);
      } catch (error) {
        console.error('Error parsing cookie consent:', error);
      }
    }
  }, []);

  const applyConsent = (prefs: CookiePreferences) => {
    // Apply analytics consent
    if (prefs.analytics) {
      // Enable Google Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'granted',
        });
      }
    }

    // Apply marketing consent
    if (prefs.marketing) {
      // Enable Facebook Pixel
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('consent', 'grant');
      }
    }
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie_consent', JSON.stringify(prefs));
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    applyConsent(prefs);
    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    savePreferences(allAccepted);
  };

  const acceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    setPreferences(necessaryOnly);
    savePreferences(necessaryOnly);
  };

  const saveCustom = () => {
    savePreferences(preferences);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-white border-t-4 border-[#FFD300] shadow-2xl animate-slide-up">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            {/* Icon & Content */}
            <div className="flex-1 flex items-start gap-4">
              <div className="bg-[#FFD300] p-3 rounded-lg shrink-0">
                <FaCookie className="w-6 h-6 text-gray-900" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  We Value Your Privacy
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                  By clicking "Accept All", you consent to our use of cookies. You can customize your preferences or learn more in our{' '}
                  <Link href="/cookies" className="text-[#FFD300] hover:underline font-semibold">
                    Cookie Policy
                  </Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-[#FFD300] hover:underline font-semibold">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={() => setShowSettings(true)}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <FaCog className="w-4 h-4" />
                <span>Customize</span>
              </button>
              <button
                onClick={acceptNecessary}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors"
              >
                Necessary Only
              </button>
              <button
                onClick={acceptAll}
                className="px-6 py-3 bg-[#FFD300] hover:bg-[#E6BE00] text-gray-900 font-semibold rounded-lg transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Cookie Preferences</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <p className="text-gray-600">
                We use different types of cookies to optimize your experience on our website. 
                Click on the categories below to learn more and change our default settings.
              </p>

              {/* Necessary Cookies */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900">Strictly Necessary Cookies</h3>
                  <div className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                    Always Active
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  These cookies are essential for the website to function properly. They enable basic functions 
                  like page navigation, security, and access to secure areas. The website cannot function properly 
                  without these cookies.
                </p>
              </div>

              {/* Analytics Cookies */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900">Analytics Cookies</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FFD300] peer-focus:ring-opacity-30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFD300]"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-600">
                  These cookies help us understand how visitors interact with our website by collecting and 
                  reporting information anonymously. This includes Google Analytics to track page views, session 
                  duration, and user behavior patterns.
                </p>
              </div>

              {/* Marketing Cookies */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900">Marketing Cookies</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FFD300] peer-focus:ring-opacity-30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFD300]"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-600">
                  These cookies are used to track visitors across websites to display relevant advertisements. 
                  They help us measure the effectiveness of our advertising campaigns and deliver personalized 
                  marketing content. This includes Facebook Pixel and other advertising platforms.
                </p>
              </div>

              {/* Learn More */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Learn More</h4>
                <p className="text-sm text-gray-600 mb-3">
                  For more information about our use of cookies and how we protect your data, please read:
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/cookies"
                    className="text-sm text-[#FFD300] hover:underline font-semibold"
                  >
                    Cookie Policy →
                  </Link>
                  <Link
                    href="/privacy"
                    className="text-sm text-[#FFD300] hover:underline font-semibold"
                  >
                    Privacy Policy →
                  </Link>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={acceptNecessary}
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-colors"
              >
                Reject All
              </button>
              <button
                onClick={saveCustom}
                className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors"
              >
                Save Preferences
              </button>
              <button
                onClick={acceptAll}
                className="flex-1 px-6 py-3 bg-[#FFD300] hover:bg-[#E6BE00] text-gray-900 font-semibold rounded-lg transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
