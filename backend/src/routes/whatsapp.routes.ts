import { Router } from 'express';
import { z } from 'zod';
import {
  getStatus,
  connect,
  confirmSimulated,
  disconnect,
  getTemplates,
  updateTemplate,
  sendCustomMessage,
  getMessageLogs,
} from '../controllers/whatsapp.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { validate } from '../middleware/validation.js';
import { requirePaidSubscription } from '../middleware/subscriptionGuard.js';

const router = Router();

const updateTemplateSchema = z.object({
  body: z.object({
    content: z.string().min(5, 'Isi template minimal 5 karakter'),
  }),
});

const sendCustomMessageSchema = z.object({
  body: z.object({
    recipientPhone: z.string().min(8, 'Nomor WA penerima tidak valid'),
    recipientName: z.string().min(2, 'Nama penerima wajib diisi'),
    message: z.string().min(2, 'Isi pesan wajib diisi'),
  }),
});

router.use(authenticate);

// Status dan disconnect TIDAK memerlukan pengecekan langganan
router.get('/status', authorize('ADMIN', 'SUPERADMIN'), getStatus);
router.post('/disconnect', authorize('ADMIN', 'SUPERADMIN'), disconnect);

// Connect dan confirm-simulated MEMERLUKAN pengecekan langganan berbayar
router.post(
  '/connect',
  authorize('ADMIN', 'SUPERADMIN'),
  requirePaidSubscription,
  connect
);
router.post(
  '/confirm-simulated',
  authorize('ADMIN', 'SUPERADMIN'),
  requirePaidSubscription,
  confirmSimulated
);

router.get('/templates', authorize('ADMIN', 'SUPERADMIN'), getTemplates);
router.put('/templates/:id', authorize('ADMIN', 'SUPERADMIN'), validate(updateTemplateSchema), updateTemplate);

router.post('/send-custom', authorize('ADMIN'), validate(sendCustomMessageSchema), sendCustomMessage);
router.get('/logs', authorize('ADMIN', 'SUPERADMIN'), getMessageLogs);

export default router;
