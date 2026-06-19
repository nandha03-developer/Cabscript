"use client";

export const dynamic = 'force-dynamic';
import React, { useState } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import DemoRequestModal from "@/components/DemoRequestModal";

export default function AdminPanelPage() {
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
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <Header />

        {/* Navigation */}
        <Navigation />

        {/* Admin Panel Content */}
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-16 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-black/30 backdrop-blur-md rounded-2xl px-8 py-6 inline-block">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                <span className="text-white">ADMIN PANEL</span>
              </h1>
              <p className="text-lg text-gray-200 max-w-2xl mx-auto">
                  Complete Control Center for Your Taxi Business
                </p>
              </div>
            </div>
          </section>

          {/* Overview Section */}
          <section className="bg-white py-16 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Powerful Admin Dashboard
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Manage your entire taxi business from a single, intuitive dashboard. Monitor operations, 
                  track performance, and make data-driven decisions in real-time.
                </p>
              </div>
            </div>
          </section>

          {/* Key Features Section */}
          <section className="bg-gray-50 py-16 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
                Core Features
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {/* Feature 1 */}
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all">
                  <div className="w-16 h-16 bg-[#FFD300] rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Real-Time Analytics</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Track bookings, revenue, and driver performance with live dashboards. Get instant insights 
                    into your business metrics with beautiful charts and graphs.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all">
                  <div className="w-16 h-16 bg-[#FFD300] rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">User Management</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Manage drivers, customers, and operators from one place. Approve registrations, verify 
                    documents, suspend accounts, and handle user disputes efficiently.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all">
                  <div className="w-16 h-16 bg-[#FFD300] rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Booking Management</h3>
                  <p className="text-gray-600 leading-relaxed">
                    View all ride bookings in real-time. Assign drivers manually, handle ride disputes, 
                    and track ride status from start to finish with complete transparency.
                  </p>
                </div>

                {/* Feature 4 */}
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all">
                  <div className="w-16 h-16 bg-[#FFD300] rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Payment & Commission</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Manage payment settings, commission rates, and driver payouts. Track all transactions 
                    with detailed financial reports and export statements.
                  </p>
                </div>

                {/* Feature 5 */}
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all">
                  <div className="w-16 h-16 bg-[#FFD300] rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Live Map Tracking</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Monitor all active vehicles on a live map. See driver locations, ride routes, 
                    and optimize dispatch operations with heat maps and zone analytics.
                  </p>
                </div>

                {/* Feature 6 */}
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all">
                  <div className="w-16 h-16 bg-[#FFD300] rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Settings & Configuration</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Configure pricing, surge pricing, vehicle types, and service areas. Customize 
                    app settings, notifications, and business rules without coding.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Advanced Features Section */}
          <section className="bg-white py-16 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
                Advanced Admin Tools
              </h2>

              <div className="space-y-12">
                {/* Feature Detail 1 */}
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Comprehensive Reports & Analytics</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Revenue reports with daily, weekly, monthly breakdowns</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Driver performance metrics and ratings analysis</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Peak hour analysis and demand forecasting</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Export reports in PDF, Excel, and CSV formats</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Customer behavior and retention analytics</span>
                      </li>
                    </ul>
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-xl p-8 flex items-center justify-center min-h-[300px]">
                    <div className="text-center text-gray-500">
                      <svg className="w-32 h-32 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <p className="text-lg font-semibold">Analytics Dashboard Preview</p>
                    </div>
                  </div>
                </div>

                {/* Feature Detail 2 */}
                <div className="flex flex-col md:flex-row-reverse items-center gap-8">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Driver & Vehicle Management</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Document verification system (license, insurance, RC)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Vehicle inspection and maintenance tracking</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Driver rating and review management</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Background check integration support</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Automated document expiry notifications</span>
                      </li>
                    </ul>
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-xl p-8 flex items-center justify-center min-h-[300px]">
                    <div className="text-center text-gray-500">
                      <svg className="w-32 h-32 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-lg font-semibold">Driver Management Interface</p>
                    </div>
                  </div>
                </div>

                {/* Feature Detail 3 */}
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Dynamic Pricing & Promotions</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Surge pricing based on demand and supply</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Create promo codes and discount campaigns</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Zone-based pricing configuration</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Referral program management</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">Seasonal pricing strategies</span>
                      </li>
                    </ul>
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-xl p-8 flex items-center justify-center min-h-[300px]">
                    <div className="text-center text-gray-500">
                      <svg className="w-32 h-32 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <p className="text-lg font-semibold">Pricing Configuration Panel</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Technical Specifications */}
          <section className="bg-gray-50 py-16 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white shadow-2xl drop-shadow-xl rounded-lg p-8 md:p-12" style={{boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)'}}>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                  Technical Details
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Platform</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Web-based responsive dashboard</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Works on all modern browsers</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Mobile-optimized interface</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Cloud-hosted solution</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Security Features</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Role-based access control</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Two-factor authentication</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Activity logs and audit trails</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">SSL encryption for all data</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Integrations</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Payment gateway integration</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">SMS and email notifications</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Google Maps API integration</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Third-party API support</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Support</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">24/7 technical support</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Regular software updates</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Comprehensive documentation</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#FFD300] mr-3">•</span>
                        <span className="text-gray-700">Training and onboarding</span>
                      </li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-linear-to-r from-gray-900 via-gray-800 to-black py-16 px-4 md:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Take Control of Your Taxi Business?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Get started with our powerful admin dashboard today
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

        {/* Footer */}
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
