import React from 'react';
import Link from 'next/link';
import { Smartphone, Download } from 'lucide-react';

interface DownloadAppButtonProps {
  href?: string;
  className?: string;
  variant?: 'primary' | 'outline' | 'banner';
}

export function DownloadAppButton({
  href = '/downloads/laundryku.apk',
  className = '',
  variant = 'primary',
}: DownloadAppButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-[#1DA9D0] focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-[#1DA9D0] text-white hover:bg-[#158cae] px-4 py-2 shadow-sm',
    outline: 'border border-[#1DA9D0] text-[#1DA9D0] hover:bg-[#F5EACA] px-4 py-2',
    banner: 'bg-gradient-to-r from-[#012040] to-[#013D66] text-white p-4 sm:p-6 rounded-xl shadow-lg w-full flex-col sm:flex-row justify-between items-start sm:items-center',
  };

  if (variant === 'banner') {
    return (
      <div className={`${variants.banner} ${className}`}>
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <div className="bg-[#1DA9D0]/20 p-3 rounded-full text-[#43D5CC]">
            <Smartphone size={32} />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-1">Download Aplikasi LaundryKu</h3>
            <p className="text-sm text-[#F5EACA]/80">Kelola laundry lebih mudah dari genggaman Anda (Android).</p>
          </div>
        </div>
        <Link 
          href={href} 
          prefetch={false}
          className={`${baseClasses} bg-[#EA8803] hover:bg-[#c97402] text-white px-6 py-3 whitespace-nowrap`}
          aria-label="Download Aplikasi Android LaundryKu"
        >
          <Download size={20} />
          <span>Download APK</span>
        </Link>
      </div>
    );
  }

  return (
    <Link 
      href={href} 
      prefetch={false}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      aria-label="Download Aplikasi Android LaundryKu"
    >
      <Smartphone size={18} />
      <span>Download Android App</span>
    </Link>
  );
}
