'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import RegisterSuccessModal from '@/app/register/components/RegisterSuccessModal';
import { RegisterFormData, RegisterErrors, PlanType } from '@/app/register/types';
import AuthHeader from './AuthHeader';
import AuthTabSelector from './AuthTabSelector';
import LoginFormView from './LoginFormView';
import RegisterFormView from './RegisterFormView';

interface UnifiedAuthCardProps {
  initialMode?: 'login' | 'register';
  activeMode?: 'login' | 'register';
  onModeChange?: (mode: 'login' | 'register') => void;
  isSplitView?: boolean;
}

export default function UnifiedAuthCard({
  initialMode = 'login',
  activeMode: controlledMode,
  onModeChange,
  isSplitView = false,
}: UnifiedAuthCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register, isAuthenticated, user } = useAuth();

  const [internalMode, setInternalMode] = useState<'login' | 'register'>(initialMode);
  const mode = controlledMode ?? internalMode;

  const setMode = (nextMode: 'login' | 'register') => {
    if (onModeChange) {
      onModeChange(nextMode);
    } else {
      setInternalMode(nextMode);
    }
  };

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);
  const [expiredMsg, setExpiredMsg] = useState(false);

  // Register form state
  const [registerData, setRegisterData] = useState<RegisterFormData>({
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
  const [registerErrors, setRegisterErrors] = useState<RegisterErrors>({});
  const [isRegisterSubmitting, setIsRegisterSubmitting] = useState(false);
  const [registerSuccessModalOpen, setRegisterSuccessModalOpen] = useState(false);

  useEffect(() => {
    if (searchParams?.get('expired') === 'true') {
      setExpiredMsg(true);
    }
    const paramMode = searchParams?.get('mode');
    if (paramMode === 'register' || paramMode === 'login') {
      setInternalMode(paramMode);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'SUPERADMIN') {
        router.push('/superadmin/dashboard');
      } else if (user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/karyawan/dashboard');
      }
    }
  }, [isAuthenticated, user, router]);

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoginSubmitting(true);

    try {
      const loggedUser = await login(loginEmail.trim(), loginPassword);
      if (loggedUser.role === 'SUPERADMIN') {
        router.push('/superadmin/dashboard');
      } else if (loggedUser.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/karyawan/dashboard');
      }
    } catch (err: any) {
      setLoginError(
        err.response?.data?.error || err.message || 'Login gagal. Periksa email dan password.'
      );
    } finally {
      setIsLoginSubmitting(false);
    }
  };

  // Handle Register Field Change
  const handleRegisterFieldChange = (field: keyof RegisterFormData, value: string) => {
    setRegisterData((prev) => ({ ...prev, [field]: value }));
    if (registerErrors[field as keyof RegisterErrors]) {
      setRegisterErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePlanSelect = (plan: PlanType) => {
    setRegisterData((prev) => ({ ...prev, planType: plan }));
  };

  const handleDurationChange = (months: number) => {
    setRegisterData((prev) => ({ ...prev, durationMonths: months }));
  };

  // Validate Register Form
  const validateRegisterForm = (): boolean => {
    const errors: RegisterErrors = {};

    if (!registerData.storeName.trim() || registerData.storeName.trim().length < 2) {
      errors.storeName = 'Nama toko laundry minimal 2 karakter.';
    }
    if (!registerData.name.trim() || registerData.name.trim().length < 2) {
      errors.name = 'Nama pengelola minimal 2 karakter.';
    }
    if (!registerData.phone.trim() || registerData.phone.trim().length < 8) {
      errors.phone = 'Nomor WhatsApp tidak valid (minimal 8 digit).';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!registerData.email.trim() || !emailRegex.test(registerData.email)) {
      errors.email = 'Format alamat email tidak valid.';
    }
    if (!registerData.password || registerData.password.length < 6) {
      errors.password = 'Kata sandi minimal 6 karakter.';
    }
    if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = 'Ulangi kata sandi tidak cocok dengan kata sandi.';
    }

    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegisterForm() || isRegisterSubmitting) return;

    setIsRegisterSubmitting(true);
    try {
      await register({
        storeName: registerData.storeName,
        name: registerData.name,
        phone: registerData.phone,
        email: registerData.email,
        password: registerData.password,
        storeAddress: registerData.storeAddress || undefined,
        planType: registerData.planType,
        durationMonths: registerData.durationMonths,
      });

      setRegisterSuccessModalOpen(true);
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        err.message ||
        'Gagal melakukan pendaftaran. Silakan coba kembali.';
      setRegisterErrors((prev) => ({ ...prev, general: msg }));
    } finally {
      setIsRegisterSubmitting(false);
    }
  };

  const handleContinueToDashboard = () => {
    setRegisterSuccessModalOpen(false);
    router.push('/admin/dashboard');
  };

  return (
    <div className="w-full max-w-xl mx-auto relative">
      {/* Main Glass Card */}
      <div className="glass-card-dark p-4 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-[#1DA9D0]/20 shadow-2xl backdrop-blur-2xl relative overflow-hidden transition-all">
        {/* Glow Accent */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-[#1DA9D0]/15 dark:bg-[#1DA9D0]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-[#43D5CC]/15 dark:bg-[#015383]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Brand & Title Header */}
        <AuthHeader mode={mode} />

        {/* Tab Switcher: Masuk vs Daftar */}
        <AuthTabSelector mode={mode} onChangeMode={setMode} />

        {/* Dynamic Forms with Animated Switch */}
        <AnimatePresence mode="wait">
          {mode === 'login' ? (
            <LoginFormView
              key="auth-login-view"
              email={loginEmail}
              setEmail={setLoginEmail}
              password={loginPassword}
              setPassword={setLoginPassword}
              showPassword={showLoginPassword}
              setShowPassword={setShowLoginPassword}
              error={loginError}
              expiredMsg={expiredMsg}
              isSubmitting={isLoginSubmitting}
              onSubmit={handleLoginSubmit}
              onSwitchToRegister={() => setMode('register')}
            />
          ) : (
            <RegisterFormView
              key="auth-register-view"
              formData={registerData}
              errors={registerErrors}
              isSubmitting={isRegisterSubmitting}
              onFieldChange={handleRegisterFieldChange}
              onPlanSelect={handlePlanSelect}
              onDurationChange={handleDurationChange}
              onSubmit={handleRegisterSubmit}
              onSwitchToLogin={() => setMode('login')}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Success Modal */}
      <RegisterSuccessModal
        isOpen={registerSuccessModalOpen}
        storeName={registerData.storeName}
        email={registerData.email}
        planType={registerData.planType}
        durationMonths={registerData.durationMonths}
        onContinue={handleContinueToDashboard}
      />
    </div>
  );
}
