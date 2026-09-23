'use client';

import React from 'react';
import { Edit, Trash2, Clock } from 'lucide-react';
import { formatDuration } from '@/lib/utils';
import type { LaundryPackage } from '@/types';

interface PackageCardProps {
  pkg: LaundryPackage;
  onEdit: (pkg: LaundryPackage) => void;
  onDelete: (id: string) => void;
}

export default function PackageCard({ pkg, onEdit, onDelete }: PackageCardProps) {
  return (
    <div className="glass-card-dark p-3 sm:p-6 rounded-xl sm:rounded-2xl border dark:border-[#1DA9D0]/15 border-slate-200 space-y-2.5 sm:space-y-4 relative shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold dark:text-[#F5EACA] text-slate-900 text-sm sm:text-base">
            {pkg.name}
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full dark:bg-[#1DA9D0]/20 bg-teal-50 dark:text-[#43D5CC] text-teal-700 border dark:border-[#1DA9D0]/30 border-teal-200 font-medium">
            Per {pkg.unit}
          </span>
        </div>
        <div className="flex items-center gap-0.5 sm:gap-1">
          <button
            onClick={() => onEdit(pkg)}
            className="p-1.5 rounded-lg dark:text-[#F5EACA]/60 text-slate-500 dark:hover:text-[#43D5CC] hover:text-teal-600 dark:hover:bg-[#013D66] hover:bg-slate-100 transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(pkg.id)}
            className="p-1.5 rounded-lg dark:text-[#F5EACA]/60 text-slate-500 hover:text-rose-500 dark:hover:bg-[#013D66] hover:bg-slate-100 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="pt-2 border-t dark:border-[#1DA9D0]/15 border-slate-200 flex justify-between items-center text-xs">
        <span className="dark:text-[#F5EACA]/60 text-slate-500">Harga Layanan:</span>
        <span className="text-sm sm:text-base font-bold dark:text-[#43D5CC] text-teal-600">
          Rp {Number(pkg.price).toLocaleString('id-ID')}
        </span>
      </div>

      <div className="text-[10px] sm:text-[11px] dark:text-[#F5EACA]/60 text-slate-500 flex items-center gap-1.5">
        <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 dark:text-[#EA8803] text-amber-500" />
        Estimasi pengerjaan: {formatDuration(pkg.estimatedDuration)}
      </div>
    </div>
  );
}
