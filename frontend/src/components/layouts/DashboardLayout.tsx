'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shirt,
  LayoutDashboard,
  ClipboardList,
  Package,
  Layers,
  Users,
  UserCheck,
  QrCode,
  Store,
  Building2,
  LogOut,
  Menu,
  X,
  PlusCircle,
  FileText,
  BarChart3,
  User,
  Database,
  Bot,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import BrandLogo from '@/components/ui/BrandLogo';
import AppWindowControls from '@/components/ui/AppWindowControls';
import ThemeToggle from '@/components/ui/ThemeToggle';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

export default function DashboardLayout({ children, role }: { children: React.ReactNode; role?: string }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  let navItems: SidebarItem[] = [];

  if (user?.role === 'SUPERADMIN') {
    navItems = [
      { label: 'Dashboard', href: '/superadmin/dashboard', icon: LayoutDashboard },
      { label: 'Kelola Admin', href: '/superadmin/admins', icon: Users },
      { label: 'Pairing WA', href: '/superadmin/whatsapp', icon: QrCode },
      { label: 'Pengaturan Bot WA', href: '/superadmin/bot-settings', icon: Bot },
      { label: 'Backup & Restore', href: '/superadmin/backup', icon: Database },
    ];
  } else if (user?.role === 'ADMIN') {
    navItems = [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Data Cucian', href: '/admin/laundry', icon: ClipboardList },
      { label: 'Catat Cucian', href: '/admin/laundry/new', icon: PlusCircle },
      { label: 'Kelola Paket', href: '/admin/packages', icon: Package },
      { label: 'Kategori Cucian', href: '/admin/categories', icon: Layers },
      { label: 'Kelola Outlet', href: '/admin/outlets', icon: Building2 },
      { label: 'Catatan Pengeluaran', href: '/admin/expenses', icon: FileText },
      { label: 'Laporan & Analitik', href: '/admin/reports', icon: BarChart3 },
      { label: 'Data Pelanggan', href: '/admin/customers', icon: Users },
      { label: 'Data Karyawan', href: '/admin/employees', icon: UserCheck },
      { label: 'Pairing WA Toko', href: '/admin/whatsapp', icon: QrCode },
      { label: 'Pengaturan Toko', href: '/admin/settings', icon: Store },
    ];
  } else {
    // EMPLOYEE
    navItems = [
      { label: 'Data Cucian', href: '/karyawan/laundry', icon: ClipboardList },
      { label: 'Catat Cucian Baru', href: '/karyawan/laundry/new', icon: PlusCircle },
    ];
  }

  return (
    <div className="min-h-screen dark:bg-[#010E1C] bg-slate-50 dark:text-[#F5EACA] text-slate-900 flex transition-colors duration-150">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 dark:bg-[#012040]/80 bg-white border-r dark:border-[#1DA9D0]/15 border-slate-200 p-5 sticky top-0 h-screen z-30 backdrop-blur-xl shadow-sm">
        {/* Brand */}
        <div className="pb-5 mb-3 border-b dark:border-[#1DA9D0]/15 border-slate-200">
          <Link href={user?.role === 'SUPERADMIN' ? '/superadmin/dashboard' : user?.role === 'ADMIN' ? '/admin/dashboard' : '/karyawan/laundry'}>
            <BrandLogo storeName={user?.storeName} storeLogo={user?.storeLogo} />
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1 relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-colors group ${
                  isActive ? 'text-[#010E1C] font-bold' : 'dark:text-[#F5EACA]/60 text-slate-600 dark:hover:text-[#F5EACA] hover:text-slate-900'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute inset-0 rounded-xl bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] shadow-lg shadow-[#1DA9D0]/25"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                {!isActive && (
                  <div className="absolute inset-0 rounded-xl dark:bg-[#1DA9D0]/10 bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
                <span className="relative z-10 flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="pt-4 mt-4 border-t dark:border-[#1DA9D0]/15 border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl dark:bg-[#013D66] bg-slate-100 border dark:border-[#1DA9D0]/25 border-slate-200 flex items-center justify-center font-bold dark:text-[#43D5CC] text-sky-600 shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="truncate">
              <div className="text-xs font-semibold dark:text-[#F5EACA] text-slate-900 truncate">{user?.name}</div>
              <div className="text-[10px] dark:text-[#F5EACA]/50 text-slate-500 truncate">{user?.email}</div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={logout}
            title="Keluar / Logout"
            className="p-2 rounded-lg dark:text-[#F5EACA]/60 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </motion.button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-11 sm:h-14 md:h-16 border-b dark:border-[#1DA9D0]/15 border-slate-200 dark:bg-[#012040]/50 bg-white/80 backdrop-blur-xl sticky top-0 z-20 px-2 sm:px-4 md:px-6 flex items-center justify-between gap-1.5 sm:gap-3 shadow-sm">
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-1 sm:p-1.5 flex items-center justify-center rounded-lg dark:text-[#F5EACA]/60 text-slate-600 dark:hover:text-[#F5EACA] hover:text-slate-900 dark:hover:bg-[#1DA9D0]/10 hover:bg-slate-100 transition-colors shrink-0"
              aria-label="Buka Menu"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div className="md:hidden flex items-center gap-1.5 min-w-0 truncate">
              <img
                src="/logo/laundryku.png"
                alt="Logo"
                className="w-5 h-5 rounded-md object-contain shrink-0"
              />
              <span className="text-xs font-bold dark:text-[#F5EACA] text-slate-900 truncate">
                {user?.storeName || 'LaundryKu'}
              </span>
            </div>

            <div className="text-xs font-semibold dark:text-[#F5EACA]/60 text-slate-500 truncate hidden md:block">
              Selamat Datang, <span className="dark:text-[#F5EACA] text-slate-900 font-bold">{user?.name}</span>
              {user?.storeName && (
                <span className="dark:text-[#1DA9D0]/70 text-sky-600 font-normal ml-1.5">({user.storeName})</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Theme Toggle (☀️ Light / 🌙 Dark) */}
            <ThemeToggle />

            {/* App Window & Fullscreen Controls */}
            <AppWindowControls />

            <span className="text-[11px] sm:text-xs px-2.5 py-1 rounded-full dark:bg-[#013D66] bg-slate-100 border dark:border-[#1DA9D0]/25 border-slate-200 dark:text-[#F5EACA]/80 text-slate-700 font-medium hidden md:inline-block">
              {user?.role}
            </span>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <div className="fixed inset-0 z-50 flex md:hidden">
              <motion.div 
                key="mobile-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-slate-900/60 dark:bg-[#010E1C]/85 backdrop-blur-sm" 
                onClick={() => setMobileOpen(false)} 
              />
              <motion.aside 
                key="mobile-sidebar"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="relative flex-1 max-w-[260px] dark:bg-[#012040] bg-white border-r dark:border-[#1DA9D0]/15 border-slate-200 p-3 sm:p-5 flex flex-col shadow-2xl"
              >
                <div className="flex items-center justify-between pb-2.5 mb-2 border-b dark:border-[#1DA9D0]/15 border-slate-200 gap-2">
                  <div className="min-w-0 flex-1">
                    <BrandLogo size="sm" storeName={user?.storeName} storeLogo={user?.storeLogo} />
                  </div>
                  <button onClick={() => setMobileOpen(false)} className="p-1 dark:text-[#F5EACA]/60 text-slate-500 dark:hover:text-[#F5EACA] hover:text-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1DA9D0]/10 transition-colors shrink-0" aria-label="Tutup Menu">
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key="close" 
                        initial={{ rotate: -90, opacity: 0 }} 
                        animate={{ rotate: 0, opacity: 1 }} 
                        exit={{ rotate: 90, opacity: 0 }} 
                        transition={{ duration: 0.15 }}
                      >
                        <X className="w-4 h-4" />
                      </motion.div>
                    </AnimatePresence>
                  </button>
                </div>

                <nav className="flex-1 space-y-0.5 overflow-y-auto pr-0.5">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] text-[#010E1C] font-bold shadow-sm shadow-[#1DA9D0]/20'
                            : 'dark:text-[#F5EACA]/60 text-slate-600 dark:hover:text-[#F5EACA] hover:text-slate-900 dark:hover:bg-[#1DA9D0]/10 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-3 pt-2.5 border-t dark:border-[#1DA9D0]/15 border-slate-200 space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-medium dark:text-[#F5EACA]/60 text-slate-500">Pilihan Tema:</span>
                    <ThemeToggle showLabel />
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={logout}
                    className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg dark:bg-rose-500/10 bg-rose-50 dark:text-rose-400 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-xs font-semibold border dark:border-rose-500/20 border-rose-200 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Keluar Aplikasi
                  </motion.button>
                </div>
              </motion.aside>
            </div>
          )}
        </AnimatePresence>

        {/* Dynamic Page Content */}
        <main className="p-2 sm:p-4 md:p-6 lg:p-8 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
