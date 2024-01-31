import { Request, Response } from 'express';
import { z } from 'zod';

export declare class AuthControllerInterface {
  static register(req: Request & { body: AuthRequest }, res: Response): Promise<void>;
  static login(req: Request & { body: AuthRequest }, res: Response): Promise<void>;
  static logout(req: Request, res: Response): Promise<void>;
}

export const validateAuthLogin = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .min(1, 'Email cannot be empty')
    .email('Invalid email'),
  password: z
    .string({ required_error: 'Password is required' })
    .trim()
    .min(1, 'Password cannot be empty'),
});

export const validateAuthRegister = validateAuthLogin.merge(
  z.object({
    companyName: z
      .string({ required_error: 'Company name is required' })
      .trim()
      .min(1, 'Company name cannot be empty'),
  }),
);

const UserWithCompanyName = validateAuthLogin.merge(
  z.object({
    companyName: z.string().optional(),
  }),
);

export const UserWithId = validateAuthRegister.merge(
  z.object({
    _id: z.string().optional(),
  }),
);

export type AuthRequest = z.infer<typeof UserWithCompanyName>;

export interface LoginAndRegisterResponse {
  token: string;
}
