'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { api } from '@/lib/api';
import { Plus } from 'lucide-react';
import type { Outlet } from '@/types';
import { getApiErrorMessage } from '@/lib/utils';
import OutletList from './components/OutletList';
import OutletModal from './components/OutletModal';

export default function OutletManagementPage() {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadOutlets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/outlets');
      setOutlets(res.data.data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan. Silakan refresh halaman.';
      setError(message);
      console.error('[OutletPage] Failed to load outlets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOutlets();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setName('');
    setAddress('');
    setPhone('');
    setModalOpen(true);
  };

  const handleOpenEdit = (outlet: Outlet) => {
    setEditingId(outlet.id);
    setName(outlet.name);
    setAddress(outlet.address || '');
    setPhone(outlet.phone || '');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name,
        address: address.trim() || undefined,
        phone: phone.trim() || undefined,
      };

      if (editingId) {
        await api.patch(`/outlets/${editingId}`, payload);
      } else {
        await api.post('/outlets', payload);
      }

      setModalOpen(false);
      loadOutlets();
    } catch (err: unknown) {
      alert(getApiErrorMessage(err, 'Gagal menyimpan outlet'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menonaktifkan outlet ini? Outlet tidak akan dihapus permanen agar data pesanan lama tetap aman.')) {
      try {
        await api.delete(`/outlets/${id}`);
        loadOutlets();
      } catch (err: unknown) {
        alert(getApiErrorMessage(err, 'Gagal menonaktifkan outlet'));
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-3 sm:space-y-6">
        <div className="flex flex-row justify-between items-center gap-2 sm:gap-4">
          <div>
            <h1 className="text-base sm:text-2xl font-bold dark:text-[#F5EACA] text-slate-900">
              Kelola Outlet
            </h1>
            <p className="text-[10px] sm:text-xs dark:text-[#F5EACA]/60 text-slate-500 mt-0.5 sm:mt-1">
              Daftar cabang/outlet dari toko Anda
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="px-2.5 sm:px-5 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] hover:opacity-95 text-[#010E1C] font-bold text-[11px] sm:text-xs shadow-md shadow-[#1DA9D0]/20 transition-all inline-flex items-center gap-1 sm:gap-2 shrink-0"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Tambah Outlet</span>
          </button>
        </div>

        <OutletList
          outlets={outlets}
          loading={loading}
          error={error}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />

        <OutletModal
          isOpen={modalOpen}
          isEditing={Boolean(editingId)}
          isSubmitting={isSubmitting}
          name={name}
          address={address}
          phone={phone}
          onNameChange={setName}
          onAddressChange={setAddress}
          onPhoneChange={setPhone}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      </div>
    </DashboardLayout>
  );
}
