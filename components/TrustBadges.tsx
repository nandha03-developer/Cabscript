/**
 * Trust Badges Component
 * Displays security badges, payment methods, and trust indicators
 */

'use client';

import Image from 'next/image';
import { FaLock, FaShieldAlt, FaCreditCard, FaAward } from 'react-icons/fa';

interface TrustBadgesProps {
  variant?: 'horizontal' | 'vertical' | 'compact';
  showPaymentMethods?: boolean;
  showSecurityBadges?: boolean;
  className?: string;
}

export default function TrustBadges({
  variant = 'horizontal',
  showPaymentMethods = true,
  showSecurityBadges = true,
  className = '',
}: TrustBadgesProps) {
  const containerClasses = {
    horizontal: 'flex flex-wrap items-center justify-center gap-6',
    vertical: 'flex flex-col items-center gap-4',
    compact: 'flex items-center gap-4',
  };

  return (
    <div className={`${containerClasses[variant]} ${className}`}>
      {/* Security Badges */}
      {showSecurityBadges && (
        <div className="flex items-center gap-4 flex-wrap justify-center">
          {/* SSL Secure */}
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
            <FaLock className="text-green-600 text-lg" />
            <div className="text-left">
              <p className="text-xs font-semibold text-green-800">SSL</p>
              <p className="text-xs text-green-600">Secure</p>
            </div>
          </div>

          {/* PCI Compliant */}
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
            <FaShieldAlt className="text-blue-600 text-lg" />
            <div className="text-left">
              <p className="text-xs font-semibold text-blue-800">PCI DSS</p>
              <p className="text-xs text-blue-600">Compliant</p>
            </div>
          </div>

          {/* Money Back Guarantee */}
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <FaAward className="text-yellow-600 text-lg" />
            <div className="text-left">
              <p className="text-xs font-semibold text-yellow-800">30-Day</p>
              <p className="text-xs text-yellow-600">Money Back</p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Methods */}
      {showPaymentMethods && (
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
            <FaCreditCard className="text-gray-600" />
            <span className="text-xs font-medium text-gray-700">Secure Payment</span>
          </div>

          {/* Payment Gateway Logos */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <Image
                src="/icons/stripe-logo.svg"
                alt="Stripe"
                width={50}
                height={20}
                className="object-contain grayscale hover:grayscale-0 transition-all"
                onError={(e) => {
                  // Fallback if image not found
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <Image
                src="/icons/razorpay-logo.svg"
                alt="Razorpay"
                width={60}
                height={20}
                className="object-contain grayscale hover:grayscale-0 transition-all"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* Credit Card Icons */}
          <div className="flex items-center gap-1">
            {['visa', 'mastercard', 'amex'].map((card) => (
              <div
                key={card}
                className="w-10 h-7 bg-gray-100 border border-gray-200 rounded flex items-center justify-center"
                title={card.toUpperCase()}
              >
                <span className="text-[8px] font-bold text-gray-500 uppercase">
                  {card === 'visa' ? 'VISA' : card === 'mastercard' ? 'MC' : 'AMEX'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
