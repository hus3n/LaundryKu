import mongoose from 'mongoose';
import { WATemplate } from './src/models-nosql/waTemplate.model.js';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/laundryku');
  const temp = await WATemplate.find({});
  console.log('Templates found:', temp.length);
  process.exit(0);
}
test();
