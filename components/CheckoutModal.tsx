/**
 * Checkout Modal Component
 * Handles payment processing for selected pricing plan
 */

'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaCreditCard, FaLock } from 'react-icons/fa';
import { SiStripe, SiRazorpay } from 'react-icons/si';
import { loadStripe } from '@stripe/stripe-js';
import { trackCheckoutStart, trackPurchase } from '@/lib/analytics';
import GuaranteeBadge from './GuaranteeBadge';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: 'startup' | 'professional' | 'enterprise';
  planName: string;
  planPrice: number;
}

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

export default function CheckoutModal({
  isOpen,
  onClose,
  planId,
  planName,
  planPrice,
}: CheckoutModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'razorpay'>('stripe');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    country: '',
  });

  // Track checkout start
  useEffect(() => {
    if (isOpen) {
      trackCheckoutStart(planName, planPrice, 'USD');
    }
  }, [isOpen, planName, planPrice]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleStripeCheckout = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create payment intent
      const response = await fetch('/api/payment/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          customerInfo: formData,
          paymentMethod: 'stripe',
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Payment initialization failed');
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe not loaded');

      // For now, we'll show success. In production, redirect to Stripe Checkout
      alert('Stripe checkout would open here. Payment intent created: ' + data.paymentId);
      
      // Track conversion
      trackPurchase(data.paymentId, planName, planPrice, 'USD');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpayCheckout = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create Razorpay order
      const response = await fetch('/api/payment/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          customerInfo: formData,
          paymentMethod: 'razorpay',
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Order creation failed');
      }

      // Initialize Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: planPrice * 100, // Convert to paise
        currency: 'INR',
        name: 'CabScript.com',
        description: planName,
        order_id: data.orderId,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#FFD300',
        },
        handler: function (response: any) {
          // Payment successful
          alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
          trackPurchase(response.razorpay_payment_id, planName, planPrice, 'INR');
          onClose();
        },
      };

      // @ts-ignore - Razorpay is loaded via script
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.country) {
      setError('Please fill in all required fields');
      return;
    }

    if (paymentMethod === 'stripe') {
      await handleStripeCheckout();
    } else {
      await handleRazorpayCheckout();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Complete Purchase</h2>
            <p className="text-gray-600 mt-1">
              {planName} - ${planPrice.toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Customer Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD300]"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD300]"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD300]"
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD300]"
                  placeholder="United States"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name (Optional)
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD300]"
                  placeholder="Your Company Inc."
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Payment Method
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('stripe')}
                className={`p-4 border-2 rounded-lg flex items-center justify-center gap-3 transition-all ${
                  paymentMethod === 'stripe'
                    ? 'border-[#FFD300] bg-[#FFD300]/10'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <SiStripe size={32} className="text-[#635BFF]" />
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Stripe</div>
                  <div className="text-sm text-gray-600">Card Payment</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('razorpay')}
                className={`p-4 border-2 rounded-lg flex items-center justify-center gap-3 transition-all ${
                  paymentMethod === 'razorpay'
                    ? 'border-[#FFD300] bg-[#FFD300]/10'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <SiRazorpay size={32} className="text-[#0C2451]" />
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Razorpay</div>
                  <div className="text-sm text-gray-600">UPI, Cards & More</div>
                </div>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Security Notice */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-start gap-3">
            <FaLock className="text-green-600 mt-1 shrink-0" />
            <div className="text-sm text-gray-600">
              <strong className="text-gray-900">Secure Payment:</strong> All transactions
              are encrypted and secure. We never store your card information.
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                Processing...
              </>
            ) : (
              <>
                <FaCreditCard />
                Pay ${planPrice.toLocaleString()}
              </>
            )}
          </button>

          {/* Money-Back Guarantee */}
          <div className="mt-6">
            <GuaranteeBadge variant="minimal" />
          </div>

          <p className="text-center text-sm text-gray-500">
            By completing this purchase, you agree to our{' '}
            <a href="/terms" className="text-black underline hover:no-underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/refund" className="text-black underline hover:no-underline">
              Refund Policy
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
