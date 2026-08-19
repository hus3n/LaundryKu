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
          <h1 className="text-2xl font-bold text-[#F5EACA]">Log Aktivitas Sistem</h1>
          <p className="text-xs text-[#F5EACA]/60 mt-1">Audit trail seluruh aktivitas pengguna di sistem toko laundry Anda</p>
        </div>

        <div className="glass-card-dark rounded-2xl border border-[#1DA9D0]/15 overflow-hidden">
          {error ? (
            <div className="text-center py-12 text-xs text-rose-400">⚠️ {error}</div>
          ) : loading ? (
            <div className="text-center py-12 text-xs text-[#F5EACA]/60">Memuat log aktivitas...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-16 text-xs text-[#F5EACA]/60 space-y-3">
              <FileText className="w-10 h-10 mx-auto text-[#1DA9D0]/40" />
              <p>Belum ada log aktivitas tercatat.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1DA9D0]/15 text-[#F5EACA]/60 font-medium bg-[#012040]">
                    <th className="py-3.5 px-4">Waktu Log</th>
                    <th className="py-3.5 px-4">Pengguna</th>
                    <th className="py-3.5 px-4">Aksi / Kegiatan</th>
                    <th className="py-3.5 px-4">Entitas Modul</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1DA9D0]/10">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#013D66]/50 transition-colors">
                      <td className="py-3.5 px-4 text-[#F5EACA]/60 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#F5EACA]">
                        {log.user?.name} ({log.user?.role})
                      </td>
                      <td className="py-3.5 px-4 text-[#43D5CC] font-medium">{log.action}</td>
                      <td className="py-3.5 px-4 text-[#F5EACA]/80">{log.entity}</td>
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
