'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, AlertCircle } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import RegisterHeader from './components/RegisterHeader';
import PlanSelector from './components/PlanSelector';
import RegisterFormFields from './components/RegisterFormFields';
import RegisterSuccessModal from './components/RegisterSuccessModal';
import { RegisterFormData, RegisterErrors, PlanType } from './types';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState<RegisterFormData>({
    storeName: '',
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    storeAddress: '',
    planType: 'TRIAL',
    durationMonths: 1,
  });

  const [errors, setErrors] = useState<RegisterErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const handleFieldChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof RegisterErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePlanSelect = (plan: PlanType) => {
    setFormData((prev) => ({ ...prev, planType: plan }));
  };

  const handleDurationChange = (months: number) => {
    setFormData((prev) => ({ ...prev, durationMonths: months }));
  };

  const validateForm = (): boolean => {
    const newErrors: RegisterErrors = {};

    if (!formData.storeName.trim() || formData.storeName.trim().length < 2) {
      newErrors.storeName = 'Nama toko laundry minimal 2 karakter.';
    }

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Nama pengelola minimal 2 karakter.';
    }

    if (!formData.phone.trim() || formData.phone.trim().length < 8) {
      newErrors.phone = 'Nomor WhatsApp tidak valid (minimal 8 digit).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = 'Format alamat email tidak valid.';
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Kata sandi minimal 6 karakter.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Ulangi kata sandi tidak cocok dengan kata sandi.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await register({
        storeName: formData.storeName,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        storeAddress: formData.storeAddress || undefined,
        planType: formData.planType,
        durationMonths: formData.durationMonths,
      });

      setSuccessModalOpen(true);
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        err.message ||
        'Gagal melakukan pendaftaran. Silakan coba kembali.';
      setErrors((prev) => ({ ...prev, general: msg }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueToDashboard = () => {
    setSuccessModalOpen(false);
    router.push('/admin/dashboard');
  };

  return (
    <div className="min-h-screen dark:bg-[#010E1C] bg-slate-100 text-slate-900 dark:text-[#F5EACA] flex items-center justify-center p-2.5 sm:p-6 sm:py-12 relative overflow-hidden transition-colors">
      {/* Top right theme toggle */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl relative z-10 glass-card-dark rounded-2xl sm:rounded-3xl p-3.5 sm:p-10 border border-slate-200 dark:border-[#1DA9D0]/20 shadow-xl"
      >
        <RegisterHeader />

        {errors.general && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-3 sm:mb-6 p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 flex items-start gap-2 text-xs text-rose-700 dark:text-rose-300"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errors.general}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-6">
          {/* Plan Selector */}
          <PlanSelector
            selectedPlan={formData.planType}
            onSelectPlan={handlePlanSelect}
            durationMonths={formData.durationMonths}
            onChangeDuration={handleDurationChange}
          />

          <div className="pt-3 sm:pt-4 border-t border-slate-200 dark:border-[#1DA9D0]/15">
            <h2 className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-[#F5EACA] uppercase tracking-wider mb-2.5 sm:mb-4">
              Informasi Akun & Toko:
            </h2>
            <RegisterFormFields
              formData={formData}
              onChange={handleFieldChange}
              errors={errors}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.01 }}
            className="w-full py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] text-[#010E1C] font-bold text-xs sm:text-sm shadow-lg shadow-[#1DA9D0]/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer transition-colors"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-[#010E1C]/30 border-t-[#010E1C] rounded-full animate-spin" />
            ) : (
              <>
                Daftar & Mulai Sekarang
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </>
            )}
          </motion.button>
        </form>

        {/* Footer links */}
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-5 border-t border-slate-200 dark:border-[#1DA9D0]/15 text-center">
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-[#F5EACA]/60">
            Sudah memiliki akun toko?{' '}
            <Link
              href="/login"
              className="text-[#1DA9D0] dark:text-[#43D5CC] font-bold hover:underline"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Success Modal */}
      <RegisterSuccessModal
        isOpen={successModalOpen}
        storeName={formData.storeName}
        email={formData.email}
        planType={formData.planType}
        durationMonths={formData.durationMonths}
        onContinue={handleContinueToDashboard}
      />
    </div>
  );
}
