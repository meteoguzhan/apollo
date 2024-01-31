import { NextFunction, Request, RequestHandler, Response } from 'express';
import { UserInterface, UserModel } from '../models/UserModel';
import { sendErrorResponse } from '../utils/errorResponse';
import { authService } from '../services/authService';

declare module 'express' {
  interface Request {
    user?: UserInterface;
  }
}

enum StatusCode {
  MissingToken = 2000,
  InvalidToken = 2001,
}

export default class AuthMiddleware {
  authenticate: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const token: string | undefined = req.header('Authorization');
    if (!token) {
      return sendErrorResponse(res, StatusCode.MissingToken);
    }

    try {
      const isUser = authService.verifyToken(token);
      if (!isUser) {
        return sendErrorResponse(res, StatusCode.InvalidToken);
      }

      const user = await UserModel.findOne({ email: isUser.email });
      if (!user) {
        return sendErrorResponse(res, StatusCode.InvalidToken);
      }

      req.user = user;
      next();
    } catch (error) {
      // Log detailed error information for debugging
      console.error(error);
      return sendErrorResponse(res, StatusCode.MissingToken);
    }
  };
}
