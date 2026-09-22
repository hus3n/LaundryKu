'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { 
  Shirt, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  PlusCircle, 
  ArrowUpRight, 
  Package, 
  QrCode,
  DollarSign
} from 'lucide-react';

import type { LaundryOrder } from '@/types';
import { 
  getOrderStatusBadgeClass, 
  getOrderStatusLabel, 
  getPaymentStatusBadgeClass, 
  getPaymentStatusLabel 
} from '@/lib/orderUtils';
import DownloadAllDataButton from '@/components/ui/DownloadAllDataButton';

export default function AdminDashboardPage() {
  const { isDark } = useTheme();
  const [orders, setOrders] = useState<LaundryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartYear, setChartYear] = useState(new Date().getFullYear());

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get('/laundry');
        setOrders(res.data.data || []);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Terjadi kesalahan. Silakan refresh halaman.';
        setError(message);
        console.error('[AdminDashboard] Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    async function fetchChart() {
      try {
        const chartRes = await api.get(`/expenses/chart?year=${chartYear}`);
        if (chartRes.data.success) {
          const { labels, expenseData, incomeData } = chartRes.data.data;
          const formatted = labels.map((label: string, index: number) => ({
            name: label,
            Pemasukan: incomeData[index],
            Pengeluaran: expenseData[index],
          }));
          setChartData(formatted);
        }
      } catch (err) {
        console.error('[AdminDashboard] Failed to load chart:', err);
      }
    }
    fetchChart();
  }, [chartYear]);

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0);
  const todayOrders = orders.filter((item) => {
    const today = new Date().toISOString().slice(0, 10);
    return item.createdAt?.slice(0, 10) === today;
  }).length;
  const doneOrders = orders.filter((item) => item.status === 'DONE').length;

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6 md:space-y-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold dark:text-[#F5EACA] text-slate-900">Dashboard Utama Laundry</h1>
            <p className="text-[11px] sm:text-xs dark:text-[#F5EACA]/60 text-slate-500 mt-0.5 sm:mt-1">Ringkasan transaksi, pendapatan, dan aktivitas cucian toko Anda</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <DownloadAllDataButton />
            <Link
              href="/admin/laundry/new"
              className="px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] hover:opacity-95 text-[#010E1C] font-bold text-xs shadow-md shadow-[#1DA9D0]/20 transition-all inline-flex items-center gap-1.5 sm:gap-2"
            >
              <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Catat Cucian Baru
            </Link>
          </div>
        </div>

        {/* Summary Cards Grid */}
        <motion.div 
          variants={{ visible: { transition: { staggerChildren: 0.08 } }, hidden: {} }}
          initial="hidden" animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6"
        >
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
            className="glass-card-dark p-3.5 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border dark:border-[#1DA9D0]/15 border-slate-200 relative overflow-hidden shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] sm:text-xs dark:text-[#F5EACA]/60 text-slate-500 font-medium">Total Cucian Masuk</p>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold dark:text-[#F5EACA] text-slate-900 mt-1 sm:mt-2">{totalOrders}</h3>
              </div>
              <div className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl dark:bg-[#1DA9D0]/20 bg-sky-50 border dark:border-[#1DA9D0]/30 border-sky-200 flex items-center justify-center dark:text-[#43D5CC] text-sky-600 shrink-0">
                <Shirt className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              </div>
            </div>
            <p className="text-[10px] sm:text-[11px] dark:text-[#43D5CC] text-sky-600 mt-2 sm:mt-4 flex items-center gap-1 font-medium">
              <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Terdaftar di sistem
            </p>
          </motion.div>

          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
            className="glass-card-dark p-3.5 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border dark:border-[#1DA9D0]/15 border-slate-200 relative overflow-hidden shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] sm:text-xs dark:text-[#F5EACA]/60 text-slate-500 font-medium">Total Pendapatan</p>
                <h3 className="text-base sm:text-xl md:text-2xl font-bold dark:text-[#43D5CC] text-teal-600 mt-1 sm:mt-2 truncate">
                  Rp {totalRevenue.toLocaleString('id-ID')}
                </h3>
              </div>
              <div className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl dark:bg-[#43D5CC]/20 bg-teal-50 border dark:border-[#43D5CC]/30 border-teal-200 flex items-center justify-center dark:text-[#43D5CC] text-teal-600 shrink-0">
                <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              </div>
            </div>
            <p className="text-[10px] sm:text-[11px] dark:text-[#43D5CC] text-teal-600 mt-2 sm:mt-4 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Akumulasi pendapatan
            </p>
          </motion.div>

          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
            className="glass-card-dark p-3.5 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border dark:border-[#1DA9D0]/15 border-slate-200 relative overflow-hidden shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] sm:text-xs dark:text-[#F5EACA]/60 text-slate-500 font-medium">Masuk Hari Ini</p>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#EA8803] mt-1 sm:mt-2">{todayOrders}</h3>
              </div>
              <div className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl dark:bg-[#EA8803]/20 bg-amber-50 border dark:border-[#EA8803]/30 border-amber-200 flex items-center justify-center text-[#EA8803] shrink-0">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              </div>
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#EA8803] mt-2 sm:mt-4 font-medium truncate">Hari ini: {new Date().toLocaleDateString('id-ID')}</p>
          </motion.div>

          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
            className="glass-card-dark p-3.5 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border dark:border-[#1DA9D0]/15 border-slate-200 relative overflow-hidden shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] sm:text-xs dark:text-[#F5EACA]/60 text-slate-500 font-medium">Siap Diambil</p>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1DA9D0] mt-1 sm:mt-2">{doneOrders}</h3>
              </div>
              <div className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl dark:bg-[#1DA9D0]/20 bg-sky-50 border dark:border-[#1DA9D0]/30 border-sky-200 flex items-center justify-center text-[#1DA9D0] shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              </div>
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#1DA9D0] mt-2 sm:mt-4 font-medium truncate">Menunggu diambil</p>
          </motion.div>
        </motion.div>

        {/* Chart Section */}
        <div className="glass-card-dark p-3.5 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border dark:border-[#1DA9D0]/15 border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3 sm:mb-6">
            <h3 className="text-xs sm:text-sm md:text-base font-bold dark:text-[#F5EACA] text-slate-900">Grafik Keuangan</h3>
            <select 
              value={chartYear} 
              onChange={(e) => setChartYear(parseInt(e.target.value))}
              className="dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 dark:text-[#F5EACA] text-slate-900 text-xs rounded-xl px-2.5 py-1 sm:px-3 sm:py-1.5 focus:outline-none focus:border-[#1DA9D0]"
            >
              {[2024, 2025, 2026, 2027].map((y) => (
                <option key={y} value={y} className="dark:bg-[#012040] dark:text-[#F5EACA] bg-white text-slate-900">{y}</option>
              ))}
            </select>
          </div>
          <div className="h-48 sm:h-60 md:h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#013D66' : '#e2e8f0'} vertical={false} />
                <XAxis dataKey="name" stroke={isDark ? '#1DA9D0' : '#64748b'} opacity={0.8} fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke={isDark ? '#1DA9D0' : '#64748b'} opacity={0.8} fontSize={9} tickLine={false} axisLine={false} width={50} tickFormatter={(val) => `${(val/1000)}k`} />
                <Tooltip 
                  cursor={{ fill: isDark ? 'rgba(29, 169, 208, 0.1)' : 'rgba(29, 169, 208, 0.05)' }} 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#012040' : '#ffffff', 
                    borderColor: isDark ? 'rgba(29, 169, 208, 0.3)' : '#cbd5e1', 
                    borderRadius: '12px', 
                    fontSize: '11px', 
                    color: isDark ? '#F5EACA' : '#0f172a',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }} 
                  formatter={(value: any) => new Intl.NumberFormat('id-ID').format(value)}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '6px' }} />
                <Bar dataKey="Pemasukan" fill="#1DA9D0" radius={[4, 4, 0, 0]} barSize={16} />
                <Bar dataKey="Pengeluaran" fill="#EA8803" radius={[4, 4, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="glass-card-dark p-3.5 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border dark:border-[#1DA9D0]/15 border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3 sm:mb-5">
            <h3 className="text-xs sm:text-sm md:text-base font-bold dark:text-[#F5EACA] text-slate-900">Cucian Terbaru</h3>
            <Link href="/admin/laundry" className="text-[11px] sm:text-xs font-semibold dark:text-[#43D5CC] text-teal-600 hover:underline">
              Lihat Semua Cucian →
            </Link>
          </div>

          {error ? (
            <div className="text-center py-6 text-xs text-rose-500">
              ⚠️ {error}
            </div>
          ) : loading ? (
            <div className="text-center py-6 text-xs dark:text-[#F5EACA]/60 text-slate-500">Memuat data cucian...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-xs dark:text-[#F5EACA]/60 text-slate-500 space-y-3">
              <Shirt className="w-8 h-8 mx-auto dark:text-[#1DA9D0]/40 text-slate-300" />
              <p>Belum ada cucian tercatat hari ini.</p>
              <Link
                href="/admin/laundry/new"
                className="inline-block px-3.5 py-1.5 rounded-xl bg-[#1DA9D0] hover:bg-[#43D5CC] text-[#010E1C] font-bold text-xs transition-colors"
              >
                Catat Cucian Pertama
              </Link>
            </div>
          ) : (
            <>
              {/* Mobile View: Compact list */}
              <div className="md:hidden divide-y dark:divide-[#1DA9D0]/10 divide-slate-100">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="py-2.5 flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold dark:text-[#43D5CC] text-sky-600 text-xs">#{order.orderNumber}</span>
                        <span className="font-medium text-xs dark:text-[#F5EACA] text-slate-900 truncate">
                          {order.customer?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold border ${getOrderStatusBadgeClass(order.status)}`}>
                          {getOrderStatusLabel(order.status)}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold border ${getPaymentStatusBadgeClass(order.paymentStatus)}`}>
                          {getPaymentStatusLabel(order.paymentStatus)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-xs dark:text-[#F5EACA] text-slate-900">
                        Rp {Number(order.totalPrice).toLocaleString('id-ID')}
                      </div>
                      <div className="text-[10px] dark:text-[#F5EACA]/50 text-slate-400">
                        {new Date(order.dateIn).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop / Tablet View: Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b dark:border-[#1DA9D0]/15 border-slate-200 dark:text-[#F5EACA]/60 text-slate-500 font-medium">
                      <th className="py-2.5 px-3">No. Nota</th>
                      <th className="py-2.5 px-3">Pelanggan</th>
                      <th className="py-2.5 px-3">Tanggal Masuk</th>
                      <th className="py-2.5 px-3">Status Cucian</th>
                      <th className="py-2.5 px-3">Pembayaran</th>
                      <th className="py-2.5 px-3 text-right">Total Harga</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-[#1DA9D0]/10 divide-slate-100">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="dark:hover:bg-[#1DA9D0]/5 hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3 font-bold dark:text-[#43D5CC] text-sky-600">#{order.orderNumber}</td>
                        <td className="py-2.5 px-3">
                          <div className="font-semibold dark:text-[#F5EACA] text-slate-900">{order.customer?.name}</div>
                          <div className="text-[10px] dark:text-[#F5EACA]/60 text-slate-500">{order.customer?.phone}</div>
                        </td>
                        <td className="py-2.5 px-3 dark:text-[#F5EACA]/80 text-slate-600">
                          {new Date(order.dateIn).toLocaleDateString('id-ID')}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getOrderStatusBadgeClass(order.status)}`}>
                            {getOrderStatusLabel(order.status)}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getPaymentStatusBadgeClass(order.paymentStatus)}`}>
                            {getPaymentStatusLabel(order.paymentStatus)}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold dark:text-[#F5EACA] text-slate-900">
                          Rp {Number(order.totalPrice).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
