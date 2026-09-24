"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Smartphone, Download, Sparkles } from 'lucide-react';

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
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium transition-colors rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1DA9D0] focus:ring-offset-2 overflow-hidden relative';
  
  if (variant === 'banner') {
    return (
      <motion.div 
        className={`relative overflow-hidden bg-gradient-to-br from-[#010E1C] via-[#012040] to-[#013D66] border border-[#1DA9D0]/20 text-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full flex-col sm:flex-row justify-between items-start sm:items-center group backdrop-blur-sm flex ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Decorative background elements for Glassmorphism/modern look */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#1DA9D0]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-[#43D5CC]/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6 sm:mb-0 relative z-10 w-full sm:w-auto">
          <motion.div 
            className="bg-gradient-to-br from-[#1DA9D0]/20 to-[#013D66]/40 p-4 rounded-2xl border border-[#1DA9D0]/30 text-[#43D5CC] shadow-[0_0_15px_rgba(29,169,208,0.2)] shrink-0"
            whileHover={{ scale: 1.05, rotate: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Smartphone size={36} strokeWidth={1.5} />
          </motion.div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5 flex items-center gap-2">
              Aplikasi LaundryKu
              <Sparkles size={16} className="text-[#EA8803]" />
            </h3>
            <p className="text-sm sm:text-base text-[#F5EACA]/70 max-w-md leading-relaxed">
              Kelola pesanan, pantau status, dan atur bisnis laundry lebih mudah dari genggaman Anda.
            </p>
          </div>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="relative z-10 w-full sm:w-auto mt-2 sm:mt-0"
        >
          <Link 
            href={href} 
            prefetch={false}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 font-semibold rounded-xl bg-gradient-to-r from-[#EA8803] to-[#d67b02] text-white px-8 py-3.5 shadow-lg hover:shadow-xl hover:shadow-[#EA8803]/20 transition-all focus:outline-none focus:ring-2 focus:ring-[#EA8803] focus:ring-offset-2 focus:ring-offset-[#010E1C] group/btn`}
            aria-label="Download Aplikasi Android LaundryKu"
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <Download size={22} className="group-hover/btn:text-white" />
            </motion.div>
            <span>Download APK</span>
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  const variants = {
    primary: 'bg-gradient-to-r from-[#1DA9D0] to-[#158cae] text-white shadow-md hover:shadow-lg hover:shadow-[#1DA9D0]/20 px-5 py-2.5',
    outline: 'border-2 border-[#1DA9D0]/50 text-[#1DA9D0] hover:bg-[#1DA9D0]/10 hover:border-[#1DA9D0] px-5 py-2.5 backdrop-blur-sm',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="inline-block w-full sm:w-auto"
    >
      <Link 
        href={href} 
        prefetch={false}
        className={`${baseClasses} w-full sm:w-auto ${variants[variant as 'primary' | 'outline']} ${className}`}
        aria-label="Download Aplikasi Android LaundryKu"
      >
        <Smartphone size={18} className="opacity-90" />
        <span>Download Android App</span>
      </Link>
    </motion.div>
  );
}
