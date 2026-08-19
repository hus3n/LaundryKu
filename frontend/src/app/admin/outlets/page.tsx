'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { api } from '@/lib/api';
import { Building2, Plus, Edit, Trash2 } from 'lucide-react';
import type { Outlet } from '@/types';
import { getApiErrorMessage } from '@/lib/utils';

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
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#F5EACA]">Kelola Outlet</h1>
            <p className="text-xs text-[#F5EACA]/60 mt-1">Daftar cabang/outlet dari toko Anda</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] hover:opacity-95 text-[#010E1C] font-bold text-xs shadow-lg shadow-[#1DA9D0]/20 transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tambah Outlet
          </button>
        </div>

        <div className="glass-card-dark rounded-2xl border border-[#1DA9D0]/15 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#012040] border-b border-[#1DA9D0]/15 text-[#F5EACA]/60">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Nama Outlet</th>
                  <th className="py-3.5 px-4 font-semibold">Alamat</th>
                  <th className="py-3.5 px-4 font-semibold">Nomor Telepon</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1DA9D0]/10">
                {error ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-rose-400">⚠️ {error}</td>
                  </tr>
                ) : loading ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-[#F5EACA]/60">Memuat data...</td>
                  </tr>
                ) : outlets.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-[#F5EACA]/60 space-y-3">
                      <Building2 className="w-8 h-8 mx-auto text-[#1DA9D0]/40" />
                      <p>Belum ada outlet ditambahkan.</p>
                    </td>
                  </tr>
                ) : (
                  outlets.map((outlet) => (
                    <tr key={outlet.id} className="hover:bg-[#013D66]/50 transition-colors">
                      <td className="py-3 px-4 text-[#F5EACA] font-medium">{outlet.name}</td>
                      <td className="py-3 px-4 text-[#F5EACA]/80">{outlet.address || '—'}</td>
                      <td className="py-3 px-4 text-[#F5EACA]/80">{outlet.phone || '—'}</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end items-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(outlet)}
                            className="p-1.5 rounded-lg text-[#F5EACA]/60 hover:text-[#43D5CC] hover:bg-[#013D66] transition-colors"
                            title="Edit Outlet"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(outlet.id)}
                            className="p-1.5 rounded-lg text-[#F5EACA]/60 hover:text-rose-400 hover:bg-[#013D66] transition-colors"
                            title="Nonaktifkan Outlet"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Create / Edit */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#010E1C]/85 backdrop-blur-sm">
            <div className="bg-[#012040] p-6 rounded-3xl border border-[#1DA9D0]/25 max-w-md w-full space-y-4 shadow-2xl">
              <h3 className="text-base font-bold text-[#F5EACA]">
                {editingId ? 'Edit Outlet' : 'Tambah Outlet Baru'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#F5EACA]/80 mb-1">Nama Outlet *</label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Cabang Utama"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#013D66] border border-[#1DA9D0]/25 text-xs text-[#F5EACA] placeholder-[#1DA9D0]/50 focus:outline-none focus:border-[#1DA9D0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F5EACA]/80 mb-1">Alamat (Opsional)</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={2}
                    placeholder="Alamat lengkap outlet..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#013D66] border border-[#1DA9D0]/25 text-xs text-[#F5EACA] placeholder-[#1DA9D0]/50 focus:outline-none focus:border-[#1DA9D0] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F5EACA]/80 mb-1">Nomor Telepon (Opsional)</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 08123456789"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#013D66] border border-[#1DA9D0]/25 text-xs text-[#F5EACA] placeholder-[#1DA9D0]/50 focus:outline-none focus:border-[#1DA9D0]"
                  />
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
                    {editingId ? 'Simpan Perubahan' : 'Tambah Outlet'}
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
