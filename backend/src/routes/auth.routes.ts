import { Router } from 'express';
import { z } from 'zod';
import { login, registerRequest, forgotPassword, resetPassword, getMe } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email tidak valid'),
    password: z.string().min(1, 'Password wajib diisi'),
  }),
});

const registerRequestSchema = z.object({
  body: z.object({
    storeName: z.string().min(2, 'Nama toko minimal 2 karakter'),
    name: z.string().min(2, 'Nama penanggung jawab minimal 2 karakter'),
    phone: z.string().min(8, 'Nomor WA tidak valid'),
    email: z.string().email('Email tidak valid'),
  }),
});

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Email tidak valid'),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Token wajib ada'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
  }),
});

router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/register-request', validate(registerRequestSchema), registerRequest);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), resetPassword);
router.get('/me', authenticate, getMe);

export default router;
