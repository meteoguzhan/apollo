import { Request, RequestHandler, Response } from 'express';
import { sendErrorResponse } from '../utils/errorResponse';
import { DataInterface, sendSuccessResponse } from '../utils/successResponse';
import { ConsumptionControllerInterface } from '../types/consumptionType';
import { ConsumptionModel } from '../models/ConsumptionModel';

export default class ConsumptionController implements ConsumptionControllerInterface {
  index: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const consumptionList = await ConsumptionModel.find({
        userId: req?.user?._id,
      })
        .select('consumption date -_id')
        .sort({ date: -1 })
        .exec();
      if (!consumptionList.length) {
        return sendErrorResponse(res, 1011);
      }

      return sendSuccessResponse(res, 1005, consumptionList as DataInterface);
    } catch (error) {
      return sendErrorResponse(res, 500);
    }
  };
}
