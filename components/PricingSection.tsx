"use client";
import React, { useState } from "react";
import CheckoutModal from "./CheckoutModal";
import { trackButtonClick, trackPricingView } from "@/lib/analytics";

const PricingSection = () => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    id: 'startup' | 'professional' | 'enterprise';
    name: string;
    price: number;
  } | null>(null);
  
  const handleBuyClick = (
    planId: 'startup' | 'professional' | 'enterprise',
    planName: string,
    price: number
  ) => {
    trackButtonClick(`Buy Now - ${planName}`, 'Pricing Section');
    trackPricingView(planName, price);
    setSelectedPlan({ id: planId, name: planName, price });
    setIsCheckoutOpen(true);
  };

  const pricingPlans = [
    {
      id: 'startup' as const,
      price: 2999,
      priceDisplay: "$2,999",
      title: "Startup License",
      bgColor: "bg-gray-800",
      buttonColor: "bg-gray-800 hover:bg-gray-700",
      features: [
        "Source Code (Web + Apps)",
        "Admin Panel",
        "Installation Support",
        "30 Days Technical Support"
      ]
    },
    {
      id: 'professional' as const,
      price: 4999,
      priceDisplay: "$4,999",
      title: "Professional License",
      bgColor: "bg-yellow-400",
      buttonColor: "bg-yellow-400 hover:bg-yellow-500",
      isPopular: true,
      features: [
        "Everything in Startup",
        "Rebranding + Play Store Upload",
        "White Label Branding",
        "90 Days Support"
      ]
    },
    {
      id: 'enterprise' as const,
      price: 9999,
      priceDisplay: "$9,999",
      title: "Enterprise License",
      bgColor: "bg-gray-800",
      buttonColor: "bg-gray-800 hover:bg-gray-700",
      features: [
        "Everything in Professional",
        "Lifetime Updates",
        "Dedicated Server Setup",
        "Priority Support"
      ]
    }
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-0.5 bg-yellow-400"></div>
            <span className="text-yellow-500 font-medium text-lg">
              Uber Clone App Price
            </span>
            <div className="w-10 h-0.5 bg-yellow-400"></div>
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            How Much Does
          </h2>
          <h2 className="text-5xl font-bold mb-8 text-gray-900">
            The <span className="text-yellow-400">Uber Clone App Cost?</span>
          </h2>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-xl overflow-hidden relative min-h-[500px] flex flex-col"
            >
              {/* Price Header */}
              <div className="text-center">
                <div className="py-6 px-6">
                  <div className="text-4xl font-extrabold text-gray-900 ">
                    {plan.priceDisplay}
                  </div>
                </div>
                <div
                  className={`${plan.bgColor} text-white py-4 px-6 font-semibold text-lg w-full`}
                >
                  {plan.title}
                </div>
              </div>

              {/* Features List */}
              <div className="px-6 pb-6 grow flex items-center justify-center">
                <ul className="space-y-4 w-full">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shrink-0">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-600 font-medium">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Buy Now Button */}
              <div className="px-6 pb-6 mt-auto flex justify-center">
                <button
                  onClick={() => handleBuyClick(plan.id, plan.title, plan.price)}
                  className={`${plan.buttonColor} text-white py-3 px-8 rounded-lg font-semibold text-lg transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer`}
                >
                  Buy Now
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-600 mb-4">
          💯 30-Day Money-Back Guarantee • 🔒 Secure Payment • ✅ Instant Access
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <span>🏆 5,000+ Satisfied Customers</span>
          <span>•</span>
          <span>⭐ 4.8/5 Average Rating</span>
          <span>•</span>
          <span>🌍 Used in 85+ Countries</span>
        </div>
      </div>

      {/* Checkout Modal */}
      {selectedPlan && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => {
            setIsCheckoutOpen(false);
            setSelectedPlan(null);
          }}
          planId={selectedPlan.id}
          planName={selectedPlan.name}
          planPrice={selectedPlan.price}
        />
      )}
    </section>
  );
};

export default PricingSection;