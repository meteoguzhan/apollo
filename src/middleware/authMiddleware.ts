import { NextFunction, Request, Response } from "express"
import { UserModel } from "../models/UserModel"
import { sendErrorResponse } from "../utils/errorResponse"
import AuthService from "../services/authService"

declare module "express" {
    interface Request {
        user?: UserModel
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = req.header("Authorization")
    if (!token) {
        return sendErrorResponse(res, 2000)
    }

    try {
        const isUser = await AuthService.verifyToken(token)
        if (isUser === false) {
            return sendErrorResponse(res, 2001)
        }

        const user = await UserModel.findOne({ email: isUser.email })
        if (!user) {
            return sendErrorResponse(res, 2001)
        }

        req.user = user
        next()
    } catch (error) {
        return sendErrorResponse(res, 2000)
    }
}
