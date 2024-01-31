import mongoose, { Schema } from 'mongoose';
import { z } from 'zod';
import { UserWithId } from '../types/authType';

export type UserInterface = z.infer<typeof UserWithId>;

export const UserSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    companyName: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: true }, versionKey: false },
);

export const UserModel = mongoose.model<UserInterface>('User', UserSchema);
