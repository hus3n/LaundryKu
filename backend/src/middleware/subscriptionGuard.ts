import { Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { AuthenticatedRequest } from './auth.js';

/**
 * Middleware: Memastikan admin memiliki masa aktif langganan / trial yang valid.
 * Blokir akses jika:
 * - subscriptionEnd sudah lewat / kadaluarsa
 * - isActive = false
 *
 * Akun Trial (isTrial = true) tetap diizinkan menggunakan fitur WhatsApp selama masa trial masih aktif.
 * Middleware ini HANYA berlaku untuk role ADMIN.
 * SUPERADMIN selalu diizinkan (untuk keperluan testing).
 */
export async function requirePaidSubscription(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // SuperAdmin selalu diizinkan
    if (req.user?.role === 'SUPERADMIN') {
      next();
      return;
    }

    const adminId = req.user?.adminId;
    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    // Ambil data admin dari database
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        isActive: true,
        isTrial: true,
        subscriptionEnd: true,
        storeName: true,
      },
    });

    if (!admin) {
      res.status(404).json({ success: false, error: 'Data toko tidak ditemukan.' });
      return;
    }

    // Cek apakah akun aktif
    if (!admin.isActive) {
      res.status(403).json({
        success: false,
        error: 'Akun Anda tidak aktif. Hubungi administrator untuk mengaktifkan akun.',
        code: 'ACCOUNT_INACTIVE',
      });
      return;
    }

    // Cek apakah masa langganan / masa trial masih aktif
    const now = new Date();
    if (admin.subscriptionEnd < now) {
      res.status(403).json({
        success: false,
        error: `Masa aktif akun Anda telah berakhir pada ${admin.subscriptionEnd.toLocaleDateString('id-ID')}. Perpanjang langganan untuk menggunakan fitur WhatsApp.`,
        code: 'SUBSCRIPTION_EXPIRED',
      });
      return;
    }

    // Semua cek lolos → izinkan akses (termasuk akun trial aktif)
    next();
  } catch (error: any) {
    next(error);
  }
}

