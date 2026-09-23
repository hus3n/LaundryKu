'use client';

import React from 'react';
import Link from 'next/link';
import { Shirt } from 'lucide-react';
import Card from '@/components/ui/Card';
import type { LaundryOrder } from '@/types';
import { 
  getOrderStatusBadgeClass, 
  getOrderStatusLabel, 
  getPaymentStatusBadgeClass, 
  getPaymentStatusLabel 
} from '@/lib/orderUtils';

interface AdminRecentOrdersProps {
  orders: LaundryOrder[];
  loading: boolean;
  error: string | null;
}

export default function AdminRecentOrders({
  orders,
  loading,
  error,
}: AdminRecentOrdersProps) {
  return (
    <Card className="p-2.5 sm:p-4 md:p-5">
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <h3 className="text-xs sm:text-sm md:text-base font-bold dark:text-[#F5EACA] text-slate-900">
          Cucian Terbaru
        </h3>
        <Link 
          href="/admin/laundry" 
          className="text-[10px] sm:text-xs font-semibold dark:text-[#43D5CC] text-teal-600 hover:underline"
        >
          Lihat Semua Cucian →
        </Link>
      </div>

      {error ? (
        <div className="text-center py-6 text-xs text-rose-500">
          ⚠️ {error}
        </div>
      ) : loading ? (
        <div className="text-center py-6 text-xs dark:text-[#F5EACA]/60 text-slate-500">
          Memuat data cucian...
        </div>
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
                    <span className="font-bold dark:text-[#43D5CC] text-sky-600 text-xs">
                      #{order.orderNumber}
                    </span>
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
                    <td className="py-2.5 px-3 font-bold dark:text-[#43D5CC] text-sky-600">
                      #{order.orderNumber}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold dark:text-[#F5EACA] text-slate-900">
                        {order.customer?.name}
                      </div>
                      <div className="text-[10px] dark:text-[#F5EACA]/60 text-slate-500">
                        {order.customer?.phone}
                      </div>
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
    </Card>
  );
}
