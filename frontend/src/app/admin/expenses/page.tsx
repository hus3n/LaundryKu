'use client';

import React, { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Calendar, X, Search, IndianRupee } from 'lucide-react';

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
    description: ''
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
        description: form.description
      });
      alert('Pengeluaran berhasil dicatat.');
      setShowForm(false);
      setForm({ category: '', amount: '', date: new Date().toISOString().slice(0, 10), description: '' });
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
      setExpenses(expenses.filter(e => e.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal menghapus pengeluaran.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold dark:text-[#F5EACA] text-slate-900">Catatan Pengeluaran</h1>
            <p className="text-xs dark:text-[#F5EACA]/60 text-slate-500 mt-1">Kelola dan pantau pengeluaran operasional toko laundry</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] hover:opacity-95 text-[#010E1C] font-bold text-xs shadow-lg shadow-[#1DA9D0]/20 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Tambah Pengeluaran
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card-dark p-4 rounded-2xl border dark:border-[#1DA9D0]/15 border-slate-200 flex flex-col md:flex-row gap-4 items-end md:items-center justify-between shadow-sm">
          <div className="flex gap-4 items-center w-full md:w-auto">
            <div>
              <label className="block text-[10px] font-semibold dark:text-[#F5EACA]/60 text-slate-600 mb-1">Bulan</label>
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(parseInt(e.target.value))}
                className="dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 dark:text-[#F5EACA] text-slate-900 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#1DA9D0] min-w-[120px]"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1} className="dark:bg-[#012040] dark:text-[#F5EACA] bg-white text-slate-900">
                    {new Date(0, i).toLocaleString('id-ID', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold dark:text-[#F5EACA]/60 text-slate-600 mb-1">Tahun</label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(parseInt(e.target.value))}
                className="dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 dark:text-[#F5EACA] text-slate-900 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#1DA9D0] min-w-[100px]"
              >
                {[2024, 2025, 2026, 2027].map(y => (
                  <option key={y} value={y} className="dark:bg-[#012040] dark:text-[#F5EACA] bg-white text-slate-900">{y}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="glass-card-dark rounded-3xl border dark:border-[#1DA9D0]/15 border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b dark:border-[#1DA9D0]/15 border-slate-200 dark:bg-[#012040]/50 bg-slate-100 text-xs">
                  <th className="py-4 px-6 font-semibold dark:text-[#F5EACA]/80 text-slate-700">Tanggal</th>
                  <th className="py-4 px-6 font-semibold dark:text-[#F5EACA]/80 text-slate-700">Kategori</th>
                  <th className="py-4 px-6 font-semibold dark:text-[#F5EACA]/80 text-slate-700">Keterangan</th>
                  <th className="py-4 px-6 font-semibold dark:text-[#F5EACA]/80 text-slate-700 text-right">Jumlah (Rp)</th>
                  <th className="py-4 px-6 font-semibold dark:text-[#F5EACA]/80 text-slate-700 text-center">Aksi</th>
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
                    <tr key={expense.id} className="border-b dark:border-[#1DA9D0]/10 border-slate-200 dark:hover:bg-[#013D66]/50 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-6 text-xs dark:text-[#F5EACA]/80 text-slate-700">
                        {new Date(expense.date).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td className="py-3 px-6 text-xs font-semibold dark:text-[#F5EACA] text-slate-900">
                        {expense.category}
                      </td>
                      <td className="py-3 px-6 text-xs dark:text-[#F5EACA]/60 text-slate-500">
                        {expense.description || '-'}
                      </td>
                      <td className="py-3 px-6 text-sm font-bold text-rose-500 dark:text-rose-400 text-right">
                        Rp {Number(expense.amount).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-6 text-center">
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="p-2 rounded-lg bg-rose-500/10 text-rose-500 dark:text-rose-400 hover:bg-rose-500/20 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Tambah */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 dark:bg-[#010E1C]/85 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="dark:bg-[#012040] bg-white p-6 rounded-3xl border dark:border-[#1DA9D0]/25 border-slate-200 w-full max-w-md relative shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold dark:text-[#F5EACA] text-slate-900">Tambah Pengeluaran</h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 rounded-xl dark:hover:bg-[#013D66] hover:bg-slate-100 dark:text-[#F5EACA]/60 text-slate-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-1.5">Tanggal</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl dark:bg-[#013D66] bg-slate-50 border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 focus:outline-none focus:border-[#1DA9D0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-1.5">Kategori *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Listrik, Gaji, Sabun..."
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl dark:bg-[#013D66] bg-slate-50 border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/50 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-1.5">Jumlah (Rp) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Contoh: 150000"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl dark:bg-[#013D66] bg-slate-50 border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/50 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-1.5">Keterangan (Opsional)</label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Bayar token listrik bulan Agustus"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl dark:bg-[#013D66] bg-slate-50 border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/50 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0]"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl dark:bg-[#013D66] bg-slate-100 dark:hover:bg-[#014775] hover:bg-slate-200 dark:text-[#F5EACA]/80 text-slate-700 font-semibold text-xs border dark:border-[#1DA9D0]/25 border-slate-300 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] hover:opacity-95 text-[#010E1C] font-bold text-xs transition-all disabled:opacity-50 shadow-sm"
                  >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
