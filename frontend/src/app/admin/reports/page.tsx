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
      <div className="space-y-3 sm:space-y-6">
        <div className="flex flex-row justify-between items-center gap-2 sm:gap-4">
          <div>
            <h1 className="text-base sm:text-2xl font-bold dark:text-[#F5EACA] text-slate-900">Analitik & Laporan</h1>
            <p className="text-[10px] sm:text-xs dark:text-[#F5EACA]/60 text-slate-500 mt-0.5 sm:mt-1">Grafik performa keuangan, paket terlaris, dan statistik</p>
          </div>
          <div className="shrink-0">
            <DownloadAllDataButton />
          </div>
        </div>

        {/* Revenue Analytics Chart Container */}
        <div className="glass-card-dark p-3 sm:p-6 rounded-xl sm:rounded-3xl border dark:border-[#1DA9D0]/15 border-slate-200 space-y-3 sm:space-y-6 shadow-sm">
          <div className="flex flex-row items-center justify-between gap-2">
            <h3 className="text-xs sm:text-base font-bold dark:text-[#F5EACA] text-slate-900 flex items-center gap-1.5 sm:gap-2">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 dark:text-[#43D5CC] text-teal-600" /> Grafik Pendapatan
            </h3>

            {/* Filter Period Tabs */}
            <div className="flex dark:bg-[#012040] bg-slate-100 p-0.5 sm:p-1 rounded-lg sm:rounded-xl border dark:border-[#1DA9D0]/15 border-slate-200">
              <button
                onClick={() => setPeriod('daily')}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-semibold transition-all ${
                  period === 'daily' ? 'bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] text-[#010E1C] font-bold shadow' : 'dark:text-[#F5EACA]/60 text-slate-600 dark:hover:text-[#F5EACA] hover:text-slate-900'
                }`}
              >
                Harian
              </button>
              <button
                onClick={() => setPeriod('monthly')}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-semibold transition-all ${
                  period === 'monthly' ? 'bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] text-[#010E1C] font-bold shadow' : 'dark:text-[#F5EACA]/60 text-slate-600 dark:hover:text-[#F5EACA] hover:text-slate-900'
                }`}
              >
                Bulanan
              </button>
              <button
                onClick={() => setPeriod('yearly')}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-semibold transition-all ${
                  period === 'yearly' ? 'bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] text-[#010E1C] font-bold shadow' : 'dark:text-[#F5EACA]/60 text-slate-600 dark:hover:text-[#F5EACA] hover:text-slate-900'
                }`}
              >
                Tahunan
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10 sm:py-16 text-xs dark:text-[#F5EACA]/60 text-slate-500">Memuat grafik analitik...</div>
          ) : !revenueData || revenueData.labels.length === 0 ? (
            <div className="text-center py-10 sm:py-16 text-xs dark:text-[#F5EACA]/60 text-slate-500">Belum ada data transaksi tercatat.</div>
          ) : (
            <div className="space-y-2 sm:space-y-4">
              {/* Custom CSS Bar Chart */}
              <div className="h-36 sm:h-64 flex items-end gap-1.5 sm:gap-3 pt-4 sm:pt-8 pb-1.5 sm:pb-2 px-1 sm:px-2 border-b dark:border-[#1DA9D0]/15 border-slate-200 overflow-x-auto">
                {revenueData.labels.map((label: string, idx: number) => {
                  const val = revenueData.data[idx];
                  const heightPercent = Math.max((val / maxRevenueVal) * 100, 4);

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 sm:gap-2 min-w-[32px] sm:min-w-[40px] group relative">
                      {/* Tooltip on hover */}
                      <div className="absolute -top-9 opacity-0 group-hover:opacity-100 transition-opacity dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/30 border-slate-300 dark:text-[#F5EACA] text-slate-900 text-[10px] py-0.5 px-1.5 rounded shadow-lg pointer-events-none whitespace-nowrap z-10 font-bold">
                        Rp {val.toLocaleString('id-ID')}
                      </div>

                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-[#1DA9D0] dark:bg-gradient-to-t dark:from-[#015383] dark:via-[#1DA9D0] dark:to-[#43D5CC] rounded-t-md sm:rounded-t-lg transition-all group-hover:brightness-125"
                      />
                      <span className="text-[9px] sm:text-[10px] dark:text-[#F5EACA]/60 text-slate-500 truncate max-w-[50px] sm:max-w-[60px]">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
          {/* Package Breakdown */}
          <div className="glass-card-dark p-3 sm:p-6 rounded-xl sm:rounded-3xl border dark:border-[#1DA9D0]/15 border-slate-200 space-y-2.5 sm:space-y-4 shadow-sm">
            <h3 className="text-xs sm:text-base font-bold dark:text-[#F5EACA] text-slate-900 flex items-center gap-1.5 sm:gap-2">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 dark:text-[#43D5CC] text-teal-600" /> Pendapatan Berdasarkan Paket
            </h3>

            {packageStats.length === 0 ? (
              <div className="text-xs dark:text-[#F5EACA]/60 text-slate-500 py-6 text-center">Belum ada data paket.</div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {packageStats.map((pkg, idx) => (
                  <div key={idx} className="p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl dark:bg-[#012040] bg-slate-50 border dark:border-[#1DA9D0]/15 border-slate-200 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold dark:text-[#F5EACA] text-slate-900 text-xs sm:text-sm">{pkg.name}</div>
                      <div className="text-[10px] dark:text-[#F5EACA]/60 text-slate-500">{pkg.count} kali transaksi</div>
                    </div>
                    <div className="text-right font-bold dark:text-[#43D5CC] text-teal-600 text-xs sm:text-sm">
                      Rp {Number(pkg.revenue).toLocaleString('id-ID')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Employee Performance Stats */}
          <div className="glass-card-dark p-3 sm:p-6 rounded-xl sm:rounded-3xl border dark:border-[#1DA9D0]/15 border-slate-200 space-y-2.5 sm:space-y-4 shadow-sm">
            <h3 className="text-xs sm:text-base font-bold dark:text-[#F5EACA] text-slate-900 flex items-center gap-1.5 sm:gap-2">
              <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 dark:text-[#43D5CC] text-teal-600" /> Statistik Performa Karyawan
            </h3>

            {employeeStats.length === 0 ? (
              <div className="text-xs dark:text-[#F5EACA]/60 text-slate-500 py-6 text-center">Belum ada data karyawan.</div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {employeeStats.map((emp, idx) => (
                  <div key={idx} className="p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl dark:bg-[#012040] bg-slate-50 border dark:border-[#1DA9D0]/15 border-slate-200 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold dark:text-[#F5EACA] text-slate-900 text-xs sm:text-sm">{emp.name}</div>
                      <div className="text-[10px] dark:text-[#F5EACA]/60 text-slate-500">
                        {emp.completedOrders} selesai / {emp.totalOrders} total cucian
                      </div>
                    </div>
                    <div className="text-right font-bold dark:text-[#43D5CC] text-teal-600 text-xs sm:text-sm">
                      Rp {Number(emp.totalRevenueHandled).toLocaleString('id-ID')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section Download Seluruh Data Excel */}
        <div className="glass-card-dark p-3 sm:p-8 rounded-xl sm:rounded-3xl border dark:border-[#1DA9D0]/15 border-slate-200 shadow-sm space-y-3 sm:space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-start gap-2.5 sm:gap-3">
              <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shrink-0">
                <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h2 className="text-xs sm:text-base font-bold dark:text-[#F5EACA] text-slate-900">
                  Ekspor Seluruh Data Laundry (.xlsx)
                </h2>
                <p className="text-[10px] sm:text-xs dark:text-[#F5EACA]/60 text-slate-600 mt-0.5 sm:mt-1 max-w-2xl">
                  Unduh seluruh database toko dalam 1 file Excel komprehensif berisi 6 lembar kerja (worksheet).
                </p>
              </div>
            </div>
            <div className="self-start sm:self-center">
              <DownloadAllDataButton label="Download Excel" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-3 pt-1">
            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl dark:bg-[#012040]/50 bg-slate-50 border dark:border-[#1DA9D0]/10 border-slate-200 text-[10px] sm:text-xs">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Sheet 1:</span> Ringkasan & Tren
            </div>
            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl dark:bg-[#012040]/50 bg-slate-50 border dark:border-[#1DA9D0]/10 border-slate-200 text-[10px] sm:text-xs">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Sheet 2:</span> Database Pelanggan
            </div>
            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl dark:bg-[#012040]/50 bg-slate-50 border dark:border-[#1DA9D0]/10 border-slate-200 text-[10px] sm:text-xs">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Sheet 3:</span> Transaksi Cucian
            </div>
            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl dark:bg-[#012040]/50 bg-slate-50 border dark:border-[#1DA9D0]/10 border-slate-200 text-[10px] sm:text-xs">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Sheet 4:</span> Riwayat Status
            </div>
            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl dark:bg-[#012040]/50 bg-slate-50 border dark:border-[#1DA9D0]/10 border-slate-200 text-[10px] sm:text-xs">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Sheet 5:</span> Pemasukan Toko
            </div>
            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl dark:bg-[#012040]/50 bg-slate-50 border dark:border-[#1DA9D0]/10 border-slate-200 text-[10px] sm:text-xs">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Sheet 6:</span> Pengeluaran Toko
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
