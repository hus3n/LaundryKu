import { Router } from 'express';
import { z } from 'zod';
import {
  getConfig,
  saveConfig,
  listAutoReplies,
  addAutoReply,
  updateAutoReplyStatus,
  removeAutoReply,
} from '../controllers/botConfig.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { validate } from '../middleware/validation.js';

const router = Router();

const saveConfigSchema = z.object({
  body: z.object({
    greetingMessage: z.string().min(5, 'Pesan sapaan minimal 5 karakter').optional(),
    isGreetingActive: z.boolean().optional(),
    aiApiKey: z.string().optional(),
    aiProvider: z.enum(['openai', 'gemini']).nullable().optional(),
    isAiActive: z.boolean().optional(),
  }),
});

const createAutoReplySchema = z.object({
  body: z.object({
    keyword: z.string().min(1, 'Kata kunci wajib diisi').max(100),
    reply: z.string().min(1, 'Balasan wajib diisi').max(1000),
  }),
});

router.use(authenticate);
// Semua endpoint hanya untuk SUPERADMIN (fase testing)
router.use(authorize('SUPERADMIN'));

router.get('/config', getConfig);
router.put('/config', validate(saveConfigSchema), saveConfig);

router.get('/auto-replies', listAutoReplies);
router.post('/auto-replies', validate(createAutoReplySchema), addAutoReply);
router.patch('/auto-replies/:id/toggle', updateAutoReplyStatus);
router.delete('/auto-replies/:id', removeAutoReply);

export default router;
