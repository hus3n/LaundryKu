import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('4000'),
  DATABASE_URL: z.string(),
  MONGODB_URI: z.string().default('mongodb://localhost:27017/laundryku_wa'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  JWT_SECRET: z.string().min(10, 'JWT_SECRET must be at least 10 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
  SUPERADMIN_EMAIL: z.string().email().default('superadmin@laundryku.com'),
  SUPERADMIN_PASSWORD: z.string().default('SuperAdmin@2026'),
  SUPERADMIN_NAME: z.string().default('Super Admin'),
  WA_SESSION_DIR: z.string().default('./wa-sessions'),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  SUPERADMIN_WA_NUMBER: z.string().default('6285229925593'),
  APP_URL: z.string().default('http://localhost:3000'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  throw new Error('Invalid environment variables');
}

export const env = _env.data;
