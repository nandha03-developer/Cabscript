import React from 'react';
import Image from 'next/image';

const HowItWorksSection = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Subtitle */}
        <div className="flex items-center justify-start gap-2 mb-4">
          <div className="w-10 h-0.5 bg-yellow-400"></div>
          <p className="text-yellow-500 font-medium text-lg">How it Works</p>
        </div>

        {/* Main heading */}
        <div className="text-left mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Start Your Ride-Hailing
          </h2>
          <h2 className="text-4xl md:text-5xl text-yellow-500">
            Business in 3 Simple Steps
          </h2>
        </div>

        {/* Steps Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl border border-[#bebebe] p-8 h-[260px] w-full max-w-sm flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
            <div>
              <div className="mb-6">
                <div className="w-16 h-16 rounded-lg flex items-center justify-center">
                  <Image
                    src="/icons /script.png"
                    alt="Script icon"
                    width={70}
                    height={70}
                    className="object-contain"
                  />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">Buy the Script</h3>
              <p className="text-gray-600 leading-relaxed">
                Purchase once — you'll own 100% source code.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl border border-[#bebebe] p-8 h-[260px] w-full max-w-sm flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
            <div>
              <div className="mb-6">
                <div className="w-16 h-16 rounded-lg flex items-center justify-center">
                  <Image
                    src="/icons /development.png"
                    alt="Development icon"
                    width={70}
                    height={70}
                    className="object-contain"
                  />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">We Deploy for You</h3>
              <p className="text-gray-600 leading-relaxed">
                Our team installs the system on your server within 3 days.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl border border-[#bebebe] p-8 h-[260px] w-full max-w-sm flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
            <div>
              <div className="mb-6">
                <div className="w-16 h-16 rounded-lg flex items-center justify-center">
                  <Image
                    src="/icons /earn.png"
                    alt="Earn icon"
                    width={70}
                    height={70}
                    className="object-contain"
                  />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">Go Live & Earn</h3>
              <p className="text-gray-600 leading-relaxed">
                Launch your app and start accepting bookings immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
