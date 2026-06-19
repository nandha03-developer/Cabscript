"use client";

export const dynamic = 'force-dynamic';
import React, { useState } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Link from "next/link";
import DemoRequestModal from "@/components/DemoRequestModal";

export default function DriverAppPage() {
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
                <span className="text-white">DRIVER APP</span>
              </h1>
              <p className="text-lg text-gray-200 max-w-2xl mx-auto">
                  Empower Your Drivers with Professional Tools
                </p>
              </div>
            </div>
          </section>

          {/* Overview */}
          <section className="bg-white py-16 px-4">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Professional Driver App
              </h2>
              <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                Give your drivers everything they need to manage rides efficiently. Accept bookings, 
                navigate to passengers, and track earnings - all in one powerful app.
              </p>
            </div>
          </section>

          {/* Key Features */}
          <section className="bg-gray-50 py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
                Driver App Features
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all">
                  <div className="w-16 h-16 bg-[#FFD300] rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Instant Ride Alerts</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Receive ride requests instantly with sound and vibration alerts. Accept or decline 
                    rides with a single tap.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all">
                  <div className="w-16 h-16 bg-[#FFD300] rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">GPS Navigation</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Integrated turn-by-turn navigation to reach passengers and destinations. Supports 
                    Google Maps and other navigation apps.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all">
                  <div className="w-16 h-16 bg-[#FFD300] rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Earnings Tracker</h3>
                  <p className="text-gray-600 leading-relaxed">
                    View real-time earnings, trip history, and detailed financial reports. Track daily, 
                    weekly, and monthly income.
                  </p>
                </div>

                {/* Feature 4 */}
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all">
                  <div className="w-16 h-16 bg-[#FFD300] rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Online/Offline Mode</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Toggle between online and offline status easily. Control when you want to receive 
                    ride requests.
                  </p>
                </div>

                {/* Feature 5 */}
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all">
                  <div className="w-16 h-16 bg-[#FFD300] rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">In-App Chat</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Communicate with passengers via in-app messaging. Call passengers directly with 
                    masked phone numbers for privacy.
                  </p>
                </div>

                {/* Feature 6 */}
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all">
                  <div className="w-16 h-16 bg-[#FFD300] rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Document Management</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Upload and manage driver documents, vehicle papers, and insurance. Get renewal 
                    reminders before expiry.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Advanced Features */}
          <section className="bg-white py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
                More Powerful Features
              </h2>

              <div className="space-y-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Ride Management</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">See passenger details and ratings before accepting</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">View estimated fare and distance information</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Accept multiple bookings in queue</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Heat map showing high-demand areas</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Trip cancellation with reason selection</span>
                      </li>
                    </ul>
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-xl p-8 flex items-center justify-center min-h-[300px]">
                    <div className="text-center text-gray-500">
                      <svg className="w-32 h-32 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <p className="text-lg font-semibold">Driver App Interface</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row-reverse items-center gap-8">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Earnings & Payouts</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Real-time earnings dashboard</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Detailed trip-wise earning breakdown</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Automatic commission calculation</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Weekly/monthly payout summaries</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Digital payment collection from passengers</span>
                      </li>
                    </ul>
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-xl p-8 flex items-center justify-center min-h-[300px]">
                    <div className="text-center text-gray-500">
                      <svg className="w-32 h-32 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p className="text-lg font-semibold">Earnings Dashboard</p>
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
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Platforms</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">iOS app for iPhone</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Android app for all devices</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Works on tablets</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Background location tracking</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Performance</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Low battery consumption</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Works in low network areas</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Offline trip data storage</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Fast app loading time</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Safety</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">SOS emergency button</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Share trip details with family</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Panic alert to admin</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Report unsafe passengers</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Support</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">In-app support chat</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Help center and FAQs</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Regular app updates</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Training resources</span>
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
                Empower Your Drivers Today
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Give them the tools they need to succeed
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
