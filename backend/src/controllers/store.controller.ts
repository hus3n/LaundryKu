import path from 'path';
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

export async function uploadStoreLogo(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ success: false, error: 'File logo tidak ditemukan dalam request.' });
      return;
    }

    // Simpan path relatif agar bisa diakses via URL
    const logoPath = `uploads/logos/${req.file.filename}`;

    const updated = await updateStoreSettings(adminId, { storeLogo: logoPath });

    res.json({
      success: true,
      message: 'Logo toko berhasil diupload.',
      data: { storeLogo: logoPath, store: updated },
    });
  } catch (error: any) {
    next(error);
  }
}
