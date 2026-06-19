"use client";

import { useState } from 'react';
import { FaEnvelope, FaSpinner, FaCheck } from 'react-icons/fa';

interface NewsletterSubscriptionProps {
  placeholder?: string;
  buttonText?: string;
  className?: string;
  showName?: boolean;
}

export default function NewsletterSubscription({
  placeholder = "Enter your email address",
  buttonText = "Subscribe",
  className = "",
  showName = false,
}: NewsletterSubscriptionProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          name: showName && name.trim() ? name.trim() : undefined,
          source: 'website',
          interests: ['updates', 'announcements'],
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setEmail('');
        setName('');
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      } else {
        setError(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={`flex items-center justify-center p-4 bg-green-500 bg-opacity-10 border border-green-500 rounded-lg ${className}`}>
        <FaCheck className="w-5 h-5 text-green-500 mr-2" />
        <span className="text-green-500 font-medium">
          Successfully subscribed to our newsletter!
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 ${className}`}>
      {showName && (
        <div>
          <input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#FFD300] focus:border-transparent transition-all"
          />
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="email"
            placeholder={placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#FFD300] focus:border-transparent transition-all"
            disabled={loading}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="px-6 py-3 bg-[#FFD300] text-black font-semibold rounded-lg hover:bg-[#E6BE00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[120px]"
        >
          {loading ? (
            <FaSpinner className="w-4 h-4 animate-spin" />
          ) : (
            buttonText
          )}
        </button>
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-3">
          {error}
        </div>
      )}

      <p className="text-xs text-gray-500">
        By subscribing, you agree to receive updates about CabScript products and services. 
        You can unsubscribe at any time.
      </p>
    </form>
  );
}