import { Router } from 'express';
import { z } from 'zod';
import { getPackages, addPackage, editPackage, removePackage } from '../controllers/package.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { validate } from '../middleware/validation.js';

const router = Router();

const createPackageSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Nama paket minimal 2 karakter'),
    unit: z.string().min(1, 'Satuan wajib diisi (kg, pcs, dll)'),
    price: z.number().positive('Harga harus lebih dari 0'),
    estimatedDuration: z.number().optional(),
  }),
});

const updatePackageSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    unit: z.string().min(1).optional(),
    price: z.number().positive().optional(),
    estimatedDuration: z.number().optional(),
    isActive: z.boolean().optional(),
  }),
});

router.use(authenticate);

router.get('/', authorize('ADMIN', 'EMPLOYEE'), getPackages);
router.post('/', authorize('ADMIN'), validate(createPackageSchema), addPackage);
router.put('/:id', authorize('ADMIN'), validate(updatePackageSchema), editPackage);
router.delete('/:id', authorize('ADMIN'), removePackage);

export default router;
