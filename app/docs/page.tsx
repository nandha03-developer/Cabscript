"use client";

export const dynamic = 'force-dynamic';
import { useState } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface DocSection {
  id: string;
  title: string;
  content: string[];
  subsections?: DocSection[];
}

const documentationData: DocSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    content: [
      "Welcome to CabScript Documentation. This comprehensive guide will help you understand and implement our taxi booking platform.",
      "CabScript is a complete solution for taxi booking businesses, providing admin dashboard, customer app, driver app, and owner management system."
    ],
    subsections: [
      {
        id: "installation",
        title: "Installation",
        content: [
          "1. Download the CabScript package from your dashboard",
          "2. Extract the files to your server directory",
          "3. Configure your database settings",
          "4. Run the installation wizard"
        ]
      },
      {
        id: "system-requirements",
        title: "System Requirements",
        content: [
          "• PHP 8.0 or higher",
          "• MySQL 5.7 or higher",
          "• Apache/Nginx web server",
          "• SSL certificate (recommended)",
          "• Minimum 1GB RAM"
        ]
      }
    ]
  },
  {
    id: "admin-dashboard",
    title: "Admin Dashboard",
    content: [
      "The admin dashboard is the central control panel for managing your taxi booking business.",
      "Access comprehensive analytics, manage drivers, customers, and monitor all bookings in real-time."
    ],
    subsections: [
      {
        id: "dashboard-overview",
        title: "Dashboard Overview",
        content: [
          "• Real-time booking statistics",
          "• Revenue analytics and reports",
          "• Driver performance metrics",
          "• Customer activity tracking"
        ]
      },
      {
        id: "user-management",
        title: "User Management",
        content: [
          "• Add/Edit/Delete customers",
          "• Driver registration and verification",
          "• Role-based access control",
          "• User activity logs"
        ]
      }
    ]
  },
  {
    id: "customer-app",
    title: "Customer App",
    content: [
      "The customer mobile application provides an intuitive booking experience for your users.",
      "Features include real-time tracking, multiple payment options, and ride history."
    ],
    subsections: [
      {
        id: "booking-process",
        title: "Booking Process",
        content: [
          "1. Customer opens the app and sets pickup location",
          "2. Selects destination and vehicle type",
          "3. Reviews fare estimate and confirms booking",
          "4. Gets matched with nearby driver",
          "5. Tracks ride in real-time"
        ]
      },
      {
        id: "payment-options",
        title: "Payment Options",
        content: [
          "• Cash payments",
          "• Credit/Debit cards",
          "• Digital wallets",
          "• In-app wallet system",
          "• Promotional codes and discounts"
        ]
      }
    ]
  },
  {
    id: "driver-app",
    title: "Driver App",
    content: [
      "The driver application helps drivers manage their rides, earnings, and availability status.",
      "Includes GPS navigation, earnings tracker, and ride management features."
    ],
    subsections: [
      {
        id: "driver-registration",
        title: "Driver Registration",
        content: [
          "• Document verification process",
          "• Vehicle registration and inspection",
          "• Background check requirements",
          "• Training and onboarding"
        ]
      },
      {
        id: "earnings-management",
        title: "Earnings Management",
        content: [
          "• Daily/Weekly/Monthly earnings reports",
          "• Commission structure",
          "• Payout scheduling",
          "• Tax documentation"
        ]
      }
    ]
  },
  {
    id: "api-reference",
    title: "API Reference",
    content: [
      "CabScript provides RESTful APIs for integration with third-party services and custom applications.",
      "All API endpoints are secured with authentication tokens and support JSON responses."
    ],
    subsections: [
      {
        id: "authentication",
        title: "Authentication",
        content: [
          "API Key: Include your API key in the request header",
          "Bearer Token: Use JWT tokens for user-specific operations",
          "Rate Limiting: 1000 requests per hour per API key"
        ]
      },
      {
        id: "endpoints",
        title: "API Endpoints",
        content: [
          "• GET /api/bookings - Retrieve bookings",
          "• POST /api/bookings - Create new booking",
          "• GET /api/drivers - List drivers",
          "• POST /api/drivers - Register driver",
          "• GET /api/customers - List customers"
        ]
      }
    ]
  }
];

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState<string>("getting-started");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["getting-started"]));

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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

        {/* Hero Section */}
        <section className="relative py-16 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-black/30 backdrop-blur-md rounded-2xl px-8 py-6 inline-block">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                <span className="text-white">Documentation</span>
              </h1>
              <p className="text-lg text-gray-200 max-w-2xl mx-auto">
                Complete guide to set up, configure, and manage your taxi booking platform
              </p>
            </div>
          </div>
        </section>

        {/* Main Content with White Background */}
        <div className="bg-white">
          <div className="container mx-auto px-6 py-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 sticky top-8 border border-gray-200 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Contents</h3>
                <nav className="space-y-2">
                  {documentationData.map((section) => (
                    <div key={section.id}>
                      <button
                        onClick={() => {
                          scrollToSection(section.id);
                          toggleSection(section.id);
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                          activeSection === section.id
                            ? "bg-[#FFD300] text-gray-900 shadow-md"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        <span className="font-medium">{section.title}</span>
                        {expandedSections.has(section.id) ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </button>
                      
                      {expandedSections.has(section.id) && section.subsections && (
                        <div className="ml-4 mt-2 space-y-1">
                          {section.subsections.map((subsection) => (
                            <button
                              key={subsection.id}
                              onClick={() => scrollToSection(subsection.id)}
                              className="w-full text-left p-2 text-sm text-gray-600 hover:text-[#FFD300] transition-colors rounded"
                            >
                              {subsection.title}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="space-y-12">
                {documentationData.map((section) => (
                  <section key={section.id} id={section.id} className="scroll-mt-8">
                    <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg">
                      <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="w-2 h-8 bg-[#FFD300] rounded-full mr-4"></span>
                        {section.title}
                      </h2>
                      
                      <div className="space-y-4 mb-8">
                        {section.content.map((paragraph, index) => (
                          <p key={index} className="text-gray-700 text-lg leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                      </div>

                      {/* Subsections */}
                      {section.subsections && (
                        <div className="space-y-8">
                          {section.subsections.map((subsection) => (
                            <div key={subsection.id} id={subsection.id} className="scroll-mt-8">
                              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                  <span className="w-1.5 h-6 bg-[#FFD300] rounded-full mr-3"></span>
                                  {subsection.title}
                                </h3>
                                <div className="space-y-3">
                                  {subsection.content.map((item, index) => (
                                    <p key={index} className="text-gray-700 leading-relaxed">
                                      {item}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </section>
                ))}

                {/* Additional Resources */}
                  <section className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg">
                    <h2 className="text-3xl font-bold mb-6 text-gray-900">Need More Help?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <h3 className="text-xl font-semibold mb-3 text-gray-900">Support Center</h3>
                        <p className="mb-4 text-gray-700">Get help from our support team for technical issues and questions.</p>
                        <button 
                          onClick={() => window.location.href = '/contact'}
                          className="bg-[#FFD300] text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-[#e6be00] transition-all cursor-pointer"
                        >
                          Contact Support
                        </button>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <h3 className="text-xl font-semibold mb-3 text-gray-900">Video Tutorials</h3>
                        <p className="mb-4 text-gray-700">Watch step-by-step video guides for setting up and using CabScript.</p>
                        <button className="bg-[#FFD300] text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-[#e6be00] transition-all">
                          Watch Videos
                        </button>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}