import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import {
  getWASessionStatus,
  initiateWAPairing,
  disconnectWASession,
  confirmWAPairingSimulated,
  sendOrderWANotificationWithImage,
} from '../whatsapp/baileys.js';
import { prisma } from '../config/database.js';
import { WATemplate } from '../models-nosql/waTemplate.model.js';
import { ensureDefaultTemplates } from '../whatsapp/templates.js';
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

import { DEFAULT_TEMPLATES } from '../whatsapp/templates.js';

export async function getTemplates(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = getTargetAdminId(req);
    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    // Prepare default list
    const defaultList = Object.entries(DEFAULT_TEMPLATES).map(([key, val]) => ({
      _id: key, // Use key as fallback ID for UI selection
      adminId,
      type: key,
      name: val.name,
      content: val.content,
      isDefault: true,
    }));

    if (!isMongoConnected()) {
      // Fallback: Show defaults if DB is offline
      res.json({ success: true, data: defaultList });
      return;
    }

    // Ensure templates exist in DB
    await ensureDefaultTemplates(adminId);

    // Fetch from DB
    const dbTemplates = await WATemplate.find({ adminId });
    
    // Merge DB content over defaults to guarantee UI never goes blank
    const mergedTemplates = defaultList.map(defTmpl => {
      const dbMatch = dbTemplates.find(db => db.type === defTmpl.type);
      if (dbMatch) {
        return dbMatch.toObject ? dbMatch.toObject() : dbMatch;
      }
      return defTmpl;
    });

    res.json({ success: true, data: mergedTemplates });
  } catch (error: any) {
    next(error);
  }
}

export async function updateTemplate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = getTargetAdminId(req);
    const id = req.params.id as string; // Ensure string type 
    const { content } = req.body;

    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    if (!isMongoConnected()) {
      res.status(503).json({ success: false, error: 'Database MongoDB (WA Storage) sedang offline.' });
      return;
    }

    // Determine query: If `id` doesn't look like an ObjectId, assume it's a `type` string.
    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: id, adminId } : { type: id, adminId };
    
    // Find first to see if it exists
    let updated = await WATemplate.findOne(query);
    if (!updated) {
      if (!isObjectId && DEFAULT_TEMPLATES[id as keyof typeof DEFAULT_TEMPLATES]) {
        // If not found and it's a default type, create it
        updated = await WATemplate.create({
          adminId,
          type: id,
          name: DEFAULT_TEMPLATES[id as keyof typeof DEFAULT_TEMPLATES].name,
          content,
          isDefault: true
        });
      } else {
        res.status(404).json({ success: false, error: 'Template tidak ditemukan.' });
        return;
      }
    } else {
      updated.content = content;
      await updated.save();
    }

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

export async function sendNotaImage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = getTargetAdminId(req);
    const { orderId } = req.body;

    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }
    if (!orderId) {
      res.status(400).json({ success: false, error: 'orderId wajib diisi.' });
      return;
    }

    const order = await prisma.laundryOrder.findFirst({
      where: { id: orderId, adminId },
      include: {
        customer: true,
        items: {
          include: { package: true, category: true },
        },
      },
    });

    if (!order) {
      res.status(404).json({ success: false, error: 'Order tidak ditemukan.' });
      return;
    }

    const typeMap: Record<string, any> = {
      RECEIVED: 'ORDER_RECEIVED',
      IN_PROGRESS: 'ORDER_IN_PROGRESS',
      DONE: 'ORDER_DONE',
      PICKED_UP: 'ORDER_PICKED_UP',
    };

    const sent = await sendOrderWANotificationWithImage(
      adminId,
      order,
      typeMap[order.status] || 'ORDER_RECEIVED'
    );

    if (sent) {
      res.json({ success: true, message: 'Gambar nota berhasil dikirim ke WhatsApp pelanggan.' });
    } else {
      res.status(500).json({
        success: false,
        error: 'Gagal mengirim gambar nota. Pastikan WhatsApp sudah terhubung dan pelanggan memiliki nomor HP.',
      });
    }
  } catch (error: any) {
    next(error);
  }
}

export async function clearPendingQueue(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = getTargetAdminId(req);
    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    const clearedCount = waQueue.clearQueue(adminId);
    res.json({
      success: true,
      message: `${clearedCount} pesan dalam antrean berhasil dibersihkan.`,
      data: { clearedCount, pendingCount: waQueue.getPendingCount(adminId) },
    });
  } catch (error: any) {
    next(error);
  }
}

export async function retryPendingQueue(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = getTargetAdminId(req);
    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    waQueue.triggerQueue();
    res.json({
      success: true,
      message: 'Proses pengiriman antrean pesan WhatsApp dipicu ulang.',
      data: { pendingCount: waQueue.getPendingCount(adminId) },
    });
  } catch (error: any) {
    next(error);
  }
}


// POST /api/whatsapp/test-direct
export async function testDirectMessage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = getTargetAdminId(req);
    const { recipientPhone, message } = req.body;

    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Admin tidak valid.' });
      return;
    }
    
    // Import helper lazily to avoid init circle
    const { sendRealWAMessage, isWAConnected } = await import('../whatsapp/baileys.js');
    
    if (!isWAConnected(adminId)) {
      res.status(400).json({ success: false, error: 'WhatsApp tidak terkoneksi dengan aktif.' });
      return;
    }

    const sent = await sendRealWAMessage(adminId, recipientPhone, message);
    if (sent) {
      res.json({ success: true, message: 'Pesan tes langsung berhasil dikirim ke tujuan.' });
    } else {
      res.status(500).json({ success: false, error: 'Gagal mengirim pesan tes (Timeout / Jaringan / Nomor tidak valid).' });
    }
  } catch (error) {
    next(error);
  }
}

// GET /api/whatsapp/error-logs
export async function getAdminErrorLogs(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = getTargetAdminId(req);
    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Admin tidak valid.' });
      return;
    }
    const { AppErrorLog } = await import('../models-nosql/appErrorLog.model.js');
    const logs = await AppErrorLog.find({ adminId }).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
}
