import React from 'react';
import Image from 'next/image';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Header() {
  return (
    <header className= "py-6 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/logo-dark.png"
            alt="CabScript Logo"
            width={180}
            height={60}
            className="h-11 w-auto object-contain "
            priority
            quality={100}
            unoptimized
          />
        </div>

        {/* Contact Info */}
        <div className="flex gap-12 items-center py-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center">
              <Phone className="text-yellow-400" size={28} />
            </div>
            <div className="flex flex-col justify-center py-1">
              <p className="text-base font-bold text-gray-800 leading-tight">
                Call Us: +91 93619 31050
              </p>
              <p className="text-sm font-medium text-gray-600 leading-tight">Email: support@cabscript.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center">
              <MapPin className="text-yellow-400" size={28} />
            </div>
            <div className="flex flex-col justify-center py-1">
              <p className="text-base font-bold text-gray-800 leading-tight">
                Madurai, Tamil Nadu, India
              </p>
              <p className="text-sm font-medium text-gray-600 leading-tight">Mon–Sat, 9 AM–8 PM IST</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
