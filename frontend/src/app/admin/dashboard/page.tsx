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
  DollarSign,
  Layers,
  Users,
  UserCheck,
  Building2
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
            <h1 className="text-2xl font-bold text-foreground">Dashboard Utama Laundry</h1>
            <p className="text-xs text-foreground/60 mt-1">Ringkasan transaksi, pendapatan, dan aktivitas cucian toko Anda</p>
          </div>
          <Link
            href="/admin/laundry/new"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] hover:opacity-95 text-[#010E1C] font-bold text-xs shadow-lg shadow-[#1DA9D0]/20 transition-all inline-flex items-center gap-2"
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
            className="glass-card-dark p-6 rounded-2xl border border-[#1DA9D0]/15 relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-foreground/60 font-medium">Total Cucian Masuk</p>
                <h3 className="text-2xl font-bold text-foreground mt-2">{totalOrders}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#1DA9D0]/20 border border-[#1DA9D0]/30 flex items-center justify-center text-[#43D5CC]">
                <Shirt className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-[#43D5CC] mt-4 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> Terdaftar di sistem
            </p>
          </motion.div>

          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
            className="glass-card-dark p-6 rounded-2xl border border-[#1DA9D0]/15 relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-foreground/60 font-medium">Total Pendapatan</p>
                <h3 className="text-2xl font-bold text-[#43D5CC] mt-2">
                  Rp {totalRevenue.toLocaleString('id-ID')}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#43D5CC]/20 border border-[#43D5CC]/30 flex items-center justify-center text-[#43D5CC]">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-[#43D5CC] mt-4 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Akumulasi pendapatan
            </p>
          </motion.div>

          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
            className="glass-card-dark p-6 rounded-2xl border border-[#1DA9D0]/15 relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-foreground/60 font-medium">Cucian Masuk Hari Ini</p>
                <h3 className="text-2xl font-bold text-[#EA8803] mt-2">{todayOrders}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#EA8803]/20 border border-[#EA8803]/30 flex items-center justify-center text-[#EA8803]">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-[#EA8803] mt-4">Tanggal: {new Date().toLocaleDateString('id-ID')}</p>
          </motion.div>

          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
            className="glass-card-dark p-6 rounded-2xl border border-[#1DA9D0]/15 relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-foreground/60 font-medium">Siap Diambil</p>
                <h3 className="text-2xl font-bold text-[#1DA9D0] mt-2">{doneOrders}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#1DA9D0]/20 border border-[#1DA9D0]/30 flex items-center justify-center text-[#1DA9D0]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-[#1DA9D0] mt-4">Menunggu diambil pelanggan</p>
          </motion.div>
        </motion.div>

        {/* Quick Access / Master Data Level (New) */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-foreground">Akses Cepat Master Data</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Paket', href: '/admin/packages', icon: Package, color: 'text-blue-400', bg: 'bg-blue-400/20', border: 'border-blue-400/30' },
              { label: 'Kategori', href: '/admin/categories', icon: Layers, color: 'text-indigo-400', bg: 'bg-indigo-400/20', border: 'border-indigo-400/30' },
              { label: 'Pelanggan', href: '/admin/customers', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-400/20', border: 'border-emerald-400/30' },
              { label: 'Karyawan', href: '/admin/employees', icon: UserCheck, color: 'text-orange-400', bg: 'bg-orange-400/20', border: 'border-orange-400/30' },
              { label: 'Cabang', href: '/admin/outlets', icon: Building2, color: 'text-purple-400', bg: 'bg-purple-400/20', border: 'border-purple-400/30' },
              { label: 'WhatsApp', href: '/admin/whatsapp', icon: QrCode, color: 'text-[#43D5CC]', bg: 'bg-[#43D5CC]/20', border: 'border-[#43D5CC]/30' },
            ].map((item, i) => (
              <Link key={i} href={item.href}>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-card-dark p-4 flex flex-col items-center justify-center text-center gap-3 rounded-2xl border border-[#1DA9D0]/15 hover:border-[#1DA9D0]/40 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.border} border flex items-center justify-center ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">{item.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Chart Section */}
        <div className="glass-card-dark p-6 rounded-2xl border border-[#1DA9D0]/15">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-foreground">Grafik Keuangan</h3>
            <select 
              value={chartYear} 
              onChange={(e) => setChartYear(parseInt(e.target.value))}
              className="bg-surface border border-[#1DA9D0]/25 text-foreground text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#1DA9D0]"
            >
              {[2024, 2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#013D66" vertical={false} />
                <XAxis dataKey="name" stroke="#1DA9D0" opacity={0.7} fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#1DA9D0" opacity={0.7} fontSize={10} tickLine={false} axisLine={false} width={80} tickFormatter={(val) => `Rp ${(val/1000)}k`} />
                <Tooltip 
                  cursor={{ fill: 'rgba(29, 169, 208, 0.1)' }} 
                  contentStyle={{ backgroundColor: '#012040', borderColor: 'rgba(29, 169, 208, 0.3)', borderRadius: '12px', fontSize: '12px', color: '#F5EACA' }} 
                  formatter={(value: any) => new Intl.NumberFormat('id-ID').format(value)}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Pemasukan" fill="#1DA9D0" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="Pengeluaran" fill="#EA8803" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="glass-card-dark p-6 rounded-2xl border border-[#1DA9D0]/15">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-foreground">Cucian Terbaru</h3>
            <Link href="/admin/laundry" className="text-xs font-semibold text-[#43D5CC] hover:underline">
              Lihat Semua Cucian →
            </Link>
          </div>

          {error ? (
            <div className="text-center py-8 text-xs text-rose-400">
              ⚠️ {error}
            </div>
          ) : loading ? (
            <div className="text-center py-8 text-xs text-foreground/60">Memuat data cucian...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-xs text-foreground/60 space-y-3">
              <Shirt className="w-10 h-10 mx-auto text-[#1DA9D0]/40" />
              <p>Belum ada cucian tercatat hari ini.</p>
              <Link
                href="/admin/laundry/new"
                className="inline-block px-4 py-2 rounded-xl bg-[#1DA9D0] hover:bg-[#43D5CC] text-[#010E1C] font-bold text-xs transition-colors"
              >
                Catat Cucian Pertama
              </Link>
            </div>
          ) : (
            <>
              {/* Mobile Card Layout (Hidden on md and up) */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="bg-surface/50 p-4 rounded-xl border border-[#1DA9D0]/10 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-[#43D5CC] text-sm">#{order.orderNumber}</div>
                        <div className="font-semibold text-foreground text-xs mt-1">{order.customer?.name}</div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${getOrderStatusBadgeClass(order.status)}`}>
                        {getOrderStatusLabel(order.status)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs border-t border-[#1DA9D0]/10 pt-3">
                      <div>
                        <p className="text-foreground/60 mb-1">Total Biaya</p>
                        <p className="font-bold text-foreground">Rp {Number(order.totalPrice).toLocaleString('id-ID')}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${getPaymentStatusBadgeClass(order.paymentStatus)}`}>
                          {getPaymentStatusLabel(order.paymentStatus)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table Layout (Hidden on mobile) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#1DA9D0]/15 text-foreground/60 font-medium">
                      <th className="py-3 px-4">No. Nota</th>
                      <th className="py-3 px-4">Pelanggan</th>
                      <th className="py-3 px-4">Tanggal Masuk</th>
                      <th className="py-3 px-4">Status Cucian</th>
                      <th className="py-3 px-4">Pembayaran</th>
                      <th className="py-3 px-4 text-right">Total Harga</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1DA9D0]/10">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-[#1DA9D0]/5 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#43D5CC]">#{order.orderNumber}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-foreground">{order.customer?.name}</div>
                          <div className="text-[10px] text-foreground/60">{order.customer?.phone}</div>
                        </td>
                        <td className="py-3.5 px-4 text-foreground/80">
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
                        <td className="py-3.5 px-4 text-right font-bold text-foreground">
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
