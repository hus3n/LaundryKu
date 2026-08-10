'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layouts/DashboardLayout';
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

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get('/laundry');
        setOrders(res.data.data || []);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card-dark p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
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
          </div>

          <div className="glass-card-dark p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
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
          </div>

          <div className="glass-card-dark p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
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
          </div>

          <div className="glass-card-dark p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
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

          {loading ? (
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
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                            order.status === 'RECEIVED'
                              ? 'bg-slate-800 text-slate-300 border-slate-700'
                              : order.status === 'IN_PROGRESS'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : order.status === 'DONE'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-brand-500/20 text-brand-300 border-brand-500/30'
                          }`}
                        >
                          {order.status === 'RECEIVED'
                            ? 'Masuk'
                            : order.status === 'IN_PROGRESS'
                            ? 'Diproses'
                            : order.status === 'DONE'
                            ? 'Selesai'
                            : 'Diambil'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                            order.paymentStatus === 'PAID'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          }`}
                        >
                          {order.paymentStatus === 'PAID' ? 'Lunas' : 'Belum Bayar'}
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
