'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { api } from '@/lib/api';
import { 
  TrendingUp, 
  BarChart3, 
  Package, 
  UserCheck, 
  Download, 
  Calendar, 
  DollarSign 
} from 'lucide-react';

export default function ReportsAndAnalyticsPage() {
  const [period, setPeriod] = useState<'daily' | 'monthly' | 'yearly'>('daily');
  const [revenueData, setRevenueData] = useState<any>(null);
  const [packageStats, setPackageStats] = useState<any[]>([]);
  const [employeeStats, setEmployeeStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // States for Combined Financial Report Download
  const [reportMonth, setReportMonth] = useState<number>(new Date().getMonth() + 1);
  const [reportYear, setReportYear] = useState<number>(new Date().getFullYear());
  const [isDownloading, setIsDownloading] = useState(false);

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

  const handleExportCSV = () => {
    if (!revenueData || revenueData.labels.length === 0) {
      alert('Tidak ada data untuk diekspor.');
      return;
    }

    let csvContent = 'data:text/csv;charset=utf-8,Periode,Total Pendapatan (Rp)\n';
    revenueData.labels.forEach((label: string, idx: number) => {
      csvContent += `${label},${revenueData.data[idx]}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Pendapatan_LaundryKu_${period}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadLaporanGabungan = async () => {
    try {
      setIsDownloading(true);
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      const url = `${apiUrl}/api/expenses/export/combined?month=${reportMonth}&year=${reportYear}`;
      const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error('Gagal mendownload laporan');
      const blob = await response.blob();
      const bulanNama = new Date(reportYear, reportMonth - 1, 1).toLocaleString('id-ID', { month: 'long' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `laporan-keuangan-${bulanNama}-${reportYear}.csv`;
      link.click();
    } catch {
      alert('Gagal mendownload laporan. Coba lagi.');
    } finally {
      setIsDownloading(false);
    }
  };

  const maxRevenueVal = revenueData?.data?.length ? Math.max(...revenueData.data, 1) : 1;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Analitik & Laporan Pendapatan</h1>
            <p className="text-xs text-slate-400 mt-1">Grafik performa keuangan, paket terlaris, dan statistik karyawan</p>
          </div>
          <button
            onClick={handleExportCSV}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all inline-flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            Ekspor Laporan (CSV)
          </button>
        </div>

        {/* Revenue Analytics Chart Container */}
        <div className="glass-card-dark p-6 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-brand-400" /> Grafik Pendapatan
            </h3>

            {/* Filter Period Tabs */}
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
              <button
                onClick={() => setPeriod('daily')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  period === 'daily' ? 'bg-brand-500 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Harian
              </button>
              <button
                onClick={() => setPeriod('monthly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  period === 'monthly' ? 'bg-brand-500 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Bulanan
              </button>
              <button
                onClick={() => setPeriod('yearly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  period === 'yearly' ? 'bg-brand-500 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tahunan
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16 text-xs text-slate-400">Memuat grafik analitik...</div>
          ) : !revenueData || revenueData.labels.length === 0 ? (
            <div className="text-center py-16 text-xs text-slate-400">Belum ada data transaksi tercatat.</div>
          ) : (
            <div className="space-y-4">
              {/* Custom CSS Bar Chart */}
              <div className="h-64 flex items-end gap-3 pt-8 pb-2 px-2 border-b border-slate-800 overflow-x-auto">
                {revenueData.labels.map((label: string, idx: number) => {
                  const val = revenueData.data[idx];
                  const heightPercent = Math.max((val / maxRevenueVal) * 100, 4);

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 min-w-[40px] group relative">
                      {/* Tooltip on hover */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-700 text-white text-[10px] py-1 px-2 rounded shadow-lg pointer-events-none whitespace-nowrap z-10 font-bold">
                        Rp {val.toLocaleString('id-ID')}
                      </div>

                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-gradient-to-t from-brand-600 via-brand-500 to-accent-teal rounded-t-lg transition-all group-hover:brightness-125"
                      />
                      <span className="text-[10px] text-slate-400 truncate max-w-[60px]">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Package Breakdown */}
          <div className="glass-card-dark p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-accent-purple" /> Pendapatan Berdasarkan Paket
            </h3>

            {packageStats.length === 0 ? (
              <div className="text-xs text-slate-400 py-8 text-center">Belum ada data paket.</div>
            ) : (
              <div className="space-y-3">
                {packageStats.map((pkg, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-white">{pkg.name}</div>
                      <div className="text-[10px] text-slate-400">{pkg.count} kali transaksi</div>
                    </div>
                    <div className="text-right font-bold text-emerald-400">
                      Rp {Number(pkg.revenue).toLocaleString('id-ID')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Employee Performance Stats */}
          <div className="glass-card-dark p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-accent-teal" /> Statistik Performa Karyawan
            </h3>

            {employeeStats.length === 0 ? (
              <div className="text-xs text-slate-400 py-8 text-center">Belum ada data karyawan.</div>
            ) : (
              <div className="space-y-3">
                {employeeStats.map((emp, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-white">{emp.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {emp.completedOrders} selesai / {emp.totalOrders} total cucian
                      </div>
                    </div>
                    <div className="text-right font-bold text-brand-300">
                      Rp {Number(emp.totalRevenueHandled).toLocaleString('id-ID')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section Download Laporan Keuangan */}
        <div className="glass-card-dark p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <Download className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Download Laporan Keuangan</h2>
          </div>
          <p className="text-xs text-slate-400 mb-5">
            Download rekap pemasukan dan pengeluaran dalam <strong className="text-slate-300">1 file CSV gabungan</strong> berdasarkan bulan & tahun. File dapat dibuka langsung di Microsoft Excel atau Google Sheets.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Bulan</label>
              <select
                value={reportMonth}
                onChange={(e) => setReportMonth(parseInt(e.target.value))}
                className="bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500 min-w-[140px]"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString('id-ID', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Tahun</label>
              <select
                value={reportYear}
                onChange={(e) => setReportYear(parseInt(e.target.value))}
                className="bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500 min-w-[100px]"
              >
                {[2024, 2025, 2026, 2027].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <button
              onClick={downloadLaporanGabungan}
              disabled={isDownloading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs transition-all inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
            >
              {isDownloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download Laporan Gabungan (CSV)
                </>
              )}
            </button>
          </div>

          <p className="text-[10px] text-slate-500 mt-3">
            💡 File berisi 3 section: Pemasukan · Pengeluaran · Ringkasan Keuangan
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
