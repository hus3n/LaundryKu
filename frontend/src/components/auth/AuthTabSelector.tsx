'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LogIn, Sparkles } from 'lucide-react';

interface AuthTabSelectorProps {
  mode: 'login' | 'register';
  onChangeMode: (mode: 'login' | 'register') => void;
}

export default function AuthTabSelector({ mode, onChangeMode }: AuthTabSelectorProps) {
  return (
    <div className="p-1 sm:p-1.5 rounded-xl bg-slate-100 dark:bg-[#010E1C]/80 border border-slate-200 dark:border-[#1DA9D0]/20 flex items-center mb-5 sm:mb-6 relative">
      <button
        type="button"
        onClick={() => onChangeMode('login')}
        className={`flex-1 relative py-2 sm:py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 z-10 ${
          mode === 'login'
            ? 'text-[#010E1C]'
            : 'text-slate-600 dark:text-[#F5EACA]/70 hover:text-slate-900 dark:hover:text-[#F5EACA]'
        }`}
      >
        {mode === 'login' && (
          <motion.div
            layoutId="auth-tab-active"
            className="absolute inset-0 rounded-lg bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] shadow-md shadow-[#1DA9D0]/25"
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-1.5">
          <LogIn className="w-3.5 h-3.5" />
          Masuk (Login)
        </span>
      </button>

      <button
        type="button"
        onClick={() => onChangeMode('register')}
        className={`flex-1 relative py-2 sm:py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 z-10 ${
          mode === 'register'
            ? 'text-[#010E1C]'
            : 'text-slate-600 dark:text-[#F5EACA]/70 hover:text-slate-900 dark:hover:text-[#F5EACA]'
        }`}
      >
        {mode === 'register' && (
          <motion.div
            layoutId="auth-tab-active"
            className="absolute inset-0 rounded-lg bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] shadow-md shadow-[#1DA9D0]/25"
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Daftar Akun Baru
        </span>
      </button>
    </div>
  );
}
