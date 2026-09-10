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
import { SuperadminConfig } from '../models-nosql/superadminConfig.model.js';
import { BotConfig } from '../models-nosql/botConfig.model.js';

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

export async function getGlobalBotConfig(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    let config = await SuperadminConfig.findOne();
    if (!config) {
      config = await SuperadminConfig.create({ apiKeys: [], provider: 'gemini' });
    }
    // Only return lengths for security, or full depending on need.
    // For superadmin dashboard, we might want them to see it or just replace it.
    // Let's send the full object so they can manage them.
    res.json({ success: true, data: config });
  } catch (error: any) {
    next(error);
  }
}

export async function updateGlobalBotConfig(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { apiKeys, provider } = req.body;
    let config = await SuperadminConfig.findOne();
    if (!config) {
      config = new SuperadminConfig({ apiKeys, provider: provider || 'gemini' });
    } else {
      config.apiKeys = apiKeys;
      if (provider) config.provider = provider;
    }
    await config.save();
    res.json({ success: true, message: 'Global Bot Config saved.', data: config });
  } catch (error: any) {
    next(error);
  }
}

export async function getAdminsBotConfig(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const admins = await getAllAdmins();
    const adminIds = admins.map(a => a.id);
    const botConfigs = await BotConfig.find({ adminId: { $in: adminIds } }).lean();
    const configMap = new Map(botConfigs.map(c => [c.adminId, c]));

    const data = admins.map(admin => {
      const config = configMap.get(admin.id);
      return {
        id: admin.id,
        storeName: admin.storeName,
        ownerName: admin.user?.name,
        isAiEnabledBySuperadmin: config?.isAiEnabledBySuperadmin || false,
        aiDailyLimit: config?.aiDailyLimit || 100,
        aiUsageToday: config?.aiUsageToday || 0,
        aiLastUsedDate: config?.aiLastUsedDate || null,
        isAiActiveByAdmin: config?.isAiActive || false,
      };
    });

    res.json({ success: true, data });
  } catch (error: any) {
    next(error);
  }
}

export async function updateAdminBotConfig(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { isAiEnabledBySuperadmin, aiDailyLimit } = req.body;

    let config = await BotConfig.findOne({ adminId: id });
    if (!config) {
      config = new BotConfig({
        adminId: id,
        isAiEnabledBySuperadmin,
        aiDailyLimit,
        isAiActive: false,
      });
    } else {
      config.isAiEnabledBySuperadmin = isAiEnabledBySuperadmin;
      config.aiDailyLimit = aiDailyLimit;
    }
    await config.save();
    
    res.json({ success: true, message: 'Admin AI config updated', data: config });
  } catch (error: any) {
    next(error);
  }
}
