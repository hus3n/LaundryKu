'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glass?: boolean;
}

export default function Card({
  children,
  className = '',
  hoverEffect = false,
  glass = true,
  ...props
}: CardProps) {
  const baseClasses = glass
    ? 'glass-card-dark'
    : 'bg-white dark:bg-[#012040] border border-slate-200 dark:border-[#1DA9D0]/15';

  if (hoverEffect) {
    return (
      <motion.div
        whileHover={{ y: -3, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
        className={`p-3 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm ${baseClasses} ${className}`}
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`p-3 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm ${baseClasses} ${className}`} {...props}>
      {children}
    </div>
  );
}
