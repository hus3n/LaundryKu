'use client';

import React from 'react';
import { Printer } from 'lucide-react';
import type { LaundryOrder } from '@/types';
import {
  getPaymentStatusBadgeClass,
  getPaymentStatusLabel,
} from '@/lib/orderUtils';

interface LaundryOrderMobileCardProps {
  orders: LaundryOrder[];
  isSendingNota: string | null;
  onSelectOrder: (order: LaundryOrder) => void;
  onUpdateStatus: (e: React.ChangeEvent<HTMLSelectElement>, orderId: string) => void;
  onUpdatePayment: (e: React.MouseEvent, orderId: string, currentStatus: string) => void;
  onSendNotaImage: (e: React.MouseEvent, order: LaundryOrder) => void;
  onOpenReceipt: (e: React.MouseEvent, order: LaundryOrder) => void;
}

export default function LaundryOrderMobileCard({
  orders,
  isSendingNota,
  onSelectOrder,
  onUpdateStatus,
  onUpdatePayment,
  onSendNotaImage,
  onOpenReceipt,
}: LaundryOrderMobileCardProps) {
  return (
    <div className="md:hidden divide-y dark:divide-[#1DA9D0]/10 divide-slate-100">
      {orders.map((order) => (
        <div
          key={order.id}
          className="p-2.5 sm:p-3.5 space-y-1.5 dark:hover:bg-[#1DA9D0]/5 hover:bg-slate-50 transition-colors cursor-pointer"
          onClick={() => onSelectOrder(order)}
        >
          {/* Baris 1: No Nota + Status Cucian */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-bold dark:text-[#43D5CC] text-sky-600 text-xs">#{order.orderNumber}</span>
              {order.outlet && (
                <span className="text-[9px] dark:text-[#1DA9D0]/50 text-slate-500 truncate">({order.outlet.name})</span>
              )}
            </div>
            <select
              value={order.status}
              onChange={(e) => onUpdateStatus(e, order.id)}
              onClick={(e) => e.stopPropagation()}
              className="px-1.5 py-0.5 rounded text-[10px] font-semibold border dark:bg-[#013D66] bg-white dark:text-[#F5EACA]/80 text-slate-800 dark:border-[#1DA9D0]/25 border-slate-300 focus:outline-none shrink-0"
            >
              <option value="RECEIVED">Masuk</option>
              <option value="IN_PROGRESS">Dikerjakan</option>
              <option value="DONE">Selesai</option>
              <option value="PICKED_UP">Diambil</option>
            </select>
          </div>

          {/* Baris 2: Pelanggan + Total + Bayar */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="dark:text-[#F5EACA] text-slate-900 text-xs font-semibold truncate">{order.customer?.name}</div>
              <div className="text-[10px] dark:text-[#F5EACA]/60 text-slate-500 truncate">{order.customer?.phone}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="dark:text-[#F5EACA] text-slate-900 text-xs font-bold">
                Rp {Number(order.totalPrice).toLocaleString('id-ID')}
              </div>
              <button
                type="button"
                onClick={(e) => onUpdatePayment(e, order.id, order.paymentStatus)}
                className={`text-[9px] px-1.5 py-0.5 rounded-full border mt-0.5 ${getPaymentStatusBadgeClass(order.paymentStatus)}`}
              >
                {getPaymentStatusLabel(order.paymentStatus)}
                {order.paymentStatus === 'PAID' && order.paymentMethod ? ` · ${order.paymentMethod}` : ''}
              </button>
            </div>
          </div>

          {/* Baris 3: Item paket */}
          <div className="text-[10px] dark:text-[#F5EACA]/60 text-slate-500 truncate">
            {order.items?.map((item, i) => (
              <span key={i}>
                {item.package?.name} ({item.quantity} {item.package?.unit})
                {i < order.items.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>

          {/* Baris 4: Catatan + Parfum (jika ada) */}
          {(order.notes || order.fragrance) && (
            <div className="text-[10px] space-y-0.5">
              {order.notes && <div className="text-[#EA8803] italic truncate">📝 {order.notes}</div>}
              {order.fragrance && <div className="dark:text-[#43D5CC] text-teal-600 truncate">🌸 Parfum: {order.fragrance}</div>}
            </div>
          )}

          {/* Baris 5: Struk + Tgl Masuk */}
          <div className="flex items-center justify-between pt-0.5">
            <span className="text-[9px] dark:text-[#1DA9D0]/50 text-slate-400">
              Masuk: {new Date(order.dateIn).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
            </span>
            <div className="flex items-center gap-1.5">
              {order.customer?.phone && (
                <button
                  type="button"
                  id={`btn-send-nota-image-mob-${order.id}`}
                  onClick={(e) => onSendNotaImage(e, order)}
                  disabled={isSendingNota === order.id}
                  className="px-2 py-0.5 rounded-lg dark:bg-[#43D5CC]/10 bg-teal-50 dark:hover:bg-[#43D5CC]/20 hover:bg-teal-100 dark:text-[#43D5CC] text-teal-700 text-[10px] font-semibold border dark:border-[#43D5CC]/30 border-teal-200 inline-flex items-center gap-1 transition-colors disabled:opacity-50"
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
                className="px-2 py-0.5 rounded-lg dark:bg-[#013D66] bg-slate-100 dark:text-[#43D5CC] text-slate-700 text-[10px] font-semibold border dark:border-[#1DA9D0]/25 border-slate-300 inline-flex items-center gap-1 dark:hover:bg-[#014775] hover:bg-slate-200"
              >
                <Printer className="w-3 h-3" /> Struk
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
