'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ReceiptModal from '@/components/ui/ReceiptModal';
import OrderLogModal from '@/components/ui/OrderLogModal';
import { AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { Shirt, PlusCircle } from 'lucide-react';
import type { LaundryOrder, StoreSettings } from '@/types';
import { getApiErrorMessage } from '@/lib/utils';
import LaundryFilterBar from './components/LaundryFilterBar';
import LaundryOrderMobileCard from './components/LaundryOrderMobileCard';
import LaundryOrderDesktopTable from './components/LaundryOrderDesktopTable';

export default function GlobalLaundryListPage() {
  const [orders, setOrders] = useState<LaundryOrder[]>([]);
  const [store, setStore] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');

  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<LaundryOrder | null>(null);
  const [selectedLogOrder, setSelectedLogOrder] = useState<LaundryOrder | null>(null);
  const [isSendingNota, setIsSendingNota] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
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
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan. Silakan refresh halaman.';
      setError(message);
      console.error('[LaundryPage] Failed to load orders:', err);
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
    } catch (err: unknown) {
      alert(getApiErrorMessage(err, 'Gagal mengubah status cucian'));
    }
  };

  const handleStatusChangeWithStop = (e: React.ChangeEvent<HTMLSelectElement>, orderId: string) => {
    e.stopPropagation();
    handleUpdateStatus(orderId, e.target.value);
  };

  const handleUpdatePayment = async (orderId: string, currentStatus: string) => {
    const newPayment = currentStatus === 'PAID' ? 'UNPAID' : 'PAID';
    try {
      await api.patch(`/laundry/${orderId}/payment`, { paymentStatus: newPayment });
      loadOrders();
    } catch (err: unknown) {
      alert(getApiErrorMessage(err, 'Gagal mengubah status pembayaran'));
    }
  };

  const handlePaymentClickWithStop = (e: React.MouseEvent, orderId: string, currentStatus: string) => {
    e.stopPropagation();
    handleUpdatePayment(orderId, currentStatus);
  };

  const handleSendNotaImage = async (e: React.MouseEvent, order: LaundryOrder) => {
    e.stopPropagation();
    const phone = order.customer?.phone;
    const name = order.customer?.name || 'Pelanggan';
    if (!phone) {
      alert('Pelanggan tidak memiliki nomor HP. Tidak bisa mengirim WA.');
      return;
    }
    if (!confirm(`Kirim gambar nota ke WhatsApp ${name} (${phone})?`)) return;

    try {
      setIsSendingNota(order.id);
      const res = await api.post('/whatsapp/send-nota-image', { orderId: order.id });
      alert(res.data.message || 'Gambar nota berhasil dikirim!');
    } catch (err: unknown) {
      alert(getApiErrorMessage(err, 'Gagal mengirim gambar nota'));
    } finally {
      setIsSendingNota(null);
    }
  };

  const handleReceiptClickWithStop = (e: React.MouseEvent, order: LaundryOrder) => {
    e.stopPropagation();
    setSelectedReceiptOrder(order);
  };

  return (
    <DashboardLayout>
      <div className="space-y-2.5 sm:space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
          <div>
            <h1 className="text-base sm:text-xl md:text-2xl font-bold dark:text-[#F5EACA] text-slate-900">Data Cucian Global</h1>
            <p className="text-[10px] sm:text-xs dark:text-[#F5EACA]/60 text-slate-500 mt-0.5">
              Daftar seluruh transaksi cucian toko, update status pengerjaan, dan cetak nota
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/laundry/new"
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] hover:opacity-95 text-[#010E1C] font-bold text-xs shadow-sm shadow-[#1DA9D0]/20 transition-all inline-flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Catat Cucian Baru
            </Link>
          </div>
        </div>

        <LaundryFilterBar
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          paymentFilter={paymentFilter}
          setPaymentFilter={setPaymentFilter}
          onSearchSubmit={handleSearchSubmit}
        />

        <div className="glass-card-dark rounded-2xl border dark:border-[#1DA9D0]/15 border-slate-200 overflow-hidden shadow-sm">
          {error ? (
            <div className="text-center py-12 text-xs text-rose-400">⚠️ {error}</div>
          ) : loading ? (
            <div className="text-center py-12 text-xs dark:text-[#F5EACA]/60 text-slate-500">Memuat data cucian...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 text-xs dark:text-[#F5EACA]/60 text-slate-500 space-y-3">
              <Shirt className="w-12 h-12 mx-auto dark:text-[#1DA9D0]/40 text-slate-300" />
              <p>Tidak ada data cucian yang sesuai dengan filter.</p>
            </div>
          ) : (
            <>
              <LaundryOrderMobileCard
                orders={orders}
                isSendingNota={isSendingNota}
                onSelectOrder={setSelectedLogOrder}
                onUpdateStatus={handleStatusChangeWithStop}
                onUpdatePayment={handlePaymentClickWithStop}
                onSendNotaImage={handleSendNotaImage}
                onOpenReceipt={handleReceiptClickWithStop}
              />
              <LaundryOrderDesktopTable
                orders={orders}
                isSendingNota={isSendingNota}
                onSelectOrder={setSelectedLogOrder}
                onUpdateStatus={handleStatusChangeWithStop}
                onUpdatePayment={handlePaymentClickWithStop}
                onSendNotaImage={handleSendNotaImage}
                onOpenReceipt={handleReceiptClickWithStop}
              />
            </>
          )}
        </div>

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
