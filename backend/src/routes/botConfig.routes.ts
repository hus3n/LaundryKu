import { Router } from 'express';
import { z } from 'zod';
import {
  getConfig,
  saveConfig,
  testAi,
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
    aiApiKey: z.string().nullable().optional(),
    aiProvider: z.string().nullable().optional(),
    aiBaseUrl: z.string().nullable().optional(),
    aiModel: z.string().nullable().optional(),
    aiSystemPrompt: z.string().nullable().optional(),
    isAiActive: z.boolean().optional(),
  }),
});

const testAiSchema = z.object({
  body: z.object({
    apiKey: z.string().optional(),
    provider: z.string().nullable().optional(),
    baseUrl: z.string().nullable().optional(),
    model: z.string().nullable().optional(),
    systemPrompt: z.string().nullable().optional(),
  }),
});

const createAutoReplySchema = z.object({
  body: z.object({
    keyword: z.string().min(1, 'Kata kunci wajib diisi').max(100),
    reply: z.string().min(1, 'Balasan wajib diisi').max(1000),
  }),
});

router.use(authenticate);
// Endpoint dapat diakses oleh SUPERADMIN & ADMIN
router.use(authorize('SUPERADMIN', 'ADMIN'));

router.get('/config', getConfig);
router.put('/config', validate(saveConfigSchema), saveConfig);
router.post('/test-ai', validate(testAiSchema), testAi);

router.get('/auto-replies', listAutoReplies);
router.post('/auto-replies', validate(createAutoReplySchema), addAutoReply);
router.patch('/auto-replies/:id/toggle', updateAutoReplyStatus);
router.delete('/auto-replies/:id', removeAutoReply);

export default router;
