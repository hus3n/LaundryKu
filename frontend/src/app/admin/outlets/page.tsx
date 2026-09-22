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
      <div className="space-y-3 sm:space-y-6">
        <div className="flex flex-row justify-between items-center gap-2 sm:gap-4">
          <div>
            <h1 className="text-base sm:text-2xl font-bold dark:text-[#F5EACA] text-slate-900">Kelola Outlet</h1>
            <p className="text-[10px] sm:text-xs dark:text-[#F5EACA]/60 text-slate-500 mt-0.5 sm:mt-1">Daftar cabang/outlet dari toko Anda</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="px-2.5 sm:px-5 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] hover:opacity-95 text-[#010E1C] font-bold text-[11px] sm:text-xs shadow-md shadow-[#1DA9D0]/20 transition-all inline-flex items-center gap-1 sm:gap-2 shrink-0"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Tambah Outlet</span>
          </button>
        </div>

        {/* Mobile View */}
        <div className="block md:hidden space-y-2">
          {error ? (
            <div className="glass-card-dark p-4 rounded-xl text-center text-xs text-rose-500">⚠️ {error}</div>
          ) : loading ? (
            <div className="glass-card-dark p-4 rounded-xl text-center text-xs dark:text-[#F5EACA]/60 text-slate-500">Memuat data...</div>
          ) : outlets.length === 0 ? (
            <div className="glass-card-dark p-6 rounded-xl text-center dark:text-[#F5EACA]/60 text-slate-500 space-y-2">
              <Building2 className="w-8 h-8 mx-auto dark:text-[#1DA9D0]/40 text-slate-400" />
              <p className="text-xs">Belum ada outlet ditambahkan.</p>
            </div>
          ) : (
            outlets.map((outlet) => (
              <div key={outlet.id} className="glass-card-dark p-2.5 rounded-xl border dark:border-[#1DA9D0]/15 border-slate-200 flex items-center justify-between gap-2 shadow-sm">
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold dark:text-[#F5EACA] text-slate-900 truncate">{outlet.name}</h4>
                  <p className="text-[11px] dark:text-[#F5EACA]/70 text-slate-600 truncate mt-0.5">{outlet.address || 'Tanpa alamat'}</p>
                  {outlet.phone && (
                    <p className="text-[10px] dark:text-[#43D5CC] text-teal-600 truncate">{outlet.phone}</p>
                  )}
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(outlet)}
                    className="p-1.5 rounded-lg dark:text-[#F5EACA]/60 text-slate-500 dark:hover:text-[#43D5CC] hover:text-teal-600 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(outlet.id)}
                    className="p-1.5 rounded-lg dark:text-[#F5EACA]/60 text-slate-500 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block glass-card-dark rounded-2xl border dark:border-[#1DA9D0]/15 border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="dark:bg-[#012040] bg-slate-100 border-b dark:border-[#1DA9D0]/15 border-slate-200 dark:text-[#F5EACA]/60 text-slate-600">
                <tr>
                  <th className="py-3 px-4 font-semibold">Nama Outlet</th>
                  <th className="py-3 px-4 font-semibold">Alamat</th>
                  <th className="py-3 px-4 font-semibold">Nomor Telepon</th>
                  <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-[#1DA9D0]/10 divide-slate-200">
                {error ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-rose-500">⚠️ {error}</td>
                  </tr>
                ) : loading ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center dark:text-[#F5EACA]/60 text-slate-500">Memuat data...</td>
                  </tr>
                ) : outlets.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center dark:text-[#F5EACA]/60 text-slate-500 space-y-3">
                      <Building2 className="w-8 h-8 mx-auto dark:text-[#1DA9D0]/40 text-slate-400" />
                      <p>Belum ada outlet ditambahkan.</p>
                    </td>
                  </tr>
                ) : (
                  outlets.map((outlet) => (
                    <tr key={outlet.id} className="dark:hover:bg-[#013D66]/50 hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-4 dark:text-[#F5EACA] text-slate-900 font-medium">{outlet.name}</td>
                      <td className="py-2.5 px-4 dark:text-[#F5EACA]/80 text-slate-700">{outlet.address || '—'}</td>
                      <td className="py-2.5 px-4 dark:text-[#F5EACA]/80 text-slate-700">{outlet.phone || '—'}</td>
                      <td className="py-2.5 px-4">
                        <div className="flex justify-end items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(outlet)}
                            className="p-1.5 rounded-lg dark:text-[#F5EACA]/60 text-slate-500 dark:hover:text-[#43D5CC] hover:text-teal-600 dark:hover:bg-[#013D66] hover:bg-slate-100 transition-colors"
                            title="Edit Outlet"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(outlet.id)}
                            className="p-1.5 rounded-lg dark:text-[#F5EACA]/60 text-slate-500 hover:text-rose-500 dark:hover:bg-[#013D66] hover:bg-slate-100 transition-colors"
                            title="Nonaktifkan Outlet"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 dark:bg-[#010E1C]/85 bg-slate-900/40 backdrop-blur-sm">
            <div className="dark:bg-[#012040] bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border dark:border-[#1DA9D0]/25 border-slate-200 max-w-md w-full space-y-3 sm:space-y-4 shadow-2xl">
              <h3 className="text-sm sm:text-base font-bold dark:text-[#F5EACA] text-slate-900">
                {editingId ? 'Edit Outlet' : 'Tambah Outlet Baru'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-0.5 sm:mb-1">Nama Outlet *</label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Cabang Utama"
                    className="w-full px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl dark:bg-[#013D66] bg-slate-50 border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/50 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-0.5 sm:mb-1">Alamat (Opsional)</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={2}
                    placeholder="Alamat lengkap outlet..."
                    className="w-full px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl dark:bg-[#013D66] bg-slate-50 border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/50 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-0.5 sm:mb-1">Nomor Telepon (Opsional)</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 08123456789"
                    className="w-full px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl dark:bg-[#013D66] bg-slate-50 border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/50 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0]"
                  />
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
                    {editingId ? 'Simpan' : 'Tambah Outlet'}
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
