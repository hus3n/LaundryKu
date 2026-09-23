'use client';

import React, { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { api } from '@/lib/api';
import { Expense } from './types';
import ExpenseHeader from './components/ExpenseHeader';
import ExpenseFilter from './components/ExpenseFilter';
import ExpenseMobileList from './components/ExpenseMobileList';
import ExpenseTable from './components/ExpenseTable';
import ExpenseFormModal from './components/ExpenseFormModal';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filterMonth, setFilterMonth] = useState<number>(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/expenses?month=${filterMonth}&year=${filterYear}`);
      setExpenses(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch expenses', err);
    } finally {
      setLoading(false);
    }
  }, [filterMonth, filterYear]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus catatan pengeluaran ini?')) return;
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal menghapus pengeluaran.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-3 sm:space-y-6">
        <ExpenseHeader onAddClick={() => setShowForm(true)} />

        <ExpenseFilter
          month={filterMonth}
          onMonthChange={setFilterMonth}
          year={filterYear}
          onYearChange={setFilterYear}
        />

        <ExpenseMobileList
          expenses={expenses}
          loading={loading}
          onDelete={handleDelete}
        />

        <ExpenseTable
          expenses={expenses}
          loading={loading}
          onDelete={handleDelete}
        />
      </div>

      <ExpenseFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={fetchExpenses}
      />
    </DashboardLayout>
  );
}
