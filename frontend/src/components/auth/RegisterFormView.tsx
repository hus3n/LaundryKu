'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, AlertCircle } from 'lucide-react';
import PlanSelector from '@/app/register/components/PlanSelector';
import RegisterFormFields from '@/app/register/components/RegisterFormFields';
import { RegisterFormData, RegisterErrors, PlanType } from '@/app/register/types';

interface RegisterFormViewProps {
  formData: RegisterFormData;
  errors: RegisterErrors;
  isSubmitting: boolean;
  onFieldChange: (field: keyof RegisterFormData, value: string) => void;
  onPlanSelect: (plan: PlanType) => void;
  onDurationChange: (months: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSwitchToLogin: () => void;
}

export default function RegisterFormView({
  formData,
  errors,
  isSubmitting,
  onFieldChange,
  onPlanSelect,
  onDurationChange,
  onSubmit,
  onSwitchToLogin,
}: RegisterFormViewProps) {
  return (
    <motion.div
      key="auth-register-view"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.22, ease: 'easeInOut' }}
      className="space-y-4 max-h-[70vh] overflow-y-auto pr-1"
    >
      {errors.general && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 flex items-start gap-2 text-xs text-rose-700 dark:text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errors.general}</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Plan Selector */}
        <PlanSelector
          selectedPlan={formData.planType}
          onSelectPlan={onPlanSelect}
          durationMonths={formData.durationMonths}
          onChangeDuration={onDurationChange}
        />

        <div className="pt-3 border-t border-slate-200 dark:border-[#1DA9D0]/15">
          <h2 className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-[#F5EACA] uppercase tracking-wider mb-3">
            Informasi Akun & Toko:
          </h2>
          <RegisterFormFields
            formData={formData}
            onChange={onFieldChange}
            errors={errors}
            isSubmitting={isSubmitting}
          />
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.01 }}
          className="w-full py-2.5 sm:py-3.5 rounded-xl bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] text-[#010E1C] font-bold text-xs sm:text-sm shadow-lg shadow-[#1DA9D0]/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer transition-colors"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-[#010E1C]/30 border-t-[#010E1C] rounded-full animate-spin" />
          ) : (
            <>
              Daftar & Mulai Sekarang
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </form>

      {/* Bottom Switch Link */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-[#1DA9D0]/15 text-center">
        <p className="text-[11px] sm:text-xs text-slate-600 dark:text-[#F5EACA]/70">
          Sudah memiliki akun toko?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-[#1DA9D0] dark:text-[#43D5CC] font-bold hover:underline cursor-pointer ml-1"
          >
            Masuk di sini
          </button>
        </p>
      </div>
    </motion.div>
  );
}
