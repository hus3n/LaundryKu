'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ExtendSubscriptionModal from '@/components/ui/ExtendSubscriptionModal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import CreateTrialModal from '@/components/ui/CreateTrialModal';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Edit, Trash2, Calendar, Phone, Mail, CheckCircle2, XCircle, RefreshCw, Zap } from 'lucide-react';
import type { AdminUser } from '@/types';
import { getApiErrorMessage } from '@/lib/utils';

export default function AdminStoreManagementPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal Extend Subscription
  const [selectedAdminForExtend, setSelectedAdminForExtend] = useState<AdminUser | null>(null);
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);

  // Modal Delete Confirmation
  const [adminToDelete, setAdminToDelete] = useState<AdminUser | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [createErrorMsg, setCreateErrorMsg] = useState<string | null>(null);

  // Modal Create
  const [modalOpen, setModalOpen] = useState(false);
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [durationMonths, setDurationMonths] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const res = await api.get('/superadmin/admins');
      setAdmins(res.data.data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan. Silakan refresh halaman.';
      setError(message);
      console.error('[AdminStorePage] Failed to load admins:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleOpenCreate = () => {
    setStoreName('');
    setName('');
    setEmail('');
    setPassword('');
    setPhone('');
    setStoreAddress('');
    setDurationMonths(1);
    setCreateErrorMsg(null);
    setModalOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setCreateErrorMsg(null);

    try {
      await api.post('/superadmin/admins', {
        storeName,
        name,
        email,
        password,
        phone,
        storeAddress: storeAddress || undefined,
        durationMonths: Number(durationMonths),
      });

      setModalOpen(false);
      loadAdmins();
    } catch (err: unknown) {
      setCreateErrorMsg(getApiErrorMessage(err, 'Gagal mendaftarkan Admin toko baru'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenExtend = (admin: AdminUser) => {
    setSelectedAdminForExtend(admin);
    setIsExtendModalOpen(true);
  };

  const handleToggleStatus = async (adminId: string, currentStatus: boolean) => {
    try {
      await api.patch(`/superadmin/admins/${adminId}/toggle-status`, { isActive: !currentStatus });
      loadAdmins();
    } catch (err: unknown) {
      alert(getApiErrorMessage(err, 'Gagal mengubah status akun'));
    }
  };

  const handleOpenDelete = (admin: AdminUser) => {
    setAdminToDelete(admin);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!adminToDelete) return;
    setIsDeleting(true);
    try {
      await api.delete(`/superadmin/admins/${adminToDelete.id}`);
      setIsDeleteModalOpen(false);
      setAdminToDelete(null);
      loadAdmins();
    } catch (err: unknown) {
      alert(getApiErrorMessage(err, 'Gagal menghapus Admin toko'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#F5EACA]">Kelola Admin Toko Laundry</h1>
            <p className="text-xs text-[#F5EACA]/60 mt-1">Daftar akun pemilik laundry terdaftar, pengesahan pendaftaran, dan masa aktif</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsTrialModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#EA8803] to-[#EA8803]/80 hover:opacity-95 text-[#010E1C] font-bold text-xs shadow-lg shadow-[#EA8803]/20 transition-all inline-flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Buat Akun Trial
            </button>
            <button
              onClick={handleOpenCreate}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] hover:opacity-95 text-[#010E1C] font-bold text-xs shadow-lg shadow-[#1DA9D0]/20 transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Daftarkan Admin Toko Baru
            </button>
          </div>
        </div>

        {/* Admins Table */}
        <div className="glass-card-dark rounded-2xl border border-[#1DA9D0]/15 overflow-hidden">
          {error ? (
            <div className="text-center py-12 text-xs text-rose-400">⚠️ {error}</div>
          ) : loading ? (
            <div className="text-center py-12 text-xs text-[#F5EACA]/60">Memuat data Admin toko...</div>
          ) : admins.length === 0 ? (
            <div className="text-center py-16 text-xs text-[#F5EACA]/60 space-y-3">
              <Users className="w-12 h-12 mx-auto text-[#1DA9D0]/30" />
              <p>Belum ada Admin toko terdaftar.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1DA9D0]/15 text-[#F5EACA]/60 font-medium bg-[#012040]">
                    <th className="py-3.5 px-4">Nama Toko & Penanggung Jawab</th>
                    <th className="py-3.5 px-4">Kontak (Email / WA)</th>
                    <th className="py-3.5 px-4">Masa Aktif Langganan</th>
                    <th className="py-3.5 px-4">Status WA Toko</th>
                    <th className="py-3.5 px-4">Status Akun</th>
                    <th className="py-3.5 px-4 text-right">Aksi Manajemen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1DA9D0]/10">
                  {admins.map((admin) => {
                    const isExpired = new Date(admin.subscriptionEnd) < new Date();
                    return (
                      <tr key={admin.id} className="hover:bg-[#013D66]/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-bold text-[#F5EACA] text-sm flex items-center gap-2">
                            {admin.storeName}
                            {admin.isTrial && (() => {
                              const now = new Date();
                              const end = new Date(admin.subscriptionEnd);
                              const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                              const isExpired = diffDays <= 0;
                              return (
                                <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold border uppercase ${
                                  isExpired
                                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                                    : 'bg-[#EA8803]/20 text-[#EA8803] border-[#EA8803]/30'
                                }`}>
                                  {isExpired ? 'TRIAL EXPIRED' : `TRIAL - ${diffDays}h`}
                                </span>
                              );
                            })()}
                          </div>
                          <div className="text-[11px] text-[#F5EACA]/60">Pemilik: {admin.user?.name}</div>
                        </td>
                        <td className="py-4 px-4 space-y-0.5">
                          <div className="text-[#F5EACA]/80">{admin.user?.email}</div>
                          <a
                            href={`https://wa.me/${admin.user?.phone}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-[#43D5CC] hover:underline"
                          >
                            {admin.user?.phone}
                          </a>
                        </td>
                        <td className="py-4 px-4">
                          <div
                            className={`font-semibold ${
                              isExpired ? 'text-rose-400' : 'text-emerald-400'
                            }`}
                          >
                            {new Date(admin.subscriptionEnd).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </div>
                          {isExpired && (
                            <span className="text-[10px] text-rose-400 font-bold">EKSPIRASI</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                              admin.waStatus === 'CONNECTED'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : 'bg-[#013D66] text-[#F5EACA]/60 border-[#1DA9D0]/20'
                            }`}
                          >
                            {admin.waStatus === 'CONNECTED' ? 'Terhubung' : 'Terputus'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleToggleStatus(admin.id, admin.isActive)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all ${
                              admin.isActive
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            }`}
                          >
                            {admin.isActive ? 'Aktif' : 'Non-Aktif'}
                          </button>
                        </td>
                        <td className="py-4 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenExtend(admin)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30 transition-all hover:scale-105"
                          >
                            Perpanjang
                          </button>
                          <button
                            onClick={() => handleOpenDelete(admin)}
                            className="p-1.5 rounded-lg text-[#F5EACA]/60 hover:text-rose-400 hover:bg-[#013D66] transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Create Admin */}
        <AnimatePresence>
          {modalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#010E1C]/80 backdrop-blur-sm">
              <div className="glass-card-dark p-6 rounded-3xl border border-[#1DA9D0]/20 max-w-md w-full space-y-4">
                <h3 className="text-base font-bold text-[#F5EACA]">Daftarkan Admin Toko Baru</h3>

                {createErrorMsg && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                    {createErrorMsg}
                  </div>
                )}

                <form onSubmit={handleCreateSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#F5EACA]/80 mb-1">Nama Toko Laundry</label>
                    <input
                      type="text"
                      required
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="Contoh: FreshClean Laundry"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#012040] border border-[#1DA9D0]/25 text-xs text-[#F5EACA] placeholder-[#1DA9D0]/40 focus:outline-none focus:border-[#1DA9D0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#F5EACA]/80 mb-1">Nama Pemilik / Admin</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Bpk. Ahmad"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#012040] border border-[#1DA9D0]/25 text-xs text-[#F5EACA] placeholder-[#1DA9D0]/40 focus:outline-none focus:border-[#1DA9D0]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#F5EACA]/80 mb-1">Email Login</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ahmad@laundry.com"
                        className="w-full px-3.5 py-2 rounded-xl bg-[#012040] border border-[#1DA9D0]/25 text-xs text-[#F5EACA] focus:outline-none focus:border-[#1DA9D0]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#F5EACA]/80 mb-1">Password</label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2 rounded-xl bg-[#012040] border border-[#1DA9D0]/25 text-xs text-[#F5EACA] focus:outline-none focus:border-[#1DA9D0]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#F5EACA]/80 mb-1">No. WhatsApp Pemilik</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="081234567890"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#012040] border border-[#1DA9D0]/25 text-xs text-[#F5EACA] focus:outline-none focus:border-[#1DA9D0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#F5EACA]/80 mb-1">Durasi Awal Berlangganan</label>
                    <select
                      value={durationMonths}
                      onChange={(e) => setDurationMonths(parseInt(e.target.value, 10))}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#012040] border border-[#1DA9D0]/25 text-xs text-[#F5EACA] focus:outline-none focus:border-[#1DA9D0]"
                    >
                      <option value={1}>1 Bulan</option>
                      <option value={3}>3 Bulan</option>
                      <option value={6}>6 Bulan</option>
                      <option value={12}>12 Bulan (1 Tahun)</option>
                    </select>
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-[#013D66] text-[#F5EACA]/80 text-xs font-semibold hover:bg-[#014775]"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] text-[#010E1C] text-xs font-bold disabled:opacity-50"
                    >
                      Daftarkan Admin Toko
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal Perpanjang Masa Aktif */}
        <AnimatePresence>
          {isExtendModalOpen && (
            <ExtendSubscriptionModal
              admin={selectedAdminForExtend}
              isOpen={isExtendModalOpen}
              onClose={() => {
                setIsExtendModalOpen(false);
                setSelectedAdminForExtend(null);
              }}
              onSuccess={() => {
                loadAdmins();
              }}
            />
          )}
        </AnimatePresence>

        {/* Modal Hapus Admin Confirm */}
        <AnimatePresence>
          {isDeleteModalOpen && (
            <ConfirmModal
              isOpen={isDeleteModalOpen}
              title="Hapus Akun Admin Toko"
              message={`Apakah Anda yakin ingin menghapus akun Admin toko "${adminToDelete?.storeName}" beserta seluruh datanya? Tindakan ini tidak dapat dibatalkan.`}
              confirmText="Hapus Akun Toko"
              cancelText="Batal"
              type="danger"
              isSubmitting={isDeleting}
              onClose={() => {
                setIsDeleteModalOpen(false);
                setAdminToDelete(null);
              }}
              onConfirm={handleConfirmDelete}
            />
          )}
        </AnimatePresence>

        {/* Modal Buat Akun Trial */}
        <AnimatePresence>
          {isTrialModalOpen && (
            <CreateTrialModal
              isOpen={isTrialModalOpen}
              onClose={() => setIsTrialModalOpen(false)}
              onSuccess={() => {
                setIsTrialModalOpen(false);
                loadAdmins();
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
