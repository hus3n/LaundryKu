'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { slideUp } from '@/lib/animations';
import type { QuickAccessItem } from './quickAccessData';

interface QuickAccessCardProps {
  item: QuickAccessItem;
}

export default function QuickAccessCard({ item }: QuickAccessCardProps) {
  const Icon = item.icon;

  return (
    <motion.div
      variants={slideUp}
      whileHover={{ y: -3, scale: 1.02, transition: { duration: 0.18 } }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        href={item.href}
        className={`group flex flex-col justify-between h-full p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white dark:bg-[#012040]/90 border border-slate-200/90 dark:border-[#1DA9D0]/15 ${item.colorClass.hoverBorder} shadow-xs hover:shadow-md ${item.colorClass.glow} transition-all relative overflow-hidden`}
      >
        {/* Highlight Glow Effect */}
        {item.highlight && (
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#1DA9D0]/10 rounded-full blur-xl pointer-events-none -mr-4 -mt-4" />
        )}

        {/* Top Row: Icon and Badge / Arrow */}
        <div className="flex items-start justify-between gap-1.5 mb-2 sm:mb-2.5">
          <div
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl ${item.colorClass.bg} border ${item.colorClass.border} flex items-center justify-center ${item.colorClass.text} shrink-0 transition-transform duration-200 group-hover:scale-105`}
          >
            <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </div>

          <div className="flex items-center gap-1">
            {item.badge && (
              <span className="text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded-md bg-[#1DA9D0]/15 dark:bg-[#1DA9D0]/25 text-sky-800 dark:text-[#43D5CC] border border-[#1DA9D0]/30 uppercase tracking-wider">
                {item.badge}
              </span>
            )}
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 dark:text-[#F5EACA]/30 group-hover:text-slate-700 dark:group-hover:text-[#43D5CC] transition-colors" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-0.5">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-[#F5EACA] leading-snug group-hover:text-[#1DA9D0] dark:group-hover:text-[#43D5CC] transition-colors">
            {item.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-[#F5EACA]/60 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
