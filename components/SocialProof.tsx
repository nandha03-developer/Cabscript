/**
 * Social Proof Component
 * Displays customer count, satisfaction rate, and live activity indicators
 */

'use client';

import { useEffect, useState } from 'react';
import { FaUsers, FaStar, FaDownload, FaGlobe } from 'react-icons/fa';

interface SocialProofProps {
  variant?: 'stats' | 'banner' | 'compact';
  animated?: boolean;
}

export default function SocialProof({ 
  variant = 'stats',
  animated = true 
}: SocialProofProps) {
  const [counts, setCounts] = useState({
    customers: 0,
    downloads: 0,
    countries: 0,
    rating: 0,
  });

  // Animate numbers on mount
  useEffect(() => {
    if (!animated) {
      setCounts({
        customers: 5000,
        downloads: 12000,
        countries: 85,
        rating: 4.8,
      });
      return;
    }

    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    const targets = {
      customers: 5000,
      downloads: 12000,
      countries: 85,
      rating: 4.8,
    };

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounts({
        customers: Math.floor(targets.customers * progress),
        downloads: Math.floor(targets.downloads * progress),
        countries: Math.floor(targets.countries * progress),
        rating: parseFloat((targets.rating * progress).toFixed(1)),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounts(targets);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [animated]);

  if (variant === 'banner') {
    return (
      <div className="bg-linear-to-r from-[#FFD300] to-yellow-400 text-black py-3 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-8 text-sm font-medium">
            <span className="flex items-center gap-2">
              <FaUsers className="text-lg" />
              <strong>{counts.customers.toLocaleString()}+</strong> Happy Customers
            </span>
            <span className="hidden md:inline">•</span>
            <span className="flex items-center gap-2">
              <FaStar className="text-lg" />
              <strong>{counts.rating}</strong> Rating
            </span>
            <span className="hidden md:inline">•</span>
            <span className="flex items-center gap-2">
              <FaGlobe className="text-lg" />
              Used in <strong>{counts.countries}+</strong> Countries
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-6 flex-wrap justify-center text-sm text-gray-600">
        <span className="flex items-center gap-2">
          <FaUsers className="text-[#FFD300]" />
          <strong className="text-gray-900">{counts.customers.toLocaleString()}+</strong> Customers
        </span>
        <span className="flex items-center gap-2">
          <FaStar className="text-yellow-500" />
          <strong className="text-gray-900">{counts.rating}/5</strong> Rating
        </span>
      </div>
    );
  }

  // Default: stats variant
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {/* Happy Customers */}
      <div className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-3">
          <FaUsers className="text-2xl text-blue-600" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-1">
          {counts.customers.toLocaleString()}+
        </h3>
        <p className="text-sm text-gray-600">Happy Customers</p>
      </div>

      {/* Total Downloads */}
      <div className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-3">
          <FaDownload className="text-2xl text-green-600" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-1">
          {counts.downloads.toLocaleString()}+
        </h3>
        <p className="text-sm text-gray-600">Total Downloads</p>
      </div>

      {/* Countries */}
      <div className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-100 rounded-full mb-3">
          <FaGlobe className="text-2xl text-purple-600" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-1">
          {counts.countries}+
        </h3>
        <p className="text-sm text-gray-600">Countries</p>
      </div>

      {/* Rating */}
      <div className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-yellow-100 rounded-full mb-3">
          <FaStar className="text-2xl text-yellow-500" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-1">
          {counts.rating}/5
        </h3>
        <p className="text-sm text-gray-600">Average Rating</p>
        <div className="flex justify-center gap-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={`text-sm ${
                i < Math.floor(counts.rating) ? 'text-yellow-500' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
