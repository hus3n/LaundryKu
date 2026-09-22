'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { api } from '@/lib/api';
import { 
  TrendingUp, 
  BarChart3, 
  Package, 
  UserCheck, 
  Calendar, 
  DollarSign,
  FileSpreadsheet
} from 'lucide-react';
import DownloadAllDataButton from '@/components/ui/DownloadAllDataButton';

export default function ReportsAndAnalyticsPage() {
  const [period, setPeriod] = useState<'daily' | 'monthly' | 'yearly'>('daily');
  const [revenueData, setRevenueData] = useState<any>(null);
  const [packageStats, setPackageStats] = useState<any[]>([]);
  const [employeeStats, setEmployeeStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [revRes, pkgRes, empRes] = await Promise.all([
        api.get('/analytics/revenue', { params: { period } }),
        api.get('/analytics/packages'),
        api.get('/analytics/employees'),
      ]);

      setRevenueData(revRes.data.data);
      setPackageStats(pkgRes.data.data || []);
      setEmployeeStats(empRes.data.data || []);
    } catch (err) {
      console.error('Failed to load analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const maxRevenueVal = revenueData?.data?.length ? Math.max(...revenueData.data, 1) : 1;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold dark:text-[#F5EACA] text-slate-900">Analitik & Laporan Pendapatan</h1>
            <p className="text-xs dark:text-[#F5EACA]/60 text-slate-500 mt-1">Grafik performa keuangan, paket terlaris, dan statistik karyawan</p>
          </div>
          <DownloadAllDataButton />
        </div>

        {/* Revenue Analytics Chart Container */}
        <div className="glass-card-dark p-6 rounded-3xl border dark:border-[#1DA9D0]/15 border-slate-200 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-base font-bold dark:text-[#F5EACA] text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 dark:text-[#43D5CC] text-teal-600" /> Grafik Pendapatan
            </h3>

            {/* Filter Period Tabs */}
            <div className="flex dark:bg-[#012040] bg-slate-100 p-1 rounded-xl border dark:border-[#1DA9D0]/15 border-slate-200 self-start sm:self-auto">
              <button
                onClick={() => setPeriod('daily')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  period === 'daily' ? 'bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] text-[#010E1C] font-bold shadow' : 'dark:text-[#F5EACA]/60 text-slate-600 dark:hover:text-[#F5EACA] hover:text-slate-900'
                }`}
              >
                Harian
              </button>
              <button
                onClick={() => setPeriod('monthly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  period === 'monthly' ? 'bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] text-[#010E1C] font-bold shadow' : 'dark:text-[#F5EACA]/60 text-slate-600 dark:hover:text-[#F5EACA] hover:text-slate-900'
                }`}
              >
                Bulanan
              </button>
              <button
                onClick={() => setPeriod('yearly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  period === 'yearly' ? 'bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] text-[#010E1C] font-bold shadow' : 'dark:text-[#F5EACA]/60 text-slate-600 dark:hover:text-[#F5EACA] hover:text-slate-900'
                }`}
              >
                Tahunan
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16 text-xs dark:text-[#F5EACA]/60 text-slate-500">Memuat grafik analitik...</div>
          ) : !revenueData || revenueData.labels.length === 0 ? (
            <div className="text-center py-16 text-xs dark:text-[#F5EACA]/60 text-slate-500">Belum ada data transaksi tercatat.</div>
          ) : (
            <div className="space-y-4">
              {/* Custom CSS Bar Chart */}
              <div className="h-64 flex items-end gap-3 pt-8 pb-2 px-2 border-b dark:border-[#1DA9D0]/15 border-slate-200 overflow-x-auto">
                {revenueData.labels.map((label: string, idx: number) => {
                  const val = revenueData.data[idx];
                  const heightPercent = Math.max((val / maxRevenueVal) * 100, 4);

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 min-w-[40px] group relative">
                      {/* Tooltip on hover */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/30 border-slate-300 dark:text-[#F5EACA] text-slate-900 text-[10px] py-1 px-2 rounded shadow-lg pointer-events-none whitespace-nowrap z-10 font-bold">
                        Rp {val.toLocaleString('id-ID')}
                      </div>

                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-gradient-to-t from-[#015383] via-[#1DA9D0] to-[#43D5CC] rounded-t-lg transition-all group-hover:brightness-125"
                      />
                      <span className="text-[10px] dark:text-[#F5EACA]/60 text-slate-500 truncate max-w-[60px]">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Package Breakdown */}
          <div className="glass-card-dark p-6 rounded-3xl border dark:border-[#1DA9D0]/15 border-slate-200 space-y-4 shadow-sm">
            <h3 className="text-base font-bold dark:text-[#F5EACA] text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 dark:text-[#43D5CC] text-teal-600" /> Pendapatan Berdasarkan Paket
            </h3>

            {packageStats.length === 0 ? (
              <div className="text-xs dark:text-[#F5EACA]/60 text-slate-500 py-8 text-center">Belum ada data paket.</div>
            ) : (
              <div className="space-y-3">
                {packageStats.map((pkg, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl dark:bg-[#012040] bg-slate-50 border dark:border-[#1DA9D0]/15 border-slate-200 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold dark:text-[#F5EACA] text-slate-900">{pkg.name}</div>
                      <div className="text-[10px] dark:text-[#F5EACA]/60 text-slate-500">{pkg.count} kali transaksi</div>
                    </div>
                    <div className="text-right font-bold dark:text-[#43D5CC] text-teal-600">
                      Rp {Number(pkg.revenue).toLocaleString('id-ID')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Employee Performance Stats */}
          <div className="glass-card-dark p-6 rounded-3xl border dark:border-[#1DA9D0]/15 border-slate-200 space-y-4 shadow-sm">
            <h3 className="text-base font-bold dark:text-[#F5EACA] text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 dark:text-[#43D5CC] text-teal-600" /> Statistik Performa Karyawan
            </h3>

            {employeeStats.length === 0 ? (
              <div className="text-xs dark:text-[#F5EACA]/60 text-slate-500 py-8 text-center">Belum ada data karyawan.</div>
            ) : (
              <div className="space-y-3">
                {employeeStats.map((emp, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl dark:bg-[#012040] bg-slate-50 border dark:border-[#1DA9D0]/15 border-slate-200 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold dark:text-[#F5EACA] text-slate-900">{emp.name}</div>
                      <div className="text-[10px] dark:text-[#F5EACA]/60 text-slate-500">
                        {emp.completedOrders} selesai / {emp.totalOrders} total cucian
                      </div>
                    </div>
                    <div className="text-right font-bold dark:text-[#43D5CC] text-teal-600">
                      Rp {Number(emp.totalRevenueHandled).toLocaleString('id-ID')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section Download Seluruh Data Excel */}
        <div className="glass-card-dark p-6 sm:p-8 rounded-3xl border dark:border-[#1DA9D0]/15 border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold dark:text-[#F5EACA] text-slate-900">
                  Ekspor Seluruh Data Laundry (1 File Excel Terpadu)
                </h2>
                <p className="text-xs dark:text-[#F5EACA]/60 text-slate-600 mt-1 max-w-2xl">
                  Unduh seluruh database operasional toko dalam 1 file buku kerja Excel (.xlsx) komprehensif. Terdiri dari 6 lembar kerja (worksheet) terpisah:
                </p>
              </div>
            </div>
            <div className="self-start sm:self-center">
              <DownloadAllDataButton label="Download Seluruh Data (Excel)" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl dark:bg-[#012040]/50 bg-slate-50 border dark:border-[#1DA9D0]/10 border-slate-200 text-xs">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Sheet 1:</span> Ringkasan & Grafik Tren Keuangan
            </div>
            <div className="p-3 rounded-xl dark:bg-[#012040]/50 bg-slate-50 border dark:border-[#1DA9D0]/10 border-slate-200 text-xs">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Sheet 2:</span> Database Lengkap Pelanggan
            </div>
            <div className="p-3 rounded-xl dark:bg-[#012040]/50 bg-slate-50 border dark:border-[#1DA9D0]/10 border-slate-200 text-xs">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Sheet 3:</span> Data Transaksi Cucian Global
            </div>
            <div className="p-3 rounded-xl dark:bg-[#012040]/50 bg-slate-50 border dark:border-[#1DA9D0]/10 border-slate-200 text-xs">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Sheet 4:</span> Riwayat Status & Audit Trail Cucian
            </div>
            <div className="p-3 rounded-xl dark:bg-[#012040]/50 bg-slate-50 border dark:border-[#1DA9D0]/10 border-slate-200 text-xs">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Sheet 5:</span> Laporan Detail Pemasukan Toko
            </div>
            <div className="p-3 rounded-xl dark:bg-[#012040]/50 bg-slate-50 border dark:border-[#1DA9D0]/10 border-slate-200 text-xs">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Sheet 6:</span> Laporan Detail Pengeluaran Toko
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
