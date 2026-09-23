'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useTheme } from '@/contexts/ThemeContext';
import { api } from '@/lib/api';
import QuickAccessMenu from '@/components/dashboard/QuickAccessMenu';
import type { LaundryOrder } from '@/types';
import { FinanceChartItem, DashboardStats } from './types';
import AdminDashboardHeader from './components/AdminDashboardHeader';
import AdminDashboardMetrics from './components/AdminDashboardMetrics';
import AdminFinancialChart from './components/AdminFinancialChart';
import AdminRecentOrders from './components/AdminRecentOrders';

export default function AdminDashboardPage() {
  const { isDark } = useTheme();
  const [orders, setOrders] = useState<LaundryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<FinanceChartItem[]>([]);
  const [chartYear, setChartYear] = useState(new Date().getFullYear());

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get('/laundry');
        setOrders(res.data.data || []);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Terjadi kesalahan. Silakan refresh halaman.';
        setError(message);
        console.error('[AdminDashboard] Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    async function fetchChart() {
      try {
        const chartRes = await api.get(`/expenses/chart?year=${chartYear}`);
        if (chartRes.data.success) {
          const { labels, expenseData, incomeData } = chartRes.data.data;
          const formatted: FinanceChartItem[] = labels.map((label: string, index: number) => ({
            name: label,
            Pemasukan: incomeData[index],
            Pengeluaran: expenseData[index],
          }));
          setChartData(formatted);
        }
      } catch (err) {
        console.error('[AdminDashboard] Failed to load chart:', err);
      }
    }
    fetchChart();
  }, [chartYear]);

  const stats: DashboardStats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0),
    todayOrders: orders.filter((item) => {
      const today = new Date().toISOString().slice(0, 10);
      return item.createdAt?.slice(0, 10) === today;
    }).length,
    doneOrders: orders.filter((item) => item.status === 'DONE').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-3 sm:space-y-5 md:space-y-6">
        <AdminDashboardHeader />
        <AdminDashboardMetrics stats={stats} />
        <QuickAccessMenu role="ADMIN" />
        <AdminFinancialChart
          chartData={chartData}
          chartYear={chartYear}
          onYearChange={setChartYear}
          isDark={isDark}
        />
        <AdminRecentOrders
          orders={orders}
          loading={loading}
          error={error}
        />
      </div>
    </DashboardLayout>
  );
}
