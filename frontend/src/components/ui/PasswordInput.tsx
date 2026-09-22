'use client';

import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  showLockIcon?: boolean;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className = '', showLockIcon = false, ...props }, ref) => {
    const [show, setShow] = useState(false);

    return (
      <div className="relative w-full">
        {showLockIcon && (
          <Lock className="w-4 h-4 text-slate-400 dark:text-[#1DA9D0]/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        )}
        <input
          {...props}
          ref={ref}
          type={show ? 'text' : 'password'}
          className={`${className} ${showLockIcon ? 'pl-10' : ''} pr-10`}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow(!show)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-[#F5EACA] p-1 rounded-lg focus:outline-none transition-colors"
          title={show ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
          aria-label={show ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
