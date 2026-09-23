'use client';

import React from 'react';
import { Mail, PhoneCall } from 'lucide-react';
import { SUPERADMIN_WA_NUMBER } from '@/components/landing/landingData';

export default function PrivacyContactCard() {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-[#43D5CC]/15 dark:from-[#012040] dark:to-[#013D66] border border-emerald-200 dark:border-[#1DA9D0]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-[#F5EACA]">
          Pertanyaan Terkait Hak Privasi atau Permintaan Data?
        </h3>
        <p className="text-xs text-slate-600 dark:text-[#F5EACA]/70 mt-1">
          Hubungi Petugas Perlindungan Data kami untuk permohonan ekspor atau penghapusan data toko.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
        <a
          href={`https://wa.me/${SUPERADMIN_WA_NUMBER}?text=Halo%20Admin%20LaundryKu,%20saya%20ingin%20berkonsultasi%20terkait%20kebijakan%20privasi%20dan%20keamanan%20data`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] text-[#010E1C] font-bold text-xs shadow-md shadow-[#1DA9D0]/20 hover:opacity-95 transition-all"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Hubungi Tim DPO via WhatsApp</span>
        </a>
        <a
          href="mailto:support@laundryku.com"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#012040] border border-slate-200 dark:border-[#1DA9D0]/30 text-slate-700 dark:text-[#F5EACA] font-semibold text-xs hover:bg-slate-100 dark:hover:bg-[#013D66] transition-all"
        >
          <Mail className="w-4 h-4 text-[#1DA9D0]" />
          <span>support@laundryku.com</span>
        </a>
      </div>
    </div>
  );
}
