"use client";

import { useState, useEffect } from 'react';
import { FaClock } from 'react-icons/fa';

interface CountdownTimerProps {
  endDate?: Date;
  daysFromNow?: number;
  hoursFromNow?: number;
  title?: string;
  subtitle?: string;
  urgentThreshold?: number; // Minutes remaining to show urgent state
  onExpire?: () => void;
  variant?: 'default' | 'compact' | 'banner';
  showIcon?: boolean;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export default function CountdownTimer({
  endDate,
  daysFromNow = 3,
  hoursFromNow,
  title = "Limited Time Offer Ends In:",
  subtitle,
  urgentThreshold = 60, // 1 hour
  onExpire,
  variant = 'default',
  showIcon = true,
}: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
  const [isUrgent, setIsUrgent] = useState(false);
  const [hasExpired, setHasExpired] = useState(false);

  // Calculate target end date
  const getEndDate = (): Date => {
    if (endDate) return endDate;
    
    const now = new Date();
    if (hoursFromNow) {
      return new Date(now.getTime() + hoursFromNow * 60 * 60 * 1000);
    }
    return new Date(now.getTime() + daysFromNow * 24 * 60 * 60 * 1000);
  };

  const calculateTimeRemaining = (targetDate: Date): TimeRemaining => {
    const total = targetDate.getTime() - Date.now();
    
    if (total <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return { days, hours, minutes, seconds, total };
  };

  useEffect(() => {
    const targetDate = getEndDate();
    
    const updateTimer = () => {
      const remaining = calculateTimeRemaining(targetDate);
      setTimeRemaining(remaining);

      // Check if urgent (less than threshold minutes)
      const totalMinutes = Math.floor(remaining.total / (1000 * 60));
      setIsUrgent(totalMinutes > 0 && totalMinutes <= urgentThreshold);

      // Check if expired
      if (remaining.total <= 0 && !hasExpired) {
        setHasExpired(true);
        if (onExpire) onExpire();
        
        // Track expiration
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'countdown_expired', {
            event_category: 'conversion',
            event_label: 'Countdown Timer Expired',
          });
        }
      }
    };

    // Initial calculation
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endDate, daysFromNow, hoursFromNow, urgentThreshold, hasExpired, onExpire]);

  if (hasExpired) {
    return (
      <div className="text-center py-4">
        <p className="text-red-600 font-bold text-lg">
          ⏰ This offer has expired!
        </p>
      </div>
    );
  }

  if (!timeRemaining) {
    return <div className="animate-pulse bg-gray-200 h-20 rounded-lg" />;
  }

  const TimeUnit = ({ value, label }: { value: number; label: string }) => {
    const urgentClass = isUrgent
      ? 'bg-red-500 text-white animate-pulse-slow'
      : 'bg-gray-900 text-[#FFD300]';

    if (variant === 'compact') {
      return (
        <div className={`${urgentClass} rounded-lg px-3 py-2 min-w-16 text-center transition-colors`}>
          <div className="text-2xl font-bold tabular-nums">{String(value).padStart(2, '0')}</div>
          <div className="text-xs opacity-80 uppercase tracking-wide">{label}</div>
        </div>
      );
    }

    return (
      <div className={`${urgentClass} rounded-xl p-4 min-w-24 text-center shadow-lg transition-colors`}>
        <div className="text-4xl font-bold tabular-nums mb-1">
          {String(value).padStart(2, '0')}
        </div>
        <div className="text-sm opacity-90 uppercase tracking-wider">{label}</div>
      </div>
    );
  };

  const Separator = () => (
    <div className="text-3xl font-bold text-gray-400 px-2 self-center">:</div>
  );

  if (variant === 'banner') {
    return (
      <div
        className={`w-full py-3 px-4 text-center ${
          isUrgent
            ? 'bg-red-600 animate-pulse-slow'
            : 'bg-linear-to-r from-gray-900 to-gray-800'
        } transition-colors`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 flex-wrap">
          {showIcon && <FaClock className="text-[#FFD300] text-2xl" />}
          <span className="text-white font-bold text-lg">
            {title}
          </span>
          <div className="flex items-center gap-2">
            <TimeUnit value={timeRemaining.days} label="Days" />
            <Separator />
            <TimeUnit value={timeRemaining.hours} label="Hours" />
            <Separator />
            <TimeUnit value={timeRemaining.minutes} label="Mins" />
            <Separator />
            <TimeUnit value={timeRemaining.seconds} label="Secs" />
          </div>
          {isUrgent && (
            <span className="text-white font-bold text-sm bg-red-700 px-3 py-1 rounded-full">
              ⚡ HURRY!
            </span>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="inline-flex flex-col items-center gap-3">
        {title && (
          <div className="flex items-center gap-2">
            {showIcon && <FaClock className="text-[#FFD300]" />}
            <p className="text-sm font-semibold text-gray-700">{title}</p>
          </div>
        )}
        <div className="flex items-center gap-2">
          <TimeUnit value={timeRemaining.days} label="D" />
          <Separator />
          <TimeUnit value={timeRemaining.hours} label="H" />
          <Separator />
          <TimeUnit value={timeRemaining.minutes} label="M" />
          <Separator />
          <TimeUnit value={timeRemaining.seconds} label="S" />
        </div>
        {subtitle && (
          <p className="text-xs text-gray-500">{subtitle}</p>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-2xl shadow-xl">
      {showIcon && (
        <div className="w-16 h-16 bg-[#FFD300] rounded-full flex items-center justify-center">
          <FaClock className="text-gray-900 text-2xl" />
        </div>
      )}
      
      {title && (
        <h3 className="text-xl font-bold text-gray-900 text-center">
          {title}
        </h3>
      )}

      <div className="flex items-center gap-3">
        <TimeUnit value={timeRemaining.days} label="Days" />
        <Separator />
        <TimeUnit value={timeRemaining.hours} label="Hours" />
        <Separator />
        <TimeUnit value={timeRemaining.minutes} label="Minutes" />
        <Separator />
        <TimeUnit value={timeRemaining.seconds} label="Seconds" />
      </div>

      {subtitle && (
        <p className="text-sm text-gray-600 text-center max-w-md">
          {subtitle}
        </p>
      )}

      {isUrgent && (
        <div className="bg-red-50 border-2 border-red-500 rounded-lg px-4 py-2 animate-pulse-slow">
          <p className="text-red-700 font-bold text-sm">
            ⚡ Less than {urgentThreshold} minutes remaining!
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
