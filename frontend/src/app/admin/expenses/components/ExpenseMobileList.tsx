'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Trash2 } from 'lucide-react';
import { Expense } from '../types';

interface ExpenseMobileListProps {
  expenses: Expense[];
  loading: boolean;
  onDelete: (id: string) => void;
}

export default function ExpenseMobileList({
  expenses,
  loading,
  onDelete,
}: ExpenseMobileListProps) {
  return (
    <div className="block md:hidden space-y-2">
      {loading ? (
        <Card className="text-center text-xs dark:text-[#F5EACA]/60 text-slate-500 py-6">
          Memuat data pengeluaran...
        </Card>
      ) : expenses.length === 0 ? (
        <Card className="text-center text-xs dark:text-[#F5EACA]/60 text-slate-500 py-6">
          Belum ada data pengeluaran untuk periode ini.
        </Card>
      ) : (
        expenses.map((expense) => (
          <Card key={expense.id} className="flex items-center justify-between gap-2 p-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold dark:text-[#F5EACA] text-slate-900 truncate">
                  {expense.category}
                </span>
                <span className="text-[10px] dark:text-[#F5EACA]/50 text-slate-400">
                  {new Date(expense.date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>
              {expense.description && (
                <p className="text-[11px] dark:text-[#F5EACA]/60 text-slate-500 truncate mt-0.5">
                  {expense.description}
                </p>
              )}
              <div className="text-xs font-bold text-rose-500 dark:text-rose-400 mt-1">
                Rp {Number(expense.amount).toLocaleString('id-ID')}
              </div>
            </div>

            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(expense.id)}
              title="Hapus"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </Card>
        ))
      )}
    </div>
  );
}
