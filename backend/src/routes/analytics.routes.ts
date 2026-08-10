import { Router } from 'express';
import {
  getRevenueChart,
  getPackageStats,
  getEmployeeStats,
  getLogs,
} from '../controllers/analytics.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';

const router = Router();

router.use(authenticate);

router.get('/revenue', authorize('ADMIN'), getRevenueChart);
router.get('/packages', authorize('ADMIN'), getPackageStats);
router.get('/employees', authorize('ADMIN'), getEmployeeStats);
router.get('/logs', authorize('ADMIN'), getLogs);

export default router;
