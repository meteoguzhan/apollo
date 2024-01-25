import { Request, Response } from "express"
import bcrypt from "bcrypt"
import { UserModel } from "../models/UserModel"
import { sendErrorResponse } from "../utils/errorResponse"
import { sendSuccessResponse } from "../utils/successResponse"
import AuthService from "../services/authService"
import { AuthControllerInterface, AuthLoginRequestBody, AuthRegisterRequestBody, AuthRequest, LoginAndRegisterResponse } from "../types/authType"
import validateParams from "../utils/validateParams"

export default class AuthController implements AuthControllerInterface {
    static async register(req: Request & { body: AuthRequest }, res: Response): Promise<void> {
        try {
            if (!validateParams(req.body, AuthRegisterRequestBody)) {
                return sendErrorResponse(res, 1008)
            }

            const { email, password, companyName } = req.body

            const isUser = await UserModel.findOne({ email })
            if (isUser) {
                return sendErrorResponse(res, 1003)
            }

            const isCompany = await UserModel.findOne({ companyName })
            if (isCompany) {
                return sendErrorResponse(res, 1004)
            }

            const hashedPassword: string = await bcrypt.hash(password, 10)
            const user = new UserModel({
                email,
                password: hashedPassword,
                companyName
            })
            await user.save()

            const token: string | false = await AuthService.generateToken(user)
            if (!token) {
                return sendErrorResponse(res, 2001)
            }

            const loginResponse: LoginAndRegisterResponse = { token }
            return sendSuccessResponse(res, 1000, loginResponse)
        } catch (error) {
            return sendErrorResponse(res, 5000)
        }
    }
    static async login(req: Request & { body: AuthRequest }, res: Response): Promise<void> {
        try {
            if (!validateParams(req.body, AuthLoginRequestBody)) {
                return sendErrorResponse(res, 1002)
            }

            const { email, password } = req.body

            const user = await UserModel.findOne({ email })
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return sendErrorResponse(res, 1002)
            }

            const token: string | false = await AuthService.generateToken(user)
            if (!token) {
                return sendErrorResponse(res, 2001)
            }

            const loginResponse: LoginAndRegisterResponse = { token }
            return sendSuccessResponse(res, 1001, loginResponse)
        } catch (error) {
            return sendErrorResponse(res, 5000)
        }
    }
    static async logout(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                return sendErrorResponse(res, 2000)
            }

            // Jsonwebtoken kullandığım için logout işlemi yapılmıyor.
            return sendSuccessResponse(res, 1002)
        } catch (error) {
            return sendErrorResponse(res, 5000)
        }
    }
}
