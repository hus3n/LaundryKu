'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { api } from '@/lib/api';
import { Package as PackageIcon, Plus } from 'lucide-react';
import type { LaundryPackage } from '@/types';
import { getApiErrorMessage } from '@/lib/utils';
import PackageCard from './components/PackageCard';
import PackageModal from './components/PackageModal';

export default function PackageManagementPage() {
  const [packages, setPackages] = useState<LaundryPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [unit, setUnit] = useState('kg');
  const [price, setPrice] = useState('');
  const [durationValue, setDurationValue] = useState('24');
  const [durationUnit, setDurationUnit] = useState('jam');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadPackages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/packages');
      setPackages(res.data.data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan. Silakan refresh halaman.';
      setError(message);
      console.error('[PackagePage] Failed to load packages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setName('');
    setUnit('kg');
    setPrice('');
    setDurationValue('24');
    setDurationUnit('jam');
    setModalOpen(true);
  };

  const handleOpenEdit = (pkg: LaundryPackage) => {
    setEditingId(pkg.id);
    setName(pkg.name);
    setUnit(pkg.unit);
    setPrice(String(pkg.price));
    if (pkg.estimatedDuration >= 24 && pkg.estimatedDuration % 24 === 0) {
      setDurationValue(String(pkg.estimatedDuration / 24));
      setDurationUnit('hari');
    } else {
      setDurationValue(String(pkg.estimatedDuration));
      setDurationUnit('jam');
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const estimatedDuration = durationUnit === 'hari' 
        ? parseInt(durationValue, 10) * 24 
        : parseInt(durationValue, 10);

      const payload = {
        name,
        unit,
        price: parseFloat(price),
        estimatedDuration,
      };

      if (editingId) {
        await api.put(`/packages/${editingId}`, payload);
      } else {
        await api.post('/packages', payload);
      }

      setModalOpen(false);
      loadPackages();
    } catch (err: unknown) {
      alert(getApiErrorMessage(err, 'Gagal menyimpan paket'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus paket ini?')) {
      try {
        await api.delete(`/packages/${id}`);
        loadPackages();
      } catch (err: unknown) {
        alert(getApiErrorMessage(err, 'Gagal menghapus paket'));
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-3 sm:space-y-6">
        <div className="flex flex-row justify-between items-center gap-2 sm:gap-4">
          <div>
            <h1 className="text-base sm:text-2xl font-bold dark:text-[#F5EACA] text-slate-900">
              Kelola Paket Layanan
            </h1>
            <p className="text-[10px] sm:text-xs dark:text-[#F5EACA]/60 text-slate-500 mt-0.5 sm:mt-1">
              Pengaturan jenis paket cucian, harga, dan satuan unit toko
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="px-2.5 sm:px-5 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] hover:opacity-95 text-[#010E1C] font-bold text-[11px] sm:text-xs shadow-md shadow-[#1DA9D0]/20 transition-all inline-flex items-center gap-1 sm:gap-2 shrink-0"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Tambah Paket</span>
          </button>
        </div>

        {/* Package Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-6">
          {error ? (
            <div className="col-span-3 text-center py-8 text-xs text-rose-500">⚠️ {error}</div>
          ) : loading ? (
            <div className="col-span-3 text-center py-8 text-xs dark:text-[#F5EACA]/60 text-slate-500">
              Memuat data paket...
            </div>
          ) : packages.length === 0 ? (
            <div className="col-span-3 glass-card-dark p-8 sm:p-12 rounded-xl sm:rounded-2xl border dark:border-[#1DA9D0]/15 border-slate-200 text-center text-xs dark:text-[#F5EACA]/60 text-slate-500 space-y-2 sm:space-y-3 shadow-sm">
              <PackageIcon className="w-8 h-8 sm:w-10 sm:h-10 mx-auto dark:text-[#1DA9D0]/40 text-slate-400" />
              <p>Belum ada paket layanan ditambahkan.</p>
            </div>
          ) : (
            packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

        <PackageModal
          isOpen={modalOpen}
          isEditing={Boolean(editingId)}
          isSubmitting={isSubmitting}
          name={name}
          unit={unit}
          price={price}
          durationValue={durationValue}
          durationUnit={durationUnit}
          onNameChange={setName}
          onUnitChange={setUnit}
          onPriceChange={setPrice}
          onDurationValueChange={setDurationValue}
          onDurationUnitChange={setDurationUnit}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      </div>
    </DashboardLayout>
  );
}
