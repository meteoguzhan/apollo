import { Request, RequestHandler, Response } from 'express';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/UserModel';
import { sendErrorResponse } from '../utils/errorResponse';
import { sendSuccessResponse } from '../utils/successResponse';
import { authService } from '../services/authService';
import { AuthControllerInterface, AuthRequest, LoginAndRegisterResponse } from '../types/authType';

export default class AuthController implements AuthControllerInterface {
  register: RequestHandler = async (
    req: Request & { body: AuthRequest },
    res: Response,
  ): Promise<void> => {
    try {
      const { email, password, companyName }: AuthRequest = req.body as AuthRequest;

      const isUser = await UserModel.findOne({ email });
      if (isUser) return sendErrorResponse(res, 1003);

      const isCompany = await UserModel.findOne({ companyName });
      if (isCompany) return sendErrorResponse(res, 1004);

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new UserModel({ email, password: hashedPassword, companyName });

      await user.save();

      const token = authService.generateToken(user);
      if (!token) return sendErrorResponse(res, 2001);

      const loginResponse: LoginAndRegisterResponse = { token };
      return sendSuccessResponse(res, 1000, loginResponse);
    } catch (error) {
      // Log detailed error information for debugging
      console.error(error);
      return sendErrorResponse(res, 5000);
    }
  };

  login: RequestHandler = async (
    req: Request & { body: AuthRequest },
    res: Response,
  ): Promise<void> => {
    try {
      const { email, password }: AuthRequest = req.body as AuthRequest;

      const user = await UserModel.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return sendErrorResponse(res, 1002);
      }

      const token = authService.generateToken(user);
      if (!token) return sendErrorResponse(res, 2001);

      const loginResponse: LoginAndRegisterResponse = { token };
      return sendSuccessResponse(res, 1001, loginResponse);
    } catch (error) {
      // Log detailed error information for debugging
      console.error(error);
      return sendErrorResponse(res, 5000);
    }
  };

  logout: RequestHandler = (_req: Request, res: Response): void => {
    try {
      return sendSuccessResponse(res, 1002);
    } catch (error) {
      // Log detailed error information for debugging
      console.error(error);
      return sendErrorResponse(res, 5000);
    }
  };
}
