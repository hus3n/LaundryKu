import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { getOutlets, createOutlet, updateOutlet, deleteOutlet } from '../services/outlet.service.js';

export async function listOutlets(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) {
      res.status(400).json({ success: false, error: 'adminId tidak ditemukan.' });
      return;
    }
    const outlets = await getOutlets(adminId);
    res.json({ success: true, data: outlets });
  } catch (e: any) {
    next(e);
  }
}

export async function addOutlet(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) {
      res.status(400).json({ success: false, error: 'adminId tidak ditemukan.' });
      return;
    }
    const outlet = await createOutlet(adminId, req.body);
    res.status(201).json({ success: true, message: 'Outlet berhasil ditambahkan.', data: outlet });
  } catch (e: any) {
    res.status(400).json({ success: false, error: e.message });
  }
}

export async function editOutlet(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    const { id } = req.params;
    if (!adminId) {
      res.status(400).json({ success: false, error: 'adminId tidak ditemukan.' });
      return;
    }
    const outlet = await updateOutlet(id as string, adminId, req.body);
    res.json({ success: true, message: 'Outlet berhasil diperbarui.', data: outlet });
  } catch (e: any) {
    res.status(400).json({ success: false, error: e.message });
  }
}

export async function removeOutlet(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    const { id } = req.params;
    if (!adminId) {
      res.status(400).json({ success: false, error: 'adminId tidak ditemukan.' });
      return;
    }
    await deleteOutlet(id as string, adminId);
    res.json({ success: true, message: 'Outlet berhasil dinonaktifkan.' });
  } catch (e: any) {
    res.status(400).json({ success: false, error: e.message });
  }
}
