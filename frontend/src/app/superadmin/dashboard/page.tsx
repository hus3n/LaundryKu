'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ExtendSubscriptionModal from '@/components/ui/ExtendSubscriptionModal';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Plus, 
  Clock, 
  Shirt, 
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';
import type { AdminUser } from '@/types';

export default function SuperAdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extend Subscription Modal state
  const [selectedAdminForExtend, setSelectedAdminForExtend] = useState<any>(null);
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dashRes, adminRes] = await Promise.all([
        api.get('/superadmin/dashboard'),
        api.get('/superadmin/admins'),
      ]);
      setData(dashRes.data.data);
      setAdmins(adminRes.data.data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan. Silakan refresh halaman.';
      setError(message);
      console.error('[SuperAdminDashboard] Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenExtend = (admin: AdminUser) => {
    setSelectedAdminForExtend(admin);
    setIsExtendModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#F5EACA]">Dashboard SuperAdmin Platform</h1>
            <p className="text-xs text-[#F5EACA]/60 mt-1">Monitoring seluruh toko laundry terdaftar dan status masa aktif langganan</p>
          </div>
          <Link
            href="/superadmin/admins"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] hover:opacity-95 text-[#010E1C] font-bold text-xs shadow-lg shadow-[#1DA9D0]/20 transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tambah Admin Toko
          </Link>
        </div>

        {/* Summary Metric Cards */}
        <motion.div 
          variants={{ visible: { transition: { staggerChildren: 0.08 } }, hidden: {} }}
          initial="hidden" animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
            className="glass-card-dark p-6 rounded-2xl border border-[#1DA9D0]/15 relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-[#F5EACA]/60 font-medium">Total Toko Admin</p>
                <h3 className="text-2xl font-bold text-[#F5EACA] mt-2">{data?.totalAdmins || 0}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#1DA9D0]/20 border border-[#1DA9D0]/30 flex items-center justify-center text-[#43D5CC]">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-[#43D5CC] mt-4 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> Terdaftar di platform
            </p>
          </motion.div>

          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
            className="glass-card-dark p-6 rounded-2xl border border-[#1DA9D0]/15 relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-[#F5EACA]/60 font-medium">Toko Masa Aktif</p>
                <h3 className="text-2xl font-bold text-emerald-400 mt-2">{data?.activeAdmins || 0}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-emerald-400 mt-4">Status aktif & beroperasi</p>
          </motion.div>

          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
            className="glass-card-dark p-6 rounded-2xl border border-[#1DA9D0]/15 relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-[#F5EACA]/60 font-medium">Toko Akan Kedaluwarsa</p>
                <h3 className="text-2xl font-bold text-[#EA8803] mt-2">{data?.expiringSoon || 0}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#EA8803]/20 border border-[#EA8803]/30 flex items-center justify-center text-[#EA8803]">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-[#EA8803] mt-4 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> {'<'} 7 hari tersisa
            </p>
          </motion.div>

          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
            className="glass-card-dark p-6 rounded-2xl border border-[#1DA9D0]/15 relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-[#F5EACA]/60 font-medium">Toko Tidak Aktif</p>
                <h3 className="text-2xl font-bold text-rose-400 mt-2">{data?.inactiveAdmins || 0}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <XCircle className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-rose-400 mt-4">Masa aktif telah habis</p>
          </motion.div>
        </motion.div>

        {/* Admins Overview Table */}
        <div className="glass-card-dark p-6 rounded-2xl border border-[#1DA9D0]/15">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-[#F5EACA]">Daftar Toko Admin Terdaftar</h3>
            <Link href="/superadmin/admins" className="text-xs font-semibold text-[#43D5CC] hover:underline">
              Kelola Semua Admin →
            </Link>
          </div>

          {error ? (
            <div className="text-center py-8 text-xs text-rose-400">⚠️ {error}</div>
          ) : loading ? (
            <div className="text-center py-8 text-xs text-[#F5EACA]/60">Memuat data Admin...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1DA9D0]/15 text-[#F5EACA]/60 font-medium bg-[#012040]">
                    <th className="py-3.5 px-4">Nama Toko</th>
                    <th className="py-3.5 px-4">Pemilik & WA</th>
                    <th className="py-3.5 px-4">Masa Aktif Berakhir</th>
                    <th className="py-3.5 px-4">Status WA</th>
                    <th className="py-3.5 px-4 text-right">Aksi Quick</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1DA9D0]/10">
                  {admins.map((admin) => {
                    const isExpired = new Date(admin.subscriptionEnd) < new Date();
                    return (
                      <tr key={admin.id} className="hover:bg-[#013D66]/50 transition-colors">
                        <td className="py-4 px-4 font-bold text-[#F5EACA]">{admin.storeName}</td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-[#F5EACA]">{admin.user?.name}</div>
                          <div className="text-[10px] text-[#F5EACA]/60">{admin.user?.email}</div>
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
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => handleOpenExtend(admin)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30 transition-all hover:scale-105"
                          >
                            Perpanjang (+Bulan)
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
                loadData();
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
