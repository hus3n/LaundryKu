import mongoose, { Schema, Document } from 'mongoose';

export interface IWAMessageLog extends Document {
  adminId: string;
  recipientPhone: string;
  recipientName: string;
  message: string;
  status: 'PENDING' | 'SENT' | 'FAILED';
  sentAt?: Date;
  errorReason?: string;
}

const WAMessageLogSchema: Schema = new Schema(
  {
    adminId: { type: String, required: true, index: true },
    recipientPhone: { type: String, required: true },
    recipientName: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'SENT', 'FAILED'],
      default: 'PENDING',
    },
    sentAt: { type: Date },
    errorReason: { type: String },
  },
  { timestamps: true }
);

export const WAMessageLog = mongoose.model<IWAMessageLog>('WAMessageLog', WAMessageLogSchema);
