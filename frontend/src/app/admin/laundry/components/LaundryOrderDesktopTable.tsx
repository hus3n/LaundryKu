'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer } from 'lucide-react';
import type { LaundryOrder } from '@/types';
import {
  getOrderStatusBadgeClass,
  getPaymentStatusBadgeClass,
  getPaymentStatusLabel,
} from '@/lib/orderUtils';

interface LaundryOrderDesktopTableProps {
  orders: LaundryOrder[];
  isSendingNota: string | null;
  onSelectOrder: (order: LaundryOrder) => void;
  onUpdateStatus: (e: React.ChangeEvent<HTMLSelectElement>, orderId: string) => void;
  onUpdatePayment: (e: React.MouseEvent, orderId: string, currentStatus: string) => void;
  onSendNotaImage: (e: React.MouseEvent, order: LaundryOrder) => void;
  onOpenReceipt: (e: React.MouseEvent, order: LaundryOrder) => void;
}

export default function LaundryOrderDesktopTable({
  orders,
  isSendingNota,
  onSelectOrder,
  onUpdateStatus,
  onUpdatePayment,
  onSendNotaImage,
  onOpenReceipt,
}: LaundryOrderDesktopTableProps) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b dark:border-[#1DA9D0]/15 border-slate-200 dark:text-[#F5EACA]/60 text-slate-500 font-medium dark:bg-[#012040]/40 bg-slate-50">
            <th className="py-2.5 px-3 lg:py-3 lg:px-4">No. Nota</th>
            <th className="py-2.5 px-3 lg:py-3 lg:px-4">Pelanggan & WA</th>
            <th className="py-2.5 px-3 lg:py-3 lg:px-4">Outlet</th>
            <th className="py-2.5 px-3 lg:py-3 lg:px-4">Detail Paket</th>
            <th className="py-2.5 px-3 lg:py-3 lg:px-4">Tgl Masuk / Estimasi</th>
            <th className="py-2.5 px-3 lg:py-3 lg:px-4">Status Cucian</th>
            <th className="py-2.5 px-3 lg:py-3 lg:px-4">Pembayaran</th>
            <th className="py-2.5 px-3 lg:py-3 lg:px-4 text-right">Total & Struk</th>
          </tr>
        </thead>
        <tbody className="divide-y dark:divide-[#1DA9D0]/10 divide-slate-100">
          <AnimatePresence>
            {orders.map((order) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.2 }}
                layout
                onClick={() => onSelectOrder(order)}
                className="dark:hover:bg-[#1DA9D0]/5 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <td className="py-2.5 px-3 lg:py-3.5 lg:px-4 font-bold dark:text-[#43D5CC] text-sky-600">
                  #{order.orderNumber}
                  {order.notes && (
                    <div className="text-[10px] text-[#EA8803] mt-0.5 italic font-normal">
                      📝 {order.notes}
                    </div>
                  )}
                  {order.fragrance && (
                    <div className="text-[10px] dark:text-[#43D5CC]/90 text-teal-600 mt-0.5 font-normal">
                      🌸 Parfum: {order.fragrance}
                    </div>
                  )}
                </td>
                <td className="py-2.5 px-3 lg:py-3.5 lg:px-4">
                  <div className="font-semibold dark:text-[#F5EACA] text-slate-900">{order.customer?.name}</div>
                  <a
                    href={`https://wa.me/${order.customer?.phone}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[10px] dark:text-[#43D5CC] text-sky-600 hover:underline"
                  >
                    {order.customer?.phone}
                  </a>
                </td>
                <td className="py-2.5 px-3 lg:py-3.5 lg:px-4 text-xs dark:text-[#F5EACA]/80 text-slate-700">
                  {order.outlet?.name || '—'}
                </td>
                <td className="py-2.5 px-3 lg:py-3.5 lg:px-4 space-y-0.5">
                  {order.items?.map((item, i) => (
                    <div key={i} className="text-[11px] dark:text-[#F5EACA]/80 text-slate-700">
                      • {item.package?.name} ({item.quantity} {item.package?.unit}) —{' '}
                      <span className="dark:text-[#F5EACA]/60 text-slate-500">{item.category?.name}</span>
                    </div>
                  ))}
                </td>
                <td className="py-2.5 px-3 lg:py-3.5 lg:px-4 dark:text-[#F5EACA]/80 text-slate-700 space-y-0.5">
                  <div>{new Date(order.dateIn).toLocaleDateString('id-ID')}</div>
                  {order.estimatedDone && (
                    <div className="text-[10px] dark:text-[#F5EACA]/60 text-slate-500">
                      Est: {new Date(order.estimatedDone).toLocaleDateString('id-ID')}
                    </div>
                  )}
                </td>
                <td className="py-2.5 px-3 lg:py-3.5 lg:px-4">
                  <select
                    value={order.status}
                    onChange={(e) => onUpdateStatus(e, order.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="px-2 py-1 rounded-lg text-[10px] font-semibold border dark:bg-[#013D66] bg-white dark:text-[#F5EACA]/80 text-slate-800 dark:border-[#1DA9D0]/25 border-slate-300 focus:outline-none"
                  >
                    <option value="RECEIVED">Masuk</option>
                    <option value="IN_PROGRESS">Sedang Dikerjakan</option>
                    <option value="DONE">Selesai</option>
                    <option value="PICKED_UP">Diambil Pelanggan</option>
                  </select>
                </td>
                <td className="py-2.5 px-3 lg:py-3.5 lg:px-4">
                  <button
                    type="button"
                    onClick={(e) => onUpdatePayment(e, order.id, order.paymentStatus)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all ${getPaymentStatusBadgeClass(order.paymentStatus)}`}
                  >
                    {getPaymentStatusLabel(order.paymentStatus)}
                    {order.paymentStatus === 'PAID' && order.paymentMethod ? ` · ${order.paymentMethod}` : ''}
                  </button>
                </td>
                <td className="py-2.5 px-3 lg:py-3.5 lg:px-4 text-right space-y-1">
                  <div className="font-bold dark:text-[#F5EACA] text-slate-900 text-xs">
                    Rp {Number(order.totalPrice).toLocaleString('id-ID')}
                  </div>
                  <div className="flex items-center justify-end gap-1.5">
                    {order.customer?.phone && (
                      <button
                        type="button"
                        id={`btn-send-nota-image-${order.id}`}
                        onClick={(e) => onSendNotaImage(e, order)}
                        disabled={isSendingNota === order.id}
                        className="px-2 py-1 rounded-lg dark:bg-[#43D5CC]/10 bg-teal-50 dark:hover:bg-[#43D5CC]/20 hover:bg-teal-100 dark:text-[#43D5CC] text-teal-700 text-[10px] font-semibold border dark:border-[#43D5CC]/30 border-teal-200 inline-flex items-center gap-1 transition-colors disabled:opacity-50"
                        title="Kirim Nota sebagai Gambar WA"
                      >
                        {isSendingNota === order.id ? (
                          <div className="w-3 h-3 border-2 border-[#43D5CC]/30 border-t-[#43D5CC] rounded-full animate-spin" />
                        ) : (
                          <>📷 WA</>
                        )}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => onOpenReceipt(e, order)}
                      className="px-2.5 py-1 rounded-lg dark:bg-[#013D66] bg-slate-100 dark:text-[#43D5CC] text-slate-700 text-[10px] font-semibold border dark:border-[#1DA9D0]/25 border-slate-300 inline-flex items-center gap-1 dark:hover:bg-[#014775] hover:bg-slate-200"
                    >
                      <Printer className="w-3 h-3" /> Struk
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
