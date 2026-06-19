"use client";
import React, { useState } from "react";
import Image from "next/image";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Do I get full source code?",
      answer:
        "Yes, you get complete full source code for both web and mobile applications with all the features and functionalities.",
    },
    {
      question: "Is installation included?",
      answer:
        "Yes, we provide complete installation support and setup assistance to get your platform running smoothly.",
    },
    {
      question: "Do you provide customization?",
      answer:
        "Yes, we offer customization services to modify the platform according to your specific business requirements.",
    },
    {
      question: "What's the refund policy?",
      answer:
        "We offer a 30-day money-back guarantee if you're not satisfied with our product or services.",
    },
    {
      question: "Do you support iOS apps?",
      answer:
        "Yes, we provide full support for both iOS and Android mobile applications with native performance.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-0.5 bg-yellow-400"></div>
            <span className="text-yellow-500 font-medium text-lg">
              Questions & Answers
            </span>
            <div className="w-10 h-0.5 bg-yellow-400"></div>
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Get Answers for your Queries and
          </h2>
          <h2 className="text-5xl font-bold mb-8">
            <span className="text-yellow-400">Stay Updated</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 items-start">
          {/* FAQ Questions */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg border border-gray-200 shadow-sm transition-all duration-200`}
              >
                {/* Question */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none hover:bg-gray-50 rounded-lg"
                >
                  <span className="font-semibold text-gray-800 text-lg">
                    {faq.question}
                  </span>
                  <div
                    className={`w-6 h-6 flex items-center justify-center transition-transform duration-200 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  >
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    openIndex === index
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-4 border-t border-gray-100">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:sticky lg:top-8 self-start">
            <div className="relative">
              <Image
                src="/Contain/faq-img.jpg"
                alt="FAQ - Looking for an Answer"
                width={500}
                height={800}
                className="rounded-lg shadow-lg object-cover"
                quality={100}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
