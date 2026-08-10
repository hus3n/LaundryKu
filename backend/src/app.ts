import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { connectMongoDB } from './config/mongodb.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { initSubscriptionCronJob } from './jobs/subscriptionCron.js';
import { startBackupCron } from './jobs/backupCron.js';
import { initTrialCronJobs } from './jobs/trialExpiry.job.js';

import authRoutes from './routes/auth.routes.js';
import packageRoutes from './routes/package.routes.js';
import categoryRoutes from './routes/category.routes.js';
import customerRoutes from './routes/customer.routes.js';
import employeeRoutes from './routes/employee.routes.js';
import laundryRoutes from './routes/laundry.routes.js';
import storeRoutes from './routes/store.routes.js';
import whatsappRoutes from './routes/whatsapp.routes.js';
import superadminRoutes from './routes/superadmin.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import backupRoutes from './routes/backup.routes.js';

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'LaundryKu Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/laundry', laundryRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/superadmin', superadminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/backup', backupRoutes);

// Global Error Handler
app.use(errorHandler);

// Connect DBs and start server
async function startServer() {
  await connectMongoDB();
  initSubscriptionCronJob();
  startBackupCron();
  initTrialCronJobs();

  app.listen(env.PORT, () => {
    console.log(`🚀 LaundryKu Backend API server running on port ${env.PORT}`);
    console.log(`📍 Health Check: http://localhost:${env.PORT}/health`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});

export default app;
