'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { api } from '@/lib/api';
import { Package as PackageIcon, Plus, Edit, Trash2, CheckCircle2, Clock, DollarSign } from 'lucide-react';
import { formatDuration } from '@/lib/utils';
import type { LaundryPackage } from '@/types';
import { getApiErrorMessage } from '@/lib/utils';

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
            <h1 className="text-base sm:text-2xl font-bold dark:text-[#F5EACA] text-slate-900">Kelola Paket Layanan</h1>
            <p className="text-[10px] sm:text-xs dark:text-[#F5EACA]/60 text-slate-500 mt-0.5 sm:mt-1">Pengaturan jenis paket cucian, harga, dan satuan unit toko</p>
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
            <div className="col-span-3 text-center py-8 text-xs dark:text-[#F5EACA]/60 text-slate-500">Memuat data paket...</div>
          ) : packages.length === 0 ? (
            <div className="col-span-3 glass-card-dark p-8 sm:p-12 rounded-xl sm:rounded-2xl border dark:border-[#1DA9D0]/15 border-slate-200 text-center text-xs dark:text-[#F5EACA]/60 text-slate-500 space-y-2 sm:space-y-3 shadow-sm">
              <PackageIcon className="w-8 h-8 sm:w-10 sm:h-10 mx-auto dark:text-[#1DA9D0]/40 text-slate-400" />
              <p>Belum ada paket layanan ditambahkan.</p>
            </div>
          ) : (
            packages.map((pkg) => (
              <div key={pkg.id} className="glass-card-dark p-3 sm:p-6 rounded-xl sm:rounded-2xl border dark:border-[#1DA9D0]/15 border-slate-200 space-y-2.5 sm:space-y-4 relative shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold dark:text-[#F5EACA] text-slate-900 text-sm sm:text-base">{pkg.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full dark:bg-[#1DA9D0]/20 bg-teal-50 dark:text-[#43D5CC] text-teal-700 border dark:border-[#1DA9D0]/30 border-teal-200 font-medium">
                      Per {pkg.unit}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <button
                      onClick={() => handleOpenEdit(pkg)}
                      className="p-1.5 rounded-lg dark:text-[#F5EACA]/60 text-slate-500 dark:hover:text-[#43D5CC] hover:text-teal-600 dark:hover:bg-[#013D66] hover:bg-slate-100 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="p-1.5 rounded-lg dark:text-[#F5EACA]/60 text-slate-500 hover:text-rose-500 dark:hover:bg-[#013D66] hover:bg-slate-100 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t dark:border-[#1DA9D0]/15 border-slate-200 flex justify-between items-center text-xs">
                  <span className="dark:text-[#F5EACA]/60 text-slate-500">Harga Layanan:</span>
                  <span className="text-sm sm:text-base font-bold dark:text-[#43D5CC] text-teal-600">
                    Rp {Number(pkg.price).toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="text-[10px] sm:text-[11px] dark:text-[#F5EACA]/60 text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 dark:text-[#EA8803] text-amber-500" />
                  Estimasi pengerjaan: {formatDuration(pkg.estimatedDuration)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Create / Edit */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 dark:bg-[#010E1C]/85 bg-slate-900/40 backdrop-blur-sm">
            <div className="dark:bg-[#012040] bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border dark:border-[#1DA9D0]/25 border-slate-200 max-w-md w-full space-y-3 sm:space-y-4 shadow-2xl">
              <h3 className="text-sm sm:text-base font-bold dark:text-[#F5EACA] text-slate-900">
                {editingId ? 'Edit Paket Layanan' : 'Tambah Paket Baru'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-0.5 sm:mb-1">Nama Paket</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Cuci Komplit, Setrika Saja"
                    className="w-full px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl dark:bg-[#013D66] bg-slate-50 border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/50 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  <div>
                    <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-0.5 sm:mb-1">Satuan Unit</label>
                    <input
                      type="text"
                      required
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      placeholder="kg, pcs, meter"
                      className="w-full px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl dark:bg-[#013D66] bg-slate-50 border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 focus:outline-none focus:border-[#1DA9D0]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-0.5 sm:mb-1">Harga (Rp)</label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="7000"
                      className="w-full px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl dark:bg-[#013D66] bg-slate-50 border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 focus:outline-none focus:border-[#1DA9D0]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-0.5 sm:mb-1">
                    Estimasi Pengerjaan
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      required
                      min={1}
                      value={durationValue}
                      onChange={(e) => setDurationValue(e.target.value)}
                      placeholder="24"
                      className="w-full px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl dark:bg-[#013D66] bg-slate-50 border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 focus:outline-none focus:border-[#1DA9D0]"
                    />
                    <select
                      value={durationUnit}
                      onChange={(e) => setDurationUnit(e.target.value)}
                      className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl dark:bg-[#013D66] bg-slate-50 border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 focus:outline-none focus:border-[#1DA9D0] w-20 sm:w-24 shrink-0"
                    >
                      <option value="jam" className="dark:bg-[#012040] dark:text-[#F5EACA] bg-white text-slate-900">Jam</option>
                      <option value="hari" className="dark:bg-[#012040] dark:text-[#F5EACA] bg-white text-slate-900">Hari</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 sm:pt-4 flex justify-end gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl dark:bg-[#013D66] bg-slate-100 dark:text-[#F5EACA]/80 text-slate-700 text-xs font-semibold dark:hover:bg-[#014775] hover:bg-slate-200 border dark:border-[#1DA9D0]/25 border-slate-300 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] hover:opacity-95 text-[#010E1C] font-bold text-xs disabled:opacity-50 transition-all shadow-sm"
                  >
                    {editingId ? 'Simpan' : 'Tambah Paket'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
