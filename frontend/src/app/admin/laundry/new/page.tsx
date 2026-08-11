'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { api } from '@/lib/api';
import { Shirt, Plus, Trash2, CheckCircle2, User, AlertCircle, Save, RotateCcw, X } from 'lucide-react';
import QuantityInput from '@/components/ui/QuantityInput';
import { useFormDraft, DraftStatus } from '@/hooks/useFormDraft';

/** Kunci unik localStorage untuk draft form ini */
const DRAFT_KEY = 'laundryku_new_order_draft_v1';

/**
 * Shape data yang disimpan sebagai draft.
 * Harus mencakup SEMUA state form yang ingin dipulihkan.
 */
interface DraftData {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes: string;
  fragrance: string;
  paymentStatus: 'UNPAID' | 'PAID';
  paymentMethod: 'CASH' | 'QRIS';
  selectedOutletId: string;
  items: Array<{ packageId: string; categoryId: string; quantity: number }>;
}

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
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'QRIS'>('CASH');
  const [fragrance, setFragrance] = useState('');
  const [outlets, setOutlets] = useState<Array<{id: string; name: string; address?: string}>>([]);
  const [selectedOutletId, setSelectedOutletId] = useState<string>('');

  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const [items, setItems] = useState<Array<{ packageId: string; categoryId: string; quantity: number }>>([
    { packageId: '', categoryId: '', quantity: 1 },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── State untuk fitur Auto-Save Draft ────────────────────────────────────
  const [draftStatus, setDraftStatus] = useState<DraftStatus>('idle');
  const [draftRestored, setDraftRestored] = useState(false);
  const [showRestoreBanner, setShowRestoreBanner] = useState(false);

  useEffect(() => {
    async function loadConfig() {
      try {
        const [pkgRes, catRes, outletRes] = await Promise.all([
          api.get('/packages'), 
          api.get('/categories'),
          api.get('/outlets'),
        ]);
        setPackages(pkgRes.data.data || []);
        setCategories(catRes.data.data || []);
        
        const outletData = outletRes.data.data || [];
        setOutlets(outletData);
        if (outletData.length > 0) {
          setSelectedOutletId(outletData[0].id);
        }

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

  const handleQuantityChange = (index: number, newValue: number) => {
    const newItems = [...items];
    newItems[index].quantity = Math.max(1, Math.floor(newValue));
    setItems(newItems);
  };

  // ─── Objek yang merangkum SELURUH state form untuk disimpan sebagai draft ─
  // Dibuat dengan useMemo agar referensinya stabil dan tidak memicu render berlebih.
  // Catatan: Kita tidak menggunakan useMemo di sini karena kita perlu nilai terbaru
  // di setiap render. Object literal biasa sudah cukup karena useFormDraft
  // menggunakan ref untuk membandingkan nilai.
  const currentDraftValue: DraftData = {
    customerName,
    customerPhone,
    customerAddress,
    notes,
    fragrance,
    paymentStatus,
    paymentMethod,
    selectedOutletId,
    items,
  };

  // ─── Callback: dipanggil oleh hook saat draft ditemukan di localStorage ───
  // Fungsi ini harus me-restore SELURUH state sekaligus dari satu objek.
  const handleRestore = useCallback((saved: DraftData) => {
    setCustomerName(saved.customerName ?? '');
    setCustomerPhone(saved.customerPhone ?? '');
    setCustomerAddress(saved.customerAddress ?? '');
    setNotes(saved.notes ?? '');
    setFragrance(saved.fragrance ?? '');
    setPaymentStatus(saved.paymentStatus ?? 'UNPAID');
    setPaymentMethod(saved.paymentMethod ?? 'CASH');
    setSelectedOutletId(saved.selectedOutletId ?? '');
    // Items: hanya restore jika array tidak kosong untuk menghindari item kosong
    if (saved.items && saved.items.length > 0) {
      setItems(saved.items);
    }
    setDraftRestored(true);
    setShowRestoreBanner(true);
  }, []);

  // Calculate total price live
  const totalPrice = items.reduce((sum, item) => {
    const pkg = packages.find((p) => p.id === item.packageId);
    if (pkg) return sum + Number(pkg.price) * item.quantity;
    return sum;
  }, 0);

  // ─── Inisialisasi Auto-Save Draft ─────────────────────────────────────────
  const { clearDraft } = useFormDraft<DraftData>({
    storageKey: DRAFT_KEY,
    currentValue: currentDraftValue,
    onRestore: handleRestore,
    onStatusChange: setDraftStatus,
    debounceMs: 600,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formattedItems = items.map((i) => ({ ...i, quantity: i.quantity }));

      await api.post('/laundry', {
        customerName,
        customerPhone,
        customerAddress,
        items: formattedItems,
        notes,
        outletId: selectedOutletId || undefined,
        fragrance: fragrance.trim() || undefined,
        paymentStatus,
        paymentMethod: paymentStatus === 'PAID' ? paymentMethod : undefined,
      });

      clearDraft(); // Hapus draft setelah berhasil submit
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
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">Pencatatan Cucian Baru</h1>
            <p className="text-xs text-slate-400 mt-1">Input transaksi cucian masuk dan pilih paket layanan</p>
          </div>

          {/* Indikator Status Draft */}
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
            {draftStatus === 'saving' && (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-slate-400 bg-slate-800/80 border border-slate-700 px-2.5 py-1.5 rounded-full animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                Menyimpan draft...
              </span>
            )}
            {draftStatus === 'saved' && !showRestoreBanner && (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-slate-400 bg-slate-800/80 border border-slate-700 px-2.5 py-1.5 rounded-full">
                <Save className="w-3 h-3 text-emerald-400" />
                Draft tersimpan
              </span>
            )}
            {draftRestored && (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-brand-300 bg-brand-500/10 border border-brand-500/30 px-2.5 py-1.5 rounded-full">
                <RotateCcw className="w-3 h-3" />
                Draft dipulihkan
              </span>
            )}
          </div>
        </div>

        {/* Banner: Draft Dipulihkan dari localStorage */}
        {showRestoreBanner && (
          <div className="p-3.5 rounded-xl bg-brand-500/10 border border-brand-500/25 flex items-start justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <RotateCcw className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-brand-300">Draft formulir ditemukan & dipulihkan</p>
                <p className="text-slate-400 mt-0.5 leading-relaxed">
                  Data Anda yang belum tersimpan sebelumnya telah dimuat kembali secara otomatis.
                  Periksa kembali data di bawah sebelum menyimpan transaksi.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowRestoreBanner(false)}
              className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700 transition-colors shrink-0"
              aria-label="Tutup notifikasi"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Info Card */}
          <div className="glass-card-dark p-4 md:p-6 rounded-2xl border border-slate-800 space-y-4">
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

            {outlets.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Outlet / Cabang *
                </label>
                <select
                  value={selectedOutletId}
                  onChange={(e) => setSelectedOutletId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="">-- Pilih Outlet --</option>
                  {outlets.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name}{o.address ? ` — ${o.address}` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

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
          <div className="glass-card-dark p-4 md:p-6 rounded-2xl border border-slate-800 space-y-4">
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
                        <QuantityInput
                          value={item.quantity}
                          onChange={(v) => handleQuantityChange(idx, v)}
                          min={1}
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
          <div className="glass-card-dark p-4 md:p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Catatan Penting</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Baju putih dipisah, luntur"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 mb-3"
                />

                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Parfum yang Digunakan (Opsional)
                </label>
                <input
                  type="text"
                  value={fragrance}
                  onChange={(e) => setFragrance(e.target.value)}
                  placeholder="Contoh: Molto Lavender, Downy Sunrise Fresh"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Tulis nama parfum secara manual sesuai stok yang tersedia
                </p>
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

                {paymentStatus === 'PAID' && (
                  <div className="mt-3">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Metode Pembayaran
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('CASH')}
                        className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                          paymentMethod === 'CASH'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        💵 Cash
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('QRIS')}
                        className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                          paymentMethod === 'QRIS'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        📱 QRIS
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-medium">Total Tagihan:</span>
                  <span className="text-lg font-bold text-emerald-400">
                    Rp {totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting || packages.length === 0}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold text-xs shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
