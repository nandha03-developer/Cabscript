"use client";

import { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimes, FaStar, FaShoppingCart, FaRocket } from 'react-icons/fa';

interface PurchaseNotification {
  id: string;
  customerName: string;
  location: string;
  product: string;
  plan: 'Startup' | 'Professional' | 'Enterprise';
  minutesAgo: number;
  avatar?: string;
}

interface SocialProofNotificationProps {
  enabled?: boolean;
  showInterval?: number; // milliseconds between notifications
  displayDuration?: number; // milliseconds to show each notification
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  maxNotifications?: number; // Max simultaneous notifications
}

const SAMPLE_PURCHASES: Omit<PurchaseNotification, 'id'>[] = [
  {
    customerName: 'John M.',
    location: 'New York, USA',
    product: 'CabScript Enterprise',
    plan: 'Enterprise',
    minutesAgo: 5,
  },
  {
    customerName: 'Sarah K.',
    location: 'London, UK',
    product: 'CabScript Professional',
    plan: 'Professional',
    minutesAgo: 12,
  },
  {
    customerName: 'Raj P.',
    location: 'Mumbai, India',
    product: 'CabScript Startup',
    plan: 'Startup',
    minutesAgo: 8,
  },
  {
    customerName: 'Mohammed A.',
    location: 'Dubai, UAE',
    product: 'CabScript Enterprise',
    plan: 'Enterprise',
    minutesAgo: 3,
  },
  {
    customerName: 'Emily W.',
    location: 'Sydney, Australia',
    product: 'CabScript Professional',
    plan: 'Professional',
    minutesAgo: 15,
  },
  {
    customerName: 'Carlos R.',
    location: 'São Paulo, Brazil',
    product: 'CabScript Startup',
    plan: 'Startup',
    minutesAgo: 20,
  },
  {
    customerName: 'Lisa T.',
    location: 'Toronto, Canada',
    product: 'CabScript Enterprise',
    plan: 'Enterprise',
    minutesAgo: 7,
  },
  {
    customerName: 'Wei L.',
    location: 'Singapore',
    product: 'CabScript Professional',
    plan: 'Professional',
    minutesAgo: 10,
  },
  {
    customerName: 'Hans M.',
    location: 'Berlin, Germany',
    product: 'CabScript Enterprise',
    plan: 'Enterprise',
    minutesAgo: 4,
  },
  {
    customerName: 'Yuki S.',
    location: 'Tokyo, Japan',
    product: 'CabScript Professional',
    plan: 'Professional',
    minutesAgo: 18,
  },
];

const PLAN_COLORS = {
  Startup: 'bg-blue-500',
  Professional: 'bg-purple-500',
  Enterprise: 'bg-gradient-to-r from-amber-400 to-orange-500',
};

const PLAN_ICONS = {
  Startup: FaRocket,
  Professional: FaStar,
  Enterprise: FaCheckCircle,
};

export default function SocialProofNotification({
  enabled = true,
  showInterval = 15000, // Show every 15 seconds
  displayDuration = 6000, // Display for 6 seconds
  position = 'bottom-left',
  maxNotifications = 1,
}: SocialProofNotificationProps) {
  const [notifications, setNotifications] = useState<PurchaseNotification[]>([]);
  const [shownIndices, setShownIndices] = useState<Set<number>>(new Set());

  // Generate notifications at intervals
  useEffect(() => {
    if (!enabled) return;

    const showNotification = () => {
      // Don't show if max reached
      if (notifications.length >= maxNotifications) return;

      // Find unshown purchase or reset if all shown
      let availableIndices = Array.from(
        { length: SAMPLE_PURCHASES.length },
        (_, i) => i
      ).filter(i => !shownIndices.has(i));

      if (availableIndices.length === 0) {
        // Reset shown indices
        setShownIndices(new Set());
        availableIndices = Array.from(
          { length: SAMPLE_PURCHASES.length },
          (_, i) => i
        );
      }

      // Pick random available purchase
      const randomIndex =
        availableIndices[Math.floor(Math.random() * availableIndices.length)];
      const purchase = SAMPLE_PURCHASES[randomIndex];

      const notification: PurchaseNotification = {
        ...purchase,
        id: `${Date.now()}-${randomIndex}`,
        minutesAgo: Math.floor(Math.random() * 25) + 1, // 1-25 minutes
      };

      setNotifications(prev => [...prev, notification]);
      setShownIndices(prev => new Set([...prev, randomIndex]));

      // Track analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'social_proof_shown', {
          event_category: 'engagement',
          event_label: purchase.plan,
        });
      }

      // Remove after display duration
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, displayDuration);
    };

    // Show first notification after 3 seconds
    const initialTimer = setTimeout(showNotification, 3000);

    // Then show at regular intervals
    const interval = setInterval(showNotification, showInterval);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [enabled, showInterval, displayDuration, maxNotifications, notifications.length, shownIndices]);

  const handleDismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));

    // Track dismissal
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'social_proof_dismissed', {
        event_category: 'engagement',
      });
    }
  };

  if (!enabled || notifications.length === 0) return null;

  // Position classes
  const positionClasses = {
    'bottom-left': 'bottom-6 left-6',
    'bottom-right': 'bottom-6 right-6',
    'top-left': 'top-6 left-6',
    'top-right': 'top-6 right-6',
  };

  // Animation classes
  const animationClasses = {
    'bottom-left': 'animate-slide-in-left',
    'bottom-right': 'animate-slide-in-right',
    'top-left': 'animate-slide-in-left',
    'top-right': 'animate-slide-in-right',
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 flex flex-col gap-3 max-w-md`}>
      {notifications.map((notification, index) => {
        const PlanIcon = PLAN_ICONS[notification.plan];
        const planColor = PLAN_COLORS[notification.plan];

        return (
          <div
            key={notification.id}
            className={`${animationClasses[position]} bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden hover:shadow-3xl transition-shadow`}
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            {/* Color bar */}
            <div className={`h-1 ${planColor}`} />

            {/* Content */}
            <div className="p-4 flex items-start gap-3">
              {/* Icon */}
              <div className={`${planColor} rounded-full p-2.5 shrink-0 text-white`}>
                <FaShoppingCart className="w-4 h-4" />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-bold text-gray-900 text-sm">
                    🎉 New Purchase!
                  </p>
                  <button
                    onClick={() => handleDismiss(notification.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                    aria-label="Dismiss notification"
                  >
                    <FaTimes className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-gray-700 text-sm font-medium mb-1">
                  {notification.customerName} from {notification.location}
                </p>

                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-full">
                    <PlanIcon className="w-3 h-3 text-gray-600" />
                    <span className="text-xs font-semibold text-gray-700">
                      {notification.plan}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {notification.minutesAgo}m ago
                  </span>
                </div>
              </div>
            </div>

            {/* Verification badge */}
            <div className="px-4 pb-3 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-green-600">
                <FaCheckCircle className="w-3 h-3" />
                <span className="font-medium">Verified Purchase</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Alternative: Simple count-based social proof
export function LiveActivityBadge() {
  const [viewers, setViewers] = useState(42);
  const [purchases, setPurchases] = useState(8);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate live changes
      setViewers(prev => Math.max(30, Math.min(80, prev + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3))));
      setPurchases(prev => Math.max(5, Math.min(15, prev + (Math.random() > 0.7 ? 1 : Math.random() > 0.3 ? 0 : -1))));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-4 px-4 py-2 bg-linear-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-full">
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping" />
        </div>
        <span className="text-sm font-semibold text-gray-700">
          <strong className="text-blue-600 tabular-nums">{viewers}</strong> viewing
        </span>
      </div>
      <div className="w-px h-4 bg-gray-300" />
      <div className="flex items-center gap-2">
        <FaShoppingCart className="text-purple-600 w-3.5 h-3.5" />
        <span className="text-sm font-semibold text-gray-700">
          <strong className="text-purple-600 tabular-nums">{purchases}</strong> sold today
        </span>
      </div>
    </div>
  );
}
