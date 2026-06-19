import React from 'react';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[600px] h-screen max-h-[800px]">
      {/* Background Image */}
      <div className="absolute inset-0 mt-[-4%]">
        <Image
          src="/slider-bg-1-1.jpg"
          alt="Background"
          fill
          className="object-contain object-center"
          priority
          sizes="100vw"
        />
      </div>

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto px-6 h-full flex items-center justify-between pt-20">
        {/* Left Content */}
        <div className="max-w-3xl z-10 -mt-20">
          <div className="bg-white/95 backdrop-blur-sm p-8 py-10 rounded-lg shadow-lg relative">
            {/* Bold Vertical Line */}
            <div className="absolute left-0 top-0 bottom-0 w-3 bg-yellow-500 rounded-l-lg"></div>
            
            <div className="text-yellow-500 font-semibold mb-4 text-base">
              — Cab Script
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
              Launch Your Own Uber-Like Taxi Business in 7 Days — No Monthly Fees
            </h1>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Full Source Code • Admin Dashboard • Driver & Customer Apps • Pay Once, Own Forever
            </p>
            <a 
              href="https://cabscript-admin.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-300 shadow-lg"
            >
              View Live Demo →
            </a>
          </div>
        </div>

        {/* Right Content - Mobile App Images */}
        {/* <div className="hidden lg:flex items-center justify-center flex-1 max-w-md">
          <div className="relative w-full h-[500px]">
            <Image
              src="/mobile-apps-preview.png"
              alt="Mobile Apps Preview"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div> */}
      </div>
    </section>
  );
}
