'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { api } from '@/lib/api';
import { Building2, Plus, Edit, Trash2 } from 'lucide-react';

export default function OutletManagementPage() {
  const [outlets, setOutlets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      console.error('Failed to load outlets', err);
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

  const handleOpenEdit = (outlet: any) => {
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
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal menyimpan outlet');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menonaktifkan outlet ini? Outlet tidak akan dihapus permanen agar data pesanan lama tetap aman.')) {
      try {
        await api.delete(`/outlets/${id}`);
        loadOutlets();
      } catch (err: any) {
        alert(err.response?.data?.error || 'Gagal menonaktifkan outlet');
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Kelola Outlet</h1>
            <p className="text-xs text-slate-400 mt-1">Daftar cabang/outlet dari toko Anda</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold text-xs shadow-lg shadow-brand-500/20 transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tambah Outlet
          </button>
        </div>

        <div className="glass-card-dark rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Nama Outlet</th>
                  <th className="py-3.5 px-4 font-semibold">Alamat</th>
                  <th className="py-3.5 px-4 font-semibold">Nomor Telepon</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">Memuat data...</td>
                  </tr>
                ) : outlets.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-400 space-y-3">
                      <Building2 className="w-8 h-8 mx-auto text-slate-600" />
                      <p>Belum ada outlet ditambahkan.</p>
                    </td>
                  </tr>
                ) : (
                  outlets.map((outlet) => (
                    <tr key={outlet.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-4 text-white font-medium">{outlet.name}</td>
                      <td className="py-3 px-4 text-slate-300">{outlet.address || '—'}</td>
                      <td className="py-3 px-4 text-slate-300">{outlet.phone || '—'}</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end items-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(outlet)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-400 hover:bg-slate-800"
                            title="Edit Outlet"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(outlet.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="glass-card-dark p-6 rounded-3xl border border-slate-800 max-w-md w-full space-y-4">
              <h3 className="text-base font-bold text-white">
                {editingId ? 'Edit Outlet' : 'Tambah Outlet Baru'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Outlet *</label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Cabang Utama"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Alamat (Opsional)</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={2}
                    placeholder="Alamat lengkap outlet..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nomor Telepon (Opsional)</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 08123456789"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
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
