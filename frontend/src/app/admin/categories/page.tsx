'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { api } from '@/lib/api';
import { Layers, Plus, Edit, Trash2 } from 'lucide-react';
import type { Category } from '@/types';
import { getApiErrorMessage } from '@/lib/utils';

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan. Silakan refresh halaman.';
      setError(message);
      console.error('[CategoryPage] Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setName('');
    setModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, { name });
      } else {
        await api.post('/categories', { name });
      }

      setModalOpen(false);
      loadCategories();
    } catch (err: unknown) {
      alert(getApiErrorMessage(err, 'Gagal menyimpan kategori'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      try {
        await api.delete(`/categories/${id}`);
        loadCategories();
      } catch (err: unknown) {
        alert(getApiErrorMessage(err, 'Gagal menghapus kategori'));
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#F5EACA]">Kelola Kategori Cucian</h1>
            <p className="text-xs text-[#F5EACA]/60 mt-1">Kategori jenis barang (Kiloan, Satuan, Bed Cover, Karpet, Sepatu, dll)</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] hover:opacity-95 text-[#010E1C] font-bold text-xs shadow-lg shadow-[#1DA9D0]/20 transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tambah Kategori
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {error ? (
            <div className="col-span-4 text-center py-12 text-xs text-rose-400">⚠️ {error}</div>
          ) : loading ? (
            <div className="col-span-4 text-center py-12 text-xs text-[#F5EACA]/60">Memuat data kategori...</div>
          ) : categories.length === 0 ? (
            <div className="col-span-4 glass-card-dark p-12 rounded-2xl text-center text-xs text-[#F5EACA]/60 space-y-3">
              <Layers className="w-10 h-10 mx-auto text-[#1DA9D0]/40" />
              <p>Belum ada kategori cucian. Tambahkan kategori pertama Anda.</p>
            </div>
          ) : (
            categories.map((cat) => (
              <div key={cat.id} className="glass-card-dark p-5 rounded-2xl border border-[#1DA9D0]/15 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#1DA9D0]/20 border border-[#1DA9D0]/30 flex items-center justify-center text-[#43D5CC]">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-[#F5EACA] text-sm">{cat.name}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 rounded-lg text-[#F5EACA]/60 hover:text-[#43D5CC] hover:bg-[#013D66] transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-1.5 rounded-lg text-[#F5EACA]/60 hover:text-rose-400 hover:bg-[#013D66] transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#010E1C]/85 backdrop-blur-sm">
            <div className="bg-[#012040] p-6 rounded-3xl border border-[#1DA9D0]/25 max-w-sm w-full space-y-4 shadow-2xl">
              <h3 className="text-base font-bold text-[#F5EACA]">
                {editingId ? 'Edit Kategori' : 'Tambah Kategori Baru'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#F5EACA]/80 mb-1">Nama Kategori</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Kiloan, Bed Cover, Jas"
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
                    {editingId ? 'Simpan' : 'Tambah'}
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
