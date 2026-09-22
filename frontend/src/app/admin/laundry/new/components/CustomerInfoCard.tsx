'use client';

import React from 'react';
import { User, Phone, MapPin, CheckCircle2, Loader2, UserCheck, Search, X } from 'lucide-react';
import { Customer } from '@/types';
import { OutletItem } from '../types';
import { useCustomerSearch } from '@/hooks/useCustomerSearch';

interface CustomerInfoCardProps {
  customerName: string;
  setCustomerName: (v: string) => void;
  customerPhone: string;
  setCustomerPhone: (v: string) => void;
  customerAddress: string;
  setCustomerAddress: (v: string) => void;
  selectedOutletId: string;
  setSelectedOutletId: (v: string) => void;
  outlets: OutletItem[];
}

export default function CustomerInfoCard({
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  customerAddress,
  setCustomerAddress,
  selectedOutletId,
  setSelectedOutletId,
  outlets,
}: CustomerInfoCardProps) {
  const {
    suggestions,
    isLoading,
    isOpen,
    setIsOpen,
    selectedIndex,
    setSelectedIndex,
    autoFilledNotice,
    isAutoFilled,
    setIsAutoFilled,
    wrapperRef,
    inputRef,
    isSelectingRef,
    searchCustomers,
    selectCustomer,
    handleKeyDown,
    handleClear,
  } = useCustomerSearch({
    onSelectCustomer: (customer: Customer) => {
      setCustomerName(customer.name);
      setCustomerPhone(customer.phone || '');
      if (customer.address) {
        setCustomerAddress(customer.address);
      }
    },
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomerName(value);
    setIsAutoFilled(false);

    if (isSelectingRef.current) {
      isSelectingRef.current = false;
      return;
    }

    searchCustomers(value);
  };

  return (
    <div className="glass-card-dark p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border dark:border-[#1DA9D0]/15 border-slate-200 space-y-2.5 sm:space-y-3.5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-xs sm:text-sm font-bold dark:text-[#F5EACA] text-slate-900 flex items-center gap-1.5 sm:gap-2">
          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 dark:text-[#43D5CC] text-teal-600" />
          Informasi Pelanggan
        </h3>

        {autoFilledNotice && (
          <div className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 animate-pulse">
            <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>{autoFilledNotice}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3.5">
        {/* Nama Pelanggan with Autocomplete */}
        <div ref={wrapperRef} className="relative">
          <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-0.5 sm:mb-1">
            Nama Pelanggan *
          </label>

          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              required
              value={customerName}
              onChange={handleNameChange}
              onFocus={() => {
                if (customerName.trim().length > 0 && suggestions.length > 0) {
                  setIsOpen(true);
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ketik nama (misal: Rina)"
              className="w-full pl-3 pr-8 py-1.5 sm:py-2 rounded-lg sm:rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/50 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0] transition-colors"
            />

            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin dark:text-[#43D5CC] text-teal-600" />
              ) : isAutoFilled ? (
                <span title="Pelanggan terdaftar terpilih" className="inline-flex">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                </span>
              ) : customerName.trim().length > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    setCustomerName('');
                    handleClear();
                  }}
                  className="p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : null}
            </div>
          </div>

          {/* Floating Dropdown Suggestion */}
          {isOpen && (
            <div className="absolute left-0 right-0 top-full mt-1 z-50 rounded-xl overflow-hidden shadow-2xl border dark:border-[#1DA9D0]/30 border-slate-200 bg-white/95 dark:bg-[#011627]/95 backdrop-blur-md max-h-56 overflow-y-auto">
              {suggestions.length > 0 ? (
                <div>
                  <div className="px-3 py-1.5 bg-slate-50 dark:bg-[#012040]/80 border-b dark:border-[#1DA9D0]/15 border-slate-200 flex items-center justify-between text-[10px] font-semibold dark:text-[#F5EACA]/70 text-slate-500">
                    <span className="flex items-center gap-1">
                      <Search className="w-3 h-3 text-[#1DA9D0]" />
                      {suggestions.length} Pelanggan
                    </span>
                    <span className="text-[9px] opacity-70">Gunakan ↑↓ dan Enter</span>
                  </div>

                  <ul className="divide-y dark:divide-[#1DA9D0]/10 divide-slate-100">
                    {suggestions.map((c, idx) => {
                      const isSelected = idx === selectedIndex;
                      return (
                        <li
                          key={c.id}
                          onClick={() => selectCustomer(c)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={`px-3 py-2 cursor-pointer transition-colors flex items-center justify-between gap-2 ${
                            isSelected
                              ? 'dark:bg-[#1DA9D0]/20 bg-teal-50/90'
                              : 'hover:bg-slate-50 dark:hover:bg-[#012040]/50'
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs dark:text-[#F5EACA] text-slate-900 truncate">
                                {c.name}
                              </span>
                              <span className="px-1 py-0.2 rounded text-[9px] font-medium bg-[#1DA9D0]/10 text-[#1DA9D0] dark:text-[#43D5CC] shrink-0">
                                Tersimpan
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-[10px] text-slate-500 dark:text-[#F5EACA]/60">
                              <span className="flex items-center gap-1">
                                <Phone className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                                {c.phone}
                              </span>
                              {c.address && (
                                <span className="flex items-center gap-1 truncate max-w-[150px]">
                                  <MapPin className="w-2.5 h-2.5 text-[#1DA9D0] shrink-0" />
                                  <span className="truncate">{c.address}</span>
                                </span>
                              )}
                            </div>
                          </div>

                          <span className="text-[10px] font-medium text-[#1DA9D0] dark:text-[#43D5CC] shrink-0">
                            Pilih ↵
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                !isLoading &&
                customerName.trim().length > 0 && (
                  <div className="p-3 text-center text-xs dark:text-[#F5EACA]/70 text-slate-600">
                    <p className="font-semibold text-slate-800 dark:text-[#F5EACA]">
                      Pelanggan belum terdaftar
                    </p>
                    <p className="text-[10px] mt-0.5 text-slate-500 dark:text-[#F5EACA]/50">
                      Nama & no WA akan otomatis disimpan sebagai data baru.
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Nomor WhatsApp */}
        <div>
          <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-0.5 sm:mb-1">
            Nomor WhatsApp *
          </label>
          <input
            type="text"
            required
            value={customerPhone}
            onChange={(e) => {
              setCustomerPhone(e.target.value);
              setIsAutoFilled(false);
            }}
            placeholder="Contoh: 081234567890"
            className="w-full px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/50 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0] transition-colors"
          />
        </div>
      </div>

      {outlets.length > 0 && (
        <div>
          <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-0.5 sm:mb-1">
            Outlet / Cabang *
          </label>
          <select
            value={selectedOutletId}
            onChange={(e) => setSelectedOutletId(e.target.value)}
            className="w-full px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 focus:outline-none focus:border-[#1DA9D0] transition-colors"
          >
            <option value="" className="dark:bg-[#012040] dark:text-[#F5EACA] bg-white text-slate-900">
              -- Pilih Outlet --
            </option>
            {outlets.map((o) => (
              <option key={o.id} value={o.id} className="dark:bg-[#012040] dark:text-[#F5EACA] bg-white text-slate-900">
                {o.name}
                {o.address ? ` — ${o.address}` : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700 mb-0.5 sm:mb-1">
          Alamat (Opsional)
        </label>
        <input
          type="text"
          value={customerAddress}
          onChange={(e) => {
            setCustomerAddress(e.target.value);
            setIsAutoFilled(false);
          }}
          placeholder="Contoh: Jl. Mawar No. 12"
          className="w-full px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl dark:bg-[#012040] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/50 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0] transition-colors"
        />
      </div>
    </div>
  );
}
