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
    const clean = path.replace(/^\//, '');
    if (typeof window !== 'undefined') {
      return `/${clean}`;
    }
    const apiUrl = process.env.INTERNAL_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://backend:4001';
    return `${apiUrl}/${clean}`;
  };

  // If store has custom uploaded logo and no error loading it
  if (storeLogo && !imageError) {
    return (
      <div className={`flex items-center gap-2 sm:gap-3 min-w-0 ${className}`}>
        <div className={`relative overflow-hidden rounded-xl dark:bg-[#013D66] bg-slate-100 border dark:border-[#1DA9D0]/25 border-slate-200 shadow-md p-0.5 flex items-center justify-center shrink-0 ${
          size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10'
        }`}>
          <img
            src={getFullApiUrl(storeLogo)}
            alt={storeName || 'Logo Toko'}
            onError={() => setImageError(true)}
            className="w-full h-full object-contain rounded-lg"
          />
        </div>
        {variant !== 'icon' && (
          <div className="flex flex-col min-w-0 truncate">
            <span className={`font-bold dark:text-[#F5EACA] text-slate-900 tracking-tight truncate ${
              size === 'sm' ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'
            }`}>
              {storeName || 'LaundryKu'}
            </span>
            {showSubtitle && (
              <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-[#1DA9D0]/20 text-[#43D5CC] dark:text-[#43D5CC] text-teal-700 inline-block font-medium w-fit border border-[#1DA9D0]/30 truncate">
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
          src="/logo/laundryku.png"
          alt="LaundryKu Icon"
          width={iconDimensions}
          height={iconDimensions}
          className="rounded-xl object-contain shadow-lg shadow-[#1DA9D0]/20 transition-transform duration-200 hover:scale-105"
        />
      </div>
    );
  }

  // Full Logo (Icon + Text)
  return (
    <div className={`flex items-center gap-2 sm:gap-3 min-w-0 ${className}`}>
      <div className="relative shrink-0">
        <img
          src="/logo/laundryku.png"
          alt="LaundryKu Icon"
          className={`rounded-xl object-contain shadow-lg shadow-[#1DA9D0]/25 transition-transform duration-300 hover:scale-105 ${
            size === 'sm' ? 'w-7 h-7 sm:w-8 sm:h-8' : size === 'lg' ? 'w-11 h-11 sm:w-12 sm:h-12' : 'w-8 h-8 sm:w-10 sm:h-10'
          }`}
        />
      </div>
      <div className="flex flex-col min-w-0 truncate">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className={`font-extrabold dark:text-[#F5EACA] text-slate-900 tracking-tight truncate ${
            size === 'sm' ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'
          }`}>
            Laundry<span className="text-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#43D5CC] dark:to-[#1DA9D0] dark:bg-clip-text dark:text-transparent">Ku</span>
          </span>
          <span className="text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0.5 rounded font-bold bg-[#1DA9D0]/20 text-[#43D5CC] dark:text-[#43D5CC] text-teal-700 border border-[#1DA9D0]/30 shrink-0">
            v1.0
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[9px] sm:text-[10px] dark:text-[#1DA9D0]/80 text-sky-600 font-medium truncate">
            {storeName ? storeName : 'Sistem POS Digital'}
          </span>
        )}
      </div>
    </div>
  );
}
