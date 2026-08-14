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
  User,
  Database,
  Bot,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import BrandLogo from '@/components/ui/BrandLogo';
import AppWindowControls from '@/components/ui/AppWindowControls';

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900/80 border-r border-slate-800/80 p-5 sticky top-0 h-screen z-30 backdrop-blur-xl">
        {/* Brand */}
        <div className="pb-5 mb-3 border-b border-slate-800">
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
                  isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 shadow-lg shadow-brand-500/25"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                {!isActive && (
                  <div className="absolute inset-0 rounded-xl bg-slate-800/60 opacity-0 group-hover:opacity-100 transition-opacity" />
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
        <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-brand-400 shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="truncate">
              <div className="text-xs font-semibold text-white truncate">{user?.name}</div>
              <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={logout}
            title="Keluar / Logout"
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </motion.button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-xl sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="text-xs font-semibold text-slate-400 truncate hidden sm:block">
              Selamat Datang, <span className="text-white font-bold">{user?.name}</span>
              {user?.storeName && (
                <span className="text-slate-500 font-normal ml-1.5">({user.storeName})</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* App Window & Fullscreen Controls */}
            <AppWindowControls />

            <span className="text-xs px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-medium hidden md:inline-block">
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
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" 
                onClick={() => setMobileOpen(false)} 
              />
              <motion.aside 
                key="mobile-sidebar"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="relative flex-1 max-w-xs bg-slate-900 border-r border-slate-800 p-6 flex flex-col"
              >
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                  <BrandLogo size="sm" storeName={user?.storeName} storeLogo={user?.storeLogo} />
                  <button onClick={() => setMobileOpen(false)} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key="close" 
                        initial={{ rotate: -90, opacity: 0 }} 
                        animate={{ rotate: 0, opacity: 1 }} 
                        exit={{ rotate: 90, opacity: 0 }} 
                        transition={{ duration: 0.15 }}
                      >
                        <X className="w-5 h-5" />
                      </motion.div>
                    </AnimatePresence>
                  </button>
                </div>

                <nav className="flex-1 space-y-1.5 overflow-y-auto">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-colors ${
                          isActive
                            ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={logout}
                  className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold border border-rose-500/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar Aplikasi
                </motion.button>
              </motion.aside>
            </div>
          )}
        </AnimatePresence>

        {/* Dynamic Page Content */}
        <main className="p-6 md:p-8 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
