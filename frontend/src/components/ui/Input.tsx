'use client';

import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', id, required, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1">
        {label && (
          <label htmlFor={inputId} className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-slate-400 dark:text-[#1DA9D0]/50">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            required={required}
            className={`w-full py-1.5 sm:py-2 rounded-lg sm:rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/40 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0] focus:ring-2 focus:ring-[#1DA9D0]/20 transition-all ${
              leftIcon ? 'pl-9 pr-3 sm:pl-10 sm:pr-4' : 'px-3 sm:px-3.5'
            } ${rightIcon ? 'pr-9 sm:pr-10' : ''} ${
              error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : ''
            } ${className}`}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-[10px] text-rose-500 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-[10px] text-slate-500 dark:text-[#F5EACA]/50">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
