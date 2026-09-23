'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Trash2 } from 'lucide-react';
import { Expense } from '../types';

interface ExpenseTableProps {
  expenses: Expense[];
  loading: boolean;
  onDelete: (id: string) => void;
}

export default function ExpenseTable({
  expenses,
  loading,
  onDelete,
}: ExpenseTableProps) {
  return (
    <Card className="hidden md:block p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b dark:border-[#1DA9D0]/15 border-slate-200 dark:bg-[#012040]/50 bg-slate-100 text-xs">
              <th className="py-3 px-5 font-semibold dark:text-[#F5EACA]/80 text-slate-700">Tanggal</th>
              <th className="py-3 px-5 font-semibold dark:text-[#F5EACA]/80 text-slate-700">Kategori</th>
              <th className="py-3 px-5 font-semibold dark:text-[#F5EACA]/80 text-slate-700">Keterangan</th>
              <th className="py-3 px-5 font-semibold dark:text-[#F5EACA]/80 text-slate-700 text-right">Jumlah (Rp)</th>
              <th className="py-3 px-5 font-semibold dark:text-[#F5EACA]/80 text-slate-700 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-xs dark:text-[#F5EACA]/60 text-slate-500">
                  Memuat data pengeluaran...
                </td>
              </tr>
            ) : expenses.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-xs dark:text-[#F5EACA]/60 text-slate-500">
                  Belum ada data pengeluaran untuk periode ini.
                </td>
              </tr>
            ) : (
              expenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="border-b dark:border-[#1DA9D0]/10 border-slate-200 dark:hover:bg-[#013D66]/50 hover:bg-slate-50 transition-colors"
                >
                  <td className="py-2.5 px-5 text-xs dark:text-[#F5EACA]/80 text-slate-700">
                    {new Date(expense.date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-2.5 px-5 text-xs font-semibold dark:text-[#F5EACA] text-slate-900">
                    {expense.category}
                  </td>
                  <td className="py-2.5 px-5 text-xs dark:text-[#F5EACA]/60 text-slate-500">
                    {expense.description || '-'}
                  </td>
                  <td className="py-2.5 px-5 text-xs font-bold text-rose-500 dark:text-rose-400 text-right">
                    Rp {Number(expense.amount).toLocaleString('id-ID')}
                  </td>
                  <td className="py-2.5 px-5 text-center">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDelete(expense.id)}
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
