import { Request, Response } from 'express';
import { z } from 'zod';

export declare class AuthControllerInterface {
  static register(req: Request & { body: AuthRequest }, res: Response): Promise<void>;
  static login(req: Request & { body: AuthRequest }, res: Response): Promise<void>;
  static logout(req: Request, res: Response): Promise<void>;
}

const ValidationMessages = {
  RequiredEmail: 'Email is required',
  EmptyEmail: 'Email cannot be empty',
  InvalidEmail: 'Invalid email',
  RequiredPassword: 'Password is required',
  EmptyPassword: 'Password cannot be empty',
  RequiredCompanyName: 'Company name is required',
  EmptyCompanyName: 'Company name cannot be empty',
};

export const validateAuthLogin = z.object({
  email: z
    .string({ required_error: ValidationMessages.RequiredEmail })
    .trim()
    .min(1, ValidationMessages.EmptyEmail)
    .email(ValidationMessages.InvalidEmail),
  password: z
    .string({ required_error: ValidationMessages.RequiredPassword })
    .trim()
    .min(1, ValidationMessages.EmptyPassword),
});

export const validateAuthRegister = validateAuthLogin.merge(
  z.object({
    companyName: z
      .string({ required_error: ValidationMessages.RequiredCompanyName })
      .trim()
      .min(1, ValidationMessages.EmptyCompanyName),
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
