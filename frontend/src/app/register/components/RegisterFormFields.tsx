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
          <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-[#F5EACA]/80 mb-1 sm:mb-1.5">
            Nama Toko Laundry <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-[#F5EACA]/40">
              <Store className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <input
              type="text"
              required
              disabled={isSubmitting}
              value={formData.storeName}
              onChange={(e) => onChange('storeName', e.target.value)}
              placeholder="Contoh: Berkah Laundry"
              className={`w-full pl-8.5 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border text-xs transition-colors dark:bg-[#013D66]/40 dark:text-[#F5EACA] text-slate-900 placeholder:text-slate-400 dark:placeholder:text-[#F5EACA]/30 ${
                errors.storeName
                  ? 'border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-300 dark:border-[#1DA9D0]/25 focus:border-[#1DA9D0] dark:focus:border-[#43D5CC]'
              }`}
            />
          </div>
          {errors.storeName && (
            <p className="text-[10px] sm:text-[11px] text-rose-500 mt-1">{errors.storeName}</p>
          )}
        </div>

        {/* Owner Name */}
        <div>
          <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-[#F5EACA]/80 mb-1 sm:mb-1.5">
            Nama Pengelola / Owner <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-[#F5EACA]/40">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <input
              type="text"
              required
              disabled={isSubmitting}
              value={formData.name}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="Nama lengkap Anda"
              className={`w-full pl-8.5 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border text-xs transition-colors dark:bg-[#013D66]/40 dark:text-[#F5EACA] text-slate-900 placeholder:text-slate-400 dark:placeholder:text-[#F5EACA]/30 ${
                errors.name
                  ? 'border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-300 dark:border-[#1DA9D0]/25 focus:border-[#1DA9D0] dark:focus:border-[#43D5CC]'
              }`}
            />
          </div>
          {errors.name && (
            <p className="text-[10px] sm:text-[11px] text-rose-500 mt-1">{errors.name}</p>
          )}
        </div>
      </div>

      {/* Kontak: Phone & Email */}
      <div className="grid sm:grid-cols-2 gap-2.5 sm:gap-4">
        {/* WhatsApp Phone */}
        <div>
          <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-[#F5EACA]/80 mb-1 sm:mb-1.5">
            Nomor WhatsApp Toko <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-[#F5EACA]/40">
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <input
              type="tel"
              required
              disabled={isSubmitting}
              value={formData.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="Contoh: 081234567890"
              className={`w-full pl-8.5 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border text-xs transition-colors dark:bg-[#013D66]/40 dark:text-[#F5EACA] text-slate-900 placeholder:text-slate-400 dark:placeholder:text-[#F5EACA]/30 ${
                errors.phone
                  ? 'border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-300 dark:border-[#1DA9D0]/25 focus:border-[#1DA9D0] dark:focus:border-[#43D5CC]'
              }`}
            />
          </div>
          {errors.phone && (
            <p className="text-[10px] sm:text-[11px] text-rose-500 mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-[#F5EACA]/80 mb-1 sm:mb-1.5">
            Alamat Email (Akun Login) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-[#F5EACA]/40">
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <input
              type="email"
              required
              disabled={isSubmitting}
              value={formData.email}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="owner@laundry.com"
              className={`w-full pl-8.5 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border text-xs transition-colors dark:bg-[#013D66]/40 dark:text-[#F5EACA] text-slate-900 placeholder:text-slate-400 dark:placeholder:text-[#F5EACA]/30 ${
                errors.email
                  ? 'border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-300 dark:border-[#1DA9D0]/25 focus:border-[#1DA9D0] dark:focus:border-[#43D5CC]'
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-[10px] sm:text-[11px] text-rose-500 mt-1">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Passwords */}
      <div className="grid sm:grid-cols-2 gap-2.5 sm:gap-4">
        {/* Password */}
        <div>
          <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-[#F5EACA]/80 mb-1 sm:mb-1.5">
            Kata Sandi / Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-[#F5EACA]/40">
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              disabled={isSubmitting}
              value={formData.password}
              onChange={(e) => onChange('password', e.target.value)}
              placeholder="Minimal 6 karakter"
              className={`w-full pl-8.5 sm:pl-10 pr-9 sm:pr-10 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border text-xs transition-colors dark:bg-[#013D66]/40 dark:text-[#F5EACA] text-slate-900 placeholder:text-slate-400 dark:placeholder:text-[#F5EACA]/30 ${
                errors.password
                  ? 'border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-300 dark:border-[#1DA9D0]/25 focus:border-[#1DA9D0] dark:focus:border-[#43D5CC]'
              }`}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-2.5 sm:pr-3 flex items-center text-slate-400 dark:text-[#F5EACA]/40 hover:text-slate-600 dark:hover:text-[#F5EACA]"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[10px] sm:text-[11px] text-rose-500 mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-[#F5EACA]/80 mb-1 sm:mb-1.5">
            Ulangi Kata Sandi <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-[#F5EACA]/40">
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              required
              disabled={isSubmitting}
              value={formData.confirmPassword}
              onChange={(e) => onChange('confirmPassword', e.target.value)}
              placeholder="Ketik ulang kata sandi"
              className={`w-full pl-8.5 sm:pl-10 pr-9 sm:pr-10 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border text-xs transition-colors dark:bg-[#013D66]/40 dark:text-[#F5EACA] text-slate-900 placeholder:text-slate-400 dark:placeholder:text-[#F5EACA]/30 ${
                errors.confirmPassword
                  ? 'border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-300 dark:border-[#1DA9D0]/25 focus:border-[#1DA9D0] dark:focus:border-[#43D5CC]'
              }`}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-2.5 sm:pr-3 flex items-center text-slate-400 dark:text-[#F5EACA]/40 hover:text-slate-600 dark:hover:text-[#F5EACA]"
            >
              {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-[10px] sm:text-[11px] text-rose-500 mt-1">{errors.confirmPassword}</p>
          )}
        </div>
      </div>

      {/* Store Address (Optional) */}
      <div>
        <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-[#F5EACA]/80 mb-1 sm:mb-1.5">
          Alamat Toko Laundry <span className="text-slate-400 font-normal">(Opsional)</span>
        </label>
        <div className="relative">
          <div className="absolute top-2 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-[#F5EACA]/40">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <textarea
            rows={2}
            disabled={isSubmitting}
            value={formData.storeAddress}
            onChange={(e) => onChange('storeAddress', e.target.value)}
            placeholder="Jalan, nomor ruko, kelurahan, kota..."
            className="w-full pl-8.5 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-slate-300 dark:border-[#1DA9D0]/25 focus:border-[#1DA9D0] dark:focus:border-[#43D5CC] text-xs transition-colors dark:bg-[#013D66]/40 dark:text-[#F5EACA] text-slate-900 placeholder:text-slate-400 dark:placeholder:text-[#F5EACA]/30 resize-none"
          />
        </div>
      </div>
    </div>
  );
}
