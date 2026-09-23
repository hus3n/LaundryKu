'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import Button from '@/components/ui/Button';

interface ExpenseHeaderProps {
  onAddClick: () => void;
}

export default function ExpenseHeader({ onAddClick }: ExpenseHeaderProps) {
  return (
    <div className="flex flex-row justify-between items-center gap-2 sm:gap-4">
      <div>
        <h1 className="text-base sm:text-2xl font-bold dark:text-[#F5EACA] text-slate-900">
          Catatan Pengeluaran
        </h1>
        <p className="text-[10px] sm:text-xs dark:text-[#F5EACA]/60 text-slate-500 mt-0.5 sm:mt-1">
          Kelola dan pantau pengeluaran operasional toko laundry
        </p>
      </div>
      <div className="flex shrink-0">
        <Button
          onClick={onAddClick}
          leftIcon={<Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        >
          Tambah Pengeluaran
        </Button>
      </div>
    </div>
  );
}
