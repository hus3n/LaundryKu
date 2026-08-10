import mongoose from 'mongoose';
import { env } from './env.js';

let mongoConnected = false;

export function isMongoConnected(): boolean {
  return mongoConnected && mongoose.connection.readyState === 1;
}

export async function connectMongoDB() {
  try {
    await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 2000 });
    mongoConnected = true;
    console.log('✅ MongoDB connected successfully (WhatsApp storage)');
  } catch (error: any) {
    mongoConnected = false;
    console.warn('⚠️ MongoDB connection skipped in local dev mode:', error.message);
  }
}
