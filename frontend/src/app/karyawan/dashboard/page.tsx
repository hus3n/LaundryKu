'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardList, 
  PlusCircle, 
  Users, 
  Package, 
  MessageCircle,
  Shirt,
  CheckCircle2,
  Inbox,
  ArrowRight
} from 'lucide-react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface TodayTasks {
  targetSelesai: number;
  antreanCuci: number;
  masukHariIni: number;
  diambilHariIni: number;
}

export default function KaryawanDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<TodayTasks | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/laundry/employee/today-tasks');
      if (res.data?.success) {
        setTasks(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchTasks, 30000);
    return () => clearInterval(interval);
  }, []);

  const gridItems = [
    {
      title: 'Catat Order Baru',
      desc: 'Masukkan transaksi pelanggan',
      icon: PlusCircle,
      href: '/karyawan/laundry/new',
      color: 'from-[#1DA9D0] to-[#43D5CC]',
      textColor: 'text-background'
    },
    {
      title: 'Manajemen Cucian',
      desc: 'Update status & cetak tagihan',
      icon: ClipboardList,
      href: '/karyawan/laundry',
      color: 'from-[#013D66] to-[#012040]',
      textColor: 'text-[#43D5CC]',
      border: 'border border-[#1DA9D0]/25'
    },
    {
      title: 'Buku Pelanggan',
      desc: 'Cari & lihat data nomor WA',
      icon: Users,
      href: '/karyawan/customers',
      color: 'from-[#013D66] to-[#012040]',
      textColor: 'text-foreground',
      border: 'border border-[#1DA9D0]/25'
    },
    {
      title: 'Katalog Paket',
      desc: 'Cek daftar layanan & harga',
      icon: Package,
      href: '/karyawan/packages',
      color: 'from-[#013D66] to-[#012040]',
      textColor: 'text-foreground/80',
      border: 'border border-[#1DA9D0]/25'
    },
    {
      title: 'Kirim Info WA',
      desc: 'Pesan kustom ke pelanggan',
      icon: MessageCircle,
      href: '/karyawan/whatsapp/send',
      color: 'from-[#013D66] to-[#012040]',
      textColor: 'text-[#1DA9D0]',
      border: 'border border-[#1DA9D0]/25'
    }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Title */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard Kasir</h1>
          <p className="text-xs text-foreground/60 mt-1">
            Tekan salah satu menu di bawah untuk mulai bekerja.
          </p>
        </div>

        {/* TASK WIDGET */}
        <div className="glass-card-dark p-5 rounded-3xl border border-[#1DA9D0]/25">
          <div className="flex items-center gap-2 mb-4">
            <Shirt className="w-5 h-5 text-[#43D5CC]" />
            <h2 className="text-sm font-bold text-white">Ringkasan Tugas Hari Ini</h2>
            {loading && <div className="ml-2 w-3 h-3 border-2 border-[#1DA9D0]/30 border-t-[#1DA9D0] rounded-full animate-spin" />}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-background p-4 rounded-2xl border border-[#1DA9D0]/15">
              <div className="text-[10px] text-foreground/50 uppercase font-semibold mb-1">Target Selesai</div>
              <div className="text-3xl font-black text-[#EA8803]">
                {tasks ? tasks.targetSelesai : '-'}
              </div>
              <div className="text-[10px] text-foreground/40 mt-1">Nota belum rampung</div>
            </div>
            
            <div className="bg-background p-4 rounded-2xl border border-[#1DA9D0]/15">
              <div className="text-[10px] text-foreground/50 uppercase font-semibold mb-1">Antrean Cuci</div>
              <div className="text-3xl font-black text-[#1DA9D0]">
                {tasks ? tasks.antreanCuci : '-'}
              </div>
              <div className="text-[10px] text-foreground/40 mt-1">Baru / antre dicuci</div>
            </div>

            <div className="bg-background p-4 rounded-2xl border border-[#1DA9D0]/15">
              <div className="text-[10px] text-foreground/50 uppercase font-semibold mb-1">Masuk Hari Ini</div>
              <div className="text-3xl font-black text-foreground">
                {tasks ? tasks.masukHariIni : '-'}
              </div>
              <div className="text-[10px] text-foreground/40 mt-1">Orderan tercatat</div>
            </div>

            <div className="bg-background p-4 rounded-2xl border border-[#43D5CC]/20 shadow-lg shadow-[#43D5CC]/5">
              <div className="text-[10px] text-[#43D5CC]/70 uppercase font-semibold mb-1">Diambil Hari Ini</div>
              <div className="text-3xl font-black text-[#43D5CC]">
                {tasks ? tasks.diambilHariIni : '-'}
              </div>
              <div className="text-[10px] text-[#43D5CC]/50 mt-1">Telah diserahkan</div>
            </div>
          </div>
        </div>

        {/* QUICK ACCESS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gridItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link key={idx} href={item.href}>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-6 rounded-3xl h-full flex flex-col justify-between bg-gradient-to-br ${item.color} ${item.border || ''} shadow-lg shadow-[#010E1C]/50 cursor-pointer transition-all group`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-2xl bg-white/10 backdrop-blur-md`}>
                      <Icon className={`w-8 h-8 ${item.textColor}`} />
                    </div>
                    <ArrowRight className={`w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity ${item.textColor}`} />
                  </div>
                  <div className="mt-8">
                    <h3 className={`text-xl font-bold ${item.textColor} mb-1`}>{item.title}</h3>
                    <p className={`text-xs ${item.textColor} opacity-80`}>{item.desc}</p>
                  </div>
                </motion.div>
              </Link>
            )
          })}
        </div>

      </div>
    </DashboardLayout>
  );
}
