"use client";

export const dynamic = 'force-dynamic';
import React from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function RefundPage() {
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
        <Header />
        <Navigation />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-16 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-black/30 backdrop-blur-md rounded-2xl px-8 py-6 inline-block">
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  REFUND POLICY
                </h1>
              </div>
            </div>
          </section>

          {/* Content Section */}
          <section className="bg-gray-50 py-16 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
              <div
                className="bg-white shadow-2xl drop-shadow-xl rounded-lg p-8 md:p-12"
                style={{
                  boxShadow:
                    "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)",
                }}
              >
                <div className="mb-8">
                  <p className="text-gray-500 text-[22px] font-bold">
                    Last updated on 07-11-2025
                  </p>
                </div>

                <div className="mb-8">
                  <p className="text-gray-600 leading-relaxed text-[18px]">
                    Our refund policy is simple and straightforward. Due to the
                    nature of digital downloads, we do not offer refunds. When
                    you purchase our scripts or themes, you are buying access to
                    support and updates. We take pride in the quality of our
                    products, and thousands of clients use them every day. If
                    you encounter an issue with any of our products, please
                    contact our support team via email for the specific product
                    you purchased, and give us a reasonable opportunity to
                    investigate and resolve the problem.
                  </p>
                </div>

                {/* Refund Scenarios Table */}
                <div className="space-y-4 mb-8">
                  {[
                    {
                      question: "Still, I haven't downloaded the product",
                      answer: "Yes, within 7 days of purchase.",
                      emoji: "😊",
                    },
                    {
                      question: "I'm sorry, I changed my mind",
                      answer: "You don’t qualify for a refund",
                      emoji: "☹️",
                    },
                    {
                      question: "Your product doesn't work with my idea",
                      answer: "You don’t qualify for a refund",
                      emoji: "☹️",
                    },
                    {
                      question:
                        "I modified the core of the script & theme",
                      answer: "You don’t qualify for a refund",
                      emoji: "☹️",
                    },
                    {
                      question: "I found an issue",
                      answer: "You don’t qualify for a refund",
                      emoji: "☹️",
                    },
                    {
                      question: "Sorry, my business failed",
                      answer: "You don’t qualify for a refund",
                      emoji: "☹️",
                    },
                    {
                      question:
                        "It doesn’t have the features & functions I need",
                      answer: "You don’t qualify for a refund",
                      emoji: "☹️",
                    },
                    {
                      question: "If installed & customized",
                      answer: "You don’t qualify for a refund",
                      emoji: "☹️",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <div className="flex">
                        <div className="flex-1 p-4 bg-gray-50 border-r border-gray-200">
                          <p className="text-gray-700 text-[18px]">{item.question}</p>
                        </div>
                        <div className="flex-1 p-4 bg-white flex items-center justify-between">
                          <p className="text-gray-700 text-[18px]">{item.answer}</p>
                          <span className="text-2xl">{item.emoji}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mb-8">
                  <p className="text-gray-600 leading-relaxed text-[18px]">
                    A refund is not encouraged under any circumstances, once the
                    product is sent and the order process is completed.
                    Eventually, we request & recommend buyers to test with the
                    Live demo before confirming and purchasing the product, and
                    we guarantee to deliver the same quality, as presented in
                    the demo.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-10">
              <Link
                href="/terms"
                className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-8 py-3 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                Terms & Conditions
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
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}
