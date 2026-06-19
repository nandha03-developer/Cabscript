"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DemoRequestModal from './DemoRequestModal';

export default function Navigation() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Features', href: '/features' },
    { name: 'Demo', href: '/demo' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Documentation', href: '/docs' },
    { name: 'Contact', href: '/contact' }
  ];
  const [showNavigation, setShowNavigation] = useState(false);
  const pathname = usePathname();

  // Check if current page needs light background
  const isLightPage = ['/privacy', '/terms', '/features','/demo', '/about','/pricing', '/FAQ', '/blog','/docs' , '/refund','/cookies'].includes(pathname);
  
  // Set navigation background and text colors based on page
  const navBgColor = isLightPage ? 'bg-white/95' : 'bg-gray-900/95';
  const textColor = isLightPage ? 'text-gray-900' : 'text-white';
  const hoverColor = isLightPage ? 'hover:text-yellow-600' : 'hover:text-yellow-400';
  const activeColor = isLightPage ? 'text-yellow-600' : 'text-yellow-400';

  // Handle scroll event to show/hide navigation bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowNavigation(scrollTop > 200); // Show navigation after scrolling 200px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Original Navigation - Always visible in its normal position */}
      <nav className="absolute top-0 left-0 right-0 z-10 px-6 pt-4">
        <div className={`max-w-7xl mx-auto ${navBgColor} backdrop-blur-sm px-8 py-4 shadow-lg`}>
          <div className="flex justify-between items-center">
            <ul className="flex gap-12">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className={`text-lg font-bold transition-colors tracking-wide ${
                      pathname === item.href
                        ? activeColor
                        : `${textColor} ${hoverColor}`
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <button 
              onClick={() => setIsDemoModalOpen(true)}
              className="bg-yellow-400 text-white px-6 py-2 rounded-lg font-bold text-base hover:bg-yellow-500 transition-colors flex items-center gap-2 tracking-wide shadow-md"
            >
              Request Demo
              <span className="text-lg">⊕</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Sticky Navigation - Only shows when scrolling - Full width */}
      {showNavigation && (
        <nav className="fixed top-0 left-0 right-0 z-50 w-full animate-in slide-in-from-top duration-300">
          <div className={`w-full ${navBgColor} backdrop-blur-sm px-8 py-4 shadow-lg`}>
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <ul className="flex gap-12">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className={`text-lg font-bold transition-colors tracking-wide ${
                        pathname === item.href
                          ? activeColor
                          : `${textColor} ${hoverColor}`
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                  ))}
              </ul>
              <button 
                onClick={() => setIsDemoModalOpen(true)}
                className="bg-yellow-400 text-white px-6 py-2 rounded-lg font-bold text-base hover:bg-yellow-500 transition-colors flex items-center gap-2 tracking-wide shadow-md"
              >
                Request Demo
                <span className="text-lg">⊕</span>
              </button>
            </div>
          </div>
        </nav>
      )}
      
      {/* Demo Request Modal */}
      <DemoRequestModal 
        isOpen={isDemoModalOpen} 
        onClose={() => setIsDemoModalOpen(false)} 
      />
    </>
  );
}