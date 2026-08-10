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
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function extendSubscription(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { additionalMonths } = req.body;

    const updated = await extendAdminSubscription(id, additionalMonths || 1);
    res.json({
      success: true,
      message: `Masa aktif berhasil diperpanjang ${additionalMonths} bulan.`,
      data: updated,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function toggleStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const updated = await toggleAdminStatus(id, isActive);
    res.json({
      success: true,
      message: `Status akun Admin diubah menjadi ${isActive ? 'Aktif' : 'Non-Aktif'}.`,
      data: updated,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function removeAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    await deleteAdmin(id);
    res.json({ success: true, message: 'Akun Admin berhasil dihapus.' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
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
      waQueue.enqueue({
        adminId: admin.id,
        recipientPhone: user.phone,
        recipientName: user.name,
        message: `Selamat Datang di LaundryKu! 🎉🧺\n\nHalo Kak ${user.name}, akun trial LaundryKu untuk toko *${admin.storeName}* berhasil dibuat!\n\n━━━━━━━━━━━━━━━━━━\n🔑 *Email Login*: ${user.email}\n⏳ *Masa Trial*: ${trialDays} hari (hingga ${expiredDate})\n🌐 *Link Aplikasi*: ${env.APP_URL}\n━━━━━━━━━━━━━━━━━━\n\nSilakan login dan mulai eksplorasi semua fitur LaundryKu.\n\nJika ada pertanyaan:\n📞 wa.me/${env.SUPERADMIN_WA_NUMBER}\n\nSelamat mencoba! 🙏`,
      });
    }

    res.status(201).json({
      success: true,
      message: `Akun trial ${trialDays} hari untuk toko "${admin.storeName}" berhasil dibuat.`,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
}
