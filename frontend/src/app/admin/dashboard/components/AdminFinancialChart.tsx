'use client';

import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import Card from '@/components/ui/Card';
import { FinanceChartItem } from '../types';

interface AdminFinancialChartProps {
  chartData: FinanceChartItem[];
  chartYear: number;
  onYearChange: (year: number) => void;
  isDark: boolean;
}

export default function AdminFinancialChart({
  chartData,
  chartYear,
  onYearChange,
  isDark,
}: AdminFinancialChartProps) {
  return (
    <Card className="p-2.5 sm:p-4 md:p-5">
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <h3 className="text-xs sm:text-sm md:text-base font-bold dark:text-[#F5EACA] text-slate-900">
          Grafik Keuangan
        </h3>
        <select 
          value={chartYear} 
          onChange={(e) => onYearChange(parseInt(e.target.value))}
          className="dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 dark:text-[#F5EACA] text-slate-900 text-[11px] sm:text-xs rounded-lg px-2 py-0.5 sm:px-3 sm:py-1 focus:outline-none focus:border-[#1DA9D0]"
        >
          {[2024, 2025, 2026, 2027].map((y) => (
            <option key={y} value={y} className="dark:bg-[#012040] dark:text-[#F5EACA] bg-white text-slate-900">
              {y}
            </option>
          ))}
        </select>
      </div>
      <div className="h-36 sm:h-52 md:h-64 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 6, right: 6, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#013D66' : '#e2e8f0'} vertical={false} />
            <XAxis dataKey="name" stroke={isDark ? '#1DA9D0' : '#64748b'} opacity={0.8} fontSize={9} tickLine={false} axisLine={false} />
            <YAxis stroke={isDark ? '#1DA9D0' : '#64748b'} opacity={0.8} fontSize={9} tickLine={false} axisLine={false} width={45} tickFormatter={(val) => `${(val / 1000)}k`} />
            <Tooltip 
              cursor={{ fill: isDark ? 'rgba(29, 169, 208, 0.1)' : 'rgba(29, 169, 208, 0.05)' }} 
              contentStyle={{ 
                backgroundColor: isDark ? '#012040' : '#ffffff', 
                borderColor: isDark ? 'rgba(29, 169, 208, 0.3)' : '#cbd5e1', 
                borderRadius: '10px', 
                fontSize: '11px', 
                color: isDark ? '#F5EACA' : '#0f172a',
                boxShadow: '0 8px 12px -3px rgba(0, 0, 0, 0.1)'
              }} 
              formatter={(value: any) => new Intl.NumberFormat('id-ID').format(value)}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '9px', paddingTop: '4px' }} />
            <Bar dataKey="Pemasukan" fill="#1DA9D0" radius={[3, 3, 0, 0]} barSize={14} />
            <Bar dataKey="Pengeluaran" fill="#EA8803" radius={[3, 3, 0, 0]} barSize={14} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
