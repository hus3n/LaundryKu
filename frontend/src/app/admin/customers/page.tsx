'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { Users, Search, Plus } from 'lucide-react';
import type { Customer } from '@/types';
import { getApiErrorMessage } from '@/lib/utils';
import CustomerCard from './components/CustomerCard';
import CustomerModal from './components/CustomerModal';

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
            <h1 className="text-base sm:text-xl md:text-2xl font-bold dark:text-[#F5EACA] text-slate-900">
              Kelola Data Pelanggan
            </h1>
            <p className="text-[10px] sm:text-xs dark:text-[#F5EACA]/60 text-slate-500 mt-0.5 sm:mt-1">
              Database kontak pelanggan toko dan WhatsApp
            </p>
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
            <div className="col-span-full text-center py-6 text-xs dark:text-[#F5EACA]/60 text-slate-500">
              Memuat data pelanggan...
            </div>
          ) : customers.length === 0 ? (
            <div className="col-span-full glass-card-dark p-6 sm:p-12 rounded-xl sm:rounded-2xl border dark:border-[#1DA9D0]/15 border-slate-200 text-center text-xs dark:text-[#F5EACA]/60 text-slate-500 space-y-2 shadow-sm">
              <Users className="w-7 h-7 sm:w-10 sm:h-10 mx-auto dark:text-[#1DA9D0]/40 text-slate-400" />
              <p>Belum ada data pelanggan.</p>
            </div>
          ) : (
            <AnimatePresence>
              {customers.map((cust) => (
                <CustomerCard
                  key={cust.id}
                  customer={cust}
                  onEdit={handleOpenEdit}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          )}
        </div>

        <CustomerModal
          isOpen={modalOpen}
          isEditing={Boolean(editingId)}
          isSubmitting={isSubmitting}
          name={name}
          phone={phone}
          address={address}
          onNameChange={setName}
          onPhoneChange={setPhone}
          onAddressChange={setAddress}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      </div>
    </DashboardLayout>
  );
}
