import { Request, Response } from "express"
import { sendErrorResponse } from "../utils/errorResponse"
import { sendSuccessResponse } from "../utils/successResponse"
import { ConsumptionControllerInterface } from "../types/consumptionType"
import { ConsumptionModel } from "../models/ConsumptionModel"

export default class ConsumptionController implements ConsumptionControllerInterface {
    static async index(req: Request, res: Response): Promise<void> {
        try {
            const consumptionList = await ConsumptionModel.find({ userId: req?.user?._id }).sort({ date: -1 }).exec()
            if (!consumptionList.length) {
                return sendErrorResponse(res, 1011)
            }

            return sendSuccessResponse(res, 1005, consumptionList)
        } catch (error) {
            return sendErrorResponse(res, 500)
        }
    }
}
