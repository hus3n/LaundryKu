'use client';

import React from 'react';
import { PhoneCall } from 'lucide-react';
import { SUPERADMIN_WA_NUMBER } from '@/components/landing/landingData';

export default function TermsContactCard() {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-50 to-[#43D5CC]/15 dark:from-[#012040] dark:to-[#013D66] border border-sky-200 dark:border-[#1DA9D0]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-[#F5EACA]">
          Pertanyaan Mengenai Ketentuan Layanan?
        </h3>
        <p className="text-xs text-slate-600 dark:text-[#F5EACA]/70 mt-1">
          Tim legal dan dukungan operasional kami siap membantu Anda 24/7.
        </p>
      </div>
      <a
        href={`https://wa.me/${SUPERADMIN_WA_NUMBER}?text=Halo%20Admin%20LaundryKu,%20saya%20ingin%20bertanya%20seputar%20syarat%20dan%20ketentuan%20layanan`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] text-[#010E1C] font-bold text-xs shadow-md shadow-[#1DA9D0]/20 hover:opacity-95 transition-all shrink-0"
      >
        <PhoneCall className="w-4 h-4" />
        <span>Hubungi Dukungan Resmi</span>
      </a>
    </div>
  );
}
