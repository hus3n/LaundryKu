import mongoose, { Schema, Document } from 'mongoose';

export interface IAutoReply extends Document {
  adminId: string;
  keyword: string;
  reply: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AutoReplySchema = new Schema<IAutoReply>(
  {
    adminId: { type: String, required: true, index: true },
    keyword: { type: String, required: true, trim: true },
    reply: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Index compound untuk mencegah keyword duplikat per admin
AutoReplySchema.index({ adminId: 1, keyword: 1 }, { unique: true });

export const AutoReply = mongoose.model<IAutoReply>('AutoReply', AutoReplySchema);
