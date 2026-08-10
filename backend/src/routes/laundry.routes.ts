import { Router } from 'express';
import { z } from 'zod';
import { createOrder, getOrders, changeOrderStatus, changePaymentStatus } from '../controllers/laundry.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { validate } from '../middleware/validation.js';

const router = Router();

const createOrderSchema = z.object({
  body: z.object({
    customerName: z.string().min(2, 'Nama pelanggan wajib diisi'),
    customerPhone: z.string().min(8, 'Nomor WA wajib diisi'),
    customerAddress: z.string().optional(),
    items: z.array(
      z.object({
        packageId: z.string().min(1, 'Paket wajib dipilih'),
        categoryId: z.string().min(1, 'Kategori wajib dipilih'),
        quantity: z.number().positive('Jumlah harus lebih dari 0'),
      })
    ).min(1, 'Minimal 1 item cucian'),
    notes: z.string().optional(),
    paymentStatus: z.enum(['UNPAID', 'PAID']).optional(),
  }),
});

const statusSchema = z.object({
  body: z.object({
    status: z.enum(['RECEIVED', 'IN_PROGRESS', 'DONE', 'PICKED_UP']),
  }),
});

const paymentSchema = z.object({
  body: z.object({
    paymentStatus: z.enum(['UNPAID', 'PAID']),
  }),
});

router.use(authenticate);

router.get('/', authorize('ADMIN', 'EMPLOYEE'), getOrders);
router.post('/', authorize('ADMIN', 'EMPLOYEE'), validate(createOrderSchema), createOrder);
router.patch('/:id/status', authorize('ADMIN', 'EMPLOYEE'), validate(statusSchema), changeOrderStatus);
router.patch('/:id/payment', authorize('ADMIN', 'EMPLOYEE'), validate(paymentSchema), changePaymentStatus);

export default router;
