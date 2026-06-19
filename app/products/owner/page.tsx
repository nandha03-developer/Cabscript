"use client";

export const dynamic = 'force-dynamic';
import React, { useState } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Link from "next/link";
import DemoRequestModal from "@/components/DemoRequestModal";

export default function OwnerAppPage() {
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
                <span className="text-white">OWNER APP</span>
              </h1>
              <p className="text-lg text-gray-200 max-w-2xl mx-auto">
                  Manage Your Fleet & Monitor Business Performance
                </p>
              </div>
            </div>
          </section>

          {/* Overview */}
          <section className="bg-white py-16 px-4">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Fleet Owner Management System
              </h2>
              <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                Comprehensive dashboard for fleet owners to manage multiple vehicles, monitor driver 
                performance, track earnings, and grow their taxi business efficiently.
              </p>
            </div>
          </section>

          {/* Key Features */}
          <section className="bg-gray-50 py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
                Owner Dashboard Features
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all">
                  <div className="w-16 h-16 bg-[#FFD300] rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Fleet Management</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Manage multiple vehicles and drivers from a single dashboard. Add, edit, or remove 
                    vehicles. Assign drivers to specific vehicles.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all">
                  <div className="w-16 h-16 bg-[#FFD300] rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Revenue Analytics</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Track total earnings, commissions, and profit margins. View detailed financial reports 
                    with charts and graphs.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all">
                  <div className="w-16 h-16 bg-[#FFD300] rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Driver Performance</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Monitor each driver's performance, ratings, completed trips, and earnings. Identify 
                    top performers and areas for improvement.
                  </p>
                </div>

                {/* Feature 4 */}
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all">
                  <div className="w-16 h-16 bg-[#FFD300] rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Trip History</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Access complete trip history for all vehicles. Filter by date, driver, vehicle, 
                    or status. Export reports for accounting.
                  </p>
                </div>

                {/* Feature 5 */}
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all">
                  <div className="w-16 h-16 bg-[#FFD300] rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Real-Time Monitoring</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Track all active vehicles on a live map. See driver locations, current trips, 
                    and availability status in real-time.
                  </p>
                </div>

                {/* Feature 6 */}
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all">
                  <div className="w-16 h-16 bg-[#FFD300] rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Commission Management</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Set custom commission rates for different drivers or vehicles. Automatic calculation 
                    of driver payouts and owner earnings.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Advanced Features */}
          <section className="bg-white py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
                Advanced Business Tools
              </h2>

              <div className="space-y-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Vehicle Management</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Add multiple vehicles with details (model, year, registration)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Vehicle maintenance scheduling and reminders</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Insurance and document expiry tracking</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Vehicle type categorization (sedan, SUV, premium)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Track vehicle mileage and usage statistics</span>
                      </li>
                    </ul>
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-xl p-8 flex items-center justify-center min-h-[300px]">
                    <div className="text-center text-gray-500">
                      <svg className="w-32 h-32 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                      <p className="text-lg font-semibold">Fleet Dashboard</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row-reverse items-center gap-8">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Financial Reports</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Daily, weekly, monthly revenue breakdowns</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Vehicle-wise earning comparison</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Driver payout calculations and history</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Expense tracking (fuel, maintenance, insurance)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Profit & loss statements with charts</span>
                      </li>
                    </ul>
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-xl p-8 flex items-center justify-center min-h-[300px]">
                    <div className="text-center text-gray-500">
                      <svg className="w-32 h-32 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <p className="text-lg font-semibold">Financial Reports</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Driver Management</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Onboard new drivers with document verification</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Set individual commission rates per driver</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Monitor driver ratings and customer feedback</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Block or suspend drivers when needed</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Performance bonuses and incentive management</span>
                      </li>
                    </ul>
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-xl p-8 flex items-center justify-center min-h-[300px]">
                    <div className="text-center text-gray-500">
                      <svg className="w-32 h-32 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <p className="text-lg font-semibold">Driver Management</p>
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
                  Platform Details
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Access</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Web dashboard (desktop & mobile)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">iOS & Android mobile apps</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Secure login with 2FA</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Role-based permissions</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Reports</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Export to PDF, Excel, CSV</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Automated email reports</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Custom date range selection</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Print-friendly formats</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Notifications</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Push notifications for important events</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Email alerts for milestones</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">SMS notifications option</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Customizable alert settings</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Integration</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Payment gateway integration</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Accounting software sync</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">API access for custom integrations</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Third-party analytics tools</span>
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
                Scale Your Fleet Business
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Start managing your taxi fleet more efficiently today
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
