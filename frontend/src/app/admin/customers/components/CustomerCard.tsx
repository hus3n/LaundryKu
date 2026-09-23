'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, MapPin, MessageSquare } from 'lucide-react';
import type { Customer } from '@/types';

interface CustomerCardProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

export default function CustomerCard({
  customer,
  onEdit,
  onDelete,
}: CustomerCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      layout
      className="glass-card-dark p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border dark:border-[#1DA9D0]/15 border-slate-200 space-y-2 sm:space-y-3 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl dark:bg-[#1DA9D0]/20 bg-teal-50 border dark:border-[#1DA9D0]/30 border-teal-200 flex items-center justify-center font-bold dark:text-[#43D5CC] text-teal-700 text-xs sm:text-sm">
            {customer.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold dark:text-[#F5EACA] text-slate-900 text-xs sm:text-sm truncate">
              {customer.name}
            </h4>
            <a
              href={`https://wa.me/${customer.phone}`}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] sm:text-[11px] dark:text-[#43D5CC] text-teal-600 hover:underline flex items-center gap-1 truncate"
            >
              <MessageSquare className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" /> {customer.phone}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(customer)}
            className="p-1 sm:p-1.5 rounded-lg dark:text-[#F5EACA]/60 text-slate-500 dark:hover:text-[#43D5CC] hover:text-teal-600 dark:hover:bg-[#013D66] hover:bg-slate-100 transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(customer.id)}
            className="p-1 sm:p-1.5 rounded-lg dark:text-[#F5EACA]/60 text-slate-500 hover:text-rose-500 dark:hover:bg-[#013D66] hover:bg-slate-100 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>

      {customer.address && (
        <div className="text-[10px] sm:text-xs dark:text-[#F5EACA]/60 text-slate-500 pt-1.5 sm:pt-2 border-t dark:border-[#1DA9D0]/15 border-slate-200 flex items-start gap-1">
          <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 dark:text-[#1DA9D0]/50 text-slate-400 shrink-0 mt-0.5" />
          <span className="line-clamp-2">{customer.address}</span>
        </div>
      )}
    </motion.div>
  );
}
