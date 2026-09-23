'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api';
import { ExpenseFormData } from '../types';

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const initialForm: ExpenseFormData = {
  category: '',
  amount: '',
  date: new Date().toISOString().slice(0, 10),
  description: '',
};

export default function ExpenseFormModal({
  isOpen,
  onClose,
  onSuccess,
}: ExpenseFormModalProps) {
  const [form, setForm] = useState<ExpenseFormData>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/expenses', {
        category: form.category,
        amount: Number(form.amount),
        date: form.date,
        description: form.description,
      });
      alert('Pengeluaran berhasil dicatat.');
      setForm(initialForm);
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal mencatat pengeluaran.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Pengeluaran"
      subtitle="Catat pengeluaran operasional baru"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          label="Tanggal"
          type="date"
          required
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <Input
          label="Kategori"
          required
          placeholder="Contoh: Listrik, Gaji, Sabun..."
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <Input
          label="Jumlah (Rp)"
          type="number"
          required
          min="1"
          placeholder="Contoh: 150000"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

        <div className="space-y-1">
          <label className="block text-[11px] sm:text-xs font-semibold dark:text-[#F5EACA]/80 text-slate-700">
            Keterangan (Opsional)
          </label>
          <textarea
            rows={2}
            placeholder="Contoh: Bayar token listrik bulan Agustus"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl dark:bg-[#013D66] bg-slate-50 border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 dark:placeholder-[#1DA9D0]/50 placeholder-slate-400 focus:outline-none focus:border-[#1DA9D0]"
          />
        </div>

        <div className="pt-2 sm:pt-3 flex gap-2 sm:gap-3">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onClose}
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            isLoading={isSubmitting}
          >
            Simpan
          </Button>
        </div>
      </form>
    </Modal>
  );
}
