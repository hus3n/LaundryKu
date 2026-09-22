import { LucideIcon } from 'lucide-react';
import {
  PlusCircle,
  ClipboardList,
  Users,
  FileText,
  BarChart3,
  Package,
  Layers,
  Building2,
  UserCheck,
  QrCode,
  Store,
  Clock,
  Database,
  Bot,
} from 'lucide-react';

export interface QuickAccessColorClass {
  bg: string;
  border: string;
  text: string;
  hoverBorder: string;
  glow: string;
}

export interface QuickAccessItem {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  colorClass: QuickAccessColorClass;
  badge?: string;
  highlight?: boolean;
}

export const ADMIN_QUICK_ACTIONS: QuickAccessItem[] = [
  {
    id: 'new-laundry',
    title: 'Catat Cucian Baru',
    description: 'Input transaksi kasir & cetak nota',
    href: '/admin/laundry/new',
    icon: PlusCircle,
    colorClass: {
      bg: 'bg-[#1DA9D0]/15 dark:bg-[#1DA9D0]/20',
      border: 'border-[#1DA9D0]/30',
      text: 'text-[#1DA9D0] dark:text-[#43D5CC]',
      hoverBorder: 'group-hover:border-[#1DA9D0]',
      glow: 'group-hover:shadow-[#1DA9D0]/20',
    },
    badge: 'Utama',
    highlight: true,
  },
  {
    id: 'laundry-list',
    title: 'Data Cucian',
    description: 'Pantau status pengerjaan & order',
    href: '/admin/laundry',
    icon: ClipboardList,
    colorClass: {
      bg: 'bg-sky-500/15 dark:bg-sky-500/20',
      border: 'border-sky-500/30',
      text: 'text-sky-600 dark:text-sky-400',
      hoverBorder: 'group-hover:border-sky-400',
      glow: 'group-hover:shadow-sky-500/20',
    },
  },
  {
    id: 'customers',
    title: 'Data Pelanggan',
    description: 'Riwayat & kontak WhatsApp pelanggan',
    href: '/admin/customers',
    icon: Users,
    colorClass: {
      bg: 'bg-emerald-500/15 dark:bg-emerald-500/20',
      border: 'border-emerald-500/30',
      text: 'text-emerald-600 dark:text-emerald-400',
      hoverBorder: 'group-hover:border-emerald-400',
      glow: 'group-hover:shadow-emerald-500/20',
    },
  },
  {
    id: 'expenses',
    title: 'Catat Pengeluaran',
    description: 'Catatan kas keluar & biaya toko',
    href: '/admin/expenses',
    icon: FileText,
    colorClass: {
      bg: 'bg-amber-500/15 dark:bg-amber-500/20',
      border: 'border-amber-500/30',
      text: 'text-amber-600 dark:text-[#EA8803]',
      hoverBorder: 'group-hover:border-amber-400',
      glow: 'group-hover:shadow-amber-500/20',
    },
  },
  {
    id: 'reports',
    title: 'Laporan & Analitik',
    description: 'Grafik omset, laba rugi & ekspor data',
    href: '/admin/reports',
    icon: BarChart3,
    colorClass: {
      bg: 'bg-indigo-500/15 dark:bg-indigo-500/20',
      border: 'border-indigo-500/30',
      text: 'text-indigo-600 dark:text-indigo-400',
      hoverBorder: 'group-hover:border-indigo-400',
      glow: 'group-hover:shadow-indigo-500/20',
    },
  },
  {
    id: 'packages',
    title: 'Kelola Paket',
    description: 'Atur paket kiloan, satuan & harga',
    href: '/admin/packages',
    icon: Package,
    colorClass: {
      bg: 'bg-violet-500/15 dark:bg-violet-500/20',
      border: 'border-violet-500/30',
      text: 'text-violet-600 dark:text-violet-400',
      hoverBorder: 'group-hover:border-violet-400',
      glow: 'group-hover:shadow-violet-500/20',
    },
  },
  {
    id: 'categories',
    title: 'Kategori Cucian',
    description: 'Kelola jenis pakaian & kategori',
    href: '/admin/categories',
    icon: Layers,
    colorClass: {
      bg: 'bg-teal-500/15 dark:bg-teal-500/20',
      border: 'border-teal-500/30',
      text: 'text-teal-600 dark:text-[#43D5CC]',
      hoverBorder: 'group-hover:border-teal-400',
      glow: 'group-hover:shadow-teal-500/20',
    },
  },
  {
    id: 'outlets',
    title: 'Kelola Outlet',
    description: 'Manajemen cabang & lokasi toko',
    href: '/admin/outlets',
    icon: Building2,
    colorClass: {
      bg: 'bg-blue-500/15 dark:bg-blue-500/20',
      border: 'border-blue-500/30',
      text: 'text-blue-600 dark:text-blue-400',
      hoverBorder: 'group-hover:border-blue-400',
      glow: 'group-hover:shadow-blue-500/20',
    },
  },
  {
    id: 'employees',
    title: 'Data Karyawan',
    description: 'Manajemen akun staf kasir & hak akses',
    href: '/admin/employees',
    icon: UserCheck,
    colorClass: {
      bg: 'bg-cyan-500/15 dark:bg-cyan-500/20',
      border: 'border-cyan-500/30',
      text: 'text-cyan-600 dark:text-cyan-400',
      hoverBorder: 'group-hover:border-cyan-400',
      glow: 'group-hover:shadow-cyan-500/20',
    },
  },
  {
    id: 'whatsapp',
    title: 'Pairing WA Toko',
    description: 'Status bot & scan QR WhatsApp',
    href: '/admin/whatsapp',
    icon: QrCode,
    colorClass: {
      bg: 'bg-green-500/15 dark:bg-green-500/20',
      border: 'border-green-500/30',
      text: 'text-green-600 dark:text-green-400',
      hoverBorder: 'group-hover:border-green-400',
      glow: 'group-hover:shadow-green-500/20',
    },
    badge: 'WA Gateway',
  },
  {
    id: 'settings',
    title: 'Pengaturan Toko',
    description: 'Profil, logo, printer & teks nota',
    href: '/admin/settings',
    icon: Store,
    colorClass: {
      bg: 'bg-slate-500/15 dark:bg-slate-500/20',
      border: 'border-slate-400/30 dark:border-slate-500/30',
      text: 'text-slate-700 dark:text-[#F5EACA]',
      hoverBorder: 'group-hover:border-slate-400',
      glow: 'group-hover:shadow-slate-500/20',
    },
  },
  {
    id: 'activity-log',
    title: 'Log Aktivitas',
    description: 'Audit jejak aksi karyawan & sistem',
    href: '/admin/activity-log',
    icon: Clock,
    colorClass: {
      bg: 'bg-rose-500/15 dark:bg-rose-500/20',
      border: 'border-rose-500/30',
      text: 'text-rose-600 dark:text-rose-400',
      hoverBorder: 'group-hover:border-rose-400',
      glow: 'group-hover:shadow-rose-500/20',
    },
  },
];

export const SUPERADMIN_QUICK_ACTIONS: QuickAccessItem[] = [
  {
    id: 'super-admins',
    title: 'Kelola Admin Toko',
    description: 'Daftar pemilik laundry, status & langganan',
    href: '/superadmin/admins',
    icon: Users,
    colorClass: {
      bg: 'bg-[#1DA9D0]/15 dark:bg-[#1DA9D0]/20',
      border: 'border-[#1DA9D0]/30',
      text: 'text-[#1DA9D0] dark:text-[#43D5CC]',
      hoverBorder: 'group-hover:border-[#1DA9D0]',
      glow: 'group-hover:shadow-[#1DA9D0]/20',
    },
    badge: 'Utama',
    highlight: true,
  },
  {
    id: 'super-whatsapp',
    title: 'Pairing WA Gateway',
    description: 'Hubungkan server WhatsApp platform',
    href: '/superadmin/whatsapp',
    icon: QrCode,
    colorClass: {
      bg: 'bg-emerald-500/15 dark:bg-emerald-500/20',
      border: 'border-emerald-500/30',
      text: 'text-emerald-600 dark:text-emerald-400',
      hoverBorder: 'group-hover:border-emerald-400',
      glow: 'group-hover:shadow-emerald-500/20',
    },
  },
  {
    id: 'super-bot',
    title: 'Pengaturan Bot WA',
    description: 'Template pesan & otomatisasi notif',
    href: '/superadmin/bot-settings',
    icon: Bot,
    colorClass: {
      bg: 'bg-violet-500/15 dark:bg-violet-500/20',
      border: 'border-violet-500/30',
      text: 'text-violet-600 dark:text-violet-400',
      hoverBorder: 'group-hover:border-violet-400',
      glow: 'group-hover:shadow-violet-500/20',
    },
  },
  {
    id: 'super-backup',
    title: 'Backup & Restore',
    description: 'Cadangkan database sistem LaundryKu',
    href: '/superadmin/backup',
    icon: Database,
    colorClass: {
      bg: 'bg-amber-500/15 dark:bg-amber-500/20',
      border: 'border-amber-500/30',
      text: 'text-amber-600 dark:text-[#EA8803]',
      hoverBorder: 'group-hover:border-amber-400',
      glow: 'group-hover:shadow-amber-500/20',
    },
  },
];

export const EMPLOYEE_QUICK_ACTIONS: QuickAccessItem[] = [
  {
    id: 'emp-new-laundry',
    title: 'Catat Cucian Baru',
    description: 'Input order cucian baru masuk kasir',
    href: '/karyawan/laundry/new',
    icon: PlusCircle,
    colorClass: {
      bg: 'bg-[#1DA9D0]/15 dark:bg-[#1DA9D0]/20',
      border: 'border-[#1DA9D0]/30',
      text: 'text-[#1DA9D0] dark:text-[#43D5CC]',
      hoverBorder: 'group-hover:border-[#1DA9D0]',
      glow: 'group-hover:shadow-[#1DA9D0]/20',
    },
    badge: 'Kasir',
    highlight: true,
  },
  {
    id: 'emp-laundry-list',
    title: 'Daftar Semua Cucian',
    description: 'Cari order, ubah status proses & siap ambil',
    href: '/karyawan/laundry',
    icon: ClipboardList,
    colorClass: {
      bg: 'bg-sky-500/15 dark:bg-sky-500/20',
      border: 'border-sky-500/30',
      text: 'text-sky-600 dark:text-sky-400',
      hoverBorder: 'group-hover:border-sky-400',
      glow: 'group-hover:shadow-sky-500/20',
    },
  },
];
