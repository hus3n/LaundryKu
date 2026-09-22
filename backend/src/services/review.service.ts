import { prisma } from '../config/database.js';

export interface CreateReviewInput {
  name: string;
  storeName?: string;
  role?: string;
  rating: number;
  comment: string;
  imageUrl?: string;
}

export async function createReview(data: CreateReviewInput) {
  const rating = Math.max(1, Math.min(5, Number(data.rating) || 5));

  return prisma.review.create({
    data: {
      name: data.name.trim(),
      storeName: data.storeName?.trim() || null,
      role: data.role?.trim() || 'Pengguna LaundryKu',
      rating,
      comment: data.comment.trim(),
      imageUrl: data.imageUrl || null,
      isPublished: true,
    },
  });
}

export async function getReviews(options?: { limit?: number; bestOnly?: boolean }) {
  await seedInitialReviewsIfEmpty();

  const take = options?.limit ? Number(options.limit) : undefined;
  const where = { isPublished: true };

  const orderBy: any = options?.bestOnly
    ? [{ rating: 'desc' }, { createdAt: 'desc' }]
    : { createdAt: 'desc' };

  return prisma.review.findMany({
    where,
    orderBy,
    take,
  });
}

export async function seedInitialReviewsIfEmpty() {
  const count = await prisma.review.count();
  if (count > 0) return;

  const initialReviews = [
    {
      name: 'Budi Santoso',
      storeName: 'Kinclong Laundry Express',
      role: 'Owner Laundry',
      rating: 5,
      comment:
        'Semenjak pakai LaundryKu, nota kasir dan notifikasi WhatsApp ke pelanggan jalan otomatis. Pelanggan senang karena dapat update saat cucian siap diambil, omset kami naik 30%!',
      imageUrl: null,
    },
    {
      name: 'Siti Aminah',
      storeName: 'Berkah Laundry Kiloan',
      role: 'Kasir & Pengelola',
      rating: 5,
      comment:
        'Tampilan aplikasi sangat bersih dan mudah digunakan oleh karyawan baru. Hitung timbangan cepat dan struk nota bluetooth langsung cetak dalam hitungan detik tanpa ribet.',
      imageUrl: null,
    },
    {
      name: 'Hendri Wijaya',
      storeName: 'Fresh & Clean Laundry',
      role: 'Owner 3 Cabang',
      rating: 5,
      comment:
        'Sangat membantu memantau omset 3 cabang sekaligus dari HP. Fitur auto-backup ke bot Telegram privat bikin tenang karena data usaha selalu aman terlindungi.',
      imageUrl: null,
    },
  ];

  for (const r of initialReviews) {
    await prisma.review.create({
      data: {
        ...r,
        isPublished: true,
      },
    });
  }
}
