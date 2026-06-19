"use client";

import { useState, useEffect } from 'react';
import { FaTimes, FaDownload, FaMobileAlt } from 'react-icons/fa';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * PWA Install Prompt Component
 * 
 * Shows a custom install prompt for Progressive Web App
 * Appears when the browser's install criteria are met
 */
export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if running as installed PWA
    const isInstalledPWA = window.matchMedia('(display-mode: standalone)').matches ||
                          (window.navigator as any).standalone === true;
    
    if (isInstalledPWA) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Check if prompt was previously dismissed
    const dismissedDate = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissedDate) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedDate)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return; // Don't show again for 7 days
      }
    }

    // Listen for beforeinstallprompt event (Chrome, Edge)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after 3 seconds delay
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      
      // Track installation
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'pwa_install', {
          event_category: 'engagement',
          event_label: 'PWA Installed'
        });
      }
    }

    // Clear the prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
    
    // Track dismissal
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'pwa_prompt_dismissed', {
        event_category: 'engagement',
        event_label: 'PWA Prompt Dismissed'
      });
    }
  };

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

  // iOS Install Instructions
  if (isIOS && showPrompt) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-[#FFD300] shadow-2xl z-50 animate-slide-up">
        <div className="max-w-2xl mx-auto p-6">
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <FaTimes className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="bg-[#FFD300] p-3 rounded-lg">
              <FaMobileAlt className="w-8 h-8 text-gray-900" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                Install CabScript App
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Add CabScript to your home screen for quick access and a better experience!
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm text-gray-700">
                <p className="font-semibold">To install:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Tap the Share button <span className="inline-block">📤</span> in Safari</li>
                  <li>Scroll down and tap &quot;Add to Home Screen&quot;</li>
                  <li>Tap &quot;Add&quot; to confirm</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Android/Desktop Install Prompt
  if (showPrompt && deferredPrompt) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-[#FFD300] shadow-2xl z-50 animate-slide-up md:bottom-6 md:left-6 md:right-auto md:max-w-md md:rounded-lg md:border-4">
        <div className="p-6">
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <FaTimes className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="bg-[#FFD300] p-3 rounded-lg">
              <FaDownload className="w-8 h-8 text-gray-900" />
            </div>
            
            <div className="flex-1 pr-8">
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                Install CabScript App
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Get quick access with offline support, push notifications, and a native app experience!
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleInstallClick}
                  className="bg-[#FFD300] hover:bg-[#E6BE00] text-gray-900 font-semibold px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  Install
                </button>
                <button
                  onClick={handleDismiss}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-2 rounded-lg transition-colors"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
