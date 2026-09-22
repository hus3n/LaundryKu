'use client';

import React from 'react';
import { Shirt, Plus, Trash2 } from 'lucide-react';
import QuantityInput from '@/components/ui/QuantityInput';
import { OrderItem, PackageItem, CategoryItem } from '../types';

interface OrderItemsCardProps {
  items: OrderItem[];
  packages: PackageItem[];
  categories: CategoryItem[];
  loadingConfig: boolean;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onItemChange: (index: number, field: keyof OrderItem, value: any) => void;
  onQuantityChange: (index: number, newValue: number) => void;
}

export default function OrderItemsCard({
  items,
  packages,
  categories,
  loadingConfig,
  onAddItem,
  onRemoveItem,
  onItemChange,
  onQuantityChange,
}: OrderItemsCardProps) {
  return (
    <div className="glass-card-dark p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border dark:border-[#1DA9D0]/15 border-slate-200 space-y-2.5 sm:space-y-3.5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-xs sm:text-sm font-bold dark:text-[#F5EACA] text-slate-900 flex items-center gap-1.5 sm:gap-2">
          <Shirt className="w-3.5 h-3.5 sm:w-4 sm:h-4 dark:text-[#43D5CC] text-teal-600" /> Detail Item Cucian
        </h3>
        <button
          type="button"
          onClick={onAddItem}
          className="px-2 sm:px-2.5 py-1 rounded-lg dark:bg-[#013D66] bg-slate-100 dark:hover:bg-[#014775] hover:bg-slate-200 dark:text-[#43D5CC] text-slate-700 text-[10px] sm:text-xs font-semibold flex items-center gap-1 border dark:border-[#1DA9D0]/25 border-slate-300 transition-colors shadow-sm"
        >
          <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Tambah Item
        </button>
      </div>

      {loadingConfig ? (
        <div className="text-xs dark:text-[#F5EACA]/60 text-slate-500 py-2.5 text-center">Memuat data paket & kategori...</div>
      ) : packages.length === 0 ? (
        <div className="text-xs text-[#EA8803] p-2.5 sm:p-3.5 rounded-xl bg-[#EA8803]/10 border border-[#EA8803]/20">
          Belum ada paket layanan. Silakan buat paket layanan terlebih dahulu di menu "Kelola Paket".
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-2.5">
          {items.map((item, idx) => {
            const currentPkg = packages.find((p) => p.id === item.packageId);
            return (
              <div key={idx} className="p-2 sm:p-3 rounded-lg sm:rounded-xl dark:bg-[#012040]/90 bg-slate-50 border dark:border-[#1DA9D0]/15 border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-end">
                <div className="sm:col-span-4">
                  <label className="block text-[10px] font-semibold dark:text-[#F5EACA]/60 text-slate-600 mb-0.5 sm:mb-1">Paket Layanan</label>
                  <select
                    value={item.packageId}
                    onChange={(e) => onItemChange(idx, 'packageId', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg dark:bg-[#013D66] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 focus:outline-none focus:border-[#1DA9D0]"
                  >
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id} className="dark:bg-[#012040] dark:text-[#F5EACA] bg-white text-slate-900">
                        {pkg.name} (Rp {Number(pkg.price).toLocaleString('id-ID')}/{pkg.unit})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-[10px] font-semibold dark:text-[#F5EACA]/60 text-slate-600 mb-0.5 sm:mb-1">Kategori Jenis</label>
                  <select
                    value={item.categoryId}
                    onChange={(e) => onItemChange(idx, 'categoryId', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg dark:bg-[#013D66] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 focus:outline-none focus:border-[#1DA9D0]"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id} className="dark:bg-[#012040] dark:text-[#F5EACA] bg-white text-slate-900">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-semibold dark:text-[#F5EACA]/60 text-slate-600 mb-0.5 sm:mb-1">
                    Kuantitas ({currentPkg?.unit || 'unit'})
                  </label>
                  <QuantityInput
                    value={item.quantity}
                    onChange={(v) => onQuantityChange(idx, v)}
                    min={1}
                  />
                </div>

                <div className="sm:col-span-1 flex items-center justify-end sm:justify-center">
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoveItem(idx)}
                      className="p-1 sm:p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Hapus Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
