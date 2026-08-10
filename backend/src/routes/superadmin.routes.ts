import { Router } from 'express';
import { z } from 'zod';
import {
  getDashboard,
  getAdmins,
  addAdmin,
  createTrial,
  extendSubscription,
  toggleStatus,
  removeAdmin,
} from '../controllers/superadmin.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { validate } from '../middleware/validation.js';

const router = Router();

const createAdminSchema = z.object({
  body: z.object({
    storeName: z.string().min(2, 'Nama toko minimal 2 karakter'),
    name: z.string().min(2, 'Nama pemilik minimal 2 karakter'),
    email: z.string().email('Email tidak valid'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
    phone: z.string().min(6, 'Nomor WA minimal 6 karakter'),
    storeAddress: z.string().optional().nullable(),
    durationMonths: z.coerce.number().positive('Durasi bulan wajib diisi'),
  }),
});

const extendSchema = z.object({
  body: z.object({
    additionalMonths: z.coerce.number().positive('Jumlah bulan perpanjangan wajib diisi'),
  }),
});

const toggleSchema = z.object({
  body: z.object({
    isActive: z.boolean(),
  }),
});

const createTrialSchema = z.object({
  body: z.object({
    storeName:    z.string().min(2, 'Nama toko minimal 2 karakter'),
    name:         z.string().min(2, 'Nama pemilik minimal 2 karakter'),
    email:        z.string().email('Email tidak valid'),
    password:     z.string().min(6, 'Password minimal 6 karakter'),
    phone:        z.string().min(6, 'Nomor WA minimal 6 karakter'),
    trialDays:    z.coerce.number().refine((v) => [3, 5, 7].includes(v), {
      message: 'Durasi trial hanya boleh 3, 5, atau 7 hari',
    }),
    storeAddress: z.string().optional().nullable(),
  }),
});

router.use(authenticate);
router.use(authorize('SUPERADMIN'));

router.get('/dashboard', getDashboard);
router.get('/admins', getAdmins);
router.post('/admins', validate(createAdminSchema), addAdmin);
router.post('/admins/trial', validate(createTrialSchema), createTrial);
router.patch('/admins/:id/extend', validate(extendSchema), extendSubscription);
router.patch('/admins/:id/toggle-status', validate(toggleSchema), toggleStatus);
router.delete('/admins/:id', removeAdmin);

export default router;
