import { Request, Response } from 'express';
import { z } from 'zod';

export declare class IndexControllerInterface {
  static create(req: Request & { body: IndexRequest }, res: Response): Promise<void>;
  static delete(req: Request & { body: IndexRequest }, res: Response): Promise<void>;
}

export const validateDeleteIndex = z.object({
  date: z.string({ required_error: 'Date is required' }).trim().min(1, 'Date cannot be empty'),
});

export const validateCreateIndex = validateDeleteIndex.merge(
  z.object({
    indexValue: z
      .number({ required_error: 'Index value is required' })
      .min(0, 'Index value cannot be empty'),
  }),
);

export const UserWithUserId = validateCreateIndex.merge(
  z.object({
    userId: z.string(),
  }),
);

export type IndexRequest = z.infer<typeof validateCreateIndex>;
