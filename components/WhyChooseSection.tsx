import Image from "next/image";

const WhyChooseSection = () => {
  return (
    <section className="bg-white py-20">
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
              <div className="bg-yellow-400 text-white px-6 py-8  shadow-lg w-[210px] h-[120px] flex flex-col justify-center items-center">
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

            {/* More About Us Button */}
            <div className="pt-4">
              <a 
                href="/about"
                className="inline-flex bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-8 py-4 rounded-lg transition-all text-lg shadow-lg hover:shadow-xl items-center gap-3"
              >
                More About Us
                <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
                  <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;