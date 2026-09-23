'use client';

import React, { useState } from 'react';
import { Store, User, Phone, Mail, Lock, Eye, EyeOff, MapPin } from 'lucide-react';
import { RegisterFormData, RegisterErrors } from '../types';

interface RegisterFormFieldsProps {
  formData: RegisterFormData;
  onChange: (field: keyof RegisterFormData, value: string) => void;
  errors: RegisterErrors;
  isSubmitting: boolean;
}

export default function RegisterFormFields({
  formData,
  onChange,
  errors,
  isSubmitting,
}: RegisterFormFieldsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Toko & Penanggung Jawab */}
      <div className="grid sm:grid-cols-2 gap-2.5 sm:gap-4">
        {/* Store Name */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-[#F5EACA]/80 mb-1 sm:mb-1.5">
            Nama Toko Laundry <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Store className="w-4 h-4 text-slate-400 dark:text-[#1DA9D0]/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none shrink-0" />
            <input
              type="text"
              required
              disabled={isSubmitting}
              value={formData.storeName}
              onChange={(e) => onChange('storeName', e.target.value)}
              placeholder="Contoh: Berkah Laundry"
              className={`w-full pl-10 sm:pl-10 pr-3.5 py-2 sm:py-2.5 rounded-xl border text-xs sm:text-sm transition-all bg-slate-50 dark:bg-[#012040] dark:text-[#F5EACA] text-slate-900 placeholder:text-slate-400 dark:placeholder:text-[#1DA9D0]/40 focus:outline-none focus:ring-2 ${
                errors.storeName
                  ? 'border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-300 dark:border-[#1DA9D0]/25 focus:border-[#1DA9D0] focus:ring-[#1DA9D0]/20'
              }`}
            />
          </div>
          {errors.storeName && (
            <p className="text-xs text-rose-500 mt-1 font-medium">{errors.storeName}</p>
          )}
        </div>

        {/* Owner Name */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-[#F5EACA]/80 mb-1 sm:mb-1.5">
            Nama Pengelola / Owner <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 dark:text-[#1DA9D0]/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none shrink-0" />
            <input
              type="text"
              required
              disabled={isSubmitting}
              value={formData.name}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="Nama lengkap Anda"
              className={`w-full pl-10 sm:pl-10 pr-3.5 py-2 sm:py-2.5 rounded-xl border text-xs sm:text-sm transition-all bg-slate-50 dark:bg-[#012040] dark:text-[#F5EACA] text-slate-900 placeholder:text-slate-400 dark:placeholder:text-[#1DA9D0]/40 focus:outline-none focus:ring-2 ${
                errors.name
                  ? 'border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-300 dark:border-[#1DA9D0]/25 focus:border-[#1DA9D0] focus:ring-[#1DA9D0]/20'
              }`}
            />
          </div>
          {errors.name && (
            <p className="text-xs text-rose-500 mt-1 font-medium">{errors.name}</p>
          )}
        </div>
      </div>

      {/* Kontak: Phone & Email */}
      <div className="grid sm:grid-cols-2 gap-2.5 sm:gap-4">
        {/* WhatsApp Phone */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-[#F5EACA]/80 mb-1 sm:mb-1.5">
            Nomor WhatsApp Toko <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 dark:text-[#1DA9D0]/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none shrink-0" />
            <input
              type="tel"
              required
              disabled={isSubmitting}
              value={formData.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="Contoh: 081234567890"
              className={`w-full pl-10 sm:pl-10 pr-3.5 py-2 sm:py-2.5 rounded-xl border text-xs sm:text-sm transition-all bg-slate-50 dark:bg-[#012040] dark:text-[#F5EACA] text-slate-900 placeholder:text-slate-400 dark:placeholder:text-[#1DA9D0]/40 focus:outline-none focus:ring-2 ${
                errors.phone
                  ? 'border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-300 dark:border-[#1DA9D0]/25 focus:border-[#1DA9D0] focus:ring-[#1DA9D0]/20'
              }`}
            />
          </div>
          {errors.phone && (
            <p className="text-xs text-rose-500 mt-1 font-medium">{errors.phone}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-[#F5EACA]/80 mb-1 sm:mb-1.5">
            Alamat Email (Akun Login) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 dark:text-[#1DA9D0]/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none shrink-0" />
            <input
              type="email"
              required
              disabled={isSubmitting}
              value={formData.email}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="owner@laundry.com"
              className={`w-full pl-10 sm:pl-10 pr-3.5 py-2 sm:py-2.5 rounded-xl border text-xs sm:text-sm transition-all bg-slate-50 dark:bg-[#012040] dark:text-[#F5EACA] text-slate-900 placeholder:text-slate-400 dark:placeholder:text-[#1DA9D0]/40 focus:outline-none focus:ring-2 ${
                errors.email
                  ? 'border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-300 dark:border-[#1DA9D0]/25 focus:border-[#1DA9D0] focus:ring-[#1DA9D0]/20'
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-rose-500 mt-1 font-medium">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Passwords */}
      <div className="grid sm:grid-cols-2 gap-2.5 sm:gap-4">
        {/* Password */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-[#F5EACA]/80 mb-1 sm:mb-1.5">
            Kata Sandi / Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 dark:text-[#1DA9D0]/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none shrink-0" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              disabled={isSubmitting}
              value={formData.password}
              onChange={(e) => onChange('password', e.target.value)}
              placeholder="Minimal 6 karakter"
              className={`w-full pl-10 sm:pl-10 pr-10 py-2 sm:py-2.5 rounded-xl border text-xs sm:text-sm transition-all bg-slate-50 dark:bg-[#012040] dark:text-[#F5EACA] text-slate-900 placeholder:text-slate-400 dark:placeholder:text-[#1DA9D0]/40 focus:outline-none focus:ring-2 ${
                errors.password
                  ? 'border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-300 dark:border-[#1DA9D0]/25 focus:border-[#1DA9D0] focus:ring-[#1DA9D0]/20'
              }`}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#F5EACA]/40 hover:text-slate-600 dark:hover:text-[#F5EACA] p-1 cursor-pointer"
              aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-rose-500 mt-1 font-medium">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-[#F5EACA]/80 mb-1 sm:mb-1.5">
            Ulangi Kata Sandi <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 dark:text-[#1DA9D0]/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none shrink-0" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              required
              disabled={isSubmitting}
              value={formData.confirmPassword}
              onChange={(e) => onChange('confirmPassword', e.target.value)}
              placeholder="Ketik ulang kata sandi"
              className={`w-full pl-10 sm:pl-10 pr-10 py-2 sm:py-2.5 rounded-xl border text-xs sm:text-sm transition-all bg-slate-50 dark:bg-[#012040] dark:text-[#F5EACA] text-slate-900 placeholder:text-slate-400 dark:placeholder:text-[#1DA9D0]/40 focus:outline-none focus:ring-2 ${
                errors.confirmPassword
                  ? 'border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-300 dark:border-[#1DA9D0]/25 focus:border-[#1DA9D0] focus:ring-[#1DA9D0]/20'
              }`}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#F5EACA]/40 hover:text-slate-600 dark:hover:text-[#F5EACA] p-1 cursor-pointer"
              aria-label={showConfirmPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-rose-500 mt-1 font-medium">{errors.confirmPassword}</p>
          )}
        </div>
      </div>

      {/* Store Address (Optional) */}
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-[#F5EACA]/80 mb-1 sm:mb-1.5">
          Alamat Toko Laundry <span className="text-slate-400 font-normal">(Opsional)</span>
        </label>
        <div className="relative">
          <MapPin className="w-4 h-4 text-slate-400 dark:text-[#1DA9D0]/50 absolute left-3.5 top-3 pointer-events-none shrink-0" />
          <textarea
            rows={2}
            disabled={isSubmitting}
            value={formData.storeAddress}
            onChange={(e) => onChange('storeAddress', e.target.value)}
            placeholder="Jalan, nomor ruko, kelurahan, kota..."
            className="w-full pl-10 sm:pl-10 pr-3.5 py-2 sm:py-2.5 rounded-xl border border-slate-300 dark:border-[#1DA9D0]/25 focus:border-[#1DA9D0] focus:ring-2 focus:ring-[#1DA9D0]/20 text-xs sm:text-sm transition-all bg-slate-50 dark:bg-[#012040] dark:text-[#F5EACA] text-slate-900 placeholder:text-slate-400 dark:placeholder:text-[#1DA9D0]/40 resize-none focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
