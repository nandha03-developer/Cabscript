import Image from "next/image";

const DemoSection = () => {
  return (
    <section className="bg-[#f5f5f5]   py-20">
      
      <div className="max-w-6xl mx-auto px-4">
         {/* Subtitle - Positioned above cards */}
        <div className="flex items-center justify-start gap-2 ">
          <div className="w-10 h-0.5 bg-yellow-400"></div>
          <p className="text-yellow-500 font-medium text-lg">
            Customization Available
          </p>
        </div>

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 text-left">
          Experience the demo,
        </h2>
        <h2 className="text-4xl md:text-5xl  text-yellow-500 mb-12 text-left">
          right now
        </h2>

       
        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 justify-center items-stretch gap-20 md:gap-x-24 md:gap-y-8">
          {/* Admin Panel Card - Removed outer border, image with outer border, left-aligned content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full md:w-[580px] h-[640px] flex flex-col items-start transition-all hover:shadow-2xl hover:scale-105">
            <div className="border-4 border-yellow-400 rounded-sm overflow-hidden mb-8 w-full h-80 shadow-lg">
              <Image
                src="/Contain/Admin panel.png"
                alt="Admin Panel"
                width={580}
                height={320}
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="text-3xl font-bold text-gray-500 mb-4 text-left">
              Admin Panel
            </h3>
            <p className="text-gray-500 mb-8 text-base leading-relaxed text-left">
              A powerful dashboard to manage drivers, riders, payments, and trips with ease.
            </p>
            <a 
              href="https://cabscript-admin.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-8 py-4 rounded-lg transition-all mt-auto text-lg shadow-lg hover:shadow-xl flex items-center gap-3"
            >
              View Admin Demo 
              <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
                <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </a>
          </div>

          {/* Customer App Card - Matching style changes */}
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full md:w-[580px] h-[640px] flex flex-col items-start transition-all hover:shadow-2xl hover:scale-105">
            <div className="border-4 border-yellow-400 rounded-sm overflow-hidden mb-8 w-full h-80 shadow-lg">
              <Image
                src="/Contain/customer.png"
                alt="Customer App"
                width={580}
                height={320}
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="text-3xl font-bold text-gray-500 mb-4 text-left">
              Customer App
            </h3>
            <p className="text-gray-500 mb-8 text-base leading-relaxed text-left">
              Book rides instantly with just a few taps. Track your driver in real-time and enjoy a seamless ride experience.
            </p>
            <a 
              href="https://cabscript-admin.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-8 py-4 rounded-lg transition-all mt-auto text-lg shadow-lg hover:shadow-xl flex items-center gap-3"
            >
              View APK 
              <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
                <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </a>
          </div>

          {/* Driver App Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full md:w-[580px] h-[640px] flex flex-col items-start transition-all hover:shadow-2xl hover:scale-105">
            <div className="border-4 border-yellow-400 rounded-sm overflow-hidden mb-8 w-full h-80 shadow-lg">
              <Image
                src="/Contain/customer.png"
                alt="Driver App"
                width={580}
                height={320}
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="text-3xl font-bold text-gray-500 mb-4 text-left">
              Driver App
            </h3>
            <p className="text-gray-500 mb-8 text-base leading-relaxed text-left">
              Smart tools to boost efficiency and reduce idle time. A reliable app built to support drivers on the go.
            </p>
            <a 
              href="https://cabscript-admin.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-8 py-4 rounded-lg transition-all mt-auto text-lg shadow-lg hover:shadow-xl flex items-center gap-3"
            >
              View APK
              <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
                <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </a>
          </div>

          {/* Owner Panel Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full md:w-[580px] h-[640px] flex flex-col items-start transition-all hover:shadow-2xl hover:scale-105">
            <div className="border-4 border-yellow-400 rounded-sm overflow-hidden mb-8 w-full h-80 shadow-lg">
              <Image
                src="/Contain/customer.png"
                alt="Owner Panel"
                width={580}
                height={320}
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="text-3xl font-bold text-gray-500 mb-4 text-left">
              Owner Panel
            </h3>
            <p className="text-gray-500 mb-8 text-base leading-relaxed text-left">
              Full control over drivers, customers, and business insights. A smart panel designed to simplify decision-making and maximize profits.
            </p>
            <a 
              href="https://cabscript-admin.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-8 py-4 rounded-lg transition-all mt-auto text-lg shadow-lg hover:shadow-xl flex items-center gap-3"
            >
              Open Demo
              <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
                <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
