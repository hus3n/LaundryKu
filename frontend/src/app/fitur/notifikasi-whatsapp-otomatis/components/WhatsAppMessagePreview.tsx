'use client';

import React from 'react';
import { WA_TEMPLATES } from '../whatsappFiturData';
import { MessageSquare, CheckCheck } from 'lucide-react';

export default function WhatsAppMessagePreview() {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-[#1DA9D0] dark:text-[#43D5CC]">
          Format Pesan Profesional
        </span>
        <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F5EACA] tracking-tight">
          Contoh Pesan Otomatis yang Diterima Pelanggan
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-[#F5EACA]/75">
          Tampilan pesan rapi dengan nama toko Anda sendiri, nomor nota, rincian biaya, dan estimasi selesai.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {WA_TEMPLATES.map((tpl) => (
          <div
            key={tpl.title}
            className="rounded-3xl border border-slate-200 dark:border-[#1DA9D0]/20 bg-slate-100/80 dark:bg-[#012040]/50 p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-700 dark:text-[#F5EACA]">
                <span>{tpl.title}</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  {tpl.recipient}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-[#F5EACA]/60 mb-3">
                Pemicu: {tpl.event}
              </div>

              {/* Chat Bubble Mockup */}
              <div className="rounded-2xl bg-[#DCF8C6] dark:bg-[#075E54]/90 text-slate-900 dark:text-white p-4 text-xs font-mono leading-relaxed whitespace-pre-line shadow-sm border border-emerald-600/10">
                {tpl.messageText}
                <div className="flex items-center justify-end gap-1 text-[10px] text-slate-500 dark:text-slate-300 mt-2">
                  <span>14:32</span>
                  <CheckCheck className="w-3.5 h-3.5 text-sky-500" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
