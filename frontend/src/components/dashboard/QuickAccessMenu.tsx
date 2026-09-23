'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Search } from 'lucide-react';
import { staggerContainer } from '@/lib/animations';
import QuickAccessCard from './QuickAccessCard';
import {
  QuickAccessItem,
  ADMIN_QUICK_ACTIONS,
  SUPERADMIN_QUICK_ACTIONS,
  EMPLOYEE_QUICK_ACTIONS,
} from './quickAccessData';

// Re-export for backward compatibility
export type { QuickAccessItem };
export {
  ADMIN_QUICK_ACTIONS,
  SUPERADMIN_QUICK_ACTIONS,
  EMPLOYEE_QUICK_ACTIONS,
};

interface QuickAccessMenuProps {
  role?: 'ADMIN' | 'SUPERADMIN' | 'EMPLOYEE';
  customItems?: QuickAccessItem[];
  title?: string;
  subtitle?: string;
}

export default function QuickAccessMenu({
  role = 'ADMIN',
  customItems,
  title = 'Akses Cepat Menu',
  subtitle = 'Pintasan langsung ke modul dan fungsi harian toko Anda',
}: QuickAccessMenuProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const defaultItems =
    role === 'SUPERADMIN'
      ? SUPERADMIN_QUICK_ACTIONS
      : role === 'EMPLOYEE'
      ? EMPLOYEE_QUICK_ACTIONS
      : ADMIN_QUICK_ACTIONS;

  const items = customItems || defaultItems;

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.badge && item.badge.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#1DA9D0]/15 dark:bg-[#1DA9D0]/25 border border-[#1DA9D0]/30 flex items-center justify-center text-[#1DA9D0] dark:text-[#43D5CC] shrink-0 shadow-xs">
            <Zap className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-[#F5EACA] flex items-center gap-1.5">
              {title}
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#013D66] text-slate-600 dark:text-[#43D5CC] border border-slate-200 dark:border-[#1DA9D0]/20">
                {filteredItems.length} Pintasan
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#F5EACA]/60">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Filter Input for fast searching */}
        {items.length > 4 && (
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#F5EACA]/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pintasan menu..."
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-[#012040] border border-slate-200 dark:border-[#1DA9D0]/20 text-slate-800 dark:text-[#F5EACA] placeholder:text-slate-400 dark:placeholder:text-[#F5EACA]/40 focus:outline-none focus:border-[#1DA9D0] focus:ring-1 focus:ring-[#1DA9D0]/30 transition-all shadow-xs"
            />
          </div>
        )}
      </div>

      {/* Grid of Quick Access Cards */}
      <motion.div
        variants={staggerContainer(0.04)}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-2 sm:gap-3"
      >
        {filteredItems.map((item) => (
          <QuickAccessCard key={item.id} item={item} />
        ))}
      </motion.div>

      {filteredItems.length === 0 && (
        <div className="p-6 text-center rounded-xl bg-slate-50 dark:bg-[#012040]/50 border border-slate-200 dark:border-[#1DA9D0]/15">
          <p className="text-xs text-slate-500 dark:text-[#F5EACA]/60">
            Tidak ditemukan pintasan menu dengan kata kunci &quot;{searchQuery}&quot;.
          </p>
        </div>
      )}
    </div>
  );
}
