'use client';

import React, { useEffect, useState } from 'react';
import { X, Clock, User } from 'lucide-react';
import { api } from '@/lib/api';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  order: any | null;
  isOpen: boolean;
  onClose: () => void;
}

const ACTION_LABELS: Record<string, string> = {
  CREATE_ORDER: 'Pesanan Dibuat',
  UPDATE_STATUS: 'Status Cucian Diubah',
  UPDATE_PAYMENT: 'Status Pembayaran Diubah',
};

const STATUS_LABELS: Record<string, string> = {
  RECEIVED: 'Masuk',
  IN_PROGRESS: 'Sedang Dikerjakan',
  DONE: 'Selesai',
  PICKED_UP: 'Diambil Pelanggan',
  PAID: 'Lunas',
  UNPAID: 'Belum Bayar',
};

export default function OrderLogModal({ order, isOpen, onClose }: Props) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !order?.id) return;
    setLoading(true);
    api.get(`/laundry/${order.id}/logs`)
      .then((res) => {
        // Parse details JSON string from backend back into object
        const parsedLogs = (res.data.data || []).map((log: any) => ({
          ...log,
          details: log.details && typeof log.details === 'string' ? JSON.parse(log.details) : log.details
        }));
        setLogs(parsedLogs);
      })
      .catch((err) => console.error('Gagal memuat log:', err))
      .finally(() => setLoading(false));
  }, [isOpen, order?.id]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-[#010E1C]/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="glass-card-dark p-6 rounded-3xl border dark:border-[#1DA9D0]/15 border-slate-200 max-w-md w-full max-h-[80vh] flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold dark:text-[#F5EACA] text-slate-900">Log Aktivitas Pesanan</h3>
              <p className="text-[10px] dark:text-[#43D5CC] text-teal-600 font-semibold">#{order?.orderNumber}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl dark:hover:bg-[#013D66] hover:bg-slate-100 dark:text-[#F5EACA]/60 text-slate-500 hover:text-slate-900 dark:hover:text-[#F5EACA] transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Log Timeline */}
          <div className="overflow-y-auto flex-1 pr-1">
            {loading ? (
              <div className="text-center py-8 text-xs dark:text-[#F5EACA]/60 text-slate-500">Memuat log...</div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8 text-xs dark:text-[#F5EACA]/60 text-slate-500">Belum ada log aktivitas untuk pesanan ini.</div>
            ) : (
              <div className="relative pl-5">
                {/* Garis vertikal timeline */}
                <div className="absolute left-2 top-0 bottom-0 w-px dark:bg-[#1DA9D0]/25 bg-slate-200" />
                <div className="space-y-5">
                  {logs.map((log) => (
                    <div key={log.id} className="relative">
                      {/* Dot di timeline */}
                      <div className="absolute -left-3 top-1 w-2.5 h-2.5 rounded-full bg-[#1DA9D0] border-2 dark:border-[#010E1C] border-white" />

                      <div className="dark:bg-[#012040] bg-slate-50 rounded-xl p-3 border dark:border-[#1DA9D0]/15 border-slate-200">
                        {/* Aksi */}
                        <p className="text-xs font-semibold dark:text-[#F5EACA] text-slate-900 mb-1">
                          {ACTION_LABELS[log.action] || log.action}
                        </p>

                        {/* Detail dari log.details */}
                        {log.details && (
                          <div className="text-[10px] dark:text-[#F5EACA]/60 text-slate-600 space-y-0.5 mb-2">
                            {log.details.newStatus && (
                              <p>Status baru: <span className="dark:text-[#F5EACA]/80 text-slate-800 font-medium">{STATUS_LABELS[log.details.newStatus] || log.details.newStatus}</span></p>
                            )}
                            {log.details.newPaymentStatus && (
                              <p>Pembayaran: <span className="dark:text-[#F5EACA]/80 text-slate-800 font-medium">{STATUS_LABELS[log.details.newPaymentStatus] || log.details.newPaymentStatus}</span></p>
                            )}
                            {log.details.paymentMethod && (
                              <p>Metode: <span className="dark:text-[#F5EACA]/80 text-slate-800 font-medium">{log.details.paymentMethod}</span></p>
                            )}
                            {log.details.customerName && (
                              <p>Pelanggan: <span className="dark:text-[#F5EACA]/80 text-slate-800 font-medium">{log.details.customerName}</span></p>
                            )}
                          </div>
                        )}

                        {/* Footer: user + waktu */}
                        <div className="flex items-center justify-between text-[10px]">
                          <div className="flex items-center gap-1 dark:text-[#F5EACA]/60 text-slate-600">
                            <User className="w-3 h-3" />
                            <span>{log.user?.name}</span>
                            <span className="dark:text-[#1DA9D0]/40 text-slate-400">({log.user?.role})</span>
                          </div>
                          <div className="flex items-center gap-1 dark:text-[#F5EACA]/50 text-slate-400">
                            <Clock className="w-3 h-3" />
                            <span>
                              {new Date(log.createdAt).toLocaleString('id-ID', {
                                day: '2-digit', month: 'short', year: 'numeric',
                                hour: '2-digit', minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
