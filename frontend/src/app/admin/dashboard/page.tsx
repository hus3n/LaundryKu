'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import DashboardLayout from '@/components/layouts/DashboardLayout';
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

export default function AdminDashboardPage() {
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
      <div className="space-y-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard Utama Laundry</h1>
            <p className="text-xs text-slate-400 mt-1">Ringkasan transaksi, pendapatan, dan aktivitas cucian toko Anda</p>
          </div>
          <Link
            href="/admin/laundry/new"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold text-xs shadow-lg shadow-brand-500/20 transition-all inline-flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Catat Cucian Baru
          </Link>
        </div>

        {/* Summary Cards Grid */}
        <motion.div 
          variants={{ visible: { transition: { staggerChildren: 0.08 } }, hidden: {} }}
          initial="hidden" animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
            className="glass-card-dark p-6 rounded-2xl border border-slate-800 relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-400 font-medium">Total Cucian Masuk</p>
                <h3 className="text-2xl font-bold text-white mt-2">{totalOrders}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
                <Shirt className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-brand-300 mt-4 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> Terdaftar di sistem
            </p>
          </motion.div>

          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
            className="glass-card-dark p-6 rounded-2xl border border-slate-800 relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-400 font-medium">Total Pendapatan</p>
                <h3 className="text-2xl font-bold text-emerald-400 mt-2">
                  Rp {totalRevenue.toLocaleString('id-ID')}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-emerald-400 mt-4 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Akumulasi pendapatan
            </p>
          </motion.div>

          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
            className="glass-card-dark p-6 rounded-2xl border border-slate-800 relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-400 font-medium">Cucian Masuk Hari Ini</p>
                <h3 className="text-2xl font-bold text-amber-400 mt-2">{todayOrders}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-amber-300 mt-4">Tanggal: {new Date().toLocaleDateString('id-ID')}</p>
          </motion.div>

          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
            className="glass-card-dark p-6 rounded-2xl border border-slate-800 relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-400 font-medium">Siap Diambil</p>
                <h3 className="text-2xl font-bold text-accent-teal mt-2">{doneOrders}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-accent-teal/20 border border-accent-teal/30 flex items-center justify-center text-accent-teal">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-accent-teal mt-4">Menunggu diambil pelanggan</p>
          </motion.div>
        </motion.div>

        {/* Chart Section */}
        <div className="glass-card-dark p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-white">Grafik Keuangan</h3>
            <select 
              value={chartYear} 
              onChange={(e) => setChartYear(parseInt(e.target.value))}
              className="bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-brand-500"
            >
              {[2024, 2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} width={80} tickFormatter={(val) => `Rp ${(val/1000)}k`} />
                <Tooltip 
                  cursor={{ fill: '#1e293b' }} 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', fontSize: '12px', color: '#f8fafc' }} 
                  formatter={(value: any) => new Intl.NumberFormat('id-ID').format(value)}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Pemasukan" fill="#34d399" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="Pengeluaran" fill="#fb7185" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="glass-card-dark p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-white">Cucian Terbaru</h3>
            <Link href="/admin/laundry" className="text-xs font-semibold text-brand-400 hover:underline">
              Lihat Semua Cucian →
            </Link>
          </div>

          {error ? (
            <div className="text-center py-8 text-xs text-rose-400">
              ⚠️ {error}
            </div>
          ) : loading ? (
            <div className="text-center py-8 text-xs text-slate-400">Memuat data cucian...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400 space-y-3">
              <Shirt className="w-10 h-10 mx-auto text-slate-600" />
              <p>Belum ada cucian tercatat hari ini.</p>
              <Link
                href="/admin/laundry/new"
                className="inline-block px-4 py-2 rounded-xl bg-brand-500 text-white text-xs font-semibold"
              >
                Catat Cucian Pertama
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-medium">
                    <th className="py-3 px-4">No. Nota</th>
                    <th className="py-3 px-4">Pelanggan</th>
                    <th className="py-3 px-4">Tanggal Masuk</th>
                    <th className="py-3 px-4">Status Cucian</th>
                    <th className="py-3 px-4">Pembayaran</th>
                    <th className="py-3 px-4 text-right">Total Harga</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-brand-300">#{order.orderNumber}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{order.customer?.name}</div>
                        <div className="text-[10px] text-slate-400">{order.customer?.phone}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {new Date(order.dateIn).toLocaleDateString('id-ID')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${getOrderStatusBadgeClass(order.status)}`}>
                          {getOrderStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${getPaymentStatusBadgeClass(order.paymentStatus)}`}>
                          {getPaymentStatusLabel(order.paymentStatus)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-white">
                        Rp {Number(order.totalPrice).toLocaleString('id-ID')}
                      </td>
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
