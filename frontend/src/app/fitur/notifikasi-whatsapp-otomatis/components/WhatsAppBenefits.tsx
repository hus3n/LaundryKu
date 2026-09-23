'use client';

import React from 'react';
import { WA_BENEFITS } from '../whatsappFiturData';
import { Check, Zap, MessageCircle, FileText, BellRing } from 'lucide-react';

export default function WhatsAppBenefits() {
  const getIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <Zap className="w-5 h-5 text-[#1DA9D0] dark:text-[#43D5CC]" />;
      case 1:
        return <MessageCircle className="w-5 h-5 text-emerald-500" />;
      case 2:
        return <FileText className="w-5 h-5 text-[#EA8803]" />;
      case 3:
        return <BellRing className="w-5 h-5 text-sky-500" />;
      default:
        return <Check className="w-5 h-5 text-emerald-500" />;
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F5EACA] tracking-tight">
          Mengapa Fitur WhatsApp Otomatis LaundryKu Mengubah Bisnis Anda?
        </h2>
        <p className="mt-3 text-sm text-slate-600 dark:text-[#F5EACA]/75">
          Tingkatkan loyalitas pelanggan sekaligus pangkas jam kerja staf kasir yang melelahkan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {WA_BENEFITS.map((benefit, idx) => (
          <div
            key={benefit.title}
            className="p-6 rounded-3xl border border-slate-200 dark:border-[#1DA9D0]/20 bg-white/70 dark:bg-[#010E1C]/80 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-[#012040] flex items-center justify-center">
                  {getIcon(idx)}
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#1DA9D0]/10 text-[#015383] dark:text-[#43D5CC] border border-[#1DA9D0]/20">
                  {benefit.badge}
                </span>
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-[#F5EACA] mb-2">
                {benefit.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#F5EACA]/75 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
