'use client';

import React from 'react';
import { TermsSection } from '../types';

interface TermsContentProps {
  sections: TermsSection[];
}

export default function TermsContent({ sections }: TermsContentProps) {
  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <section
          key={section.number}
          className="space-y-3 bg-white dark:bg-[#012040]/70 p-5 sm:p-7 rounded-2xl border border-slate-200 dark:border-[#1DA9D0]/20 shadow-xs"
        >
          <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-slate-900 dark:text-[#F5EACA]">
            <span className="w-7 h-7 rounded-lg bg-[#1DA9D0]/20 text-[#1DA9D0] dark:text-[#43D5CC] flex items-center justify-center text-xs font-black">
              {section.number}
            </span>
            <h2>{section.title}</h2>
          </div>

          {section.intro && (
            <p className="text-slate-600 dark:text-[#F5EACA]/80">{section.intro}</p>
          )}

          {section.items && section.items.length > 0 && (
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 dark:text-[#F5EACA]/80 pl-2">
              {section.items.map((item, idx) => (
                <li key={idx} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          )}

          {section.conclusion && (
            <p className="text-slate-600 dark:text-[#F5EACA]/80 pt-1">
              {section.conclusion}
            </p>
          )}
        </section>
      ))}
    </div>
  );
}
