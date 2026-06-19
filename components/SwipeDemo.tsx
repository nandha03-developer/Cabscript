"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const OurProjects = () => {
  const projects = [
    { image: "/project/Booking_Successful.png", name: "Booking Successful" },
    { image: "/project/Home_ChooseRide.png", name: "Choose Ride" },
    { image: "/project/Home_Screen.png", name: "Home Screen" },
    { image: "/project/Live Tracking.png", name: "Live Tracking" },
    { image: "/project/login-screen.png", name: "Login Screen" },
    { image: "/project/Notification&Offers.png", name: "Notifications & Offers" },
    { image: "/project/Ride Information.png", name: "Ride Information" },
    { image: "/project/Ride Information.png", name: "Ride Details" },
  ];

  return (
    <section className="bg-white py-20">
         {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-evenly mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-0.5 bg-yellow-400"></div>
              <span className="text-yellow-500 font-medium text-lg">
                Taxi Booking Script
              </span>
            </div>
            <h2 className="text-4xl font-extrabold text-black">
              Our <span className="text-black">Projects</span>
            </h2>
          </div>
          <p className="text-gray-500 max-w-xl mt-4 md:mt-0 leading-relaxed text-center md:text-left">
            Uber Clone is a ready-to-launch ride-hailing app solution that has
            all the essential features and functionalities of a taxi booking
            platform.
          </p>
        </div>
      <div className="max-w-8xl mx-auto px-6">
       

        {/* Swiper Section */}
        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={6}
          loop={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          speed={1000}
          className="cursor-grab"
        >
          {projects.map((project, index) => (
            <SwiperSlide key={index}>
              <div
                className="relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 group"
                style={{
                  width: "260px",
                  height: "500px",
                }}
              >
                <Image
                  src={project.image}
                  alt={project.name}
                  width={260}
                  height={500}
                  className="object-cover w-full h-full"
                />
                {/* Card Name Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-yellow-400 p-6 py-8 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                  <h3 className="text-white font-bold text-xl">{project.name}</h3>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default OurProjects;
