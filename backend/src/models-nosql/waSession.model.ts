import mongoose, { Schema, Document } from 'mongoose';

export interface IWASession extends Document {
  adminId: string;
  status: 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED';
  qrCode?: string;
  phoneConnected?: string;
  updatedAt: Date;
}

const WASessionSchema: Schema = new Schema(
  {
    adminId: { type: String, required: true, unique: true, index: true },
    status: {
      type: String,
      enum: ['DISCONNECTED', 'CONNECTING', 'CONNECTED'],
      default: 'DISCONNECTED',
    },
    qrCode: { type: String },
    phoneConnected: { type: String },
  },
  { timestamps: true }
);

export const WASession = mongoose.model<IWASession>('WASession', WASessionSchema);
