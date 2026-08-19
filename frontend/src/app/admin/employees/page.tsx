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
            <h1 className="text-2xl font-bold text-[#F5EACA]">Kelola Data Karyawan</h1>
            <p className="text-xs text-[#F5EACA]/60 mt-1">Daftar staf/karyawan kasir laundry yang memiliki hak akses aplikasi</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] hover:opacity-95 text-[#010E1C] font-bold text-xs shadow-lg shadow-[#1DA9D0]/20 transition-all inline-flex items-center gap-2"
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
            <div className="col-span-3 text-center py-12 text-xs text-[#F5EACA]/60">Memuat data karyawan...</div>
          ) : employees.length === 0 ? (
            <div className="col-span-3 glass-card-dark p-12 rounded-2xl text-center text-xs text-[#F5EACA]/60 space-y-3">
              <UserCheck className="w-10 h-10 mx-auto text-[#1DA9D0]/40" />
              <p>Belum ada karyawan terdaftar.</p>
            </div>
          ) : (
            employees.map((emp) => (
              <div key={emp.id} className="glass-card-dark p-6 rounded-2xl border border-[#1DA9D0]/15 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1DA9D0]/20 border border-[#1DA9D0]/30 flex items-center justify-center font-bold text-[#43D5CC]">
                      {emp.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#F5EACA] text-sm">{emp.name}</h4>
                      <span className="text-[10px] text-[#F5EACA]/60">
                        {emp._count?.ordersTaken || 0} Cucian Dicatat
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(emp)}
                      className="p-1.5 rounded-lg text-[#F5EACA]/60 hover:text-[#43D5CC] hover:bg-[#013D66] transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(emp.id)}
                      className="p-1.5 rounded-lg text-[#F5EACA]/60 hover:text-rose-400 hover:bg-[#013D66] transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-[#F5EACA]/80 pt-2 border-t border-[#1DA9D0]/15">
                  <div className="flex items-center gap-2 text-[#F5EACA]/60">
                    <Mail className="w-3.5 h-3.5 text-[#1DA9D0]/50" /> {emp.email}
                  </div>
                  {emp.phone && (
                    <div className="flex items-center gap-2 text-[#F5EACA]/60">
                      <Phone className="w-3.5 h-3.5 text-[#1DA9D0]/50" /> {emp.phone}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#010E1C]/85 backdrop-blur-sm">
            <div className="bg-[#012040] p-6 rounded-3xl border border-[#1DA9D0]/25 max-w-md w-full space-y-4 shadow-2xl">
              <h3 className="text-base font-bold text-[#F5EACA]">
                {editingId ? 'Edit Karyawan' : 'Tambah Karyawan Baru'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#F5EACA]/80 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#013D66] border border-[#1DA9D0]/25 text-xs text-[#F5EACA] placeholder-[#1DA9D0]/50 focus:outline-none focus:border-[#1DA9D0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F5EACA]/80 mb-1">Email Karyawan</label>
                  <input
                    type="email"
                    required
                    disabled={!!editingId}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="budi@laundryku.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#013D66] border border-[#1DA9D0]/25 text-xs text-[#F5EACA] placeholder-[#1DA9D0]/50 focus:outline-none focus:border-[#1DA9D0] disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F5EACA]/80 mb-1">
                    {editingId ? 'Password Baru (Kosongkan jika tidak diubah)' : 'Password Karyawan'}
                  </label>
                  <input
                    type="password"
                    required={!editingId}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#013D66] border border-[#1DA9D0]/25 text-xs text-[#F5EACA] placeholder-[#1DA9D0]/50 focus:outline-none focus:border-[#1DA9D0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F5EACA]/80 mb-1">No. WhatsApp / HP</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="081234567890"
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
