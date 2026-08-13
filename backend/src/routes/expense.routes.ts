import { Router } from 'express';
import { z } from 'zod';
import {
  addExpense,
  listExpenses,
  removeExpense,
  getIncome,
  getChartData,
  exportExpensesCSV,
  exportIncomeCSV,
} from '../controllers/expense.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { validate } from '../middleware/validation.js';

const router = Router();

const createExpenseSchema = z.object({
  body: z.object({
    category: z.string().min(1, 'Kategori wajib diisi'),
    amount: z.number().positive('Jumlah harus lebih dari 0'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD'),
    description: z.string().optional(),
  }),
});

router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/', listExpenses);
router.post('/', validate(createExpenseSchema), addExpense);
router.delete('/:id', removeExpense);

// Rekap pemasukan
router.get('/income', getIncome);

// Data grafik
router.get('/chart', getChartData);

// Export CSV
router.get('/export/expenses', exportExpensesCSV);
router.get('/export/income', exportIncomeCSV);

export default router;
