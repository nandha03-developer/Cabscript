"use client";

import dynamic from 'next/dynamic';

// Dynamically import chat components to reduce initial bundle size
const TawkToChat = dynamic(() => import('./TawkToChat'), {
  ssr: false, // Disable server-side rendering for chat widgets
});

const WhatsAppButton = dynamic(() => import('./WhatsAppButton'), {
  ssr: false,
});

interface ChatSupportProps {
  enableTawkTo?: boolean;
  enableWhatsApp?: boolean;
  whatsAppPosition?: 'bottom-right' | 'bottom-left';
}

/**
 * Unified Chat Support Component
 * 
 * This component manages all customer support chat integrations:
 * - Tawk.to Live Chat (bottom-right, auto-positioned)
 * - WhatsApp Business Button (configurable position)
 * 
 * Usage:
 * Add this component to your root layout for site-wide availability
 * 
 * Environment Variables Required:
 * - NEXT_PUBLIC_TAWKTO_PROPERTY_ID
 * - NEXT_PUBLIC_TAWKTO_WIDGET_ID
 * - NEXT_PUBLIC_WHATSAPP_NUMBER
 */
export default function ChatSupport({ 
  enableTawkTo = true,
  enableWhatsApp = true,
  whatsAppPosition = 'bottom-left' // Position WhatsApp on left to avoid conflicting with Tawk.to on right
}: ChatSupportProps) {
  
  return (
    <>
      {/* Tawk.to Live Chat - appears bottom-right by default */}
      {enableTawkTo && <TawkToChat />}
      
      {/* WhatsApp Business Button - positioned to avoid conflict */}
      {enableWhatsApp && (
        <WhatsAppButton 
          position={whatsAppPosition}
          showTooltip={true}
        />
      )}
    </>
  );
}
