import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { listOutlets, addOutlet, editOutlet, removeOutlet } from '../controllers/outlet.controller.js';

const router = Router();
router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/', listOutlets);
router.post('/', addOutlet);
router.patch('/:id', editOutlet);
router.delete('/:id', removeOutlet);

export default router;
