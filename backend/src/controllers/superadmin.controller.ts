import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import {
  getSuperAdminDashboardData,
  getAllAdmins,
  createAdminWithStore,
  createTrialAdmin,
  extendAdminSubscription,
  toggleAdminStatus,
  deleteAdmin,
} from '../services/superadmin.service.js';
import { waQueue } from '../whatsapp/messageQueue.js';
import { env } from '../config/env.js';

function buildTrialWelcomeMessage(params: {
  userName: string;
  storeName: string;
  email: string;
  trialDays: number;
  expiredDate: string;
  appUrl: string;
  superadminWaNumber: string;
}): string {
  const { userName, storeName, email, trialDays, expiredDate, appUrl, superadminWaNumber } = params;

  return [
    `Selamat Datang di LaundryKu! 🎉🧺`,
    ``,
    `Halo Kak ${userName}, akun trial LaundryKu untuk toko *${storeName}* berhasil dibuat!`,
    ``,
    `━━━━━━━━━━━━━━━━━━`,
    `🔑 *Email Login*: ${email}`,
    `⏳ *Masa Trial*: ${trialDays} hari (hingga ${expiredDate})`,
    `🌐 *Link Aplikasi*: ${appUrl}`,
    `━━━━━━━━━━━━━━━━━━`,
    ``,
    `Silakan login dan mulai eksplorasi semua fitur LaundryKu.`,
    ``,
    `Jika ada pertanyaan:`,
    `📞 wa.me/${superadminWaNumber}`,
    ``,
    `Selamat mencoba! 🙏`,
  ].join('\n');
}

export async function getDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await getSuperAdminDashboardData();
    res.json({ success: true, data });
  } catch (error: any) {
    next(error);
  }
}

export async function getAdmins(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const admins = await getAllAdmins();
    res.json({ success: true, data: admins });
  } catch (error: any) {
    next(error);
  }
}

export async function addAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await createAdminWithStore(req.body);
    res.status(201).json({
      success: true,
      message: 'Akun Admin toko berhasil dibuat.',
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
}

export async function extendSubscription(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { additionalMonths } = req.body;

    const updated = await extendAdminSubscription(id as string, additionalMonths || 1);
    res.json({
      success: true,
      message: `Masa aktif berhasil diperpanjang ${additionalMonths} bulan.`,
      data: updated,
    });
  } catch (error: any) {
    next(error);
  }
}

export async function toggleStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const updated = await toggleAdminStatus(id as string, isActive);
    res.json({
      success: true,
      message: `Status akun Admin diubah menjadi ${isActive ? 'Aktif' : 'Non-Aktif'}.`,
      data: updated,
    });
  } catch (error: any) {
    next(error);
  }
}

export async function removeAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    await deleteAdmin(id as string);
    res.json({ success: true, message: 'Akun Admin berhasil dihapus.' });
  } catch (error: any) {
    next(error);
  }
}

export async function createTrial(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await createTrialAdmin(req.body);
    const { user, admin } = result;
    const trialDays: number = req.body.trialDays;

    const expiredDate = new Date(admin.subscriptionEnd).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
    });

    if (user.phone) {
      const welcomeMessage = buildTrialWelcomeMessage({
        userName: user.name,
        storeName: admin.storeName,
        email: user.email,
        trialDays,
        expiredDate,
        appUrl: env.APP_URL,
        superadminWaNumber: env.SUPERADMIN_WA_NUMBER,
      });

      waQueue.enqueue({
        adminId: admin.id,
        recipientPhone: user.phone,
        recipientName: user.name,
        message: welcomeMessage,
      });
    }

    res.status(201).json({
      success: true,
      message: `Akun trial ${trialDays} hari untuk toko "${admin.storeName}" berhasil dibuat.`,
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
}
