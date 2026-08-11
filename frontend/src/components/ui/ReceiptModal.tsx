'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, Printer, Shirt } from 'lucide-react';

interface ReceiptModalProps {
  order: any;
  store: any;
  onClose: () => void;
}

export default function ReceiptModal({ order, store, onClose }: ReceiptModalProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="bg-white text-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative space-y-4 pointer-events-auto print:p-0 print:shadow-none print:w-full print:rounded-none">
          {/* Header bar (hide on print) */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 print:hidden">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <Printer className="w-4 h-4 text-brand-600" /> Struk / Nota Cucian
            </h3>
            <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
              <X className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Thermal Struk Area */}
          <div id="receipt-print-area" className="font-mono text-[11px] space-y-3 leading-tight text-slate-800">
            {/* Store Logo & Title */}
            <div className="text-center space-y-1">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center mx-auto mb-1">
                <Shirt className="w-4 h-4" />
              </div>
              <h2 className="font-extrabold text-sm uppercase tracking-wider">{store?.storeName || 'LAUNDRYKU'}</h2>
              {order?.outlet && (
                <p className="text-[10px] text-slate-700 font-bold uppercase pb-0.5">{order.outlet.name}</p>
              )}
              <p className="text-[10px] text-slate-600">
                {order?.outlet?.address || store?.storeAddress || 'Alamat Toko Laundry'}
              </p>
              <p className="text-[10px] text-slate-600">
                WA: {order?.outlet?.phone || store?.storePhone || '-'}
              </p>
            </div>

            <div className="border-t border-b border-dashed border-slate-400 py-2 space-y-1">
              <div className="flex justify-between">
                <span>No. Nota:</span>
                <span className="font-bold">#{order?.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Tanggal:</span>
                <span>{order?.dateIn ? new Date(order.dateIn).toLocaleDateString('id-ID') : '-'}</span>
              </div>
              <div className="flex justify-between">
                <span>Pelanggan:</span>
                <span className="font-bold">{order?.customer?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>No. WA:</span>
                <span>{order?.customer?.phone}</span>
              </div>
              <div className="flex justify-between">
                <span>Kasir:</span>
                <span>{order?.employee?.name || 'Staf Kasir'}</span>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-1 py-1">
              <div className="flex justify-between font-bold border-b pb-1">
                <span>Item & Paket</span>
                <span>Subtotal</span>
              </div>
              {order?.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between text-[10px]">
                  <div>
                    <div>{item.package?.name} ({item.category?.name})</div>
                    <div className="text-slate-500">
                      {item.quantity} {item.package?.unit} x Rp {Number(item.price).toLocaleString('id-ID')}
                    </div>
                  </div>
                  <div className="font-bold">Rp {Number(item.subtotal).toLocaleString('id-ID')}</div>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-slate-400 pt-2 space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span>TOTAL TAGIHAN:</span>
                <span className="text-sm">Rp {Number(order?.totalPrice || 0).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span>Status Pembayaran:</span>
                <span className="font-extrabold uppercase">
                  [{order?.paymentStatus === 'PAID' ? `LUNAS${order.paymentMethod ? ' - ' + order.paymentMethod : ''}` : 'BELUM BAYAR'}]
                </span>
              </div>
              {order?.estimatedDone && (
                <div className="flex justify-between text-[10px]">
                  <span>Est. Selesai:</span>
                  <span>{new Date(order.estimatedDone).toLocaleDateString('id-ID')}</span>
                </div>
              )}
              {order?.notes && (
                <div className="text-[10px] text-slate-600 italic pt-1">
                  Catatan: {order.notes}
                </div>
              )}
              {order?.fragrance && (
                <div className="text-[10px] text-slate-600 italic pt-1">
                  Parfum: {order.fragrance}
                </div>
              )}
            </div>

            {/* Footer Note */}
            <div className="text-center text-[9px] text-slate-500 pt-3 border-t border-slate-300 space-y-0.5">
              <p>*** TERIMA KASIH ***</p>
              <p>Simpan nota ini saat pengambilan cucian</p>
              <p>Powered by LaundryKu v1.0</p>
            </div>
          </div>

          {/* Action Buttons (hide on print) */}
          <div className="flex gap-3 pt-2 print:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
            >
              Tutup
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handlePrint}
              className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" /> Cetak Thermal / PDF
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
