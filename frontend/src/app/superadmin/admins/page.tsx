'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ExtendSubscriptionModal from '@/components/ui/ExtendSubscriptionModal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import CreateTrialModal from '@/components/ui/CreateTrialModal';
import { api } from '@/lib/api';
import { AnimatePresence } from 'framer-motion';
import { Plus, Zap } from 'lucide-react';
import type { AdminUser } from '@/types';
import { getApiErrorMessage } from '@/lib/utils';
import AdminStoreTable from './components/AdminStoreTable';
import CreateAdminModal from './components/CreateAdminModal';

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
            <h1 className="text-2xl font-bold dark:text-[#F5EACA] text-slate-900">Kelola Admin Toko Laundry</h1>
            <p className="text-xs dark:text-[#F5EACA]/60 text-slate-500 mt-1">
              Daftar akun pemilik laundry terdaftar, pengesahan pendaftaran, dan masa aktif
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsTrialModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#EA8803] dark:bg-gradient-to-r dark:from-[#EA8803] dark:to-[#EA8803]/80 hover:opacity-95 text-[#010E1C] font-bold text-xs shadow-lg shadow-[#EA8803]/20 transition-all inline-flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Buat Akun Trial
            </button>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="px-5 py-2.5 rounded-xl bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] hover:opacity-95 text-[#010E1C] font-bold text-xs shadow-lg shadow-[#1DA9D0]/20 transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Daftarkan Admin Toko Baru
            </button>
          </div>
        </div>

        <AdminStoreTable
          admins={admins}
          loading={loading}
          error={error}
          onToggleStatus={handleToggleStatus}
          onOpenExtend={handleOpenExtend}
          onOpenDelete={handleOpenDelete}
        />

        <AnimatePresence>
          {modalOpen && (
            <CreateAdminModal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              onSubmit={handleCreateSubmit}
              createErrorMsg={createErrorMsg}
              storeName={storeName}
              setStoreName={setStoreName}
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              phone={phone}
              setPhone={setPhone}
              durationMonths={durationMonths}
              setDurationMonths={setDurationMonths}
              isSubmitting={isSubmitting}
            />
          )}
        </AnimatePresence>

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
