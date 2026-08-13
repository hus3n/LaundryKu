'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { api } from '@/lib/api';
import { UserCheck, Plus, Edit, Trash2, Mail, Phone, Lock } from 'lucide-react';
import type { Employee } from '@/types';
import { getApiErrorMessage } from '@/lib/utils';

export default function EmployeeManagementPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get('/employees');
      setEmployees(res.data.data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan. Silakan refresh halaman.';
      setError(message);
      console.error('[EmployeePage] Failed to load employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setName('');
    setEmail('');
    setPassword('');
    setPhone('');
    setModalOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditingId(emp.id);
    setName(emp.name);
    setEmail(emp.email);
    setPassword('');
    setPhone(emp.phone || '');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingId) {
        await api.put(`/employees/${editingId}`, {
          name,
          phone,
          ...(password ? { password } : {}),
        });
      } else {
        await api.post('/employees', {
          name,
          email,
          password,
          phone,
        });
      }

      setModalOpen(false);
      loadEmployees();
    } catch (err: unknown) {
      alert(getApiErrorMessage(err, 'Gagal menyimpan data karyawan'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menonaktifkan karyawan ini?')) {
      try {
        await api.delete(`/employees/${id}`);
        loadEmployees();
      } catch (err: unknown) {
        alert(getApiErrorMessage(err, 'Gagal menonaktifkan karyawan'));
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Kelola Data Karyawan</h1>
            <p className="text-xs text-slate-400 mt-1">Daftar staf/karyawan kasir laundry yang memiliki hak akses aplikasi</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold text-xs shadow-lg shadow-brand-500/20 transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tambah Karyawan
          </button>
        </div>

        {/* Employee Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {error ? (
            <div className="col-span-3 text-center py-12 text-xs text-rose-400">⚠️ {error}</div>
          ) : loading ? (
            <div className="col-span-3 text-center py-12 text-xs text-slate-400">Memuat data karyawan...</div>
          ) : employees.length === 0 ? (
            <div className="col-span-3 glass-card-dark p-12 rounded-2xl text-center text-xs text-slate-400 space-y-3">
              <UserCheck className="w-10 h-10 mx-auto text-slate-600" />
              <p>Belum ada karyawan terdaftar.</p>
            </div>
          ) : (
            employees.map((emp) => (
              <div key={emp.id} className="glass-card-dark p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center font-bold text-brand-400">
                      {emp.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{emp.name}</h4>
                      <span className="text-[10px] text-slate-400">
                        {emp._count?.ordersTaken || 0} Cucian Dicatat
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(emp)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-brand-400 hover:bg-slate-800"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(emp.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Mail className="w-3.5 h-3.5 text-slate-500" /> {emp.email}
                  </div>
                  {emp.phone && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Phone className="w-3.5 h-3.5 text-slate-500" /> {emp.phone}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="glass-card-dark p-6 rounded-3xl border border-slate-800 max-w-md w-full space-y-4">
              <h3 className="text-base font-bold text-white">
                {editingId ? 'Edit Karyawan' : 'Tambah Karyawan Baru'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Karyawan</label>
                  <input
                    type="email"
                    required
                    disabled={!!editingId}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="budi@laundryku.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {editingId ? 'Password Baru (Kosongkan jika tidak diubah)' : 'Password Karyawan'}
                  </label>
                  <input
                    type="password"
                    required={!editingId}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">No. WhatsApp / HP</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="081234567890"
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
