'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { api } from '@/lib/api';
import { Shirt, Plus, Trash2, CheckCircle2, User, Phone, MapPin, AlertCircle } from 'lucide-react';

interface PackageItem {
  id: string;
  name: string;
  unit: string;
  price: number;
}

interface CategoryItem {
  id: string;
  name: string;
}

export default function NewLaundryOrderPage() {
  const router = useRouter();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'UNPAID' | 'PAID'>('UNPAID');

  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const [items, setItems] = useState<Array<{ packageId: string; categoryId: string; quantity: number | string }>>([
    { packageId: '', categoryId: '', quantity: 1 },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadConfig() {
      try {
        const [pkgRes, catRes] = await Promise.all([api.get('/packages'), api.get('/categories')]);
        setPackages(pkgRes.data.data || []);
        setCategories(catRes.data.data || []);

        if (pkgRes.data.data?.length > 0 && catRes.data.data?.length > 0) {
          setItems([
            {
              packageId: pkgRes.data.data[0].id,
              categoryId: catRes.data.data[0].id,
              quantity: 1,
            },
          ]);
        }
      } catch (err) {
        console.error('Failed to load configuration', err);
      } finally {
        setLoadingConfig(false);
      }
    }
    loadConfig();
  }, []);

  const handleAddItem = () => {
    if (packages.length > 0 && categories.length > 0) {
      setItems([...items, { packageId: packages[0].id, categoryId: categories[0].id, quantity: 1 }]);
    }
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  // Calculate total price live
  const totalPrice = items.reduce((sum, item) => {
    const pkg = packages.find((p) => p.id === item.packageId);
    if (pkg) {
      const qtyNum = parseFloat(String(item.quantity)) || 0;
      return sum + Number(pkg.price) * qtyNum;
    }
    return sum;
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formattedItems = items.map((i) => ({
        ...i,
        quantity: parseFloat(String(i.quantity)) || 1,
      }));

      await api.post('/laundry', {
        customerName,
        customerPhone,
        customerAddress,
        items: formattedItems,
        notes,
        paymentStatus,
      });

      router.push('/admin/laundry');
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Gagal menyimpan transaksi cucian.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Pencatatan Cucian Baru</h1>
          <p className="text-xs text-slate-400 mt-1">Input transaksi cucian masuk dan pilih paket layanan</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Info Card */}
          <div className="glass-card-dark p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-brand-400" /> Informasi Pelanggan
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nama Pelanggan *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Contoh: Ibu Rina"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nomor WhatsApp *
                </label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Alamat (Opsional)</label>
              <input
                type="text"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="Contoh: Jl. Mawar No. 12"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Items & Package Card */}
          <div className="glass-card-dark p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Shirt className="w-4 h-4 text-brand-400" /> Detail Item Cucian
              </h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-brand-300 text-xs font-semibold flex items-center gap-1 border border-slate-700"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Item
              </button>
            </div>

            {loadingConfig ? (
              <div className="text-xs text-slate-400 py-4 text-center">Memuat data paket & kategori...</div>
            ) : packages.length === 0 ? (
              <div className="text-xs text-amber-400 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                Belum ada paket layanan. Silakan buat paket layanan terlebih dahulu di menu "Kelola Paket".
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item, idx) => {
                  const currentPkg = packages.find((p) => p.id === item.packageId);
                  return (
                    <div key={idx} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                      <div className="sm:col-span-4">
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Paket Layanan</label>
                        <select
                          value={item.packageId}
                          onChange={(e) => handleItemChange(idx, 'packageId', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                        >
                          {packages.map((pkg) => (
                            <option key={pkg.id} value={pkg.id}>
                              {pkg.name} (Rp {Number(pkg.price).toLocaleString('id-ID')}/{pkg.unit})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-4">
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">Kategori Jenis</label>
                        <select
                          value={item.categoryId}
                          onChange={(e) => handleItemChange(idx, 'categoryId', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                        >
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Kuantitas ({currentPkg?.unit || 'unit'})
                        </label>
                        <input
                          type="number"
                          step="any"
                          min="0.01"
                          required
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                        />
                      </div>

                      <div className="sm:col-span-1 text-right">
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Transaction Summary Card */}
          <div className="glass-card-dark p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Catatan Penting</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Baju putih dipisah, luntur"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Status Pembayaran</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentStatus('UNPAID')}
                    className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      paymentStatus === 'UNPAID'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Belum Bayar
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentStatus('PAID')}
                    className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      paymentStatus === 'PAID'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Lunas
                  </button>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-medium">Total Tagihan:</span>
                  <span className="text-lg font-bold text-emerald-400">
                    Rp {totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting || packages.length === 0}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold text-xs shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Simpan Transaksi
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
