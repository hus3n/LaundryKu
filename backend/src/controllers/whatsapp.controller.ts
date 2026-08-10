import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import {
  getWASessionStatus,
  initiateWAPairing,
  disconnectWASession,
  confirmWAPairingSimulated,
} from '../whatsapp/baileys.js';
import { WATemplate } from '../models-nosql/waTemplate.model.js';
import { isMongoConnected } from '../config/mongodb.js';
import { WAMessageLog } from '../models-nosql/waMessageLog.model.js';
import { waQueue } from '../whatsapp/messageQueue.js';

function getTargetAdminId(req: AuthenticatedRequest): string | null {
  return req.user?.adminId || (req.user?.role === 'SUPERADMIN' ? 'SUPERADMIN' : null);
}

export async function getStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = getTargetAdminId(req);
    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    const session = await getWASessionStatus(adminId);
    res.json({ success: true, data: session });
  } catch (error: any) {
    next(error);
  }
}

export async function connect(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = getTargetAdminId(req);
    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    const pairing = await initiateWAPairing(adminId);
    res.json({ success: true, data: pairing });
  } catch (error: any) {
    next(error);
  }
}

export async function confirmSimulated(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = getTargetAdminId(req);
    const { phone } = req.body;
    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    const session = await confirmWAPairingSimulated(adminId, phone || '6281234567890');
    res.json({ success: true, message: 'WhatsApp Toko terhubung!', data: session });
  } catch (error: any) {
    next(error);
  }
}

export async function disconnect(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = getTargetAdminId(req);
    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    await disconnectWASession(adminId);
    res.json({ success: true, message: 'WhatsApp Toko berhasil diputuskan.' });
  } catch (error: any) {
    next(error);
  }
}

export async function getTemplates(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = getTargetAdminId(req);
    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    if (!isMongoConnected()) {
      res.json({ success: true, data: [] });
      return;
    }

    const templates = await WATemplate.find({ adminId });
    res.json({ success: true, data: templates });
  } catch (error: any) {
    next(error);
  }
}

export async function updateTemplate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = getTargetAdminId(req);
    const { id } = req.params;
    const { content } = req.body;

    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    if (!isMongoConnected()) {
      res.status(503).json({ success: false, error: 'Database MongoDB (WA Storage) sedang offline.' });
      return;
    }

    const updated = await WATemplate.findOneAndUpdate(
      { _id: id, adminId },
      { content },
      { new: true }
    );

    res.json({ success: true, message: 'Template pesan disimpan.', data: updated });
  } catch (error: any) {
    next(error);
  }
}

export async function sendCustomMessage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = getTargetAdminId(req);
    const { recipientPhone, recipientName, message } = req.body;

    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    waQueue.enqueue({
      adminId,
      recipientPhone,
      recipientName,
      message,
    });

    res.json({
      success: true,
      message: 'Pesan telah masuk antrian (dikirim dengan jeda 10 detik).',
    });
  } catch (error: any) {
    next(error);
  }
}

export async function getMessageLogs(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = getTargetAdminId(req);
    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    if (!isMongoConnected()) {
      res.json({ success: true, data: [] });
      return;
    }

    const logs = await WAMessageLog.find({ adminId }).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: logs });
  } catch (error: any) {
    next(error);
  }
}
