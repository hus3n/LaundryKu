import { Router } from 'express';
import { z } from 'zod';
import { getEmployees, addEmployee, editEmployee, removeEmployee } from '../controllers/employee.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { validate } from '../middleware/validation.js';

const router = Router();

const createEmployeeSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Nama karyawan minimal 2 karakter'),
    email: z.string().email('Email tidak valid'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
    phone: z.string().optional(),
  }),
});

const updateEmployeeSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    phone: z.string().optional(),
    password: z.string().min(6).optional(),
    isActive: z.boolean().optional(),
  }),
});

router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/', getEmployees);
router.post('/', validate(createEmployeeSchema), addEmployee);
router.put('/:id', validate(updateEmployeeSchema), editEmployee);
router.delete('/:id', removeEmployee);

export default router;
