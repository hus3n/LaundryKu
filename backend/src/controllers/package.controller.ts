import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import {
  getPackagesByAdmin,
  createPackage,
  updatePackage,
  deletePackage,
} from '../services/package.service.js';

export async function getPackages(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }
    const packages = await getPackagesByAdmin(adminId);
    res.json({ success: true, data: packages });
  } catch (error: any) {
    next(error);
  }
}

export async function addPackage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }
    const newPackage = await createPackage(adminId, req.body);
    res.status(201).json({ success: true, message: 'Paket berhasil ditambahkan.', data: newPackage });
  } catch (error: any) {
    next(error);
  }
}

export async function editPackage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    const { id } = req.params;
    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }
    const updated = await updatePackage(id, adminId, req.body);
    res.json({ success: true, message: 'Paket berhasil diperbarui.', data: updated });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function removePackage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    const { id } = req.params;
    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }
    await deletePackage(id, adminId);
    res.json({ success: true, message: 'Paket berhasil dihapus.' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
}
