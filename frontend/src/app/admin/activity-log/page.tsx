'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { api } from '@/lib/api';
import { FileText, Clock, User, ShieldAlert } from 'lucide-react';
import type { ActivityLog } from '@/types';

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await api.get('/analytics/logs');
        setLogs(res.data.data || []);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Terjadi kesalahan. Silakan refresh halaman.';
        setError(message);
        console.error('[ActivityLogPage] Failed to load logs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold dark:text-[#F5EACA] text-slate-900">Log Aktivitas Sistem</h1>
          <p className="text-xs dark:text-[#F5EACA]/60 text-slate-500 mt-1">Audit trail seluruh aktivitas pengguna di sistem toko laundry Anda</p>
        </div>

        <div className="glass-card-dark rounded-2xl border dark:border-[#1DA9D0]/15 border-slate-200 overflow-hidden shadow-sm">
          {error ? (
            <div className="text-center py-12 text-xs text-rose-500">⚠️ {error}</div>
          ) : loading ? (
            <div className="text-center py-12 text-xs dark:text-[#F5EACA]/60 text-slate-500">Memuat log aktivitas...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-16 text-xs dark:text-[#F5EACA]/60 text-slate-500 space-y-3">
              <FileText className="w-10 h-10 mx-auto dark:text-[#1DA9D0]/40 text-slate-400" />
              <p>Belum ada log aktivitas tercatat.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b dark:border-[#1DA9D0]/15 border-slate-200 dark:text-[#F5EACA]/60 text-slate-600 font-medium dark:bg-[#012040] bg-slate-100">
                    <th className="py-3.5 px-4">Waktu Log</th>
                    <th className="py-3.5 px-4">Pengguna</th>
                    <th className="py-3.5 px-4">Aksi / Kegiatan</th>
                    <th className="py-3.5 px-4">Entitas Modul</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-[#1DA9D0]/10 divide-slate-200">
                  {logs.map((log) => (
                    <tr key={log.id} className="dark:hover:bg-[#013D66]/50 hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 dark:text-[#F5EACA]/60 text-slate-500 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5 px-4 font-semibold dark:text-[#F5EACA] text-slate-900">
                        {log.user?.name} ({log.user?.role})
                      </td>
                      <td className="py-3.5 px-4 dark:text-[#43D5CC] text-teal-600 font-medium">{log.action}</td>
                      <td className="py-3.5 px-4 dark:text-[#F5EACA]/80 text-slate-700">{log.entity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
