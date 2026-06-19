/**
 * Live Activity Notification Component
 * Shows recent customer activity to create urgency and social proof
 */

'use client';

import { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';

interface Activity {
  id: number;
  name: string;
  location: string;
  plan: string;
  timeAgo: string;
}

// Sample activities (in production, fetch from API)
const sampleActivities: Activity[] = [
  { id: 1, name: 'John D.', location: 'New York, USA', plan: 'Professional', timeAgo: '5 minutes ago' },
  { id: 2, name: 'Sarah M.', location: 'London, UK', plan: 'Enterprise', timeAgo: '12 minutes ago' },
  { id: 3, name: 'Raj P.', location: 'Mumbai, India', plan: 'Startup', timeAgo: '18 minutes ago' },
  { id: 4, name: 'Michael C.', location: 'Toronto, Canada', plan: 'Professional', timeAgo: '25 minutes ago' },
  { id: 5, name: 'Emma L.', location: 'Sydney, Australia', plan: 'Enterprise', timeAgo: '32 minutes ago' },
  { id: 6, name: 'Ahmed K.', location: 'Dubai, UAE', plan: 'Professional', timeAgo: '40 minutes ago' },
];

export default function LiveActivity() {
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activityIndex, setActivityIndex] = useState(0);

  useEffect(() => {
    const showActivity = () => {
      setCurrentActivity(sampleActivities[activityIndex]);
      setIsVisible(true);

      // Hide after 8 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 8000);

      // Move to next activity
      setActivityIndex((prev) => (prev + 1) % sampleActivities.length);
    };

    // Show first activity after 5 seconds
    const initialTimer = setTimeout(showActivity, 5000);

    // Then show every 15 seconds
    const interval = setInterval(() => {
      if (!isVisible) {
        showActivity();
      }
    }, 15000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [activityIndex, isVisible]);

  if (!isVisible || !currentActivity) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 animate-slide-in-left">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 max-w-sm">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="shrink-0">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <FaCheckCircle className="text-green-600 text-lg" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 mb-1">
              Recent Purchase
            </p>
            <p className="text-xs text-gray-600 mb-1">
              <strong>{currentActivity.name}</strong> from {currentActivity.location}
            </p>
            <p className="text-xs text-gray-500">
              Purchased <span className="font-medium text-[#FFD300]">{currentActivity.plan}</span> plan
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {currentActivity.timeAgo}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close notification"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>

        {/* Verification badge */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <FaCheckCircle className="text-green-500" />
            Verified purchase
          </p>
        </div>
      </div>
    </div>
  );
}
