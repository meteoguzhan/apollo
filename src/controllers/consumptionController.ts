import { Request, RequestHandler, Response } from 'express';
import { sendErrorResponse } from '../utils/errorResponse';
import { DataInterface, sendSuccessResponse } from '../utils/successResponse';
import { ConsumptionControllerInterface } from '../types/consumptionType';
import { ConsumptionModel } from '../models/ConsumptionModel';

export default class ConsumptionController implements ConsumptionControllerInterface {
  index: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req?.user?._id;
      const consumptionList = await ConsumptionModel.find({ userId })
        .select('consumption date -_id')
        .sort({ date: -1 })
        .exec();

      if (consumptionList.length === 0) {
        return sendErrorResponse(res, 1011);
      }

      const responseData: DataInterface = consumptionList as DataInterface;
      return sendSuccessResponse(res, 1005, responseData);
    } catch (error) {
      // Log detailed error information for debugging
      console.error(error);
      return sendErrorResponse(res, 500);
    }
  };
}
