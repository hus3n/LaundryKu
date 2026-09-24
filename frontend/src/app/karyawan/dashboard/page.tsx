'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import QuickAccessMenu from '@/components/dashboard/QuickAccessMenu';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import type { LaundryOrder } from '@/types';
import KaryawanHeader from './components/KaryawanHeader';
import KaryawanMetrics from './components/KaryawanMetrics';
import KaryawanRecentOrders from './components/KaryawanRecentOrders';
import { DownloadAppButton } from '@/app/components/DownloadAppButton';

export default function KaryawanDashboardPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<LaundryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/laundry');
      setOrders(res.data.data || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat transaksi cucian';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter((o) => o.createdAt?.slice(0, 10) === todayStr);
  const inProgressOrders = orders.filter(
    (o) => o.status === 'RECEIVED' || o.status === 'IN_PROGRESS'
  );
  const readyOrders = orders.filter((o) => o.status === 'DONE');
  const pickedUpOrders = orders.filter((o) => o.status === 'PICKED_UP');

  return (
    <DashboardLayout role="EMPLOYEE">
      <div className="space-y-4 sm:space-y-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <KaryawanHeader
              userName={user?.name}
              loading={loading}
              onRefresh={fetchOrders}
            />
          </div>
          <div className="flex-shrink-0 mt-4 md:mt-0">
            <DownloadAppButton />
          </div>
        </div>

        {/* Akses Cepat Menu Section */}
        <QuickAccessMenu
          role="EMPLOYEE"
          title="Akses Cepat Kasir"
          subtitle="Pintasan cepat untuk proses kasir, input nota, dan pengecekan pakaian"
        />

        {/* Summary Metrics */}
        <KaryawanMetrics
          todayCount={todayOrders.length}
          inProgressCount={inProgressOrders.length}
          readyCount={readyOrders.length}
          pickedUpCount={pickedUpOrders.length}
        />

        {/* Latest Orders List */}
        <KaryawanRecentOrders orders={orders} loading={loading} />
      </div>
    </DashboardLayout>
  );
}
