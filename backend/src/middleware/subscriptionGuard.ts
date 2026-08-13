import { Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { AuthenticatedRequest } from './auth.js';

/**
 * Middleware: Memastikan admin memiliki langganan berbayar yang aktif.
 * Blokir akses jika:
 * - Admin adalah akun trial (isTrial = true), terlepas dari status masa trial
 * - subscriptionEnd sudah lewat
 * - isActive = false
 *
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

    // Cek apakah akun adalah trial (trial tidak mendapat akses WA)
    if (admin.isTrial) {
      res.status(403).json({
        success: false,
        error: 'Fitur WhatsApp tidak tersedia untuk akun trial. Upgrade ke akun berbayar untuk menggunakan fitur ini.',
        code: 'TRIAL_ACCOUNT',
      });
      return;
    }

    // Cek apakah masa langganan masih aktif
    const now = new Date();
    if (admin.subscriptionEnd < now) {
      res.status(403).json({
        success: false,
        error: `Masa langganan Anda telah berakhir pada ${admin.subscriptionEnd.toLocaleDateString('id-ID')}. Perpanjang langganan untuk menggunakan fitur WhatsApp.`,
        code: 'SUBSCRIPTION_EXPIRED',
      });
      return;
    }

    // Semua cek lolos → izinkan akses
    next();
  } catch (error: any) {
    next(error);
  }
}
