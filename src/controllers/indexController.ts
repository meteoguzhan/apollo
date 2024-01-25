import { Request, Response } from "express"
import { sendErrorResponse } from "../utils/errorResponse"
import IndexService from "../services/indexService"
import { IndexModel } from "../models/IndexModel"
import { sendSuccessResponse } from "../utils/successResponse"
import { IndexControllerInterface, IndexCreateRequestBody, IndexDeleteRequestBody, IndexRequest } from "../types/indexType"
import validateParams from "../utils/validateParams"

export default class IndexController implements IndexControllerInterface {
    static async create(req: Request & { body: IndexRequest }, res: Response): Promise<void> {
        try {
            if (!validateParams(req.body, IndexCreateRequestBody)) {
                return sendErrorResponse(res, 1009)
            }

            const { indexValue, date } = req.body

            if (indexValue < 0) {
                return sendErrorResponse(res, 1012)
            }

            const createIndex: boolean = await IndexService.addIndex(indexValue, date, req.user)
            if (!createIndex) {
                return sendErrorResponse(res, 1005)
            }

            return sendSuccessResponse(res, 1003)
        } catch (error) {
            return sendErrorResponse(res, 500)
        }
    }
    static async delete(req: Request & { body: IndexRequest }, res: Response): Promise<void> {
        try {
            if (!validateParams(req.body, IndexDeleteRequestBody)) {
                return sendErrorResponse(res, 1010)
            }

            const { date } = req.body

            const isSuccess = await IndexModel.deleteOne({ userId: req?.user?._id, date })
            if (!isSuccess) {
                return sendErrorResponse(res, 1006)
            }

            const calculateConsumption: boolean = await IndexService.calculateConsumption(req.user)
            if (!calculateConsumption) {
                return sendErrorResponse(res, 1007)
            }

            return sendSuccessResponse(res, 1004)
        } catch (error) {
            return sendErrorResponse(res, 500)
        }
    }
}
