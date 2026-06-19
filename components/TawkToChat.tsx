"use client";

import { useEffect } from "react";

interface TawkToWidgetProps {
  propertyId?: string;
  widgetId?: string;
}

/**
 * Tawk.to Live Chat Widget Component
 *
 * To set up:
 * 1. Sign up at https://www.tawk.to (FREE)
 * 2. Create a property and get your Property ID and Widget ID
 * 3. Add to .env.local:
 *    NEXT_PUBLIC_TAWKTO_PROPERTY_ID=your_property_id
 *    NEXT_PUBLIC_TAWKTO_WIDGET_ID=your_widget_id
 *
 * Features:
 * - Live chat with customers
 * - Offline message collection
 * - Mobile app for agents
 * - Chat history
 * - Visitor monitoring
 * - Free forever plan
 */
function TawkToChat({
  propertyId = process.env.NEXT_PUBLIC_TAWKTO_PROPERTY_ID,
  widgetId = process.env.NEXT_PUBLIC_TAWKTO_WIDGET_ID,
}: TawkToWidgetProps) {
  useEffect(() => {
    // Only load Tawk.to if IDs are provided
    if (!propertyId || !widgetId) {
      console.warn("Tawk.to: Property ID or Widget ID not configured");
      return;
    }

    // Check if Tawk.to is already loaded
    if ((window as any).Tawk_API) {
      return;
    }

    // Load Tawk.to script
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    // Add script to document
    try {
      document.body.appendChild(script);
    } catch (error) {
      console.error("Error appending Tawk.to script:", error);
    }

    // Cleanup function
    return () => {
      // Remove Tawk.to when component unmounts
      if ((window as any).Tawk_API) {
        try {
          (window as any).Tawk_API.hideWidget();
        } catch (error) {
          console.error("Error hiding Tawk.to widget:", error);
        }
      }
    };
  }, [propertyId, widgetId]);

  // This component doesn't render anything visible
  // The Tawk.to widget appears automatically
  return null;
}

export default TawkToChat;

// TypeScript declarations for Tawk.to API
declare global {
  interface Window {
    Tawk_API?: {
      hideWidget: () => void;
      showWidget: () => void;
      maximize: () => void;
      minimize: () => void;
      toggle: () => void;
      onLoad?: () => void;
      setAttributes?: (
        attributes: Record<string, string>,
        callback?: (error: Error | null) => void
      ) => void;
    };
    Tawk_LoadStart?: Date;
  }
}
