"use client";
import React from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Image from "next/image";

// Blog data
const blogData = {
  "how-to-get-started-with-uber-clone": {
    id: 1,
    title: "How to Get Started with our Uber Clone?",
    content: `Getting started with our Uber Clone is quick and hassle-free. Whether you're launching a new taxi business or upgrading your existing one, our ready-made solution gives you everything you need to go live faster. With user-friendly apps for customers, drivers, and powerful panels for admins and owners, you'll have a complete ecosystem designed to simplify operations and maximize efficiency.

All it takes is a simple onboarding process where we tailor the app to match your brand, integrate payment gateways, and set up key features. From there, you'll be ready to launch your taxi business in no time. Our dedicated support team ensures a smooth setup, training, and post-launch assistance—so you can focus on growing your business while we handle the tech.

Our Uber Clone is built with scalability in mind, meaning you can start small and expand as your business grows. From adding more drivers and regions to integrating advanced features like loyalty programs or surge pricing, the platform adapts to your evolving needs. You'll always have the flexibility to upgrade without rebuilding from scratch.

We also provide ongoing maintenance, updates, and technical support to keep your app running smoothly. With our expertise and 8+ years of experience in taxi app development, you can be confident that you're not just getting an app—you're partnering with a team committed to your long-term success.`,
    image: "/blog/blog-1-2.jpg",
    date: "Sep 23, 2025",
    author: "cabscript",
    category: "Uber Clone",
    tags: ["Uber Clone", "Service", "Corporate"],
    excerpt: "Getting started with our Uber Clone is quick and hassle-free. Whether you're launching a new taxi business or upgrading your existing one, our ready-made solution gives you everything you need to go live faster."
  },
  "advanced-taxi-app-features": {
    id: 2,
    title: "Advanced Features for Your Taxi Booking App",
    content: `In today's competitive ride-hailing market, having advanced features can set your taxi app apart from the competition. Our Uber clone comes packed with cutting-edge features designed to enhance user experience and streamline operations.

Real-time tracking is at the heart of modern taxi apps. Passengers can track their ride in real-time, see driver location, and get accurate arrival estimates. This transparency builds trust and improves the overall user experience.

Advanced payment integration supports multiple payment methods including credit cards, digital wallets, and even cryptocurrency. This flexibility ensures that customers can pay using their preferred method, reducing booking abandonment rates.

Smart route optimization uses AI to find the most efficient routes, reducing travel time and fuel costs. This not only improves customer satisfaction but also increases driver earnings by enabling more trips per hour.`,
    image: "/blog/blog-1-3.jpg",
    date: "Sep 18, 2025",
    author: "cabscript",
    category: "Technology",
    tags: ["Taxi App", "Features", "Innovation"],
    excerpt: "Explore advanced features that can make your taxi booking app stand out from the competition and provide exceptional user experience."
  },
  "marketing-strategies-taxi-apps": {
    id: 3,
    title: "Marketing Strategies for Taxi Apps",
    content: `Marketing your taxi app effectively requires a multi-channel approach that targets both riders and drivers. Success in the ride-hailing industry depends not just on having a great app, but on building a strong brand presence and user base.

Social media marketing plays a crucial role in building awareness. Platforms like Facebook, Instagram, and Twitter allow you to engage with potential customers, share updates, and build community around your brand.

Referral programs are particularly effective in the taxi industry. Both riders and drivers benefit from referring new users, creating a viral growth mechanism. Offering ride credits or cash bonuses for successful referrals can quickly expand your user base.

Local partnerships with businesses, hotels, and event organizers can provide steady streams of customers. Corporate partnerships for employee transportation needs can also provide reliable revenue streams.`,
    image: "/blog/blog-1-4.jpg",
    date: "Sep 15, 2025",
    author: "cabscript",
    category: "Marketing",
    tags: ["Marketing", "Business", "Growth"],
    excerpt: "Learn effective marketing strategies to promote your taxi booking app and attract more customers to your ride-hailing business."
  }
};

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  // Get blog post data
  const post = blogData[slug as keyof typeof blogData] || blogData["how-to-get-started-with-uber-clone"];

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
        
        {/* Blog Detail Content */}
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-16 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-black/30 backdrop-blur-md rounded-2xl px-8 py-6 inline-block">
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  BLOG DETAILS
                </h1>
              </div>
            </div>
          </section>

          {/* Blog Content Section */}
          <section className="bg-gray-50 py-10">
            {/* Main container */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-4 ">
              
              {/* Left - Blog Content */}
              <div className="md:col-span-2">
                {/* Top Tag */}
                <div className="mb-2">
                  <span className="bg-yellow-400 text-xs px-3 py-1 rounded font-semibold text-white">
                    {post.category}
                  </span>
                </div>

                {/* Top Image - Reduced Height */}
                <Image
                  src={post.image}
                  alt={post.title}
                  width={1000}
                  height={100}
                  className="rounded-xl  object-contain mb-5 h-[60vh] w-[100vh]"
                />

                {/* Blog Meta Info */}
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    {post.author}
                  </span>
                  <span>•</span>
                  <span>{post.date}</span>
                </div>

                {/* Title */}
                <h1 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
                  {post.title}
                </h1>

                {/* Content Paragraphs */}
                <div className="space-y-4 mb-5">
                  {post.content.split('\n\n').slice(0, 2).map((paragraph, index) => (
                    <p key={index} className="text-gray-700 text-[18px] leading-relaxed " style={{textAlign: 'justify'}}>
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Inline Image with Text beside */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-5">
                  <div className="flex items-center justify-center">
                    <Image
                      src="/blog/blog-d-1.jpg"
                      alt="Taxi app on phone"
                      width={200}
                      height={200}
                      className="object-contain w-[400px] h-[211px]"
                    />
                  </div>
                  <div className="flex items-start">
                    <p className="text-gray-700 text-[18px] leading-relaxed" style={{textAlign: 'justify'}}>
                      {post.content.split('\n\n')[2] || "Our Uber Clone is built with scalability in mind, meaning you can start small and expand as your business grows. From adding more drivers and regions to integrating advanced features like loyalty programs or surge pricing, the platform adapts to your evolving needs. You'll always have the flexibility to upgrade without rebuilding from scratch."}
                    </p>
                  </div>
                </div>

                {/* Final Paragraph */}
                <p className="text-gray-700 text-[18px] leading-relaxed mb-4" style={{textAlign: 'justify'}}>
                  {post.content.split('\n\n')[3] || "We also provide ongoing maintenance, updates, and technical support to keep your app running smoothly. With our expertise and 8+ years of experience in taxi app development, you can be confident that you're not just getting an app—you're partnering with a team committed to your long-term success."}
                </p>

                {/* Tags and Social Sharing */}
                <div className="mt-6 border-t border-gray-200 pt-3 flex items-center justify-between">
                  <div className="text-[18px]">
                    <span className="font-semibold text-gray-800">Tags:</span>
                    <span className="ml-2">
                      {post.tags.map((tag, index) => (
                        <span key={index}>
                          <span className="text-gray-500 hover:text-yellow-500 cursor-pointer transition-colors">
                            {tag}
                          </span>
                          {index < post.tags.length - 1 && ", "}
                        </span>
                      ))}
                    </span>
                  </div>
                  
                  {/* Social Share Buttons */}
                  <div className="flex items-center gap-3">
                    <button className="w-8 h-8 bg-black hover:bg-yellow-500 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </button>
                    <button className="w-8 h-8 bg-black hover:bg-yellow-500 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer" >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </button>
                    <button className="w-8 h-8 bg-black hover:bg-yellow-500 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right - Sidebar */}
              <div style={{marginTop:"9%"}}>
                {/* Search Box */}
                <div className="bg-[#2c3e50]  shadow-sm p-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search Here..."
                      className="w-full bg-[#2c3e50] text-white placeholder-white border-none pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-lg"
                    />
                    <button className="absolute right-3 top-3 text-yellow-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Categories */}
                <div className="p-6 mb-6">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800">Categories</h2>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-gray-500 hover:text-gray-700 cursor-pointer">
                      <span className="w-2 h-2 bg-gray-400 rounded-full"></span> 
                      <span className="text-sm">Taxi App Script</span>
                    </li>
                    <li className="flex items-center gap-3 text-gray-500 hover:text-gray-700 cursor-pointer">
                      <span className="w-2 h-2 bg-gray-400 rounded-full"></span> 
                      <span className="text-sm">POS Software</span>
                    </li>
                    <li className="flex items-center gap-3 text-gray-500 hover:text-gray-700 cursor-pointer">
                      <span className="w-2 h-2 bg-gray-400 rounded-full"></span> 
                      <span className="text-sm">ERP System</span>
                    </li>
                    <li className="flex items-center gap-3 text-yellow-500 cursor-pointer">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span> 
                      <span className="text-sm font-medium">CRM Tools</span>
                    </li>
                  </ul>
                </div>

                {/* Tags */}
                <div className=" p-6">
                  <h2 className="text-lg font-extrabold mb-4 text-black">Tags</h2>
                  <div className="text-[18px] leading-relaxed">
                    <span className="text-gray-500 hover:text-yellow-500 cursor-pointer transition-colors">Uber clone,</span>&nbsp;&nbsp;
                    <span className="text-gray-500 hover:text-yellow-500 cursor-pointer transition-colors">Taxi app,</span>&nbsp;&nbsp;
                    <span className="text-gray-500 hover:text-yellow-500 cursor-pointer transition-colors">Car rental app,</span><br/>
                    <span className="text-gray-500 hover:text-yellow-500 cursor-pointer transition-colors">Rental business ideas,</span>&nbsp;&nbsp;
                    <span className="text-gray-500 hover:text-yellow-500 cursor-pointer transition-colors">Taxi booking,</span><br/>
                    <span className="text-gray-500 hover:text-yellow-500 cursor-pointer transition-colors">Car rental script,</span>&nbsp;&nbsp;
                    <span className="text-gray-500 hover:text-yellow-500 cursor-pointer transition-colors">Readymade app</span>
                  </div>
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