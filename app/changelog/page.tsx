"use client";

export const dynamic = 'force-dynamic';
import { useState } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface ChangelogEntry {
  version: string;
  date: string;
  type: "major" | "minor" | "patch";
  changes: {
    category: "New Features" | "Improvements" | "Bug Fixes" | "Security" | "Breaking Changes";
    items: string[];
  }[];
}

const changelogData: ChangelogEntry[] = [
  {
    version: "v3.2.1",
    date: "November 8, 2025",
    type: "patch",
    changes: [
      {
        category: "New Features",
        items: [
          "Added real-time driver location tracking with enhanced GPS accuracy",
          "Introduced multi-language support for 15+ languages",
          "New dark mode theme for better user experience",
          "Advanced analytics dashboard with custom reporting"
        ]
      },
      {
        category: "Improvements",
        items: [
          "Enhanced ride matching algorithm for faster pickups",
          "Improved app performance with 40% faster loading times",
          "Updated payment gateway integration with new security protocols",
          "Better notification system with smart delivery timing"
        ]
      },
      {
        category: "Bug Fixes",
        items: [
          "Fixed issue with ride cancellation not updating driver status",
          "Resolved payment processing delays during peak hours",
          "Fixed GPS accuracy issues in urban areas with tall buildings"
        ]
      }
    ]
  },
  {
    version: "v3.2.0",
    date: "October 15, 2025",
    type: "minor",
    changes: [
      {
        category: "New Features",
        items: [
          "Introduced scheduled rides feature for advance bookings",
          "Added driver rating and feedback system",
          "New customer loyalty program with reward points",
          "Emergency SOS button for passenger safety"
        ]
      },
      {
        category: "Improvements",
        items: [
          "Enhanced route optimization for better fuel efficiency",
          "Improved driver onboarding process with video tutorials",
          "Better surge pricing algorithm with transparent notifications"
        ]
      },
      {
        category: "Security",
        items: [
          "Implemented two-factor authentication for admin accounts",
          "Enhanced data encryption for sensitive user information",
          "Added security audit logs for admin dashboard"
        ]
      }
    ]
  },
  {
    version: "v3.1.5",
    date: "September 22, 2025",
    type: "patch",
    changes: [
      {
        category: "Bug Fixes",
        items: [
          "Fixed crash issue on Android devices with older OS versions",
          "Resolved memory leak in the driver app during long sessions",
          "Fixed incorrect fare calculation for multi-stop rides"
        ]
      },
      {
        category: "Improvements",
        items: [
          "Optimized database queries for better performance",
          "Enhanced push notification delivery reliability",
          "Improved error handling and user-friendly error messages"
        ]
      }
    ]
  },
  {
    version: "v3.1.0",
    date: "August 10, 2025",
    type: "major",
    changes: [
      {
        category: "New Features",
        items: [
          "Launch of electric vehicle support with charging station integration",
          "Introduced corporate booking system for business accounts",
          "Added wheelchair accessible vehicle options",
          "New admin panel with advanced fleet management tools"
        ]
      },
      {
        category: "Breaking Changes",
        items: [
          "Updated API endpoints - please update your integrations",
          "Changed user authentication flow - existing tokens will expire",
          "Modified database schema for better performance"
        ]
      },
      {
        category: "Security",
        items: [
          "Enhanced user data protection with GDPR compliance",
          "Implemented advanced fraud detection system",
          "Added secure payment tokenization"
        ]
      }
    ]
  },
  {
    version: "v3.0.8",
    date: "July 5, 2025",
    type: "patch",
    changes: [
      {
        category: "Bug Fixes",
        items: [
          "Fixed issue with driver app not receiving ride requests",
          "Resolved customer app freezing during payment processing",
          "Fixed incorrect distance calculation in rural areas"
        ]
      },
      {
        category: "Improvements",
        items: [
          "Enhanced map accuracy with updated geographic data",
          "Improved customer support chat functionality",
          "Better handling of network connectivity issues"
        ]
      }
    ]
  }
];

const getVersionTypeColor = (type: string) => {
  switch (type) {
    case "major":
      return "bg-red-100 text-red-800 border-red-200";
    case "minor":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "patch":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "New Features":
      return (
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      );
    case "Improvements":
      return (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case "Bug Fixes":
      return (
        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      );
    case "Security":
      return (
        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case "Breaking Changes":
      return (
        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      );
    default:
      return (
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
};

export default function ChangelogPage() {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

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
           <span className="text-white">Changelog</span>
              </h1>
              <p className="text-lg text-gray-200 max-w-2xl mx-auto">
                Track all updates, new features, and improvements to our platform
              </p>
            </div>
          </div>
        </section>

        {/* Main Content with White Background */}
        <div className="bg-white">
          <div className="container mx-auto px-6 py-12 max-w-7xl">
            
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-linear-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Total Releases</p>
                    <p className="text-2xl font-bold text-green-800">{changelogData.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-200 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-linear-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Latest Version</p>
                    <p className="text-2xl font-bold text-blue-800">{changelogData[0].version}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-linear-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-600 text-sm font-medium">New Features</p>
                    <p className="text-2xl font-bold text-yellow-800">24</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-200 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-linear-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Bug Fixes</p>
                    <p className="text-2xl font-bold text-purple-800">18</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-200 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Changelog Timeline */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <span className="w-2 h-8 bg-[#FFD300] rounded-full mr-4"></span>
                Release Timeline
              </h2>
              
              {changelogData.map((entry, index) => (
                <div key={entry.version} className="relative">
                  <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                    {/* Version Header */}
                    <div className="bg-gray-50 border-b border-gray-200 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {/* Timeline Dot */}
                          <div className="w-12 h-12 bg-[#FFD300] rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                          </div>
                          
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900">{entry.version}</h3>
                            <p className="text-gray-600">{entry.date}</p>
                          </div>
                        </div>
                        
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getVersionTypeColor(entry.type)}`}>
                          {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)} Release
                        </span>
                      </div>
                    </div>
                    
                    {/* Changes Content */}
                    <div className="p-6">
                      <div className="space-y-6">
                        {entry.changes.map((changeGroup, groupIndex) => (
                          <div key={groupIndex}>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                              {getCategoryIcon(changeGroup.category)}
                              <span className="ml-2">{changeGroup.category}</span>
                            </h4>
                            <ul className="space-y-2">
                              {changeGroup.items.map((item, itemIndex) => (
                                <li key={itemIndex} className="flex items-start">
                                  <span className="w-2 h-2 bg-[#FFD300] rounded-full mt-2 mr-3 shrink-0"></span>
                                  <span className="text-gray-700">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Subscribe to Updates */}
            <div className="mt-16 bg-white rounded-xl p-8 border border-gray-200 shadow-lg">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Stay Updated</h3>
                <p className="text-lg mb-6 text-gray-600">Get notified about new releases and updates to CabScript</p>
                <div className="max-w-md mx-auto">
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Enter Your Email"
                      className="w-full px-4 py-3 pr-32 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FFD300] text-gray-700"
                    />
                    <button className="absolute right-2 top-2 bottom-2 px-6 bg-[#FFD300] text-gray-900 rounded-lg font-medium hover:bg-[#e6be00] transition-all">
                      Subscribe
                    </button>
                  </div>
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