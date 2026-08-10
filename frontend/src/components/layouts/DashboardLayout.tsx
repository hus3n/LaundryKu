'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  LogOut,
  Menu,
  X,
  PlusCircle,
  FileText,
  User,
  Database,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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
      { label: 'Backup & Restore', href: '/superadmin/backup', icon: Database },
    ];
  } else if (user?.role === 'ADMIN') {
    navItems = [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Data Cucian', href: '/admin/laundry', icon: ClipboardList },
      { label: 'Catat Cucian', href: '/admin/laundry/new', icon: PlusCircle },
      { label: 'Kelola Paket', href: '/admin/packages', icon: Package },
      { label: 'Kategori Cucian', href: '/admin/categories', icon: Layers },
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
        <div className="flex items-center gap-3 pb-6 mb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-md shadow-brand-500/20">
            <Shirt className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-base">LaundryKu</div>
            <div className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 inline-block font-medium">
              {user?.storeName || user?.role}
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
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

          <button
            onClick={logout}
            title="Keluar / Logout"
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-xl sticky top-0 z-20 px-6 flex items-center justify-between">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="text-xs font-semibold text-slate-400">
            Selamat Datang, <span className="text-white">{user?.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-medium hidden sm:inline-block">
              {user?.role}
            </span>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <div className="relative flex-1 max-w-xs bg-slate-900 border-r border-slate-800 p-6 flex flex-col">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Shirt className="w-6 h-6 text-brand-400" />
                  <span className="font-bold text-white text-base">LaundryKu</span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
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
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${
                        isActive
                          ? 'bg-brand-500 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <button
                onClick={logout}
                className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-rose-500/10 text-rose-400 text-xs font-semibold border border-rose-500/20"
              >
                <LogOut className="w-4 h-4" />
                Keluar Aplikasi
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Page Content */}
        <main className="p-6 md:p-8 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
