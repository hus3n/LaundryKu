import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import {
  createLaundryOrder,
  getLaundryOrders,
  updateOrderStatus,
  updatePaymentStatus,
} from '../services/laundry.service.js';

export async function createOrder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    const employeeId = req.user?.id;

    if (!adminId || !employeeId) {
      res.status(400).json({ success: false, error: 'Informasi pengguna tidak valid.' });
      return;
    }

    const order = await createLaundryOrder(adminId, employeeId, req.body);
    res.status(201).json({
      success: true,
      message: 'Pencatatan cucian berhasil.',
      data: order,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function getOrders(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    const orders = await getLaundryOrders(adminId, req.query as any);
    res.json({ success: true, data: orders });
  } catch (error: any) {
    next(error);
  }
}

export async function changeOrderStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    const { id } = req.params;
    const { status } = req.body;

    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    const updated = await updateOrderStatus(id, adminId, status);
    res.json({
      success: true,
      message: `Status cucian diperbarui menjadi ${status}.`,
      data: updated,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function changePaymentStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    const { id } = req.params;
    const { paymentStatus } = req.body;

    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    const updated = await updatePaymentStatus(id, adminId, paymentStatus);
    res.json({
      success: true,
      message: `Status pembayaran diperbarui menjadi ${paymentStatus}.`,
      data: updated,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
}
