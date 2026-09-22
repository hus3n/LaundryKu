'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-2.5 py-1.5 text-[11px] rounded-lg gap-1.5',
    md: 'px-4 py-2 text-xs rounded-xl gap-2',
    lg: 'px-5 py-2.5 text-sm rounded-xl gap-2.5',
  };

  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      'bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] text-[#010E1C] font-bold shadow-md shadow-[#1DA9D0]/20 hover:opacity-95',
    secondary:
      'bg-slate-100 dark:bg-[#013D66] text-slate-700 dark:text-[#F5EACA]/90 border border-slate-300 dark:border-[#1DA9D0]/25 hover:bg-slate-200 dark:hover:bg-[#014775] font-semibold',
    danger:
      'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 font-semibold',
    outline:
      'bg-transparent border border-slate-300 dark:border-[#1DA9D0]/30 text-slate-700 dark:text-[#F5EACA] hover:bg-slate-100 dark:hover:bg-[#013D66]/40 font-semibold',
    ghost:
      'bg-transparent text-slate-600 dark:text-[#F5EACA]/70 hover:text-slate-900 dark:hover:text-[#F5EACA] hover:bg-slate-100 dark:hover:bg-[#013D66]/50 font-medium',
  };

  return (
    <motion.button
      whileHover={disabled || isLoading ? undefined : { scale: 1.01, y: -1 }}
      whileTap={disabled || isLoading ? undefined : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center transition-all cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...(props as any)}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </motion.button>
  );
}
