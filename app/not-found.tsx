/**
 * 404 Not Found Page
 * Displayed when a page or route doesn't exist
 */

'use client';

import Link from 'next/link';
import { FaHome, FaSearch, FaArrowLeft, FaQuestionCircle } from 'react-icons/fa';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            {/* 404 Illustration */}
            <div className="mb-8">
              <h1 className="text-9xl md:text-[200px] font-black text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-yellow-600 leading-none">
                404
              </h1>
              <div className="flex items-center justify-center gap-3 mt-4">
                <div className="w-20 h-1 bg-yellow-400 rounded"></div>
                <FaQuestionCircle className="text-yellow-500 text-3xl" />
                <div className="w-20 h-1 bg-yellow-400 rounded"></div>
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Oops! The page you're looking for seems to have taken a detour. 
              Don't worry, we'll help you get back on track.
            </p>
          </div>

          {/* Helpful Links Card */}
          <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Where would you like to go?
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* Home Link */}
              <Link
                href="/"
                className="group p-6 border-2 border-gray-200 rounded-lg hover:border-yellow-400 hover:bg-yellow-50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center group-hover:bg-yellow-400 transition-colors">
                    <FaHome className="text-yellow-600 group-hover:text-white text-xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Homepage</h4>
                    <p className="text-sm text-gray-600">Start fresh from our homepage</p>
                  </div>
                </div>
              </Link>

              {/* Pricing Link */}
              <Link
                href="/#pricing"
                className="group p-6 border-2 border-gray-200 rounded-lg hover:border-yellow-400 hover:bg-yellow-50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center group-hover:bg-yellow-400 transition-colors">
                    <svg className="w-6 h-6 text-yellow-600 group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">View Pricing</h4>
                    <p className="text-sm text-gray-600">Check our taxi script plans</p>
                  </div>
                </div>
              </Link>

              {/* About Link */}
              <Link
                href="/about"
                className="group p-6 border-2 border-gray-200 rounded-lg hover:border-yellow-400 hover:bg-yellow-50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center group-hover:bg-yellow-400 transition-colors">
                    <svg className="w-6 h-6 text-yellow-600 group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">About Us</h4>
                    <p className="text-sm text-gray-600">Learn about CabScript</p>
                  </div>
                </div>
              </Link>

              {/* Contact Link */}
              <Link
                href="/contact"
                className="group p-6 border-2 border-gray-200 rounded-lg hover:border-yellow-400 hover:bg-yellow-50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center group-hover:bg-yellow-400 transition-colors">
                    <svg className="w-6 h-6 text-yellow-600 group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Contact Us</h4>
                    <p className="text-sm text-gray-600">Get in touch with support</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-black border-2 border-black rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              <FaArrowLeft />
              Go Back
            </button>
            
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg"
            >
              <FaHome />
              Return Home
            </Link>
          </div>

          {/* Search Suggestion */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 mb-4">Looking for something specific?</p>
            <div className="max-w-md mx-auto relative">
              <input
                type="text"
                placeholder="Search our site..."
                className="w-full px-6 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const query = (e.target as HTMLInputElement).value;
                    window.location.href = `/?search=${encodeURIComponent(query)}`;
                  }
                }}
              />
              <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
