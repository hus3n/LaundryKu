import mongoose, { Schema, Document } from 'mongoose';

export interface IAppErrorLog extends Document {
  adminId?: string; // Optional, can be global or tied to an admin
  type: 'WHATSAPP_QUEUE_FAIL' | 'WHATSAPP_AUTH_FAIL' | 'SYSTEM_ERROR' | 'TEST_FAIL';
  errorMessage: string;
  details?: Record<string, any>;
  isResolved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AppErrorLogSchema: Schema = new Schema(
  {
    adminId: { type: String, index: true },
    type: { type: String, required: true },
    errorMessage: { type: String, required: true },
    details: { type: Schema.Types.Mixed },
    isResolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const AppErrorLog = mongoose.model<IAppErrorLog>('AppErrorLog', AppErrorLogSchema);
