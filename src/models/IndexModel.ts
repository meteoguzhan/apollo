import mongoose, { Schema, Types } from 'mongoose';
import moment from 'moment';
import { z } from 'zod';
import { UserWithUserId } from '../types/indexType';

export type IndexInterface = z.infer<typeof UserWithUserId>;

export const IndexSchema = new Schema(
  {
    date: {
      type: String,
      required: true,
      validate: {
        validator: (date: string) => moment(date, 'YYYY-MM-DD', true).isValid(),
        message: 'Invalid date format',
      },
    },
    indexValue: { type: Number, required: true },
    userId: { type: Types.ObjectId, ref: 'User', required: true },
  },
  { versionKey: false },
);

export const IndexModel = mongoose.model<IndexInterface>('Index', IndexSchema);
