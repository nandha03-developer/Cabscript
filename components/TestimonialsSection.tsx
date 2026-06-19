"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Brian Mwangi, CEO, SwiftRide Africa",
      review: "CabScript helped us launch our ride-hailing startup in Kenya within a week. The setup team was fast and professional.",
      avatar: "/icons /blog-1-1.jpg"
    },
    {
      name: "Brian Mwangi, CEO, SwiftRide Africa", 
      review: "CabScript helped us launch our ride-hailing startup in Kenya within a week. The setup team was fast and professional.",
      avatar: "/icons /blog-1-1.jpg"
    },
    {
      name: "Brian Mwangi, CEO, SwiftRide Africa",
      review: "CabScript helped us launch our ride-hailing startup in Kenya within a week. The setup team was fast and professional.", 
      avatar: "/icons /blog-1-1.jpg"
    },
    {
      name: "Sarah Johnson, CTO, RideEasy",
      review: "Amazing service and support. The platform was up and running in no time with all the features we needed.",
      avatar: "/icons /blog-1-1.jpg"
    },
    {
      name: "Michael Chen, Founder, QuickCab",
      review: "Professional team with excellent technical expertise. Highly recommend CabScript for anyone starting a ride-hailing business.",
      avatar: "/icons /blog-1-1.jpg"
    }
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-0.5 bg-yellow-400"></div>
            <span className="text-yellow-500 font-medium text-lg">
              Reviews
            </span>
            <div className="w-10 h-0.5 bg-yellow-400"></div>
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Check Our Client's
          </h2>
          <h2 className="text-5xl  mb-8">
            <span className="text-yellow-400">Experiences</span>
          </h2>
        </div>

        {/* Testimonials Swiper */}
        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          slidesPerView={3}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          speed={1000}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 25,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
          className="testimonials-swiper"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                {/* Avatar */}
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center overflow-hidden">
                    {testimonial.avatar && testimonial.avatar !== "/icons/user-avatar.png" ? (
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Name */}
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-4 h-4 text-yellow-400">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-700 text-sm">
                      {testimonial.name}
                    </h3>
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-gray-600 text-center leading-relaxed">
                  {testimonial.review}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TestimonialsSection;