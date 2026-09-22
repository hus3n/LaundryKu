'use client';

import React, { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { api } from '@/lib/api';
import { Plus, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';

interface Expense {
  id: string;
  category: string;
  amount: string | number;
  date: string;
  description?: string;
  createdAt: string;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filterMonth, setFilterMonth] = useState<number>(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    category: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    description: '',
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/expenses', {
        category: form.category,
        amount: Number(form.amount),
        date: form.date,
        description: form.description,
      });
      alert('Pengeluaran berhasil dicatat.');
      setShowForm(false);
      setForm({
        category: '',
        amount: '',
        date: new Date().toISOString().slice(0, 10),
        description: '',
      });
      fetchExpenses();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal mencatat pengeluaran.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus catatan pengeluaran ini?')) return;
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal menghapus pengeluaran.');
    }
  };

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString('id-ID', { month: 'long' }),
  }));

  const yearOptions = [2024, 2025, 2026, 2027].map((y) => ({
    value: y,
    label: y.toString(),
  }));

  return (
    <DashboardLayout>
      <div className="space-y-3 sm:space-y-6">
        {/* Header */}
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
              onClick={() => setShowForm(true)}
              leftIcon={<Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            >
              Tambah Pengeluaran
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="flex flex-wrap gap-2.5 sm:gap-4 items-center justify-between">
          <div className="flex gap-2 sm:gap-4 items-center w-full sm:w-auto">
            <div className="flex-1 sm:flex-initial min-w-[120px]">
              <Select
                label="Bulan"
                value={filterMonth}
                onChange={(e) => setFilterMonth(parseInt(e.target.value))}
                options={monthOptions}
              />
            </div>
            <div className="flex-1 sm:flex-initial min-w-[100px]">
              <Select
                label="Tahun"
                value={filterYear}
                onChange={(e) => setFilterYear(parseInt(e.target.value))}
                options={yearOptions}
              />
            </div>
          </div>
        </Card>

        {/* Mobile Card List */}
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
                  onClick={() => handleDelete(expense.id)}
                  title="Hapus"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </Card>
            ))
          )}
        </div>

        {/* Desktop Table */}
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
                          onClick={() => handleDelete(expense.id)}
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
      </div>

      {/* Modal Tambah */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Tambah Pengeluaran"
        subtitle="Catat pengeluaran operasional baru"
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            label="Tanggal"
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />

          <Input
            label="Kategori"
            required
            placeholder="Contoh: Listrik, Gaji, Sabun..."
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <Input
            label="Jumlah (Rp)"
            type="number"
            required
            min="1"
            placeholder="Contoh: 150000"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />

          <div className="space-y-1">
            <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700">
              Keterangan (Opsional)
            </label>
            <textarea
              rows={2}
              placeholder="Contoh: Bayar token listrik bulan Agustus"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl dark:bg-[#013D66] bg-slate-50 border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/50 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0]"
            />
          </div>

          <div className="pt-2 sm:pt-3 flex gap-2 sm:gap-3">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => setShowForm(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              isLoading={isSubmitting}
            >
              Simpan
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
