'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { api } from '@/lib/api';
import { Bot, Save } from 'lucide-react';

export default function AiSubscriptionsPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/superadmin/admins-bot-config');
      if (res.data?.success) setAdmins(res.data.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (adminId: string, enabled: boolean, limit: number) => {
    setUpdating(adminId);
    try {
      await api.put(`/superadmin/admins/${adminId}/bot-config`, {
        isAiEnabledBySuperadmin: enabled,
        aiDailyLimit: limit,
      });
      alert('Konfigurasi toko berhasil diperbarui.');
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal mengubah konfigurasi AI');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center mt-20 text-xs">Memuat daftar langganan AI...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="w-6 h-6 text-[#43D5CC]" /> Manajemen Akses AI Cabang
          </h1>
          <p className="text-xs text-foreground/60 mt-1">
            Atur kuota harian dan izin penggunaan AI untuk setiap toko.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs bg-surface rounded-xl overflow-hidden">
            <thead className="bg-[#1DA9D0]/10 border-b border-[#1DA9D0]/20">
              <tr>
                <th className="py-4 px-4">Nama Toko</th>
                <th className="py-4 px-4 text-center">Status AI</th>
                <th className="py-4 px-4 text-center">Limit Harian</th>
                <th className="py-4 px-4 text-center">Terpakai Hari Ini</th>
                <th className="py-4 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1DA9D0]/10">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-muted/50 text-foreground/80">
                  <td className="py-3 px-4">
                    <div className="font-semibold">{admin.storeName}</div>
                    <div className="text-[10px] text-foreground/50">{admin.ownerName}</div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <label className="relative inline-flex items-center cursor-pointer justify-center">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={admin.isAiEnabledBySuperadmin}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setAdmins(admins.map(a => a.id === admin.id ? { ...a, isAiEnabledBySuperadmin: val } : a));
                        }}
                      />
                      <div className="w-8 h-4 bg-muted rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-emerald-500 after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all"></div>
                    </label>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <input
                      type="number"
                      className="w-20 px-2 py-1 text-center bg-background border border-[#1DA9D0]/20 rounded-md"
                      value={admin.aiDailyLimit}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setAdmins(admins.map(a => a.id === admin.id ? { ...a, aiDailyLimit: val } : a));
                      }}
                    />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-bold text-[#43D5CC]">{admin.aiUsageToday}</span> / {admin.aiDailyLimit}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleUpdate(admin.id, admin.isAiEnabledBySuperadmin, admin.aiDailyLimit)}
                      disabled={updating === admin.id}
                      className="p-2 bg-[#1DA9D0]/20 hover:bg-[#1DA9D0]/40 rounded-lg text-[#1DA9D0] transition-colors inline-block"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
