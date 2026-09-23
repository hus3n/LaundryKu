'use client';

import React from 'react';
import { Scale, MessageSquare, Printer, BarChart3, ShieldCheck, Users, Check } from 'lucide-react';
import { PILLAR_FEATURES } from '../aplikasiKasirLaundryData';

export default function PillarKeyPillars() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'scale':
        return <Scale className="w-5 h-5 text-[#1DA9D0] dark:text-[#43D5CC]" />;
      case 'whatsapp':
        return <MessageSquare className="w-5 h-5 text-[#1DA9D0] dark:text-[#43D5CC]" />;
      case 'printer':
        return <Printer className="w-5 h-5 text-[#1DA9D0] dark:text-[#43D5CC]" />;
      case 'chart':
        return <BarChart3 className="w-5 h-5 text-[#1DA9D0] dark:text-[#43D5CC]" />;
      case 'shield':
        return <ShieldCheck className="w-5 h-5 text-[#1DA9D0] dark:text-[#43D5CC]" />;
      case 'users':
        return <Users className="w-5 h-5 text-[#1DA9D0] dark:text-[#43D5CC]" />;
      default:
        return <Scale className="w-5 h-5 text-[#1DA9D0] dark:text-[#43D5CC]" />;
    }
  };

  return (
    <section id="fitur-inti" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-[#1DA9D0] dark:text-[#43D5CC]">
          Fitur Spesifik Industri
        </span>
        <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#F5EACA] tracking-tight">
          6 Pilar Inti Aplikasi Kasir Laundry Modern
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-[#F5EACA]/75">
          Sistem kasir toko umum tidak dirancang untuk menangani kompleksitas penimbangan, durasi pengerjaan, dan penitipan cucian. LaundryKu menyediakan ekosistem terpadu:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PILLAR_FEATURES.map((feat) => (
          <div
            key={feat.title}
            className="p-6 rounded-3xl border border-slate-200 dark:border-[#1DA9D0]/15 bg-white/70 dark:bg-[#010E1C]/60 hover:border-[#1DA9D0]/40 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-lg hover:shadow-[#1DA9D0]/5"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#1DA9D0]/10 dark:bg-[#1DA9D0]/20 flex items-center justify-center">
                  {getIcon(feat.icon)}
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#012040] text-[#015383] dark:text-[#43D5CC] border border-slate-200 dark:border-[#1DA9D0]/20">
                  {feat.badge}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#F5EACA] mb-2 leading-snug">
                {feat.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#F5EACA]/75 leading-relaxed mb-4">
                {feat.description}
              </p>
            </div>

            <ul className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-[#F5EACA]/85">
              {feat.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
