"use client";

export const dynamic = 'force-dynamic';
import React, { useState } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('About Product');
  const [openFAQ, setOpenFAQ] = useState(0);

  // FAQ Data
  const faqData = {
    'About Product': [
      {
        question: "What is a cabscript?",
        answer: "The cabscript is a pre-developed taxi booking app solution that helps entrepreneurs launch their cabscript app. Since it is pre-built, it offers a quick and affordable way to launch a cabscript app. The solution comes with a mobile app for riders and drivers and an admin panel for the platform owner."
      },
      {
        question: "The cost of the cab script?",
        answer: "Our cab script pricing varies based on the features and customization requirements. Please contact our sales team for detailed pricing information tailored to your specific needs."
      },
      {
        question: "How does the solution work?",
        answer: "The solution works by connecting passengers with nearby drivers through a mobile app. Passengers can book rides, track their driver's location, and make payments through the app. Drivers receive ride requests and can accept or decline them based on their availability."
      },
      {
        question: "What is 100% source code?",
        answer: "100% source code means you get complete access to all the code files and can modify, customize, and rebrand the application according to your business requirements. You own the complete solution without any licensing restrictions."
      },
      {
        question: "Is the cabscript customizable from my end?",
        answer: "Yes, the cabscript is fully customizable. Since you receive the complete source code, you can modify the design, add new features, integrate third-party services, and customize the solution according to your business needs."
      }
    ],
    'About Updates': [
      {
        question: "How often do you release updates?",
        answer: "We release regular updates to improve functionality, fix bugs, and add new features. Major updates are released quarterly, while minor updates and security patches are released as needed."
      },
      {
        question: "Are updates free for existing customers?",
        answer: "Yes, all updates are free for customers who have purchased our solution. You will receive notifications about new updates and can download them from your customer portal."
      },
      {
        question: "How do I install updates?",
        answer: "Updates can be installed through our automated update system or manually by following the installation guide provided with each update. Our technical team is available to assist with the update process if needed."
      },
      {
        question: "Will updates affect my customizations?",
        answer: "We design our updates to be compatible with standard customizations. However, extensive modifications may require manual integration. We provide detailed upgrade notes with each update to help you maintain your customizations."
      }
    ],
    'About Tech Support': [
      {
        question: "What kind of technical support do you provide?",
        answer: "We provide comprehensive technical support including installation assistance, bug fixes, customization guidance, and troubleshooting. Our support team is available via email, chat, and phone during business hours."
      },
      {
        question: "How long is the support period?",
        answer: "We provide 6 months of free technical support with every purchase. Extended support plans are available for customers who need ongoing assistance beyond the initial period."
      },
      {
        question: "Do you provide customization services?",
        answer: "Yes, we offer professional customization services to modify the solution according to your specific business requirements. Our development team can help with design changes, feature additions, and third-party integrations."
      },
      {
        question: "Is there documentation available?",
        answer: "Yes, we provide comprehensive documentation including installation guides, user manuals, API documentation, and video tutorials to help you understand and use the solution effectively."
      }
    ]
  };

  const renderFAQContent = () => {
    const currentFAQs = faqData[selectedCategory as keyof typeof faqData] || [];
    
    return (
      <div className="space-y-4">
        {currentFAQs.map((faq, index) => (
          <div 
            key={index} 
            className={`bg-white rounded-lg transition-all duration-300 ${
              openFAQ === index 
                ? 'border-2 border-yellow-400' 
                : 'border border-gray-200'
            }`}
          >
            <button
              onClick={() => setOpenFAQ(openFAQ === index ? -1 : index)}
              className="w-full px-6 py-4 text-left flex justify-between items-center cursor-pointer transition-colors"
            >
              <span className="font-medium text-gray-900">{faq.question}</span>
              <svg
                className={`w-5 h-5 transition-all duration-300 ${
                  openFAQ === index ? 'rotate-180 text-yellow-500' : 'text-gray-500'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div 
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                openFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
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
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10">
        {/* Header */}
        <Header />
        
        {/* Navigation */}
        <Navigation />
        
        {/* FAQ Content */}
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-16 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-black/30 backdrop-blur-md rounded-2xl px-8 py-6 inline-block">
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  KNOW MORE ABOUT OUR PRODUCT
                </h1>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="bg-gray-50 py-16 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
              {/* Header Section */}
              <div className="text-center mb-12">
                <div className="flex items-center justify-center mb-4">
                  <div className="h-0.5 bg-yellow-400 w-12 mr-3"></div>
                  <span className="text-yellow-400 font-medium text-lg">Questions & Answers</span>
                  <div className="h-0.5 bg-yellow-400 w-12 ml-3"></div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  Get Answers for your Queries and
                </h2>
                <h2 className="text-3xl md:text-4xl  text-yellow-400 mb-6">
                  Stay Updated
                </h2>
              </div>

              {/* FAQ Content */}
              <div className="grid lg:grid-cols-4 gap-8">
                {/* Left Sidebar - Categories */}
                <div className="lg:col-span-1">
                  <div className="space-y-2">
                    {/* About Product */}
                    <button
                      onClick={() => setSelectedCategory('About Product')}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                        selectedCategory === 'About Product'
                          ? 'bg-yellow-400 text-white font-semibold border-l-4 border-yellow-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      About Product
                    </button>
                    
                    {/* About Updates */}
                    <button
                      onClick={() => setSelectedCategory('About Updates')}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                        selectedCategory === 'About Updates'
                          ? 'bg-yellow-400 text-white font-semibold border-l-4 border-yellow-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      About Updates
                    </button>
                    
                    {/* About Tech Support */}
                    <button
                      onClick={() => setSelectedCategory('About Tech Support')}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                        selectedCategory === 'About Tech Support'
                          ? 'bg-yellow-400 text-white font-semibold border-l-4 border-yellow-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      About Tech Support
                    </button>
                  </div>
                </div>

                {/* Right Content - FAQ List */}
                <div className="lg:col-span-3">
                  <div className="bg-white rounded-lg p-6 shadow-2xl drop-shadow-xl" style={{boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)'}}>
                    {renderFAQContent()}
                  </div>
                </div>
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