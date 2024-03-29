import mongoose, { Document, Schema, Types } from 'mongoose';
import moment from 'moment/moment';

export interface ConsumptionInterface extends Document {
  date: string;
  consumption: number;
  userId: string;
}

export const ConsumptionSchema = new Schema(
  {
    date: {
      type: String,
      required: true,
      validate: {
        validator: (date: string) => moment(date, 'YYYY-MM-DD', true).isValid(),
        message: 'Invalid date format',
      },
    },
    consumption: { type: Number, required: true },
    userId: { type: Types.ObjectId, ref: 'User', required: true },
  },
  { versionKey: false },
);

export const ConsumptionModel = mongoose.model<ConsumptionInterface>(
  'Consumption',
  ConsumptionSchema,
);
