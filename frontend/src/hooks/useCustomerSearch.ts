'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { Customer } from '@/types';

interface UseCustomerSearchOptions {
  onSelectCustomer: (customer: Customer) => void;
}

export function useCustomerSearch({ onSelectCustomer }: UseCustomerSearchOptions) {
  const [suggestions, setSuggestions] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [autoFilledNotice, setAutoFilledNotice] = useState<string | null>(null);
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSelectingRef = useRef(false);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Auto-dismiss autofill notice
  useEffect(() => {
    if (!autoFilledNotice) return;
    const timer = setTimeout(() => {
      setAutoFilledNotice(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [autoFilledNotice]);

  const searchCustomers = (query: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    const trimmed = query.trim();
    if (trimmed.length === 0) {
      setSuggestions([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await api.get('/customers', {
          params: { q: trimmed },
        });
        const data: Customer[] = res.data?.data || [];
        const queryLower = trimmed.toLowerCase();
        const filtered = data.filter(
          (c) =>
            c.name.toLowerCase().includes(queryLower) ||
            (c.phone && c.phone.includes(trimmed))
        );

        setSuggestions(filtered);
        setSelectedIndex(-1);
        if (document.activeElement === inputRef.current) {
          setIsOpen(true);
        }
      } catch (err) {
        console.error('[useCustomerSearch] Gagal memuat rekomendasi:', err);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 250);
  };

  const selectCustomer = (customer: Customer) => {
    isSelectingRef.current = true;
    onSelectCustomer(customer);
    setIsOpen(false);
    setSuggestions([]);
    setIsAutoFilled(true);
    setAutoFilledNotice(`Data "${customer.name}" berhasil terisi otomatis!`);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        e.preventDefault();
        selectCustomer(suggestions[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setSuggestions([]);
    setIsOpen(false);
    setIsAutoFilled(false);
    inputRef.current?.focus();
  };

  return {
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
  };
}
