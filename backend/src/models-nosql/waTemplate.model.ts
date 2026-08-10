import mongoose, { Schema, Document } from 'mongoose';

export interface IWATemplate extends Document {
  adminId: string;
  type: 'ORDER_RECEIVED' | 'ORDER_IN_PROGRESS' | 'ORDER_DONE' | 'ORDER_PICKED_UP' | 'CUSTOM';
  name: string;
  content: string;
  isDefault: boolean;
}

const WATemplateSchema: Schema = new Schema(
  {
    adminId: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: ['ORDER_RECEIVED', 'ORDER_IN_PROGRESS', 'ORDER_DONE', 'ORDER_PICKED_UP', 'CUSTOM'],
      required: true,
    },
    name: { type: String, required: true },
    content: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const WATemplate = mongoose.model<IWATemplate>('WATemplate', WATemplateSchema);
