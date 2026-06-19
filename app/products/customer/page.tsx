"use client";

export const dynamic = 'force-dynamic';
import React, { useState } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Link from "next/link";
import DemoRequestModal from "@/components/DemoRequestModal";

export default function CustomerAppPage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  return (
    <div className="min-h-screen relative">
      {/* Fixed Background Image */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/Contain/slider-bg-1-2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <Navigation />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-20 flex items-center justify-center">
            <div className="text-center max-w-4xl mx-auto px-4">
              <div className="bg-black/30 backdrop-blur-md rounded-2xl px-8 py-8 inline-block">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                <span className="text-white">CUSTOMER APP</span>
              </h1>
              <p className="text-lg text-gray-200 max-w-2xl mx-auto">
                  Seamless Ride Booking Experience for Your Passengers
                </p>
              </div>
            </div>
          </section>

          {/* Overview */}
          <section className="bg-white py-16 px-4">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                User-Friendly Customer App
              </h2>
              <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                Give your customers an intuitive mobile app that makes booking rides as easy as a few taps. 
                Available for both iOS and Android platforms with a beautiful, modern interface.
              </p>
            </div>
          </section>

          {/* Key Features */}
          <section className="bg-gray-50 py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
                App Features
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all">
                  <div className="w-16 h-16 bg-[#FFD300] rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Easy Booking</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Book rides instantly with just a few taps. Enter pickup and drop-off locations, 
                    select vehicle type, and confirm booking in seconds.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all">
                  <div className="w-16 h-16 bg-[#FFD300] rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Live Tracking</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Track your driver's location in real-time on the map. Know exactly when your ride 
                    will arrive with accurate ETAs and live updates.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all">
                  <div className="w-16 h-16 bg-[#FFD300] rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Multiple Payments</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Pay with credit/debit cards, digital wallets, or cash. Save payment methods for 
                    quick checkout on future rides.
                  </p>
                </div>

                {/* Feature 4 */}
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all">
                  <div className="w-16 h-16 bg-[#FFD300] rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Ride Scheduling</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Schedule rides in advance for important appointments. Set pickup time and get 
                    reminders before your scheduled ride.
                  </p>
                </div>

                {/* Feature 5 */}
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all">
                  <div className="w-16 h-16 bg-[#FFD300] rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Rate & Review</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Rate your driver and provide feedback after each trip. Help maintain service 
                    quality and share your experience.
                  </p>
                </div>

                {/* Feature 6 */}
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all">
                  <div className="w-16 h-16 bg-[#FFD300] rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Referral Rewards</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Refer friends and earn rewards. Share your unique referral code and get discounts 
                    on future rides when they sign up.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Advanced Features */}
          <section className="bg-white py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
                Powerful Features for Better Experience
              </h2>

              <div className="space-y-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Booking System</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Autocomplete address suggestions powered by Google Maps</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Save favorite locations (Home, Work, etc.) for quick booking</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Real-time fare estimation before booking</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Multiple vehicle types to choose from</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Add multiple stops along your route</span>
                      </li>
                    </ul>
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-xl p-8 flex items-center justify-center min-h-[300px]">
                    <div className="text-center text-gray-500">
                      <svg className="w-32 h-32 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <p className="text-lg font-semibold">Booking Interface</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row-reverse items-center gap-8">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Safety Features</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Share ride details with friends and family in real-time</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Emergency SOS button with instant alerts</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">View driver details, photo, and ratings before ride</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">In-app emergency contact numbers</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Ride recording and incident reporting</span>
                      </li>
                    </ul>
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-xl p-8 flex items-center justify-center min-h-[300px]">
                    <div className="text-center text-gray-500">
                      <svg className="w-32 h-32 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <p className="text-lg font-semibold">Safety Features</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Wallet & Payments</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">In-app wallet for cashless transactions</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Apply promo codes and discounts automatically</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Digital receipts sent via email</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Transaction history and ride receipts</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Multiple currency support</span>
                      </li>
                    </ul>
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-xl p-8 flex items-center justify-center min-h-[300px]">
                    <div className="text-center text-gray-500">
                      <svg className="w-32 h-32 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p className="text-lg font-semibold">Wallet Interface</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Technical Details */}
          <section className="bg-gray-50 py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white shadow-2xl rounded-lg p-8 md:p-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                  Technical Specifications
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Platform Support</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Native iOS app (iPhone & iPad)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Native Android app (all devices)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Support for iOS 13+ and Android 6+</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Optimized for all screen sizes</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">App Performance</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Lightweight app size (&lt; 30MB)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Fast loading and smooth animations</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Offline mode for viewing ride history</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Low battery consumption</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Languages</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Multi-language support</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">RTL (Right-to-Left) language support</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Easy language switching</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Localized content and notifications</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Customization</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">White-label solution</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Custom branding and colors</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Your logo and app name</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Publish under your own account</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-linear-to-r from-gray-900 to-black py-16 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-white mb-6">
                Give Your Customers the Best Booking Experience
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Launch your taxi business with a professional customer app
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/pricing"
                  className="bg-[#FFD300] hover:bg-yellow-500 text-gray-900 font-bold px-8 py-4 rounded-lg transition-all shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2"
                >
                  View Pricing Plans
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <button
                  onClick={() => setIsDemoModalOpen(true)}
                  className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-bold px-8 py-4 rounded-lg transition-all inline-flex items-center justify-center gap-2"
                >
                  Request Demo
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>

      {/* Demo Request Modal */}
      <DemoRequestModal 
        isOpen={isDemoModalOpen} 
        onClose={() => setIsDemoModalOpen(false)} 
      />
    </div>
  );
}
