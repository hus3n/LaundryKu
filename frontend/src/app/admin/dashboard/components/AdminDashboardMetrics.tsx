'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shirt, TrendingUp, Clock, CheckCircle2, ArrowUpRight, DollarSign } from 'lucide-react';
import { staggerContainer, slideUp, cardHover } from '@/lib/animations';
import { DashboardStats } from '../types';

interface AdminDashboardMetricsProps {
  stats: DashboardStats;
}

export default function AdminDashboardMetrics({ stats }: AdminDashboardMetricsProps) {
  const { totalOrders, totalRevenue, todayOrders, doneOrders } = stats;

  return (
    <motion.div 
      variants={staggerContainer(0.06)}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3.5 md:gap-4"
    >
      <motion.div 
        variants={slideUp}
        whileHover={cardHover.hover}
        className="app-card p-2.5 sm:p-4 rounded-xl sm:rounded-2xl relative overflow-hidden shadow-sm"
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] sm:text-xs dark:text-[#F5EACA]/60 text-slate-500 font-medium">
              Total Cucian Masuk
            </p>
            <h3 className="text-base sm:text-xl md:text-2xl font-bold dark:text-[#F5EACA] text-slate-900 mt-0.5 sm:mt-1.5">
              {totalOrders}
            </h3>
          </div>
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl dark:bg-[#1DA9D0]/20 bg-sky-50 border dark:border-[#1DA9D0]/30 border-sky-200 flex items-center justify-center dark:text-[#43D5CC] text-sky-600 shrink-0">
            <Shirt className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <p className="text-[9px] sm:text-[11px] dark:text-[#43D5CC] text-sky-600 mt-1 sm:mt-2.5 flex items-center gap-1 font-medium">
          <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Terdaftar di sistem
        </p>
      </motion.div>

      <motion.div 
        variants={slideUp}
        whileHover={cardHover.hover}
        className="app-card p-2.5 sm:p-4 rounded-xl sm:rounded-2xl relative overflow-hidden shadow-sm"
      >
        <div className="flex justify-between items-start">
          <div className="min-w-0 flex-1 mr-1">
            <p className="text-[10px] sm:text-xs dark:text-[#F5EACA]/60 text-slate-500 font-medium">
              Total Pendapatan
            </p>
            <h3 className="text-sm sm:text-lg md:text-2xl font-bold dark:text-[#43D5CC] text-teal-600 mt-0.5 sm:mt-1.5 truncate">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </h3>
          </div>
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl dark:bg-[#43D5CC]/20 bg-teal-50 border dark:border-[#43D5CC]/30 border-teal-200 flex items-center justify-center dark:text-[#43D5CC] text-teal-600 shrink-0">
            <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <p className="text-[9px] sm:text-[11px] dark:text-[#43D5CC] text-teal-600 mt-1 sm:mt-2.5 flex items-center gap-1 font-medium">
          <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Akumulasi
        </p>
      </motion.div>

      <motion.div 
        variants={slideUp}
        whileHover={cardHover.hover}
        className="app-card p-2.5 sm:p-4 rounded-xl sm:rounded-2xl relative overflow-hidden shadow-sm"
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] sm:text-xs dark:text-[#F5EACA]/60 text-slate-500 font-medium">
              Masuk Hari Ini
            </p>
            <h3 className="text-base sm:text-xl md:text-2xl font-bold text-[#EA8803] mt-0.5 sm:mt-1.5">
              {todayOrders}
            </h3>
          </div>
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl dark:bg-[#EA8803]/20 bg-amber-50 border dark:border-[#EA8803]/30 border-amber-200 flex items-center justify-center text-[#EA8803] shrink-0">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <p className="text-[9px] sm:text-[11px] text-[#EA8803] mt-1 sm:mt-2.5 font-medium truncate">
          Hari ini: {new Date().toLocaleDateString('id-ID')}
        </p>
      </motion.div>

      <motion.div 
        variants={slideUp}
        whileHover={cardHover.hover}
        className="app-card p-2.5 sm:p-4 rounded-xl sm:rounded-2xl relative overflow-hidden shadow-sm"
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] sm:text-xs dark:text-[#F5EACA]/60 text-slate-500 font-medium">
              Siap Diambil
            </p>
            <h3 className="text-base sm:text-xl md:text-2xl font-bold text-[#1DA9D0] mt-0.5 sm:mt-1.5">
              {doneOrders}
            </h3>
          </div>
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl dark:bg-[#1DA9D0]/20 bg-sky-50 border dark:border-[#1DA9D0]/30 border-sky-200 flex items-center justify-center text-[#1DA9D0] shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <p className="text-[9px] sm:text-[11px] text-[#1DA9D0] mt-1 sm:mt-2.5 font-medium truncate">
          Menunggu diambil
        </p>
      </motion.div>
    </motion.div>
  );
}
