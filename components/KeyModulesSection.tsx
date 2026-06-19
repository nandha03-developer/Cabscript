"use client";

import React from 'react';
import Image from 'next/image';
import { 
  Smartphone, 
  Car, 
  Settings, 
  CreditCard, 
  Monitor, 
  MapPin, 
  DollarSign, 
  Globe, 
  BarChart3 
} from 'lucide-react';

interface ModuleItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ModuleItem: React.FC<ModuleItemProps> = ({ icon, title, description }) => {
  return (
    <div className="flex items-start gap-6 group hover:transform hover:scale-105 transition-all duration-300 p-4 cursor-pointer">
      {/* Icon Container */}
      <div className="shrink-0 w-16 h-16 rounded-lg flex items-center justify-center transition-colors duration-300 bg-transparent">
        <div className="w-12 h-12 text-yellow-500">
          {icon}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1">
        <h3 className="text-xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-300 text-base leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default function KeyModulesSection() {
  const modules = [
    {
      icon: <Image src="/icons /customer.png" alt="Customer App" width={60} height={60} className="object-contain" />,
      title: "Customer App",
      description: "Easy booking, live tracking, fare estimation, and secure payments."
    },
    {
      icon: <Image src="/icons /driver.png" alt="Driver App" width={60} height={60} className="object-contain" />,
      title: "Driver App", 
      description: "Accept rides, navigation, trip history, earnings dashboard."
    },
    {
      icon: <Image src="/icons /admin.png" alt="Admin Panel" width={60} height={60} className="object-contain" />,
      title: "Admin Panel",
      description: "Manage users, rides, payments, commissions, and reports."
    },
    {
      icon: <Image src="/icons /payment.png" alt="Payment Integration" width={60} height={60} className="object-contain" />,
      title: "Payment Integration",
      description: "Razorpay, Stripe and PayPal ready."
    },
    {
      icon: <Image src="/icons /Multi-Platform.png" alt="Multi-Platform" width={60} height={60} className="object-contain" />,
      title: "Multi-Platform",
      description: "Android + iOS apps with modern UI."
    },
    {
      icon: <Image src="/icons /gps-tracking.png" alt="Live GPS Tracking" width={60} height={60} className="object-contain" />,
      title: "Live GPS Tracking",
      description: "Real-time driver-customer route tracking."
    },
    {
      icon: <Image src="/icons /currency.png" alt="Multiple Currency" width={60} height={60} className="object-contain" />,
      title: "Multiple Currency",
      description: "Real-time rates, customer route tracking."
    },
    {
      icon: <Image src="/icons /language.png" alt="Multi Language" width={60} height={60} className="object-contain" />,
      title: "Multi Language",
      description: "Real-time driver-customer route tracking."
    },
    {
      icon: <Image src="/icons /reporting.png" alt="Reports & Analytics" width={60} height={60} className="object-contain" />,
      title: "Reports & Analytics",
      description: "Trips, revenue, commissions, and performance dashboards."
    }
  ];  return (
    <section className="py-20 bg-slate-800 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/service-bg-1-1.png"
          alt="Background"
          fill
          className="object-cover opacity-60"
          quality={75}
        />
      </div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-yellow-500 rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 border-2 border-yellow-500 rounded-full"></div>
        <div className="absolute bottom-20 left-32 w-12 h-12 border-2 border-yellow-500 rounded-full"></div>
        <div className="absolute bottom-40 right-10 w-24 h-24 border-2 border-yellow-500 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-8 h-8 border-2 border-yellow-500 rounded-full"></div>
        <div className="absolute top-1/3 right-1/3 w-14 h-14 border-2 border-yellow-500 rounded-full"></div>
        
        {/* Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgb(251, 191, 36)" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-yellow-500/20 px-4 py-2 rounded-full mb-6">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-yellow-500 font-semibold text-sm">Key Modules</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            A quick overview of the core modules that
            <br />
            <span className="text-yellow-500">power our solution.</span>
          </h2>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {modules.map((module, index) => (
            <ModuleItem
              key={index}
              icon={module.icon}
              title={module.title}
              description={module.description}
            />
          ))}
        </div>

      </div>
    </section>
  );
}