'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { api } from '@/lib/api';
import { AlertCircle } from 'lucide-react';
import { useFormDraft, DraftStatus } from '@/hooks/useFormDraft';
import {
  DraftData,
  PackageItem,
  CategoryItem,
  OutletItem,
  OrderItem,
} from './types';
import {
  DraftStatusBadge,
  DraftRestoreBanner,
} from './components/DraftStatusBanner';
import CustomerInfoCard from './components/CustomerInfoCard';
import OrderItemsCard from './components/OrderItemsCard';
import OrderSummaryCard from './components/OrderSummaryCard';

const DRAFT_KEY = 'laundryku_new_order_draft_v1';

export default function NewLaundryOrderPage() {
  const router = useRouter();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'UNPAID' | 'PAID'>('UNPAID');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'QRIS'>('CASH');
  const [fragrance, setFragrance] = useState('');
  const [clothesCount, setClothesCount] = useState<number | undefined>(undefined);
  const [outlets, setOutlets] = useState<OutletItem[]>([]);
  const [selectedOutletId, setSelectedOutletId] = useState<string>('');

  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const [items, setItems] = useState<OrderItem[]>([
    { packageId: '', categoryId: '', quantity: 1 },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleItemChange = (index: number, field: keyof OrderItem, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const handleQuantityChange = (index: number, newValue: number) => {
    const newItems = [...items];
    newItems[index].quantity = Math.max(1, Math.floor(newValue));
    setItems(newItems);
  };

  const currentDraftValue: DraftData = {
    customerName,
    customerPhone,
    customerAddress,
    notes,
    fragrance,
    clothesCount,
    paymentStatus,
    paymentMethod,
    selectedOutletId,
    items,
  };

  const handleRestore = useCallback((saved: DraftData) => {
    setCustomerName(saved.customerName ?? '');
    setCustomerPhone(saved.customerPhone ?? '');
    setCustomerAddress(saved.customerAddress ?? '');
    setNotes(saved.notes ?? '');
    setFragrance(saved.fragrance ?? '');
    setClothesCount(saved.clothesCount);
    setPaymentStatus(saved.paymentStatus ?? 'UNPAID');
    setPaymentMethod(saved.paymentMethod ?? 'CASH');
    setSelectedOutletId(saved.selectedOutletId ?? '');
    if (saved.items && saved.items.length > 0) {
      setItems(saved.items);
    }
    setDraftRestored(true);
    setShowRestoreBanner(true);
  }, []);

  const totalPrice = items.reduce((sum, item) => {
    const pkg = packages.find((p) => p.id === item.packageId);
    if (pkg) return sum + Number(pkg.price) * item.quantity;
    return sum;
  }, 0);

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
        clothesCount,
        paymentStatus,
        paymentMethod: paymentStatus === 'PAID' ? paymentMethod : undefined,
      });

      clearDraft();
      router.push('/admin/laundry');
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Gagal menyimpan transaksi cucian.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-3.5 sm:space-y-5 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 sm:gap-3">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold dark:text-[#F5EACA] text-slate-900">Pencatatan Cucian Baru</h1>
            <p className="text-[11px] sm:text-xs dark:text-[#F5EACA]/60 text-slate-500 mt-0.5 sm:mt-1">Input transaksi cucian masuk dan pilih paket layanan</p>
          </div>

          <DraftStatusBadge
            draftStatus={draftStatus}
            draftRestored={draftRestored}
            showRestoreBanner={showRestoreBanner}
          />
        </div>

        <DraftRestoreBanner
          showRestoreBanner={showRestoreBanner}
          onClose={() => setShowRestoreBanner(false)}
        />

        {error && (
          <div className="p-3 sm:p-4 rounded-xl dark:bg-rose-500/10 bg-rose-50 border dark:border-rose-500/30 border-rose-200 dark:text-rose-300 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4 md:space-y-6">
          <CustomerInfoCard
            customerName={customerName}
            setCustomerName={setCustomerName}
            customerPhone={customerPhone}
            setCustomerPhone={setCustomerPhone}
            customerAddress={customerAddress}
            setCustomerAddress={setCustomerAddress}
            selectedOutletId={selectedOutletId}
            setSelectedOutletId={setSelectedOutletId}
            outlets={outlets}
          />

          <OrderItemsCard
            items={items}
            packages={packages}
            categories={categories}
            loadingConfig={loadingConfig}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            onItemChange={handleItemChange}
            onQuantityChange={handleQuantityChange}
          />

          <OrderSummaryCard
            notes={notes}
            setNotes={setNotes}
            fragrance={fragrance}
            setFragrance={setFragrance}
            clothesCount={clothesCount}
            setClothesCount={setClothesCount}
            paymentStatus={paymentStatus}
            setPaymentStatus={setPaymentStatus}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            totalPrice={totalPrice}
            isSubmitting={isSubmitting}
            canSubmit={packages.length > 0}
            onCancel={() => router.back()}
          />
        </form>
      </div>
    </DashboardLayout>
  );
}
