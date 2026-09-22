'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantityInputProps {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
}

export default function QuantityInput({ value, onChange, min = 1 }: QuantityInputProps) {
  const decrement = () => {
    if (value > min) onChange(value - 1);
  };

  const increment = () => {
    onChange(value + 1);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseInt(e.target.value, 10);
    if (!isNaN(parsed) && parsed >= min) {
      onChange(parsed);
    }
  };

  return (
    <div className="flex items-center rounded-lg border dark:border-slate-700 border-slate-300 overflow-hidden dark:bg-slate-800 bg-slate-100 w-fit">
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        className="px-3 py-2 dark:text-slate-300 text-slate-700 dark:hover:bg-slate-700 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Kurangi kuantitas"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <input
        type="number"
        value={value}
        onChange={handleInput}
        min={min}
        step={1}
        className="w-12 text-center py-2 bg-transparent text-xs dark:text-white text-slate-900 font-semibold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={increment}
        className="px-3 py-2 dark:text-slate-300 text-slate-700 dark:hover:bg-slate-700 hover:bg-slate-200 transition-colors"
        aria-label="Tambah kuantitas"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
