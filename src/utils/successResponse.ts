import { Response } from 'express';
import { LoginAndRegisterResponse } from '../types/authType';
import { ConsumptionInterface } from '../models/ConsumptionModel';

export type DataInterface = LoginAndRegisterResponse | [ConsumptionInterface];

export interface SuccessResponse {
  code: number;
  message: string;
  data: DataInterface;
}

export const sendSuccessResponse = (
  res: Response,
  successCode: number,
  data?: DataInterface,
): void => {
  const message: string = getSuccessMessage(successCode);
  const response: {
    code: number;
    message: string;
    data?: DataInterface;
  } = { code: successCode, message };
  if (data) {
    response.data = data;
  }

  res.status(200).json(response as SuccessResponse);
};

const getSuccessMessage = (successCode: number): string => {
  const successMessages: { [key: number]: string } = {
    1000: 'Register successful',
    1001: 'Login successful',
    1002: 'Logout successful',
    1003: 'Added index successful',
    1004: 'Deleted index successful',
    1005: 'Consumption list successful',
  };

  return successMessages[successCode] || 'Successful';
};
