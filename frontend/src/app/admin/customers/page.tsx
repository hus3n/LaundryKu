'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { Users, Search, Plus, Edit, Trash2, Phone, MapPin, MessageSquare } from 'lucide-react';
import type { Customer } from '@/types';
import { getApiErrorMessage } from '@/lib/utils';

export default function CustomerManagementPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/customers', { params: { q: search } });
      setCustomers(res.data.data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan. Silakan refresh halaman.';
      setError(message);
      console.error('[CustomerPage] Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadCustomers();
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setName('');
    setPhone('');
    setAddress('');
    setModalOpen(true);
  };

  const handleOpenEdit = (cust: Customer) => {
    setEditingId(cust.id);
    setName(cust.name);
    setPhone(cust.phone);
    setAddress(cust.address || '');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = { name, phone, address };
      if (editingId) {
        await api.put(`/customers/${editingId}`, payload);
      } else {
        await api.post('/customers', payload);
      }

      setModalOpen(false);
      loadCustomers();
    } catch (err: unknown) {
      alert(getApiErrorMessage(err, 'Gagal menyimpan data pelanggan'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus pelanggan ini?')) {
      try {
        await api.delete(`/customers/${id}`);
        loadCustomers();
      } catch (err: unknown) {
        alert(getApiErrorMessage(err, 'Gagal menghapus pelanggan'));
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-2.5 sm:space-y-4 md:space-y-6">
        <div className="flex flex-row sm:items-center justify-between items-center gap-2 sm:gap-4">
          <div>
            <h1 className="text-base sm:text-xl md:text-2xl font-bold dark:text-[#F5EACA] text-slate-900">Kelola Data Pelanggan</h1>
            <p className="text-[10px] sm:text-xs dark:text-[#F5EACA]/60 text-slate-500 mt-0.5 sm:mt-1">Database kontak pelanggan toko dan WhatsApp</p>
          </div>
          <div className="flex shrink-0">
            <button
              onClick={handleOpenCreate}
              className="px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] hover:opacity-95 text-[#010E1C] font-bold text-[11px] sm:text-xs shadow-md shadow-[#1DA9D0]/20 transition-all inline-flex items-center gap-1 sm:gap-2"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Tambah Pelanggan</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="glass-card-dark p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border dark:border-[#1DA9D0]/15 border-slate-200 flex justify-between items-center shadow-sm">
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
            <Search className="w-3.5 h-3.5 dark:text-[#1DA9D0]/50 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau nomor WhatsApp pelanggan..."
              className="w-full pl-8 pr-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/50 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0] shadow-sm"
            />
          </form>
        </div>

        {/* Customer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-5">
          {error ? (
            <div className="col-span-full text-center py-6 text-xs text-rose-500">⚠️ {error}</div>
          ) : loading ? (
            <div className="col-span-full text-center py-6 text-xs dark:text-[#F5EACA]/60 text-slate-500">Memuat data pelanggan...</div>
          ) : customers.length === 0 ? (
            <div className="col-span-full glass-card-dark p-6 sm:p-12 rounded-xl sm:rounded-2xl border dark:border-[#1DA9D0]/15 border-slate-200 text-center text-xs dark:text-[#F5EACA]/60 text-slate-500 space-y-2 shadow-sm">
              <Users className="w-7 h-7 sm:w-10 sm:h-10 mx-auto dark:text-[#1DA9D0]/40 text-slate-400" />
              <p>Belum ada data pelanggan.</p>
            </div>
          ) : (
            <AnimatePresence>
              {customers.map((cust) => (
                <motion.div 
                  key={cust.id} 
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  layout
                  className="glass-card-dark p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border dark:border-[#1DA9D0]/15 border-slate-200 space-y-2 sm:space-y-3 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl dark:bg-[#1DA9D0]/20 bg-teal-50 border dark:border-[#1DA9D0]/30 border-teal-200 flex items-center justify-center font-bold dark:text-[#43D5CC] text-teal-700 text-xs sm:text-sm">
                        {cust.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold dark:text-[#F5EACA] text-slate-900 text-xs sm:text-sm truncate">{cust.name}</h4>
                        <a
                          href={`https://wa.me/${cust.phone}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] sm:text-[11px] dark:text-[#43D5CC] text-teal-600 hover:underline flex items-center gap-1 truncate"
                        >
                          <MessageSquare className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" /> {cust.phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleOpenEdit(cust)}
                        className="p-1 sm:p-1.5 rounded-lg dark:text-[#F5EACA]/60 text-slate-500 dark:hover:text-[#43D5CC] hover:text-teal-600 dark:hover:bg-[#013D66] hover:bg-slate-100 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(cust.id)}
                        className="p-1 sm:p-1.5 rounded-lg dark:text-[#F5EACA]/60 text-slate-500 hover:text-rose-500 dark:hover:bg-[#013D66] hover:bg-slate-100 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </div>

                  {cust.address && (
                    <div className="text-[10px] sm:text-xs dark:text-[#F5EACA]/60 text-slate-500 pt-1.5 sm:pt-2 border-t dark:border-[#1DA9D0]/15 border-slate-200 flex items-start gap-1">
                      <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 dark:text-[#1DA9D0]/50 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{cust.address}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <AnimatePresence>
          {modalOpen && (
            <>
              <motion.div 
                key="overlay"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 dark:bg-[#010E1C]/85 bg-slate-900/40 backdrop-blur-sm" 
                onClick={() => setModalOpen(false)} 
              />
              <motion.div 
                key="modal"
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 pointer-events-none"
              >
                <div className="dark:bg-[#012040] bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border dark:border-[#1DA9D0]/25 border-slate-200 max-w-md w-full space-y-3 sm:space-y-4 pointer-events-auto shadow-2xl">
                  <h3 className="text-sm sm:text-base font-bold dark:text-[#F5EACA] text-slate-900">
                    {editingId ? 'Edit Pelanggan' : 'Tambah Pelanggan Baru'}
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-1">Nama Pelanggan</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Contoh: Ibu Rina"
                        className="w-full px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl dark:bg-[#013D66] bg-slate-50 border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/50 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-1">Nomor WhatsApp</label>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="081234567890"
                        className="w-full px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl dark:bg-[#013D66] bg-slate-50 border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/50 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-1">Alamat (Opsional)</label>
                      <textarea
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Alamat domisili pelanggan"
                        className="w-full px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl dark:bg-[#013D66] bg-slate-50 border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/50 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0]"
                      />
                    </div>

                    <div className="pt-2 sm:pt-3 flex justify-end gap-2 sm:gap-3">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setModalOpen(false)}
                        className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl dark:bg-[#013D66] bg-slate-100 dark:text-[#F5EACA]/80 text-slate-700 text-xs font-semibold dark:hover:bg-[#014775] hover:bg-slate-200 border dark:border-[#1DA9D0]/25 border-slate-300 transition-colors"
                      >
                        Batal
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] hover:opacity-95 text-[#010E1C] font-bold text-xs disabled:opacity-50 transition-all shadow-sm"
                      >
                        {editingId ? 'Simpan' : 'Tambah'}
                      </motion.button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
