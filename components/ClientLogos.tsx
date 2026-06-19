/**
 * Client Logos Component
 * Displays logos of companies/clients using CabScript
 */

'use client';

import Image from 'next/image';

interface ClientLogosProps {
  title?: string;
  logos?: Array<{ name: string; image: string }>;
}

// Default client logos (replace with real client logos)
const defaultLogos = [
  { name: 'TaxiGo', image: '/logos/client-1.png' },
  { name: 'RideNow', image: '/logos/client-2.png' },
  { name: 'CabPro', image: '/logos/client-3.png' },
  { name: 'QuickRide', image: '/logos/client-4.png' },
  { name: 'UrbanCab', image: '/logos/client-5.png' },
  { name: 'MetroCab', image: '/logos/client-6.png' },
];

export default function ClientLogos({ 
  title = 'Trusted by Leading Ride-Hailing Companies Worldwide',
  logos = defaultLogos 
}: ClientLogosProps) {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {title && (
          <h3 className="text-center text-xl md:text-2xl font-bold text-gray-700 mb-8">
            {title}
          </h3>
        )}
        
        {/* Logo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {logos.map((logo, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow grayscale hover:grayscale-0"
            >
              {/* Placeholder for logos - replace with actual logo images */}
              <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-gray-400">{logo.name}</span>
              </div>
              
              {/* Uncomment when you have actual logo images */}
              {/* <Image
                src={logo.image}
                alt={logo.name}
                width={120}
                height={60}
                className="object-contain"
                onError={(e) => {
                  // Fallback if image not found
                  e.currentTarget.style.display = 'none';
                }}
              /> */}
            </div>
          ))}
        </div>

        {/* Additional trust text */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Join 5,000+ businesses worldwide who trust CabScript for their ride-hailing platform
        </p>
      </div>
    </section>
  );
}
