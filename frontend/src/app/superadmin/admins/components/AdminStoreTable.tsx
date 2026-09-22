'use client';

import React from 'react';
import { Users, Trash2 } from 'lucide-react';
import type { AdminUser } from '@/types';

interface AdminStoreTableProps {
  admins: AdminUser[];
  loading: boolean;
  error: string | null;
  onToggleStatus: (adminId: string, currentStatus: boolean) => void;
  onOpenExtend: (admin: AdminUser) => void;
  onOpenDelete: (admin: AdminUser) => void;
}

export default function AdminStoreTable({
  admins,
  loading,
  error,
  onToggleStatus,
  onOpenExtend,
  onOpenDelete,
}: AdminStoreTableProps) {
  return (
    <div className="glass-card-dark rounded-2xl border dark:border-[#1DA9D0]/15 border-slate-200 shadow-sm overflow-hidden">
      {error ? (
        <div className="text-center py-12 text-xs text-rose-600 dark:text-rose-400">⚠️ {error}</div>
      ) : loading ? (
        <div className="text-center py-12 text-xs dark:text-[#F5EACA]/60 text-slate-500">Memuat data Admin toko...</div>
      ) : admins.length === 0 ? (
        <div className="text-center py-16 text-xs dark:text-[#F5EACA]/60 text-slate-500 space-y-3">
          <Users className="w-12 h-12 mx-auto text-[#1DA9D0]/30" />
          <p>Belum ada Admin toko terdaftar.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b dark:border-[#1DA9D0]/15 border-slate-200 dark:text-[#F5EACA]/60 text-slate-600 font-semibold dark:bg-[#012040] bg-slate-100">
                <th className="py-3.5 px-4">Nama Toko & Penanggung Jawab</th>
                <th className="py-3.5 px-4">Kontak (Email / WA)</th>
                <th className="py-3.5 px-4">Masa Aktif Langganan</th>
                <th className="py-3.5 px-4">Status WA Toko</th>
                <th className="py-3.5 px-4">Status Akun</th>
                <th className="py-3.5 px-4 text-right">Aksi Manajemen</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-[#1DA9D0]/10 divide-slate-200">
              {admins.map((admin) => {
                const isExpired = new Date(admin.subscriptionEnd) < new Date();
                return (
                  <tr key={admin.id} className="dark:hover:bg-[#013D66]/50 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold dark:text-[#F5EACA] text-slate-900 text-sm flex items-center gap-2">
                        {admin.storeName}
                        {admin.isTrial && (() => {
                          const now = new Date();
                          const end = new Date(admin.subscriptionEnd);
                          const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                          const trialExpired = diffDays <= 0;
                          return (
                            <span
                              className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold border uppercase ${
                                trialExpired
                                  ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30'
                                  : 'bg-[#EA8803]/20 text-amber-600 dark:text-[#EA8803] border-amber-500/30'
                              }`}
                            >
                              {trialExpired ? 'TRIAL EXPIRED' : `TRIAL - ${diffDays}h`}
                            </span>
                          );
                        })()}
                      </div>
                      <div className="text-[11px] dark:text-[#F5EACA]/60 text-slate-500">Pemilik: {admin.user?.name}</div>
                    </td>
                    <td className="py-4 px-4 space-y-0.5">
                      <div className="dark:text-[#F5EACA]/80 text-slate-700">{admin.user?.email}</div>
                      <a
                        href={`https://wa.me/${admin.user?.phone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-[#1DA9D0] dark:text-[#43D5CC] hover:underline"
                      >
                        {admin.user?.phone}
                      </a>
                    </td>
                    <td className="py-4 px-4">
                      <div
                        className={`font-semibold ${
                          isExpired ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {new Date(admin.subscriptionEnd).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                      {isExpired && (
                        <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold">EKSPIRASI</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                          admin.waStatus === 'CONNECTED'
                            ? 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                            : 'dark:bg-[#013D66] bg-slate-100 dark:text-[#F5EACA]/60 text-slate-600 dark:border-[#1DA9D0]/20 border-slate-300'
                        }`}
                      >
                        {admin.waStatus === 'CONNECTED' ? 'Terhubung' : 'Terputus'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        type="button"
                        onClick={() => onToggleStatus(admin.id, admin.isActive)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all ${
                          admin.isActive
                            ? 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                            : 'bg-rose-500/15 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {admin.isActive ? 'Aktif' : 'Non-Aktif'}
                      </button>
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => onOpenExtend(admin)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold border border-emerald-500/30 transition-all hover:scale-105"
                      >
                        Perpanjang
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenDelete(admin)}
                        className="p-1.5 rounded-lg dark:text-[#F5EACA]/60 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 dark:hover:bg-[#013D66] hover:bg-slate-100 transition-colors"
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
  );
}
