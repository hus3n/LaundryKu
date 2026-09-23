'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';

interface ExpenseFilterProps {
  month: number;
  onMonthChange: (month: number) => void;
  year: number;
  onYearChange: (year: number) => void;
}

export default function ExpenseFilter({
  month,
  onMonthChange,
  year,
  onYearChange,
}: ExpenseFilterProps) {
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString('id-ID', { month: 'long' }),
  }));

  const yearOptions = [2024, 2025, 2026, 2027].map((y) => ({
    value: y,
    label: y.toString(),
  }));

  return (
    <Card className="flex flex-wrap gap-2.5 sm:gap-4 items-center justify-between">
      <div className="flex gap-2 sm:gap-4 items-center w-full sm:w-auto">
        <div className="flex-1 sm:flex-initial min-w-[120px]">
          <Select
            label="Bulan"
            value={month}
            onChange={(e) => onMonthChange(parseInt(e.target.value))}
            options={monthOptions}
          />
        </div>
        <div className="flex-1 sm:flex-initial min-w-[100px]">
          <Select
            label="Tahun"
            value={year}
            onChange={(e) => onYearChange(parseInt(e.target.value))}
            options={yearOptions}
          />
        </div>
      </div>
    </Card>
  );
}
