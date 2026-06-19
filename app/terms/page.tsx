"use client";

export const dynamic = 'force-dynamic';
import React from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function TermsPage() {
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

        {/* Terms & Conditions Content */}
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-16 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-black/30 backdrop-blur-md rounded-2xl px-8 py-6 inline-block">
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  TERMS & CONDITIONS
                </h1>
              </div>
            </div>
          </section>

          {/* Content Section with Light Background */}
          <section className="bg-gray-50 py-16 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
              {/* White Card */}
              <div className="bg-white shadow-2xl drop-shadow-xl rounded-lg p-8 md:p-12" style={{boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)'}}>
                {/* Introduction */}
                <div className="mb-8">
                  <p className="text-gray-500 leading-relaxed text-[22px] mb-4 font-bold">
                    Welcome to our Cabscript platform. By accessing or using our application, website, or related
                    services, you agree to the following Terms and Conditions.
                  </p>
                  <p className="text-gray-500 leading-relaxed text-[18px]">
                    We provide a technology platform that connects drivers and customers. We are not a transportation provider and do not employ drivers.
                    All rides are provided by independent third-party drivers.
                  </p>
                </div>

                {/* License Grant */}
                <div className="mb-8">
                  <h2 className="text-gray-700 leading-relaxed text-[22px] font-bold mb-4">License Grant</h2>
                  <ul className="space-y-3">
                    <li className="flex items-start text-gray-500 text-[18px]">
                      <span className="text-gray-400 mr-2 mt-0.5">•</span>
                      Upon purchase, the Company grants you a non-exclusive, non-transferable license to use the Script for your business operations.
                    </li>
                    <li className="flex items-start text-gray-500 text-[18px]">
                      <span className="text-gray-400 mr-2 mt-0.5">•</span>
                      You are not permitted to resell, redistribute, or sublicense the Script without prior written consent.
                    </li>
                  </ul>
                </div>

                {/* Scope of Use */}
                <div className="mb-8">
                  <h2 className="text-gray-700 leading-relaxed text-[22px] font-bold mb-4">Scope of Use</h2>
                  <ul className="space-y-3">
                    <li className="flex items-start text-gray-500 text-[18px]">
                      <span className="text-gray-400 mr-2 mt-0.5">•</span>
                      The Script is provided as a white-label taxi booking software solution.
                    </li>
                    <li className="flex items-start text-gray-500 text-[18px]">
                      <span className="text-gray-400 mr-2 mt-0.5">•</span>
                      You are solely responsible for legal compliance, licensing, and operations of your taxi or ride-hailing business.
                    </li>
                  </ul>
                </div>

                {/* Customization & Support */}
                <div className="mb-8">
                  <h2 className="text-gray-700 leading-relaxed text-[22px] font-bold mb-4">Customization & Support</h2>
                  <ul className="space-y-3">
                    <li className="flex items-start text-gray-500 text-[18px]">
                      <span className="text-gray-400 mr-2 mt-0.5">•</span>
                      Basic setup support may be included depending on your purchase plan.
                    </li>
                    <li className="flex items-start text-gray-500 text-[18px]">
                      <span className="text-gray-400 mr-2 mt-0.5">•</span>
                      Additional customization, integrations, or feature enhancements may incur extra charges.
                    </li>
                    <li className="flex items-start text-gray-500 text-[18px]">
                      <span className="text-gray-400 mr-2 mt-0.5">•</span>
                      Support is provided as per the support policy agreed upon during purchase.
                    </li>
                  </ul>
                </div>

                {/* Intellectual Property */}
                <div className="mb-8">
                  <h2 className="text-gray-700 leading-relaxed text-[22px] font-bold mb-4">Intellectual Property</h2>
                  <ul className="space-y-3">
                    <li className="flex items-start text-gray-500 text-[18px]">
                      <span className="text-gray-400 mr-2 mt-0.5">•</span>
                      You may customize the Script for your business but may not claim ownership of the original codebase.
                    </li>
                  </ul>
                </div>

                {/* Restrictions */}
                <div className="mb-8">
                  <h2 className="text-gray-700 leading-relaxed text-[22px] font-bold mb-4">Restrictions</h2>
                  <p className="text-gray-500 text-[18px] leading-relaxed">
                    You must not sell, share, or misuse the Script, and you must keep all copyright and ownership notices intact.
                  </p>
                </div>

                {/* Governing Law */}
                <div className="mb-8">
                  <h2 className="text-gray-700 leading-relaxed text-[22px] font-bold mb-4">Governing Law</h2>
                  <p className="text-gray-500 text-[18px] leading-relaxed">
                    These Terms are governed by the laws of Tamil Nadu, India. Any disputes will be subject to the jurisdiction of the courts in Tamil Nadu, India.
                  </p>
                </div>
              </div>

              {/* Privacy Policy Button */}
              <div className="flex justify-center mt-10">
                <Link
                  href="/privacy"
                  className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-8 py-3 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  Privacy Policy
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
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}