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
            <h1 className="text-2xl font-bold text-white">Kelola Kategori Cucian</h1>
            <p className="text-xs text-slate-400 mt-1">Kategori jenis barang (Kiloan, Satuan, Bed Cover, Karpet, Sepatu, dll)</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold text-xs shadow-lg shadow-brand-500/20 transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tambah Kategori
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {error ? (
            <div className="col-span-4 text-center py-12 text-xs text-rose-400">⚠️ {error}</div>
          ) : loading ? (
            <div className="col-span-4 text-center py-12 text-xs text-slate-400">Memuat data kategori...</div>
          ) : categories.length === 0 ? (
            <div className="col-span-4 glass-card-dark p-12 rounded-2xl text-center text-xs text-slate-400 space-y-3">
              <Layers className="w-10 h-10 mx-auto text-slate-600" />
              <p>Belum ada kategori cucian. Tambahkan kategori pertama Anda.</p>
            </div>
          ) : (
            categories.map((cat) => (
              <div key={cat.id} className="glass-card-dark p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent-purple/20 border border-accent-purple/30 flex items-center justify-center text-accent-purple">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-white text-sm">{cat.name}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-brand-400 hover:bg-slate-800"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="glass-card-dark p-6 rounded-3xl border border-slate-800 max-w-sm w-full space-y-4">
              <h3 className="text-base font-bold text-white">
                {editingId ? 'Edit Kategori' : 'Tambah Kategori Baru'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Kategori</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Kiloan, Bed Cover, Jas"
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
