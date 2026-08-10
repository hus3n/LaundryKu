import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import {
  getCategoriesByAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/category.service.js';

export async function getCategories(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }
    const categories = await getCategoriesByAdmin(adminId);
    res.json({ success: true, data: categories });
  } catch (error: any) {
    next(error);
  }
}

export async function addCategory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }
    const newCategory = await createCategory(adminId, req.body.name);
    res.status(201).json({ success: true, message: 'Kategori berhasil ditambahkan.', data: newCategory });
  } catch (error: any) {
    next(error);
  }
}

export async function editCategory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    const { id } = req.params;
    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }
    const updated = await updateCategory(id, adminId, req.body);
    res.json({ success: true, message: 'Kategori berhasil diperbarui.', data: updated });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function removeCategory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    const { id } = req.params;
    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }
    await deleteCategory(id, adminId);
    res.json({ success: true, message: 'Kategori berhasil dihapus.' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
}
