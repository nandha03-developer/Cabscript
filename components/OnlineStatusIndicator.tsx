"use client";

import { useState, useEffect } from 'react';
import { FaWifi } from 'react-icons/fa';
import { MdSignalWifiOff } from 'react-icons/md';

/**
 * Online Status Indicator
 * 
 * Shows a toast notification when connection is lost or restored
 */
export default function OnlineStatusIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Set initial online status
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowToast(true);
      
      // Hide toast after 3 seconds
      setTimeout(() => setShowToast(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowToast(true);
      
      // Keep offline toast visible longer (hide after 5 seconds)
      setTimeout(() => setShowToast(false), 5000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showToast) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className={`
        flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg
        ${isOnline 
          ? 'bg-green-500 text-white' 
          : 'bg-red-500 text-white'
        }
      `}>
        {isOnline ? (
          <>
            <FaWifi className="w-5 h-5" />
            <div>
              <p className="font-semibold">Back Online</p>
              <p className="text-sm opacity-90">Your connection has been restored</p>
            </div>
          </>
        ) : (
          <>
            <MdSignalWifiOff className="w-5 h-5" />
            <div>
              <p className="font-semibold">No Internet Connection</p>
              <p className="text-sm opacity-90">You&apos;re currently offline</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
