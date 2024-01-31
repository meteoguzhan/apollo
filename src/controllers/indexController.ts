import { Request, RequestHandler, Response } from 'express';
import { sendErrorResponse } from '../utils/errorResponse';
import IndexService from '../services/indexService';
import { IndexModel } from '../models/IndexModel';
import { sendSuccessResponse } from '../utils/successResponse';
import { IndexControllerInterface, IndexRequest } from '../types/indexType';
import { AuthRequest } from '../types/authType';

export default class IndexController implements IndexControllerInterface {
  create: RequestHandler = async (
    req: Request & { body: AuthRequest },
    res: Response,
  ): Promise<void> => {
    try {
      const { indexValue, date }: IndexRequest = req.body as IndexRequest;

      const createIndex = await IndexService.addIndex(indexValue, date, req.user);
      if (!createIndex) {
        return sendErrorResponse(res, 1005);
      }

      return sendSuccessResponse(res, 1003);
    } catch (error) {
      // Log detailed error information for debugging
      console.error(error);
      return sendErrorResponse(res, 500);
    }
  };

  delete: RequestHandler = async (
    req: Request & { body: AuthRequest },
    res: Response,
  ): Promise<void> => {
    try {
      const { date }: IndexRequest = req.body as IndexRequest;

      const isSuccess = await IndexModel.deleteOne({ userId: req?.user?._id, date });
      if (!isSuccess) {
        return sendErrorResponse(res, 1006);
      }

      const calculateConsumption = await IndexService.calculateConsumption(req.user);
      if (!calculateConsumption) {
        return sendErrorResponse(res, 1007);
      }

      return sendSuccessResponse(res, 1004);
    } catch (error) {
      // Log detailed error information for debugging
      console.error(error);
      return sendErrorResponse(res, 500);
    }
  };
}
