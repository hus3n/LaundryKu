'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ExtendSubscriptionModal from '@/components/ui/ExtendSubscriptionModal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import CreateTrialModal from '@/components/ui/CreateTrialModal';
import { api } from '@/lib/api';
import { Users, Plus, Edit, Trash2, Calendar, Phone, Mail, CheckCircle2, XCircle, RefreshCw, Zap } from 'lucide-react';

export default function AdminStoreManagementPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Extend Subscription
  const [selectedAdminForExtend, setSelectedAdminForExtend] = useState<any>(null);
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);

  // Modal Delete Confirmation
  const [adminToDelete, setAdminToDelete] = useState<any>(null);
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
      console.error('Failed to load admins', err);
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
    } catch (err: any) {
      const errMsg = err.response?.data?.error || err.message || 'Gagal mendaftarkan Admin toko baru';
      setCreateErrorMsg(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenExtend = (admin: any) => {
    setSelectedAdminForExtend(admin);
    setIsExtendModalOpen(true);
  };

  const handleToggleStatus = async (adminId: string, currentStatus: boolean) => {
    try {
      await api.patch(`/superadmin/admins/${adminId}/toggle-status`, { isActive: !currentStatus });
      loadAdmins();
    } catch (err: any) {
      console.error('Gagal mengubah status akun', err);
    }
  };

  const handleOpenDelete = (admin: any) => {
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
    } catch (err: any) {
      console.error('Gagal menghapus Admin toko', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Kelola Admin Toko Laundry</h1>
            <p className="text-xs text-slate-400 mt-1">Daftar akun pemilik laundry terdaftar, pengesahan pendaftaran, dan masa aktif</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsTrialModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold text-xs shadow-lg shadow-amber-500/20 transition-all inline-flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Buat Akun Trial
            </button>
            <button
              onClick={handleOpenCreate}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold text-xs shadow-lg shadow-brand-500/20 transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Daftarkan Admin Toko Baru
            </button>
          </div>
        </div>

        {/* Admins Table */}
        <div className="glass-card-dark rounded-2xl border border-slate-800 overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-xs text-slate-400">Memuat data Admin toko...</div>
          ) : admins.length === 0 ? (
            <div className="text-center py-16 text-xs text-slate-400 space-y-3">
              <Users className="w-12 h-12 mx-auto text-slate-600" />
              <p>Belum ada Admin toko terdaftar.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-medium bg-slate-900/40">
                    <th className="py-3.5 px-4">Nama Toko & Penanggung Jawab</th>
                    <th className="py-3.5 px-4">Kontak (Email / WA)</th>
                    <th className="py-3.5 px-4">Masa Aktif Langganan</th>
                    <th className="py-3.5 px-4">Status WA Toko</th>
                    <th className="py-3.5 px-4">Status Akun</th>
                    <th className="py-3.5 px-4 text-right">Aksi Manajemen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {admins.map((admin) => {
                    const isExpired = new Date(admin.subscriptionEnd) < new Date();
                    return (
                      <tr key={admin.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-bold text-white text-sm flex items-center gap-2">
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
                                    : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                }`}>
                                  {isExpired ? 'TRIAL EXPIRED' : `TRIAL - ${diffDays}h`}
                                </span>
                              );
                            })()}
                          </div>
                          <div className="text-[11px] text-slate-400">Pemilik: {admin.user?.name}</div>
                        </td>
                        <td className="py-4 px-4 space-y-0.5">
                          <div className="text-slate-300">{admin.user?.email}</div>
                          <a
                            href={`https://wa.me/${admin.user?.phone}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-brand-400 hover:underline"
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
                                : 'bg-slate-800 text-slate-400 border-slate-700'
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
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
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
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="glass-card-dark p-6 rounded-3xl border border-slate-800 max-w-md w-full space-y-4">
              <h3 className="text-base font-bold text-white">Daftarkan Admin Toko Baru</h3>

              {createErrorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                  {createErrorMsg}
                </div>
              )}

              <form onSubmit={handleCreateSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Toko Laundry</label>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="Contoh: FreshClean Laundry"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Pemilik / Admin</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Bpk. Ahmad"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email Login</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ahmad@laundry.com"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">No. WhatsApp Pemilik</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="081234567890"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Durasi Awal Berlangganan</label>
                  <select
                    value={durationMonths}
                    onChange={(e) => setDurationMonths(parseInt(e.target.value, 10))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
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
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-xs font-semibold disabled:opacity-50"
                  >
                    Daftarkan Admin Toko
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Perpanjang Masa Aktif */}
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

        {/* Modal Hapus Admin Confirm */}
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

        {/* Modal Buat Akun Trial */}
        <CreateTrialModal
          isOpen={isTrialModalOpen}
          onClose={() => setIsTrialModalOpen(false)}
          onSuccess={() => {
            setIsTrialModalOpen(false);
            loadAdmins();
          }}
        />
      </div>
    </DashboardLayout>
  );
}
