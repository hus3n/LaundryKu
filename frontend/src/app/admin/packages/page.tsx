'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { api } from '@/lib/api';
import { Package as PackageIcon, Plus, Edit, Trash2, CheckCircle2, Clock, DollarSign } from 'lucide-react';
import { formatDuration } from '@/lib/utils';

export default function PackageManagementPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      console.error('Failed to load packages', err);
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

  const handleOpenEdit = (pkg: any) => {
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
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal menyimpan paket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus paket ini?')) {
      try {
        await api.delete(`/packages/${id}`);
        loadPackages();
      } catch (err: any) {
        alert(err.response?.data?.error || 'Gagal menghapus paket');
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Kelola Paket Layanan</h1>
            <p className="text-xs text-slate-400 mt-1">Pengaturan jenis paket cucian, harga, dan satuan unit toko</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold text-xs shadow-lg shadow-brand-500/20 transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tambah Paket Baru
          </button>
        </div>

        {/* Package Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-3 text-center py-12 text-xs text-slate-400">Memuat data paket...</div>
          ) : packages.length === 0 ? (
            <div className="col-span-3 glass-card-dark p-12 rounded-2xl text-center text-xs text-slate-400 space-y-3">
              <PackageIcon className="w-10 h-10 mx-auto text-slate-600" />
              <p>Belum ada paket layanan ditambahkan.</p>
            </div>
          ) : (
            packages.map((pkg) => (
              <div key={pkg.id} className="glass-card-dark p-6 rounded-2xl border border-slate-800 space-y-4 relative">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white text-base">{pkg.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-medium">
                      Per {pkg.unit}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(pkg)}
                      className="p-2 rounded-lg text-slate-400 hover:text-brand-400 hover:bg-slate-800"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Harga Layanan:</span>
                  <span className="text-base font-bold text-emerald-400">
                    Rp {Number(pkg.price).toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Estimasi pengerjaan: {formatDuration(pkg.estimatedDuration)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Create / Edit */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="glass-card-dark p-6 rounded-3xl border border-slate-800 max-w-md w-full space-y-4">
              <h3 className="text-base font-bold text-white">
                {editingId ? 'Edit Paket Layanan' : 'Tambah Paket Baru'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Paket</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Cuci Komplit, Setrika Saja"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Satuan Unit</label>
                    <input
                      type="text"
                      required
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      placeholder="kg, pcs, meter"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Harga (Rp)</label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="7000"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
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
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                    />
                    <select
                      value={durationUnit}
                      onChange={(e) => setDurationUnit(e.target.value)}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500 w-24 shrink-0"
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
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-xs font-semibold disabled:opacity-50"
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
