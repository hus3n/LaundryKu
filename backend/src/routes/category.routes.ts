import { Router } from 'express';
import { z } from 'zod';
import { getCategories, addCategory, editCategory, removeCategory } from '../controllers/category.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { validate } from '../middleware/validation.js';

const router = Router();

const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Nama kategori minimal 2 karakter'),
  }),
});

const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    isActive: z.boolean().optional(),
  }),
});

router.use(authenticate);

router.get('/', authorize('ADMIN', 'EMPLOYEE'), getCategories);
router.post('/', authorize('ADMIN'), validate(createCategorySchema), addCategory);
router.put('/:id', authorize('ADMIN'), validate(updateCategorySchema), editCategory);
router.delete('/:id', authorize('ADMIN'), removeCategory);

export default router;
