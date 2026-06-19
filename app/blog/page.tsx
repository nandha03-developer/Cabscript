"use client";
import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function BlogPage() {
  const [showMorePosts, setShowMorePosts] = useState(false);
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
        
        {/* Blog Content */}
       <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-16 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-black/30 backdrop-blur-md rounded-2xl px-8 py-6 inline-block">
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  BLOG
                </h1>
              </div>
            </div>
          </section>

          {/* Blog Posts Section */}
          <section className="bg-gray-50 py-16 px-4 md:px-8">
            <div className="max-w-6xl mx-auto px-4">


              {/* Blog Posts Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {/* Blog Post 1 */}
                <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative h-48 w-full">
                    <Image 
                      src="/blog/blog-1-2.jpg" 
                      alt="How to Get Started with our Uber Clone"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-yellow-400 text-white px-3 py-1 rounded text-sm font-medium">
                        Blog Details
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        cabscript
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        Sep 23, 2025
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 hover:text-yellow-500 transition-colors cursor-pointer">
                      How to Get Started with our Uber Clone?
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      Discover everything about Wooberly, our taxi booking app solution, and learn how it can help you launch your own taxi app.
                    </p>
                    <div className="flex justify-start">
                      <a href="/blog/how-to-get-started-with-uber-clone" className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 group">
                        Read More
                        <svg 
                          className="w-4 h-4 transition-transform group-hover:translate-x-1" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </article>

                {/* Blog Post 2 */}
                <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <img 
                      src="/blog/blog-1-3.jpg" 
                      alt="Advanced Features for Your Taxi Booking App"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-yellow-400 text-white px-3 py-1 rounded text-sm font-medium">
                        Blog Details
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        cabscript
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        Sep 18, 2025
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 hover:text-yellow-500 transition-colors cursor-pointer">
                      Advanced Features for Your Taxi Booking App
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      Explore advanced features that can make your taxi booking app stand out from the competition and provide exceptional user experience.
                    </p>
                    <div className="flex justify-start">
                      <a href="/blog/advanced-taxi-app-features" className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 group">
                        Read More
                        <svg 
                          className="w-4 h-4 transition-transform group-hover:translate-x-1" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </article>

                {/* Blog Post 3 */}
                <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <img 
                      src="/blog/blog-1-4.jpg" 
                      alt="Marketing Strategies for Taxi Apps"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-yellow-400 text-white px-3 py-1 rounded text-sm font-medium">
                        Blog Details
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        cabscript
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        Sep 15, 2025
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 hover:text-yellow-500 transition-colors cursor-pointer">
                      Marketing Strategies for Taxi Apps
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      Learn effective marketing strategies to promote your taxi booking app and attract more customers to your ride-hailing business.
                    </p>
                    <div className="flex justify-start">
                      <a href="/blog/marketing-strategies-taxi-apps" className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 group">
                        Read More
                        <svg 
                          className="w-4 h-4 transition-transform group-hover:translate-x-1" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </article>

                {/* Blog Post 4 */}
                <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <img 
                      src="/blog/blog-d-1.jpg" 
                      alt="How to Get Started with our Uber Clone"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-yellow-400 text-white px-3 py-1 rounded text-sm font-medium">
                        Blog Details
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        cabscript
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        Sep 23, 2025
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 hover:text-yellow-500 transition-colors cursor-pointer">
                      How to Get Started with our Uber Clone?
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      Discover everything about Wooberly, our taxi booking app solution, and learn how it can help you launch your own taxi app.
                    </p>
                    <div className="flex justify-start">
                      <a href="/blog/how-to-get-started-with-uber-clone" className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 group">
                        Read More
                        <svg 
                          className="w-4 h-4 transition-transform group-hover:translate-x-1" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </article>

                {/* Blog Post 5 */}
                <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <img 
                      src="/blog/blog-d-2.jpg" 
                      alt="How to Get Started with our Uber Clone"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-yellow-400 text-white px-3 py-1 rounded text-sm font-medium">
                        Blog Details
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        cabscript
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        Sep 23, 2025
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 hover:text-yellow-500 transition-colors cursor-pointer">
                      How to Get Started with our Uber Clone?
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      Discover everything about Wooberly, our taxi booking app solution, and learn how it can help you launch your own taxi app.
                    </p>
                    <div className="flex justify-start">
                      <a href="/blog/how-to-get-started-with-uber-clone" className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 group">
                        Read More
                        <svg 
                          className="w-4 h-4 transition-transform group-hover:translate-x-1" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </article>

                {/* Blog Post 6 - Duplicate for grid completion */}
                <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <img 
                      src="/blog/blog-1-2.jpg" 
                      alt="How to Get Started with our Uber Clone"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-yellow-400 text-white px-3 py-1 rounded text-sm font-medium">
                        Blog Details
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        cabscript
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        Sep 23, 2025
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 hover:text-yellow-500 transition-colors cursor-pointer">
                      How to Get Started with our Uber Clone?
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      Discover everything about Wooberly, our taxi booking app solution, and learn how it can help you launch your own taxi app.
                    </p>
                    <div className="flex justify-start">
                      <a href="/blog/how-to-get-started-with-uber-clone" className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 group">
                        Read More
                        <svg 
                          className="w-4 h-4 transition-transform group-hover:translate-x-1" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </article>
              </div>

              {/* Additional Blog Posts - Show when "See More" is clicked */}
              {showMorePosts && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                  {/* Additional Blog Post 1 */}
                  <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative">
                      <img 
                        src="/blog/blog-1-3.jpg" 
                        alt="Advanced Taxi App Features"
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-yellow-400 text-white px-3 py-1 rounded text-sm font-medium">
                          Blog Details
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          cabscript
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          Sep 18, 2025
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3 hover:text-yellow-500 transition-colors cursor-pointer">
                        Advanced Features for Your Taxi Booking App
                      </h3>
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                        Explore advanced features that can make your taxi booking app stand out from the competition and provide exceptional user experience.
                      </p>
                      <div className="flex justify-start">
                        <a href="/blog/advanced-taxi-app-features" className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 group">
                          Read More
                          <svg 
                            className="w-4 h-4 transition-transform group-hover:translate-x-1" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </article>

                  {/* Additional Blog Post 2 */}
                  <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative">
                      <img 
                        src="/blog/blog-1-4.jpg" 
                        alt="Marketing Your Ride-Hailing Business"
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-yellow-400 text-white px-3 py-1 rounded text-sm font-medium">
                          Blog Details
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          cabscript
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          Sep 15, 2025
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3 hover:text-yellow-500 transition-colors cursor-pointer">
                        Marketing Strategies for Taxi Apps
                      </h3>
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                        Learn effective marketing strategies to promote your taxi booking app and attract more customers to your ride-hailing business.
                      </p>
                      <div className="flex justify-start">
                        <a href="/blog/marketing-strategies-taxi-apps" className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 group">
                          Read More
                          <svg 
                            className="w-4 h-4 transition-transform group-hover:translate-x-1" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </article>

                  {/* Additional Blog Post 3 */}
                  <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative">
                      <img 
                        src="/blog/blog-d-1.jpg" 
                        alt="Driver Management System"
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-yellow-400 text-white px-3 py-1 rounded text-sm font-medium">
                          Blog Details
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          cabscript
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          Sep 12, 2025
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3 hover:text-yellow-500 transition-colors cursor-pointer">
                        Effective Driver Management System
                      </h3>
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                        Discover how to build an effective driver management system that ensures quality service and driver satisfaction in your taxi app.
                      </p>
                      <div className="flex justify-start">
                        <a href="/blog/how-to-get-started-with-uber-clone" className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 group">
                          Read More
                          <svg 
                            className="w-4 h-4 transition-transform group-hover:translate-x-1" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </article>
                </div>
              )}

              {/* See More / See Less Button */}
              <div className="text-center">
                <button 
                  onClick={() => setShowMorePosts(!showMorePosts)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-3 rounded transition-all text-sm shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
                >
                  {showMorePosts ? 'See Less' : 'See More'}
                  <svg 
                    className={`w-4 h-4 transition-transform ${showMorePosts ? 'rotate-180' : ''}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
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