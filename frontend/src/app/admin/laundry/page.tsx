'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ReceiptModal from '@/components/ui/ReceiptModal';
import OrderLogModal from '@/components/ui/OrderLogModal';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { 
  Shirt, 
  Search, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Filter,
  Printer,
  Download
} from 'lucide-react';
import { exportToCSV } from '@/lib/export';

export default function GlobalLaundryListPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');

  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<any | null>(null);
  const [selectedLogOrder, setSelectedLogOrder] = useState<any | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (paymentFilter) params.paymentStatus = paymentFilter;

      const [orderRes, storeRes] = await Promise.all([
        api.get('/laundry', { params }),
        api.get('/store').catch(() => ({ data: { data: null } })),
      ]);

      setOrders(orderRes.data.data || []);
      setStore(storeRes.data.data || null);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter, paymentFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadOrders();
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.patch(`/laundry/${orderId}/status`, { status: newStatus });
      loadOrders();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal mengubah status cucian');
    }
  };

  const handleUpdatePayment = async (orderId: string, currentStatus: string) => {
    const newPayment = currentStatus === 'PAID' ? 'UNPAID' : 'PAID';
    try {
      await api.patch(`/laundry/${orderId}/payment`, { paymentStatus: newPayment });
      loadOrders();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal mengubah status pembayaran');
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await api.get('/laundry/export/all');
      const allOrders = res.data.data || [];
      if (allOrders.length === 0) {
        alert('Tidak ada data untuk diexport.');
        return;
      }

      const csvData = allOrders.map((o: any) => ({
        'No. Nota': o.orderNumber,
        'Tanggal Masuk': new Date(o.dateIn).toLocaleDateString('id-ID'),
        'Nama Pelanggan': o.customer?.name || '',
        'Nomor WA': o.customer?.phone || '',
        'Outlet': o.outlet?.name || 'Pusat',
        'Status Cucian': o.status,
        'Status Pembayaran': o.paymentStatus,
        'Metode Pembayaran': o.paymentMethod || '',
        'Total Harga (Rp)': o.totalPrice,
        'Catatan': o.notes || '',
        'Parfum': o.fragrance || '',
      }));

      exportToCSV(`Export_Cucian_${new Date().getTime()}.csv`, csvData);
    } catch (err) {
      alert('Gagal mengekspor data.');
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Data Cucian Global</h1>
            <p className="text-xs text-slate-400 mt-1">Daftar seluruh transaksi cucian toko, update status pengerjaan, dan cetak nota</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors inline-flex items-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Mengekspor...' : 'Export CSV'}
            </button>
            <Link
              href="/admin/laundry/new"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold text-xs shadow-lg shadow-brand-500/20 transition-all inline-flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Catat Cucian Baru
            </Link>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="glass-card-dark p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nota, pelanggan, no WA..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </form>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
            >
              <option value="">Semua Status Cucian</option>
              <option value="RECEIVED">Masuk</option>
              <option value="IN_PROGRESS">Sedang Dikerjakan</option>
              <option value="DONE">Selesai</option>
              <option value="PICKED_UP">Diambil Pelanggan</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
            >
              <option value="">Semua Pembayaran</option>
              <option value="UNPAID">Belum Bayar</option>
              <option value="PAID">Lunas</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="glass-card-dark rounded-2xl border border-slate-800 overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-xs text-slate-400">Memuat data cucian...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 text-xs text-slate-400 space-y-3">
              <Shirt className="w-12 h-12 mx-auto text-slate-600" />
              <p>Tidak ada data cucian yang sesuai dengan filter.</p>
            </div>
          ) : (
            <>
              {/* === CARD VIEW — MOBILE ONLY (< md) === */}
              <div className="md:hidden divide-y divide-slate-800/60">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 space-y-2.5 hover:bg-slate-900/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedLogOrder(order)}
                  >
                    {/* Baris 1: No Nota + Status Cucian */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-brand-300 text-xs">#{order.orderNumber}</span>
                        {order.outlet && (
                          <span className="ml-2 text-[9px] text-slate-500">{order.outlet.name}</span>
                        )}
                      </div>
                      <select
                        value={order.status}
                        onChange={(e) => { e.stopPropagation(); handleUpdateStatus(order.id, e.target.value); }}
                        onClick={(e) => e.stopPropagation()}
                        className="px-2 py-1 rounded-lg text-[10px] font-semibold border bg-slate-800 text-slate-300 border-slate-700 focus:outline-none"
                      >
                        <option value="RECEIVED">Masuk</option>
                        <option value="IN_PROGRESS">Dikerjakan</option>
                        <option value="DONE">Selesai</option>
                        <option value="PICKED_UP">Diambil</option>
                      </select>
                    </div>

                    {/* Baris 2: Pelanggan + Total + Bayar */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-white text-xs font-semibold">{order.customer?.name}</div>
                        <div className="text-[10px] text-slate-400">{order.customer?.phone}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white text-xs font-bold">
                          Rp {Number(order.totalPrice).toLocaleString('id-ID')}
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleUpdatePayment(order.id, order.paymentStatus); }}
                          className={`text-[9px] px-2 py-0.5 rounded-full border mt-0.5 ${
                            order.paymentStatus === 'PAID'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          }`}
                        >
                          {order.paymentStatus === 'PAID'
                            ? `Lunas${order.paymentMethod ? ` · ${order.paymentMethod}` : ''}`
                            : 'Belum Bayar'}
                        </button>
                      </div>
                    </div>

                    {/* Baris 3: Item paket */}
                    <div className="text-[10px] text-slate-400">
                      {order.items?.map((item: any, i: number) => (
                        <span key={i}>
                          {item.package?.name} ({item.quantity} {item.package?.unit})
                          {i < order.items.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>

                    {/* Baris 4: Catatan + Parfum (jika ada) */}
                    {(order.notes || order.fragrance) && (
                      <div className="text-[10px] space-y-0.5">
                        {order.notes && <div className="text-amber-400 italic">📝 {order.notes}</div>}
                        {order.fragrance && <div className="text-purple-400/90">🌸 Parfum: {order.fragrance}</div>}
                      </div>
                    )}

                    {/* Baris 5: Struk + Tgl Masuk */}
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-slate-500">
                        Masuk: {new Date(order.dateIn).toLocaleDateString('id-ID')}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedReceiptOrder(order); }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 text-brand-300 text-[10px] font-semibold border border-slate-700 inline-flex items-center gap-1"
                      >
                        <Printer className="w-3 h-3" /> Struk
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* === TABLE VIEW — DESKTOP ONLY (>= md) === */}
              <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-medium bg-slate-900/40">
                    <th className="py-3.5 px-4">No. Nota</th>
                    <th className="py-3.5 px-4">Pelanggan & WA</th>
                    <th className="py-3.5 px-4">Outlet</th>
                    <th className="py-3.5 px-4">Detail Paket</th>
                    <th className="py-3.5 px-4">Tgl Masuk / Estimasi</th>
                    <th className="py-3.5 px-4">Status Cucian</th>
                    <th className="py-3.5 px-4">Pembayaran</th>
                    <th className="py-3.5 px-4 text-right">Total & Struk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <AnimatePresence>
                    {orders.map((order) => (
                      <motion.tr 
                        key={order.id} 
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 16 }}
                        transition={{ duration: 0.2 }}
                        layout
                        onClick={() => setSelectedLogOrder(order)}
                        className="hover:bg-slate-900/50 transition-colors cursor-pointer"
                      >
                        <td className="py-4 px-4 font-bold text-brand-300">
                        #{order.orderNumber}
                        {order.notes && (
                          <div className="text-[10px] text-amber-400/90 mt-1 italic font-normal">
                            📝 {order.notes}
                          </div>
                        )}
                        {order.fragrance && (
                          <div className="text-[10px] text-purple-400/90 mt-0.5 font-normal">
                            🌸 Parfum: {order.fragrance}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-white">{order.customer?.name}</div>
                        <a
                          href={`https://wa.me/${order.customer?.phone}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[10px] text-brand-400 hover:underline"
                        >
                          {order.customer?.phone}
                        </a>
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-300">
                        {order.outlet?.name || '—'}
                      </td>
                      <td className="py-4 px-4 space-y-1">
                        {order.items?.map((item: any, i: number) => (
                          <div key={i} className="text-[11px] text-slate-300">
                            • {item.package?.name} ({item.quantity} {item.package?.unit}) —{' '}
                            <span className="text-slate-400">{item.category?.name}</span>
                          </div>
                        ))}
                      </td>
                      <td className="py-4 px-4 text-slate-300 space-y-0.5">
                        <div>{new Date(order.dateIn).toLocaleDateString('id-ID')}</div>
                        {order.estimatedDone && (
                          <div className="text-[10px] text-slate-400">
                            Est: {new Date(order.estimatedDone).toLocaleDateString('id-ID')}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={order.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => { e.stopPropagation(); handleUpdateStatus(order.id, e.target.value); }}
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-semibold border cursor-pointer focus:outline-none ${
                            order.status === 'RECEIVED'
                              ? 'bg-slate-800 text-slate-300 border-slate-700'
                              : order.status === 'IN_PROGRESS'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : order.status === 'DONE'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-brand-500/20 text-brand-300 border-brand-500/30'
                          }`}
                        >
                          <option value="RECEIVED" className="bg-slate-900 text-white">Masuk</option>
                          <option value="IN_PROGRESS" className="bg-slate-900 text-white">Sedang Dikerjakan</option>
                          <option value="DONE" className="bg-slate-900 text-white">Selesai</option>
                          <option value="PICKED_UP" className="bg-slate-900 text-white">Diambil Pelanggan</option>
                        </select>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleUpdatePayment(order.id, order.paymentStatus); }}
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-semibold border transition-all ${
                            order.paymentStatus === 'PAID'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-rose-500/20 hover:text-rose-300'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/30 hover:bg-emerald-500/20 hover:text-emerald-300'
                          }`}
                          title="Klik untuk ubah status bayar"
                        >
                          {order.paymentStatus === 'PAID' ? 'Lunas' : 'Belum Bayar'}
                        </button>
                        {order.paymentStatus === 'PAID' && order.paymentMethod && (
                          <div className="text-[9px] text-slate-400 mt-0.5 text-center">
                            {order.paymentMethod === 'CASH' ? '💵 Cash' : '📱 QRIS'}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right space-y-1.5">
                        <div className="font-bold text-white">
                          Rp {Number(order.totalPrice).toLocaleString('id-ID')}
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedReceiptOrder(order); }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-brand-300 text-[10px] font-semibold inline-flex items-center gap-1 border border-slate-700"
                        >
                          <Printer className="w-3 h-3" /> Struk
                        </button>
                      </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            </>
          )}
        </div>

        {/* Thermal Receipt Printable Modal */}
        <AnimatePresence>
          {selectedReceiptOrder && (
            <ReceiptModal
              order={selectedReceiptOrder}
              store={store}
              onClose={() => setSelectedReceiptOrder(null)}
            />
          )}
        </AnimatePresence>

        <OrderLogModal
          order={selectedLogOrder}
          isOpen={!!selectedLogOrder}
          onClose={() => setSelectedLogOrder(null)}
        />
      </div>
    </DashboardLayout>
  );
}
