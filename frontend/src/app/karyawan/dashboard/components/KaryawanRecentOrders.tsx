'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import type { LaundryOrder } from '@/types';
import { getOrderStatusBadgeClass, getOrderStatusLabel } from '@/lib/orderUtils';

interface KaryawanRecentOrdersProps {
  orders: LaundryOrder[];
  loading: boolean;
}

export default function KaryawanRecentOrders({
  orders,
  loading,
}: KaryawanRecentOrdersProps) {
  return (
    <Card glass className="p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-[#F5EACA]">
            Daftar Cucian Terbaru
          </h2>
          <p className="text-[10px] sm:text-xs text-slate-500 dark:text-[#F5EACA]/60">
            10 transaksi terakhir yang masuk ke sistem kasir
          </p>
        </div>
        <Link
          href="/karyawan/laundry"
          className="text-xs font-bold text-sky-600 dark:text-[#43D5CC] hover:underline inline-flex items-center gap-1"
        >
          Lihat Semua Cucian <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="py-8 text-center text-xs text-slate-400 dark:text-[#F5EACA]/50">
          Memuat data cucian terbaru...
        </div>
      ) : orders.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400 dark:text-[#F5EACA]/50">
          Belum ada transaksi cucian yang tercatat.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#1DA9D0]/15 text-slate-500 dark:text-[#F5EACA]/60">
                <th className="py-2.5 px-3">No. Nota</th>
                <th className="py-2.5 px-3">Pelanggan</th>
                <th className="py-2.5 px-3">Layanan</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#1DA9D0]/10">
              {orders.slice(0, 10).map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50 dark:hover:bg-[#013D66]/40 transition-colors"
                >
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-[#F5EACA]">
                    #{order.orderNumber}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-800 dark:text-[#F5EACA]">
                      {order.customer?.name}
                    </div>
                    <div className="text-[10px] text-slate-400">{order.customer?.phone}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-[#F5EACA]/80">
                    {order.items?.[0]?.package?.name || 'Layanan Laundry'}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${getOrderStatusBadgeClass(
                        order.status
                      )}`}
                    >
                      {getOrderStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      href="/karyawan/laundry"
                      className="text-[11px] font-semibold text-sky-600 dark:text-[#43D5CC] hover:underline"
                    >
                      Detail →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
