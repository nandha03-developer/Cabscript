"use client";
import Image from "next/image";
import { RiFacebookFill, RiLinkedinFill, RiYoutubeFill, RiGithubFill } from "react-icons/ri";
import { useState, useEffect } from "react";
import { trackNewsletterSubscribe } from "@/lib/analytics";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Handle client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle scroll event to show/hide scroll to top button
  useEffect(() => {
    if (!isClient) return;
    
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollTop(scrollTop > 300); // Show button after scrolling 300px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isClient]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || 'Subscription failed. Please try again.' });
        return;
      }

      setMessage({ type: 'success', text: data.message || 'Successfully subscribed!' });
      
      // Track conversion
      trackNewsletterSubscribe();
      
      setEmail("");
      
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
      
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
      console.error('Newsletter subscription error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="text-white">
      {/* ===== Newsletter Section ===== */}
     <section
  className="relative py-20 flex flex-col items-center justify-center overflow-hidden"
  style={{
    backgroundImage: "url('/Contain/subscribe-box-bg-1.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-[#192B44]" />

  <div className="relative z-10 container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8 max-w-7xl">
    {/* Left side */}
    <div className="flex items-center gap-5">
      <div className="relative w-[85px] h-[105px]">
        <Image 
          src="/icons /email-icon-1-1.png" 
          alt="Email Icon" 
          width={85} 
          height={105}
          className="object-contain"
        />
      </div>
      <div>
        <h2 className="text-4xl font-bold leading-tight" style={{ color: "white" }}>
          Subscribe for <br/> Newsletter
        </h2>
        <p className="text-white text-xl mt-2">
          Stay updated with the latest news, updates, and offers
        </p>
      </div>
    </div>

    {/* Right side: Email input */}
      <div className="w-full max-w-lg">
        {/* Feedback Message */}
        {message && (
          <div className={`mb-3 p-3 rounded-md text-sm ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}
        
        <form
          onSubmit={handleSubmit}
          className="relative w-full bg-white rounded-md shadow-md overflow-hidden" 
        >
          {/* Input Field */}
          <input
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
            className="w-full px-6 py-5 pr-44 text-gray-700 placeholder-gray-500 focus:outline-none rounded-md text-base disabled:opacity-50"
          />

          {/* Button inside input field with proper fit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="absolute right-2 top-2 bottom-2 bg-[#FFD300] text-white font-semibold rounded-md px-8 py-2 hover:bg-[#e6be00] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      </div>
    </div>
</section>


      {/* ===== Footer Links Section ===== */}
      <section className="bg-[#091121] py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Company */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-white">
                Company
              </h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="/about"
                    className="relative text-gray-400 hover:text-[#FFD300] transition-colors inline-block after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-[#FFD300] after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/blog"
                    className="relative text-gray-400 hover:text-[#FFD300] transition-colors inline-block after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-[#FFD300] after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="relative text-gray-400 hover:text-[#FFD300] transition-colors inline-block after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-[#FFD300] after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Products */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-white">
                Products
              </h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="/products/adminpanel"
                    className="relative text-gray-400 hover:text-[#FFD300] transition-colors inline-block after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-[#FFD300] after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    Admin Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="/products/customer"
                    className="relative text-gray-400 hover:text-[#FFD300] transition-colors inline-block after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-[#FFD300] after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    Customer
                  </a>
                </li>
                <li>
                  <a
                    href="/products/driver"
                    className="relative text-gray-400 hover:text-[#FFD300] transition-colors inline-block after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-[#FFD300] after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    Driver
                  </a>
                </li>
                <li>
                  <a
                    href="/products/owner"
                    className="relative text-gray-400 hover:text-[#FFD300] transition-colors inline-block after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-[#FFD300] after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    Owner
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-white">
                Resources
              </h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="/docs"
                    className="relative text-gray-400 hover:text-[#FFD300] transition-colors inline-block after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-[#FFD300] after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="/FAQ"
                    className="relative text-gray-400 hover:text-[#FFD300] transition-colors inline-block after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-[#FFD300] after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    FAQs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="relative text-gray-400 hover:text-[#FFD300] transition-colors inline-block after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-[#FFD300] after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    Demo Access
                  </a>
                </li>
                <li>
                  <a
                    href="/changelog"
                    className="relative text-gray-400 hover:text-[#FFD300] transition-colors inline-block after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-[#FFD300] after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    Changelog
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-white">Legal</h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="relative text-gray-400 hover:text-[#FFD300] transition-colors inline-block after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-[#FFD300] after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    className="relative text-gray-400 hover:text-[#FFD300] transition-colors inline-block after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-[#FFD300] after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/refund"
                    className="relative text-gray-400 hover:text-[#FFD300] transition-colors inline-block after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-[#FFD300] after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    Refund Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/cookies"
                    className="relative text-gray-400 hover:text-[#FFD300] transition-colors inline-block after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-[#FFD300] after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    Cookies Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

   {/* ===== Bottom Section ===== */}
<div className="bg-[#091121] relative">
  {/* Full width border line */}
  <div className="container mx-auto px-6 max-w-6xl">
    <div className="h-px bg-[#1c2a44]"></div>
  </div>

  <div className="container mx-auto px-6 py-6 max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4 relative">
    {/* Copyright */}
    <div className="text-center md:text-left">
      <p className="text-gray-400 text-sm">
        © 2025 CabScript.com — A Product of Laabam One Business Solutions (OPC) Pvt. Ltd.
      </p>
      <p className="text-gray-400 text-xs mt-1">
        "Automate your Business with Smart Software"
      </p>
    </div>

    {/* Social Icons */}
    <div className="flex items-center gap-4">
      <a
        href="https://www.facebook.com/LaabamOne/"
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 bg-[#FFD300] rounded-xl flex items-center justify-center hover:bg-[#e6be00] transition-all"
      >
        <RiFacebookFill size={28} className="text-white" />
      </a>
      <a
        href="https://www.linkedin.com/company/laabamone?_l=en_US"
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 bg-[#FFD300] rounded-xl flex items-center justify-center hover:bg-[#e6be00] transition-all"
      >
        <RiLinkedinFill size={28} className="text-white" />
      </a>
      <a
        href="https://www.youtube.com/@laabamone"
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 bg-[#FFD300] rounded-xl flex items-center justify-center hover:bg-[#e6be00] transition-all"
      >
        <RiYoutubeFill size={28} className="text-white" />
      </a>
      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 bg-[#FFD300] rounded-xl flex items-center justify-center hover:bg-[#e6be00] transition-all"
      >
        <RiGithubFill size={28} className="text-white" />
      </a>
    </div>

    {/* Scroll to top - fixed at right bottom - only show when scrolled down */}
    {isClient && showScrollTop && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-[#FFD300] rounded-full flex items-center justify-center hover:bg-[#e6be00] transition-all duration-300 shadow-lg transform hover:scale-110 z-50"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white"
        >
          <path d="m18 15-6-6-6 6" />
        </svg>
      </button>
    )}
  </div>
</div>


   
    </footer>
  );
}
