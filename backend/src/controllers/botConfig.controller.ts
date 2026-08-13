import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import {
  getBotConfig,
  updateBotConfig,
  getAutoReplies,
  createAutoReply,
  toggleAutoReply,
  deleteAutoReply,
} from '../services/botConfig.service.js';

// Helper: ambil adminId (superadmin menggunakan ID khusus 'SUPERADMIN')
function getAdminId(req: AuthenticatedRequest): string | null {
  return req.user?.adminId || (req.user?.role === 'SUPERADMIN' ? 'SUPERADMIN' : null);
}

export async function getConfig(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = getAdminId(req);
    if (!adminId) { res.status(400).json({ success: false, error: 'ID tidak ditemukan.' }); return; }

    const config = await getBotConfig(adminId);
    // Jangan kirim aiApiKey ke frontend (keamanan) — sensor sebagian
    const safeConfig = {
      ...config.toObject(),
      aiApiKey: config.aiApiKey ? '••••••••' + config.aiApiKey.slice(-4) : null,
    };
    res.json({ success: true, data: safeConfig });
  } catch (error: any) {
    next(error);
  }
}

export async function saveConfig(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = getAdminId(req);
    if (!adminId) { res.status(400).json({ success: false, error: 'ID tidak ditemukan.' }); return; }

    const { greetingMessage, isGreetingActive, aiApiKey, aiProvider, isAiActive } = req.body;
    const updated = await updateBotConfig(adminId, {
      greetingMessage,
      isGreetingActive,
      aiApiKey,
      aiProvider,
      isAiActive,
    });
    res.json({ success: true, message: 'Konfigurasi bot disimpan.', data: updated });
  } catch (error: any) {
    next(error);
  }
}

export async function listAutoReplies(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = getAdminId(req);
    if (!adminId) { res.status(400).json({ success: false, error: 'ID tidak ditemukan.' }); return; }

    const replies = await getAutoReplies(adminId);
    res.json({ success: true, data: replies });
  } catch (error: any) {
    next(error);
  }
}

export async function addAutoReply(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = getAdminId(req);
    if (!adminId) { res.status(400).json({ success: false, error: 'ID tidak ditemukan.' }); return; }

    const reply = await createAutoReply(adminId, req.body);
    res.status(201).json({ success: true, message: 'Pesan otomatis ditambahkan.', data: reply });
  } catch (error: any) {
    next(error);
  }
}

export async function updateAutoReplyStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = getAdminId(req);
    const { id } = req.params;
    const { isActive } = req.body;
    if (!adminId) { res.status(400).json({ success: false, error: 'ID tidak ditemukan.' }); return; }

    const updated = await toggleAutoReply(adminId, id as string, isActive);
    res.json({ success: true, message: `Pesan otomatis ${isActive ? 'diaktifkan' : 'dinonaktifkan'}.`, data: updated });
  } catch (error: any) {
    next(error);
  }
}

export async function removeAutoReply(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = getAdminId(req);
    const { id } = req.params;
    if (!adminId) { res.status(400).json({ success: false, error: 'ID tidak ditemukan.' }); return; }

    await deleteAutoReply(adminId, id as string);
    res.json({ success: true, message: 'Pesan otomatis dihapus.' });
  } catch (error: any) {
    next(error);
  }
}
