"use client";

import { useState } from 'react';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  position?: 'bottom-right' | 'bottom-left';
  showTooltip?: boolean;
}

/**
 * WhatsApp Business Floating Action Button
 * 
 * To set up:
 * 1. Get WhatsApp Business number
 * 2. Add to .env.local:
 *    NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210 (country code + number, no +)
 * 
 * Features:
 * - Direct WhatsApp chat link
 * - Pre-filled message
 * - Customizable position
 * - Tooltip with instructions
 * - Mobile and desktop friendly
 */
export default function WhatsAppButton({ 
  phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210',
  message = 'Hi! I\'m interested in CabScript taxi booking software. Can you help me?',
  position = 'bottom-right',
  showTooltip = true
}: WhatsAppButtonProps) {
  
  const [isTooltipVisible, setIsTooltipVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Encode message for URL
  const encodedMessage = encodeURIComponent(message);
  
  // Create WhatsApp link
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  // Position classes
  const positionClasses = position === 'bottom-right' 
    ? 'right-6 bottom-6' 
    : 'left-6 bottom-6';

  const tooltipPositionClasses = position === 'bottom-right'
    ? 'right-20'
    : 'left-20';

  const handleClick = () => {
    // Track WhatsApp click event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'whatsapp_click', {
        event_category: 'engagement',
        event_label: 'WhatsApp Button Click'
      });
    }
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const closeTooltip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTooltipVisible(false);
  };

  return (
    <div className={`fixed ${positionClasses} z-40 flex items-center gap-4`}>
      {/* Tooltip */}
      {showTooltip && isTooltipVisible && (
        <div 
          className={`absolute ${tooltipPositionClasses} bottom-0 bg-white text-gray-800 px-4 py-3 rounded-lg shadow-lg animate-bounce-subtle max-w-[200px] hidden md:block`}
        >
          <button
            onClick={closeTooltip}
            className="absolute -top-2 -right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-1 transition-colors"
            aria-label="Close tooltip"
          >
            <FaTimes className="w-3 h-3" />
          </button>
          <p className="text-sm font-medium mb-1">Need Help?</p>
          <p className="text-xs text-gray-600">Chat with us on WhatsApp!</p>
          <div className="absolute top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-transparent"
               style={{
                 [position === 'bottom-right' ? 'right' : 'left']: '-8px',
                 [position === 'bottom-right' ? 'borderLeft' : 'borderRight']: '8px solid white'
               }}>
          </div>
        </div>
      )}

      {/* WhatsApp Button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-pulse-slow"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="w-8 h-8" />
        
        {/* Ripple effect */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-20 animate-ping"></span>
        
        {/* Hover tooltip */}
        {isHovered && (
          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1 rounded whitespace-nowrap">
            Chat with us
          </span>
        )}
      </button>
    </div>
  );
}
