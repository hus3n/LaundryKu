import { Router } from 'express';
import { z } from 'zod';
import { getCustomers, addCustomer, editCustomer, removeCustomer } from '../controllers/customer.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { validate } from '../middleware/validation.js';

const router = Router();

const createCustomerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Nama pelanggan minimal 2 karakter'),
    phone: z.string().min(8, 'Nomor WhatsApp tidak valid'),
    address: z.string().optional(),
  }),
});

const updateCustomerSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    phone: z.string().min(8).optional(),
    address: z.string().optional(),
  }),
});

router.use(authenticate);

router.get('/', authorize('ADMIN', 'EMPLOYEE'), getCustomers);
router.post('/', authorize('ADMIN', 'EMPLOYEE'), validate(createCustomerSchema), addCustomer);
router.put('/:id', authorize('ADMIN', 'EMPLOYEE'), validate(updateCustomerSchema), editCustomer);
router.delete('/:id', authorize('ADMIN'), removeCustomer);

export default router;
