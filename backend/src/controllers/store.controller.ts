import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { getStoreSettings, updateStoreSettings } from '../services/store.service.js';

export async function getStore(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }
    const store = await getStoreSettings(adminId);
    res.json({ success: true, data: store });
  } catch (error: any) {
    next(error);
  }
}

export async function updateStore(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    const updated = await updateStoreSettings(adminId, req.body);
    res.json({ success: true, message: 'Pengaturan toko berhasil disimpan.', data: updated });
  } catch (error: any) {
    next(error);
  }
}
