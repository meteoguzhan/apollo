import { Request, Response } from 'express';
import { z } from 'zod';

export declare class IndexControllerInterface {
  static create(req: Request & { body: IndexRequest }, res: Response): Promise<void>;
  static delete(req: Request & { body: IndexRequest }, res: Response): Promise<void>;
}

const ValidationMessages = {
  RequiredDate: 'Date is required',
  EmptyDate: 'Date cannot be empty',
  RequiredIndexValue: 'Index value is required',
  EmptyIndexValue: 'Index value cannot be empty',
};

export const validateDeleteIndex = z.object({
  date: z
    .string({ required_error: ValidationMessages.RequiredDate })
    .trim()
    .min(1, ValidationMessages.EmptyDate),
});

export const validateCreateIndex = validateDeleteIndex.merge(
  z.object({
    indexValue: z
      .number({ required_error: ValidationMessages.RequiredIndexValue })
      .min(0, ValidationMessages.EmptyIndexValue),
  }),
);

export const UserWithUserId = validateCreateIndex.merge(
  z.object({
    userId: z.string(),
  }),
);

export type IndexRequest = z.infer<typeof validateCreateIndex>;
