'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({ className = '', showLabel = false }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      title={isDark ? 'Beralih ke Tema Terang (☀️)' : 'Beralih ke Tema Gelap (🌙)'}
      aria-label={isDark ? 'Beralih ke Tema Terang' : 'Beralih ke Tema Gelap'}
      className={`relative inline-flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg sm:rounded-xl border shrink-0 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1DA9D0]/30 ${
        isDark
          ? 'bg-[#013D66] border-[#1DA9D0]/25 text-[#F5EACA] hover:bg-[#014775]'
          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.18 }}
            >
              <Moon className="w-4 h-4 text-[#43D5CC]" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, opacity: 0, scale: 0.7 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.18 }}
            >
              <Sun className="w-4 h-4 text-amber-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showLabel && (
        <span className="text-xs font-semibold">
          {isDark ? 'Tema Gelap' : 'Tema Terang'}
        </span>
      )}
    </motion.button>
  );
}
