import { Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
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

    const updated = await updateOrderStatus(
      id as string, 
      adminId as string, 
      status,
      req.user!.id
    );
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
    const { paymentStatus, paymentMethod } = req.body;

    if (!adminId) {
      res.status(400).json({ success: false, error: 'ID Toko tidak ditemukan.' });
      return;
    }

    const updated = await updatePaymentStatus(
      id as string, 
      adminId as string, 
      paymentStatus,
      req.user!.id,
      paymentMethod
    );
    res.json({
      success: true,
      message: `Status pembayaran diperbarui menjadi ${paymentStatus}.`,
      data: updated,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function getOrderLogs(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    const { id } = req.params;
    if (!adminId) { res.status(400).json({ success: false, error: 'adminId tidak ditemukan.' }); return; }

    // Verifikasi pesanan milik admin ini
    const order = await prisma.laundryOrder.findFirst({ where: { id: id as string, adminId } });
    if (!order) { res.status(404).json({ success: false, error: 'Pesanan tidak ditemukan.' }); return; }

    const logs = await prisma.activityLog.findMany({
      where: { entity: 'LaundryOrder', entityId: id as string },
      include: {
        user: { select: { id: true, name: true, role: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ success: true, data: logs });
  } catch (e: any) { next(e); }
}

export async function exportOrders(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.user?.adminId;
    if (!adminId) {
      res.status(400).json({ success: false, error: 'adminId tidak ditemukan.' });
      return;
    }

    const orders = await prisma.laundryOrder.findMany({
      where: { adminId },
      include: {
        customer: true,
        outlet: true,
        items: {
          include: { package: true, category: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: orders });
  } catch (e: any) {
    next(e);
  }
}
