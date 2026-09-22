'use client';

import React, { forwardRef } from 'react';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: SelectOption[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, children, className = '', id, required, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1">
        {label && (
          <label htmlFor={selectId} className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}

        <select
          ref={ref}
          id={selectId}
          required={required}
          className={`w-full px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 focus:outline-none focus:border-[#1DA9D0] focus:ring-2 focus:ring-[#1DA9D0]/20 transition-all ${
            error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : ''
          } ${className}`}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className="dark:bg-[#012040] dark:text-[#F5EACA] bg-white text-slate-900"
                >
                  {opt.label}
                </option>
              ))
            : children}
        </select>

        {error && <p className="text-[10px] text-rose-500 font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
