/**
 * Money-Back Guarantee Badge Component
 * Prominent display of refund policy to build trust
 */

import { FaCheckCircle, FaShieldAlt, FaUndo } from 'react-icons/fa';

interface GuaranteeBadgeProps {
  variant?: 'default' | 'highlight' | 'minimal';
  days?: number;
}

export default function GuaranteeBadge({ 
  variant = 'default',
  days = 30 
}: GuaranteeBadgeProps) {
  
  if (variant === 'minimal') {
    return (
      <div className="inline-flex items-center gap-2 text-green-600 text-sm font-medium">
        <FaCheckCircle />
        <span>{days}-Day Money-Back Guarantee</span>
      </div>
    );
  }

  if (variant === 'highlight') {
    return (
      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-3">
          <FaUndo className="text-2xl text-white" />
        </div>
        <h3 className="text-2xl font-bold text-green-800 mb-2">
          {days}-Day Money-Back Guarantee
        </h3>
        <p className="text-gray-700 leading-relaxed">
          Try CabScript risk-free. If you're not completely satisfied, 
          we'll refund your purchase within {days} days—no questions asked.
        </p>
      </div>
    );
  }

  // Default variant
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <div className="shrink-0">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <FaShieldAlt className="text-xl text-green-600" />
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg text-gray-900 mb-2">
            {days}-Day Money-Back Guarantee
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            We stand behind our product. If CabScript doesn't meet your expectations, 
            get a full refund within {days} days of purchase.
          </p>
          <ul className="mt-3 space-y-1">
            <li className="flex items-center gap-2 text-sm text-gray-700">
              <FaCheckCircle className="text-green-500 shrink-0" />
              <span>100% Risk-Free Purchase</span>
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-700">
              <FaCheckCircle className="text-green-500 shrink-0" />
              <span>No Questions Asked Policy</span>
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-700">
              <FaCheckCircle className="text-green-500 shrink-0" />
              <span>Full Refund Guaranteed</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
