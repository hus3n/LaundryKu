'use client';

import React, { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Download, Trash2, Calendar, FileSpreadsheet, X, Search, IndianRupee } from 'lucide-react';

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

  const downloadCSV = async (type: 'expenses' | 'income') => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      const url = `${apiUrl}/api/expenses/export/${type}?month=${filterMonth}&year=${filterYear}`;
      const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      
      if (!response.ok) throw new Error('Gagal mendownload CSV');
      
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${type}-${filterYear}-${filterMonth}.csv`;
      link.click();
    } catch (err) {
      alert('Gagal mendownload CSV');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Catatan Pengeluaran</h1>
            <p className="text-xs text-slate-400 mt-1">Kelola dan pantau pengeluaran operasional toko laundry</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold text-xs shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Tambah Pengeluaran
            </button>
          </div>
        </div>

        {/* Filters & Export */}
        <div className="glass-card-dark p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-4 items-end md:items-center justify-between">
          <div className="flex gap-4 items-center w-full md:w-auto">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1">Bulan</label>
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(parseInt(e.target.value))}
                className="bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500 min-w-[120px]"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString('id-ID', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1">Tahun</label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(parseInt(e.target.value))}
                className="bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500 min-w-[100px]"
              >
                {[2024, 2025, 2026, 2027].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => downloadCSV('income')}
              className="px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-semibold text-xs transition-colors flex items-center gap-2"
              title="Download rekap pemasukan (dari pesanan LUNAS)"
            >
              <FileSpreadsheet className="w-4 h-4" /> Export Pemasukan
            </button>
            <button
              onClick={() => downloadCSV('expenses')}
              className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-semibold text-xs transition-colors flex items-center gap-2"
              title="Download rekap pengeluaran"
            >
              <FileSpreadsheet className="w-4 h-4" /> Export Pengeluaran
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="glass-card-dark rounded-3xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50 text-xs">
                  <th className="py-4 px-6 font-semibold text-slate-300">Tanggal</th>
                  <th className="py-4 px-6 font-semibold text-slate-300">Kategori</th>
                  <th className="py-4 px-6 font-semibold text-slate-300">Keterangan</th>
                  <th className="py-4 px-6 font-semibold text-slate-300 text-right">Jumlah (Rp)</th>
                  <th className="py-4 px-6 font-semibold text-slate-300 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-slate-400">
                      Memuat data pengeluaran...
                    </td>
                  </tr>
                ) : expenses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-slate-400">
                      Belum ada data pengeluaran untuk periode ini.
                    </td>
                  </tr>
                ) : (
                  expenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-slate-800/50 hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-6 text-xs text-slate-300">
                        {new Date(expense.date).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td className="py-3 px-6 text-xs font-semibold text-white">
                        {expense.category}
                      </td>
                      <td className="py-3 px-6 text-xs text-slate-400">
                        {expense.description || '-'}
                      </td>
                      <td className="py-3 px-6 text-sm font-bold text-rose-400 text-right">
                        Rp {Number(expense.amount).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-6 text-center">
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="glass-card-dark p-6 rounded-3xl border border-slate-800 w-full max-w-md relative"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Tambah Pengeluaran</h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tanggal</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Kategori *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Listrik, Gaji, Sabun..."
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Jumlah (Rp) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Contoh: 150000"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Keterangan (Opsional)</label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Bayar token listrik bulan Agustus"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors disabled:opacity-50"
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
