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
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#F5EACA]">Kelola Paket Layanan</h1>
            <p className="text-xs text-[#F5EACA]/60 mt-1">Pengaturan jenis paket cucian, harga, dan satuan unit toko</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] hover:opacity-95 text-[#010E1C] font-bold text-xs shadow-lg shadow-[#1DA9D0]/20 transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tambah Paket Baru
          </button>
        </div>

        {/* Package Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {error ? (
            <div className="col-span-3 text-center py-12 text-xs text-rose-400">⚠️ {error}</div>
          ) : loading ? (
            <div className="col-span-3 text-center py-12 text-xs text-[#F5EACA]/60">Memuat data paket...</div>
          ) : packages.length === 0 ? (
            <div className="col-span-3 glass-card-dark p-12 rounded-2xl text-center text-xs text-[#F5EACA]/60 space-y-3">
              <PackageIcon className="w-10 h-10 mx-auto text-[#1DA9D0]/40" />
              <p>Belum ada paket layanan ditambahkan.</p>
            </div>
          ) : (
            packages.map((pkg) => (
              <div key={pkg.id} className="glass-card-dark p-6 rounded-2xl border border-[#1DA9D0]/15 space-y-4 relative">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-[#F5EACA] text-base">{pkg.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1DA9D0]/20 text-[#43D5CC] border border-[#1DA9D0]/30 font-medium">
                      Per {pkg.unit}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(pkg)}
                      className="p-2 rounded-lg text-[#F5EACA]/60 hover:text-[#43D5CC] hover:bg-[#013D66] transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="p-2 rounded-lg text-[#F5EACA]/60 hover:text-rose-400 hover:bg-[#013D66] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#1DA9D0]/15 flex justify-between items-center text-xs">
                  <span className="text-[#F5EACA]/60">Harga Layanan:</span>
                  <span className="text-base font-bold text-[#43D5CC]">
                    Rp {Number(pkg.price).toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="text-[11px] text-[#F5EACA]/60 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#EA8803]" />
                  Estimasi pengerjaan: {formatDuration(pkg.estimatedDuration)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Create / Edit */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#010E1C]/85 backdrop-blur-sm">
            <div className="bg-[#012040] p-6 rounded-3xl border border-[#1DA9D0]/25 max-w-md w-full space-y-4 shadow-2xl">
              <h3 className="text-base font-bold text-[#F5EACA]">
                {editingId ? 'Edit Paket Layanan' : 'Tambah Paket Baru'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#F5EACA]/80 mb-1">Nama Paket</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Cuci Komplit, Setrika Saja"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#013D66] border border-[#1DA9D0]/25 text-xs text-[#F5EACA] placeholder-[#1DA9D0]/50 focus:outline-none focus:border-[#1DA9D0]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#F5EACA]/80 mb-1">Satuan Unit</label>
                    <input
                      type="text"
                      required
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      placeholder="kg, pcs, meter"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#013D66] border border-[#1DA9D0]/25 text-xs text-[#F5EACA] focus:outline-none focus:border-[#1DA9D0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#F5EACA]/80 mb-1">Harga (Rp)</label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="7000"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#013D66] border border-[#1DA9D0]/25 text-xs text-[#F5EACA] focus:outline-none focus:border-[#1DA9D0]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F5EACA]/80 mb-1">
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
                      className="w-full px-3.5 py-2 rounded-xl bg-[#013D66] border border-[#1DA9D0]/25 text-xs text-[#F5EACA] focus:outline-none focus:border-[#1DA9D0]"
                    />
                    <select
                      value={durationUnit}
                      onChange={(e) => setDurationUnit(e.target.value)}
                      className="px-3.5 py-2 rounded-xl bg-[#013D66] border border-[#1DA9D0]/25 text-xs text-[#F5EACA] focus:outline-none focus:border-[#1DA9D0] w-24 shrink-0"
                    >
                      <option value="jam">Jam</option>
                      <option value="hari">Hari</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#013D66] text-[#F5EACA]/80 text-xs font-semibold hover:bg-[#014775] border border-[#1DA9D0]/25 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] hover:opacity-95 text-[#010E1C] font-bold text-xs disabled:opacity-50 transition-all"
                  >
                    {editingId ? 'Simpan Perubahan' : 'Tambah Paket'}
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
