'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { X, Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import PasswordInput from '@/components/ui/PasswordInput';

interface CreateTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateTrialModal({ isOpen, onClose, onSuccess }: CreateTrialModalProps) {
  const [storeName, setStoreName]     = useState('');
  const [name, setName]               = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [phone, setPhone]             = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [trialDays, setTrialDays]     = useState<3 | 5 | 7>(7);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg]       = useState<string | null>(null);

  const resetForm = () => {
    setStoreName(''); setName(''); setEmail('');
    setPassword(''); setPhone(''); setStoreAddress('');
    setTrialDays(7); setErrorMsg(null);
  };

  const handleClose = () => { resetForm(); onClose(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await api.post('/superadmin/admins/trial', {
        storeName, name, email, password, phone,
        storeAddress: storeAddress || undefined,
        trialDays: Number(trialDays),
      });
      resetForm(); onSuccess(); onClose();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || err.message || 'Gagal membuat akun trial');
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[60] bg-slate-900/60 dark:bg-[#010E1C]/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="glass-card-dark p-6 rounded-3xl dark:border-[#EA8803]/30 border-amber-300 max-w-md w-full space-y-5 shadow-2xl shadow-[#EA8803]/10 pointer-events-auto max-h-[90vh] overflow-y-auto">
  
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-[#EA8803]/20 text-[#EA8803] text-[10px] font-bold border border-[#EA8803]/30 uppercase tracking-wider">
                  TRIAL
                </span>
                <Zap className="w-4 h-4 text-[#EA8803]" />
              </div>
              <h3 className="text-base font-bold dark:text-[#F5EACA] text-slate-900">Buat Akun Trial Admin</h3>
              <p className="text-xs dark:text-[#F5EACA]/60 text-slate-500 mt-0.5">Tidak memerlukan pembayaran dimuka</p>
            </div>
            <motion.button 
              whileTap={{ scale: 0.9 }} 
              onClick={handleClose} 
              className="p-1.5 rounded-lg dark:text-[#F5EACA]/60 text-slate-500 hover:text-slate-900 dark:hover:text-[#F5EACA] dark:hover:bg-[#013D66] hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 dark:text-rose-400 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">

          <div>
            <label className="block text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-1">
              Nama Toko Laundry <span className="text-rose-400">*</span>
            </label>
            <input type="text" required value={storeName} onChange={(e) => setStoreName(e.target.value)}
              placeholder="Contoh: Bersih Jaya Laundry"
              className="w-full px-3.5 py-2 rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/40 placeholder-slate-400 focus:outline-none focus:border-[#EA8803] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-1">
              Nama Pemilik / Admin <span className="text-rose-400">*</span>
            </label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Bpk. Hendra"
              className="w-full px-3.5 py-2 rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/40 placeholder-slate-400 focus:outline-none focus:border-[#EA8803] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-1">
                Email Login <span className="text-rose-400">*</span>
              </label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="hendra@laundry.com"
                className="w-full px-3.5 py-2 rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 focus:outline-none focus:border-[#EA8803] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-1">
                Password <span className="text-rose-400">*</span>
              </label>
              <PasswordInput
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 karakter"
                className="w-full px-3.5 py-2 rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 focus:outline-none focus:border-[#EA8803] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-1">
              No. WhatsApp Pemilik <span className="text-rose-400">*</span>
            </label>
            <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)}
              placeholder="081234567890"
              className="w-full px-3.5 py-2 rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 focus:outline-none focus:border-[#EA8803] transition-colors"
            />
            <p className="text-[10px] dark:text-[#F5EACA]/50 text-slate-400 mt-1">Digunakan untuk notifikasi WhatsApp otomatis</p>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-1.5">
              <Clock className="w-3.5 h-3.5 text-[#EA8803]" />
              Durasi Trial <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {([3, 5, 7] as const).map((days) => (
                <button key={days} type="button" onClick={() => setTrialDays(days)}
                  className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                    trialDays === days
                      ? 'bg-[#EA8803]/20 border-[#EA8803]/60 text-[#EA8803]'
                      : 'dark:bg-[#012040] bg-slate-100 dark:border-[#1DA9D0]/25 border-slate-200 dark:text-[#F5EACA]/60 text-slate-600 hover:border-amber-300'
                  }`}
                >
                  {days} Hari
                </button>
              ))}
            </div>
            {trialDays === 7 && (
              <p className="text-[10px] text-[#EA8803]/70 mt-1.5">Disarankan: 7 hari untuk pengalaman trial terbaik</p>
            )}
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              type="button" 
              onClick={handleClose}
              className="px-4 py-2 rounded-xl dark:bg-[#013D66] bg-slate-100 dark:text-[#F5EACA]/80 text-slate-700 text-xs font-semibold dark:hover:bg-[#014775] hover:bg-slate-200 transition-colors"
            >
              Batal
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              type="submit" 
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#EA8803] dark:bg-gradient-to-r dark:from-[#EA8803] dark:to-[#EA8803]/80 hover:opacity-95 text-[#010E1C] font-bold text-xs disabled:opacity-50 transition-all shadow-md shadow-[#EA8803]/20 inline-flex items-center gap-2"
            >
              {isSubmitting ? (
                <><span className="w-3 h-3 border border-[#010E1C]/30 border-t-[#010E1C] rounded-full animate-spin" />Membuat...</>
              ) : (
                <><Zap className="w-3.5 h-3.5" />Buat Akun Trial</>
              )}
            </motion.button>
          </div>
  
        </form>
      </div>
    </motion.div>
    </>
  );
}
