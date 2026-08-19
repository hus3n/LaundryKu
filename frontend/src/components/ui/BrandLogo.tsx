'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface BrandLogoProps {
  variant?: 'full' | 'icon' | 'header';
  size?: 'sm' | 'md' | 'lg';
  storeName?: string | null;
  storeLogo?: string | null;
  className?: string;
  showSubtitle?: boolean;
}

export default function BrandLogo({
  variant = 'full',
  size = 'md',
  storeName,
  storeLogo,
  className = '',
  showSubtitle = true,
}: BrandLogoProps) {
  const [imageError, setImageError] = useState(false);

  const getFullApiUrl = (path: string) => {
    if (path.startsWith('http')) return path;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
    return `${apiUrl}/${path.replace(/^\//, '')}`;
  };

  // If store has custom uploaded logo and no error loading it
  if (storeLogo && !imageError) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="relative overflow-hidden rounded-xl bg-[#013D66] border border-[#1DA9D0]/25 shadow-md p-0.5 flex items-center justify-center shrink-0 w-10 h-10">
          <img
            src={getFullApiUrl(storeLogo)}
            alt={storeName || 'Logo Toko'}
            onError={() => setImageError(true)}
            className="w-full h-full object-contain rounded-lg"
          />
        </div>
        {variant !== 'icon' && (
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-[#F5EACA] text-base tracking-tight truncate">
              {storeName || 'LaundryKu'}
            </span>
            {showSubtitle && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1DA9D0]/20 text-[#43D5CC] inline-block font-medium w-fit border border-[#1DA9D0]/30">
                Laundry POS
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  // Icon only
  if (variant === 'icon') {
    const iconDimensions = size === 'sm' ? 32 : size === 'lg' ? 48 : 40;
    return (
      <div className={`relative shrink-0 ${className}`}>
        <img
          src="/logo/laundryku-icon.svg"
          alt="LaundryKu Icon"
          width={iconDimensions}
          height={iconDimensions}
          className="rounded-xl shadow-lg shadow-[#1DA9D0]/20 transition-transform duration-200 hover:scale-105"
        />
      </div>
    );
  }

  // Full Logo (Icon + Text)
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative shrink-0">
        <img
          src="/logo/laundryku-icon.svg"
          alt="LaundryKu Icon"
          className={`rounded-xl shadow-lg shadow-[#1DA9D0]/25 transition-transform duration-300 hover:scale-105 ${
            size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10'
          }`}
        />
      </div>
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-[#F5EACA] tracking-tight text-base">
            Laundry<span className="bg-gradient-to-r from-[#43D5CC] to-[#1DA9D0] bg-clip-text text-transparent">Ku</span>
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-[#1DA9D0]/20 text-[#43D5CC] border border-[#1DA9D0]/30">
            v1.0
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] text-[#1DA9D0]/70 font-medium truncate">
            {storeName ? storeName : 'Sistem POS Digital'}
          </span>
        )}
      </div>
    </div>
  );
}
