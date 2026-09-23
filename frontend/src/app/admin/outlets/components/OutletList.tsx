'use client';

import React from 'react';
import { Building2, Edit, Trash2 } from 'lucide-react';
import type { Outlet } from '@/types';

interface OutletListProps {
  outlets: Outlet[];
  loading: boolean;
  error: string | null;
  onEdit: (outlet: Outlet) => void;
  onDelete: (id: string) => void;
}

export default function OutletList({
  outlets,
  loading,
  error,
  onEdit,
  onDelete,
}: OutletListProps) {
  return (
    <>
      {/* Mobile View */}
      <div className="block md:hidden space-y-2">
        {error ? (
          <div className="glass-card-dark p-4 rounded-xl text-center text-xs text-rose-500">⚠️ {error}</div>
        ) : loading ? (
          <div className="glass-card-dark p-4 rounded-xl text-center text-xs dark:text-[#F5EACA]/60 text-slate-500">Memuat data...</div>
        ) : outlets.length === 0 ? (
          <div className="glass-card-dark p-6 rounded-xl text-center dark:text-[#F5EACA]/60 text-slate-500 space-y-2">
            <Building2 className="w-8 h-8 mx-auto dark:text-[#1DA9D0]/40 text-slate-400" />
            <p className="text-xs">Belum ada outlet ditambahkan.</p>
          </div>
        ) : (
          outlets.map((outlet) => (
            <div key={outlet.id} className="glass-card-dark p-2.5 rounded-xl border dark:border-[#1DA9D0]/15 border-slate-200 flex items-center justify-between gap-2 shadow-sm">
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold dark:text-[#F5EACA] text-slate-900 truncate">{outlet.name}</h4>
                <p className="text-[11px] dark:text-[#F5EACA]/70 text-slate-600 truncate mt-0.5">{outlet.address || 'Tanpa alamat'}</p>
                {outlet.phone && (
                  <p className="text-[10px] dark:text-[#43D5CC] text-teal-600 truncate">{outlet.phone}</p>
                )}
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  onClick={() => onEdit(outlet)}
                  className="p-1.5 rounded-lg dark:text-[#F5EACA]/60 text-slate-500 dark:hover:text-[#43D5CC] hover:text-teal-600 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete(outlet.id)}
                  className="p-1.5 rounded-lg dark:text-[#F5EACA]/60 text-slate-500 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block glass-card-dark rounded-2xl border dark:border-[#1DA9D0]/15 border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="dark:bg-[#012040] bg-slate-100 border-b dark:border-[#1DA9D0]/15 border-slate-200 dark:text-[#F5EACA]/60 text-slate-600">
              <tr>
                <th className="py-3 px-4 font-semibold">Nama Outlet</th>
                <th className="py-3 px-4 font-semibold">Alamat</th>
                <th className="py-3 px-4 font-semibold">Nomor Telepon</th>
                <th className="py-3 px-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-[#1DA9D0]/10 divide-slate-200">
              {error ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-rose-500">⚠️ {error}</td>
                </tr>
              ) : loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center dark:text-[#F5EACA]/60 text-slate-500">Memuat data...</td>
                </tr>
              ) : outlets.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center dark:text-[#F5EACA]/60 text-slate-500 space-y-3">
                    <Building2 className="w-8 h-8 mx-auto dark:text-[#1DA9D0]/40 text-slate-400" />
                    <p>Belum ada outlet ditambahkan.</p>
                  </td>
                </tr>
              ) : (
                outlets.map((outlet) => (
                  <tr key={outlet.id} className="dark:hover:bg-[#013D66]/50 hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-4 dark:text-[#F5EACA] text-slate-900 font-medium">{outlet.name}</td>
                    <td className="py-2.5 px-4 dark:text-[#F5EACA]/80 text-slate-700">{outlet.address || '—'}</td>
                    <td className="py-2.5 px-4 dark:text-[#F5EACA]/80 text-slate-700">{outlet.phone || '—'}</td>
                    <td className="py-2.5 px-4">
                      <div className="flex justify-end items-center gap-1.5">
                        <button
                          onClick={() => onEdit(outlet)}
                          className="p-1.5 rounded-lg dark:text-[#F5EACA]/60 text-slate-500 dark:hover:text-[#43D5CC] hover:text-teal-600 dark:hover:bg-[#013D66] hover:bg-slate-100 transition-colors"
                          title="Edit Outlet"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(outlet.id)}
                          className="p-1.5 rounded-lg dark:text-[#F5EACA]/60 text-slate-500 hover:text-rose-500 dark:hover:bg-[#013D66] hover:bg-slate-100 transition-colors"
                          title="Nonaktifkan Outlet"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
