import React from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = generateSEOMetadata({
  title: 'About Us - Leading Taxi Script Provider',
  description: 'Learn about CabScript.com - your trusted partner for white-label taxi booking solutions. We provide ready-to-deploy Uber clone scripts with full source code and lifetime support.',
  keywords: ['taxi script company', 'ride hailing solution provider', 'uber clone developer'],
  url: '/about',
});

export default function AboutPage() {
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
        
        {/* About Us Content */}
       <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-16 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-black/30 backdrop-blur-md rounded-2xl px-8 py-6 inline-block">
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  ABOUT US
                </h1>
              </div>
            </div>
          </section>

          {/* About Company Section */}
          <section className= "bg-gray-50 py-16 px-4 md:px-8">
            <div className="max-w-6xl mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                {/* Left side - Images */}
                <div className="relative flex gap-6">
                  {/* Main person image */}
                  <div className="relative shrink-0">
                    <Image
                      src="/Contain/about-1-1.png"
                      alt="Business person"
                      width={300}
                      height={320}
                      className="object-cover"
                    />
                  </div>
                  
                  {/* Projects counter card - positioned at top right with same height */}
                  <div className="flex flex-col justify-start">
                    <div className="bg-yellow-400 text-white px-6 py-8 shadow-lg w-[210px] h-[120px] flex flex-col justify-center items-center">
                      <div className="text-3xl font-bold mb-1">25</div>
                      <div className="text-sm font-medium text-center leading-tight">Finished Projects</div>
                    </div>
                  </div>

                  {/* Taxi illustration */}
                  <div className="absolute -bottom-14 -right-6 z-10">
                    <Image
                      src="/Contain/about-1-2.png"
                      alt="Taxi app illustration"
                      width={300}
                      height={380}
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Right side - Content */}
                <div className="space-y-8 pt-0">
                  {/* Subtitle */}
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-0.5 bg-yellow-400"></div>
                    <p className="text-yellow-500 font-medium text-lg">
                      About Company
                    </p>
                  </div>

                  {/* Main heading */}
                  <div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                      Why Choose
                    </h2>
                    <h2 className="text-4xl md:text-5xl text-yellow-500">
                      Our Uber Clone App?
                    </h2>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Set up your taxi business with our 100% whitelabel uber clone app solution. The complete tech solution consist of Android and iOS apps for both driver and passenger with admin dashboard for managing the system. Start your cab business like uber, bolt, indrive, etc with best uber clone script from Cabscript.
                  </p>

                  {/* Feature items */}
                  <div className="space-y-6">
                    {/* 12+ Years Experience */}
                    <div className="flex items-start gap-4">
                      <div className="bg-yellow-100 p-3 rounded-full shrink-0">
                        <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          12+ Years Of Experience
                        </h3>
                        <p className="text-gray-600">
                          With over 8 years of proven expertise in app development, we've successfully delivered a wide range of taxi app projects. Our experience ensures a tailored solution that perfectly matches your business needs.
                        </p>
                      </div>
                    </div>

                    {/* Highly Qualified Developers */}
                    <div className="flex items-start gap-4">
                      <div className="bg-yellow-100 p-3 rounded-full shrink-0">
                        <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          Highly Qualified Developers
                        </h3>
                        <p className="text-gray-600">
                          Our team comprises highly qualified and experienced developers who are passionate about building cutting-edge and user-friendly applications.
                        </p>
                      </div>
                    </div>
                  </div>

              
                </div>
              </div>
            </div>
          </section>

          {/* Team Enhancement Section - White Background Overlay */}
          <section className="py-16 bg-gray-50 relative">
            <div className="container mx-auto px-6">
              {/* Header Section */}
              <div className="text-left mb-12 max-w-6xl mx-auto">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-0.5 bg-yellow-400"></div>
                  <p className="text-yellow-500 font-medium text-lg">
                    Mission & Vision
                  </p>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  Enhancing Team
                </h2>
                <h2 className="text-4xl md:text-5xl  text-yellow-500">
                  Collaboration
                </h2>
              </div>

              <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
                {/* Mission */}
                <div className="bg-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    To empower businesses with cutting-edge technology solutions that drive 
                    growth and efficiency. We strive to make taxi app development accessible 
                    to everyone with our comprehensive and affordable solutions.
                  </p>
                </div>

                {/* Vision */}
                <div className="bg-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    To become the leading provider of transportation technology solutions 
                    globally, enabling businesses worldwide to launch and scale their 
                    ride-hailing services successfully.
                  </p>
                </div>

                {/* Values */}
                <div className="bg-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Our Values</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    Innovation, reliability, and customer success drive everything we do. 
                    We believe in delivering high-quality products with exceptional support 
                    to help our clients achieve their business goals.
                  </p>
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