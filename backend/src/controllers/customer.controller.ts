import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import {
  getCustomersByAdmin,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '../services/customer.service.js';

export async function getCustomers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    const search = req.query.q as string | undefined;

    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    const customers = await getCustomersByAdmin(adminId, search);
    res.json({ success: true, data: customers });
  } catch (error: any) {
    next(error);
  }
}

export async function addCustomer(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    const newCustomer = await createCustomer(adminId, req.body);
    res.status(201).json({ success: true, message: 'Data pelanggan tersimpan.', data: newCustomer });
  } catch (error: any) {
    next(error);
  }
}

export async function editCustomer(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    const { id } = req.params;

    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    const updated = await updateCustomer(id, adminId, req.body);
    res.json({ success: true, message: 'Data pelanggan diperbarui.', data: updated });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function removeCustomer(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    const { id } = req.params;

    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    await deleteCustomer(id, adminId);
    res.json({ success: true, message: 'Data pelanggan dihapus.' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
}
