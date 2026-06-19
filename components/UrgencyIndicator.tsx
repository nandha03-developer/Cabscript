"use client";

import { useState, useEffect } from 'react';
import { FaFire, FaEye, FaShoppingCart, FaUsers } from 'react-icons/fa';

interface UrgencyIndicatorProps {
  type: 'limited-stock' | 'live-viewers' | 'recent-purchase' | 'trending';
  baseCount?: number;
  variance?: number;
  updateInterval?: number; // milliseconds
  threshold?: number; // Show urgent state when below this
  productName?: string;
}

export default function UrgencyIndicator({
  type,
  baseCount = 50,
  variance = 10,
  updateInterval = 5000,
  threshold = 10,
  productName = 'CabScript',
}: UrgencyIndicatorProps) {
  const [count, setCount] = useState(baseCount);
  const [isUrgent, setIsUrgent] = useState(false);
  const [recentPurchase, setRecentPurchase] = useState<string | null>(null);

  // Simulate realistic count changes
  useEffect(() => {
    const updateCount = () => {
      // Random walk: small changes up or down
      const change = Math.floor(Math.random() * (variance * 2 + 1)) - variance;
      const newCount = Math.max(1, count + change);
      setCount(newCount);

      // Update urgent state
      if (type === 'limited-stock') {
        setIsUrgent(newCount <= threshold);
      } else if (type === 'live-viewers') {
        setIsUrgent(newCount >= baseCount * 1.5); // High traffic
      }
    };

    const interval = setInterval(updateCount, updateInterval);
    return () => clearInterval(interval);
  }, [count, variance, updateInterval, threshold, baseCount, type]);

  // Simulate recent purchases
  useEffect(() => {
    if (type !== 'recent-purchase') return;

    const locations = [
      'New York, USA',
      'London, UK',
      'Mumbai, India',
      'Dubai, UAE',
      'Sydney, Australia',
      'Toronto, Canada',
      'Singapore',
      'Berlin, Germany',
      'Tokyo, Japan',
      'São Paulo, Brazil',
    ];

    const showPurchase = () => {
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      const minutesAgo = Math.floor(Math.random() * 30) + 1;
      setRecentPurchase(`Someone from ${randomLocation} purchased ${minutesAgo}min ago`);

      // Hide after 5 seconds
      setTimeout(() => {
        setRecentPurchase(null);
      }, 5000);
    };

    // Show first purchase after 3 seconds
    const initialTimer = setTimeout(showPurchase, 3000);

    // Then show randomly every 15-30 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        showPurchase();
      }
    }, 20000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [type, productName]);

  // Recent Purchase Notification (Toast-style)
  if (type === 'recent-purchase' && recentPurchase) {
    return (
      <div className="fixed bottom-6 left-6 z-40 animate-slide-in-left">
        <div className="bg-white rounded-xl shadow-2xl p-4 max-w-sm border-l-4 border-green-500 flex items-start gap-3">
          <div className="bg-green-100 rounded-full p-2 shrink-0">
            <FaShoppingCart className="text-green-600 w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-sm mb-1">
              🎉 New Purchase!
            </p>
            <p className="text-gray-600 text-xs leading-relaxed">
              {recentPurchase}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Limited Stock Indicator
  if (type === 'limited-stock') {
    return (
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
          isUrgent
            ? 'bg-red-50 border-2 border-red-500 text-red-700'
            : 'bg-amber-50 border-2 border-amber-400 text-amber-700'
        } font-semibold text-sm transition-all ${
          isUrgent ? 'animate-pulse-slow' : ''
        }`}
      >
        <FaFire className={isUrgent ? 'text-red-600' : 'text-amber-600'} />
        <span>
          {isUrgent ? '⚡ Only ' : ''}
          <strong className="text-lg tabular-nums">{count}</strong>{' '}
          licenses left!
        </span>
      </div>
    );
  }

  // Live Viewers Indicator
  if (type === 'live-viewers') {
    return (
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
          isUrgent
            ? 'bg-red-50 border-2 border-red-400 text-red-700'
            : 'bg-blue-50 border-2 border-blue-400 text-blue-700'
        } font-semibold text-sm transition-all`}
      >
        <div className="relative">
          <FaEye className={isUrgent ? 'text-red-600' : 'text-blue-600'} />
          {isUrgent && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
          )}
        </div>
        <span>
          <strong className="text-lg tabular-nums">{count}</strong>{' '}
          {isUrgent ? 'people viewing now! 🔥' : 'people viewing this'}
        </span>
      </div>
    );
  }

  // Trending Indicator
  if (type === 'trending') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-purple-50 to-pink-50 border-2 border-purple-400 text-purple-700 font-semibold text-sm">
        <FaUsers className="text-purple-600" />
        <span>
          🔥 <strong className="text-lg tabular-nums">{count}+</strong>{' '}
          customers this week!
        </span>
      </div>
    );
  }

  return null;
}

// Composite component showing multiple indicators
export function UrgencyIndicatorStack() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <UrgencyIndicator
        type="live-viewers"
        baseCount={45}
        variance={8}
        updateInterval={4000}
        threshold={60}
      />
      <UrgencyIndicator
        type="limited-stock"
        baseCount={12}
        variance={2}
        updateInterval={8000}
        threshold={10}
      />
      <UrgencyIndicator
        type="recent-purchase"
        productName="CabScript"
      />
    </div>
  );
}
