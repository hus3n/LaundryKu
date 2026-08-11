'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { Users, Search, Plus, Edit, Trash2, Phone, MapPin, MessageSquare } from 'lucide-react';

export default function CustomerManagementPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
      console.error('Failed to load customers', err);
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

  const handleOpenEdit = (cust: any) => {
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
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal menyimpan data pelanggan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus pelanggan ini?')) {
      try {
        await api.delete(`/customers/${id}`);
        loadCustomers();
      } catch (err: any) {
        alert(err.response?.data?.error || 'Gagal menghapus pelanggan');
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Kelola Data Pelanggan</h1>
            <p className="text-xs text-slate-400 mt-1">Database kontak pelanggan toko dan nomor WhatsApp terdaftar</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold text-xs shadow-lg shadow-brand-500/20 transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tambah Pelanggan
          </button>
        </div>

        {/* Search */}
        <div className="glass-card-dark p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau nomor WhatsApp pelanggan..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </form>
        </div>

        {/* Customer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-3 text-center py-12 text-xs text-slate-400">Memuat data pelanggan...</div>
          ) : customers.length === 0 ? (
            <div className="col-span-3 glass-card-dark p-12 rounded-2xl text-center text-xs text-slate-400 space-y-3">
              <Users className="w-10 h-10 mx-auto text-slate-600" />
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
                  className="glass-card-dark p-6 rounded-2xl border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent-teal/20 border border-accent-teal/30 flex items-center justify-center font-bold text-accent-teal">
                        {cust.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{cust.name}</h4>
                        <a
                          href={`https://wa.me/${cust.phone}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-brand-400 hover:underline flex items-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" /> {cust.phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleOpenEdit(cust)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-400 hover:bg-slate-800"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(cust.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </div>

                  {cust.address && (
                    <div className="text-xs text-slate-400 pt-2 border-t border-slate-800/80 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
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
                className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm" 
                onClick={() => setModalOpen(false)} 
              />
              <motion.div 
                key="modal"
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
              >
                <div className="glass-card-dark p-6 rounded-3xl border border-slate-800 max-w-md w-full space-y-4 pointer-events-auto">
                  <h3 className="text-base font-bold text-white">
                    {editingId ? 'Edit Pelanggan' : 'Tambah Pelanggan Baru'}
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Pelanggan</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Contoh: Ibu Rina"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Nomor WhatsApp</label>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="081234567890"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Alamat (Opsional)</label>
                      <textarea
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Alamat domisili pelanggan"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setModalOpen(false)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                      >
                        Batal
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-xs font-semibold disabled:opacity-50"
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
