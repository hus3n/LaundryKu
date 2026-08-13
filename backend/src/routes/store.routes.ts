import { Router } from 'express';
import { z } from 'zod';
import { getStore, updateStore, uploadStoreLogo } from '../controllers/store.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { validate } from '../middleware/validation.js';
import { uploadLogo } from '../middleware/upload.js';

const router = Router();

const updateStoreSchema = z.object({
  body: z.object({
    storeName: z.string().min(2).optional(),
    storeAddress: z.string().optional(),
    storePhone: z.string().optional(),
    storeLogo: z.string().optional(),
    operatingHours: z.any().optional(),
  }),
});

router.use(authenticate);

router.get('/', authorize('ADMIN', 'EMPLOYEE'), getStore);
router.put('/', authorize('ADMIN'), validate(updateStoreSchema), updateStore);

// Endpoint baru untuk upload logo
router.post(
  '/upload-logo',
  authorize('ADMIN'),
  uploadLogo.single('logo'), // field name di form-data harus 'logo'
  uploadStoreLogo
);

export default router;
