'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import ThemeToggle from '@/components/ui/ThemeToggle';
import ResetPasswordHeader from './components/ResetPasswordHeader';
import ResetPasswordForm from './components/ResetPasswordForm';
import ResetPasswordSuccess from './components/ResetPasswordSuccess';

export default function ResetPasswordPage() {
  const params = useParams();
  const token = typeof params?.token === 'string' ? params.token : '';
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <div className="min-h-screen dark:bg-[#010E1C] bg-slate-100 text-slate-900 dark:text-[#F5EACA] flex items-center justify-center p-6 relative overflow-hidden transition-colors">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#1DA9D0]/15 rounded-full blur-[100px] pointer-events-none dark:opacity-100 opacity-50" />

      <div className="w-full max-w-md relative z-10">
        <ResetPasswordHeader />

        <div className="glass-card-dark p-7 sm:p-8 rounded-3xl border dark:border-[#1DA9D0]/15 border-slate-200 shadow-2xl backdrop-blur-2xl">
          {isSuccess ? (
            <ResetPasswordSuccess />
          ) : (
            <ResetPasswordForm token={token} onSuccess={() => setIsSuccess(true)} />
          )}
        </div>
      </div>
    </div>
  );
}
