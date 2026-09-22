'use client';

import React from 'react';
import { Code, Save } from 'lucide-react';
import type { WATemplate } from '@/types';

interface WaTemplateEditorCardProps {
  templates: WATemplate[];
  selectedTemplateId: string | null;
  templateContent: string;
  savingTemplate: boolean;
  onSelectTemplate: (id: string) => void;
  onChangeContent: (content: string) => void;
  onSaveTemplate: () => void;
}

export default function WaTemplateEditorCard({
  templates,
  selectedTemplateId,
  templateContent,
  savingTemplate,
  onSelectTemplate,
  onChangeContent,
  onSaveTemplate,
}: WaTemplateEditorCardProps) {
  return (
    <div className="md:col-span-2 glass-card-dark p-3 sm:p-6 rounded-xl sm:rounded-3xl border dark:border-[#1DA9D0]/15 border-slate-200 space-y-3 sm:space-y-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-xs sm:text-base font-bold dark:text-[#F5EACA] text-slate-900 flex items-center gap-1.5 sm:gap-2">
          <Code className="w-3.5 h-3.5 sm:w-4 sm:h-4 dark:text-[#43D5CC] text-teal-600" /> Editor Template Pesan WA
        </h3>
        <button
          type="button"
          onClick={onSaveTemplate}
          disabled={savingTemplate || !selectedTemplateId}
          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-[#1DA9D0] hover:bg-[#43D5CC] text-[#010E1C] font-bold text-[11px] sm:text-xs shadow-md shadow-[#1DA9D0]/20 transition-all flex items-center gap-1 sm:gap-1.5 disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Simpan
        </button>
      </div>

      {/* Template Selector */}
      <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-2">
        {templates.map((tmpl) => (
          <button
            type="button"
            key={tmpl._id}
            onClick={() => onSelectTemplate(tmpl._id)}
            className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedTemplateId === tmpl._id
                ? 'bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] text-[#010E1C] font-bold border-transparent shadow-md'
                : 'dark:bg-[#012040] bg-slate-100 dark:text-[#F5EACA]/60 text-slate-600 dark:border-[#1DA9D0]/15 border-slate-200 dark:hover:text-[#F5EACA] hover:text-slate-900 dark:hover:bg-[#013D66] hover:bg-slate-200'
            }`}
          >
            {tmpl.name}
          </button>
        ))}
      </div>

      {/* Editor Area */}
      <div className="space-y-2 sm:space-y-3">
        <textarea
          rows={5}
          value={templateContent}
          onChange={(e) => onChangeContent(e.target.value)}
          className="w-full p-2.5 sm:p-4 rounded-lg sm:rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/50 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0] font-mono leading-relaxed shadow-sm"
        />

        {/* Dynamic Variables Guide */}
        <div className="p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl dark:bg-[#012040]/60 bg-slate-50 border dark:border-[#1DA9D0]/15 border-slate-200 text-[10px] sm:text-[11px] dark:text-[#F5EACA]/60 text-slate-600 space-y-1">
          <p className="font-semibold dark:text-[#F5EACA]/80 text-slate-700">Variabel Dinamis:</p>
          <div className="flex flex-wrap gap-1 sm:gap-2 text-[9px] sm:text-[10px]">
            <span className="px-1.5 sm:px-2 py-0.5 rounded dark:bg-[#013D66] bg-slate-200 dark:text-[#43D5CC] text-teal-700 dark:border-[#1DA9D0]/25 border-slate-300 font-mono">&#123;&#123;nama_pelanggan&#125;&#125;</span>
            <span className="px-1.5 sm:px-2 py-0.5 rounded dark:bg-[#013D66] bg-slate-200 dark:text-[#43D5CC] text-teal-700 dark:border-[#1DA9D0]/25 border-slate-300 font-mono">&#123;&#123;no_nota&#125;&#125;</span>
            <span className="px-1.5 sm:px-2 py-0.5 rounded dark:bg-[#013D66] bg-slate-200 dark:text-[#43D5CC] text-teal-700 dark:border-[#1DA9D0]/25 border-slate-300 font-mono">&#123;&#123;detail_item&#125;&#125;</span>
            <span className="px-1.5 sm:px-2 py-0.5 rounded dark:bg-[#013D66] bg-slate-200 dark:text-[#43D5CC] text-teal-700 dark:border-[#1DA9D0]/25 border-slate-300 font-mono">&#123;&#123;total_harga&#125;&#125;</span>
            <span className="px-1.5 sm:px-2 py-0.5 rounded dark:bg-[#013D66] bg-slate-200 dark:text-[#43D5CC] text-teal-700 dark:border-[#1DA9D0]/25 border-slate-300 font-mono">&#123;&#123;status_bayar&#125;&#125;</span>
            <span className="px-1.5 sm:px-2 py-0.5 rounded dark:bg-[#013D66] bg-slate-200 dark:text-[#43D5CC] text-teal-700 dark:border-[#1DA9D0]/25 border-slate-300 font-mono">&#123;&#123;estimasi_selesai&#125;&#125;</span>
            <span className="px-1.5 sm:px-2 py-0.5 rounded dark:bg-[#013D66] bg-slate-200 dark:text-[#43D5CC] text-teal-700 dark:border-[#1DA9D0]/25 border-slate-300 font-mono">&#123;&#123;nama_toko&#125;&#125;</span>
          </div>
        </div>
      </div>
    </div>
  );
}
