import { NextFunction, Request, RequestHandler, Response } from 'express';
import { UserInterface, UserModel } from '../models/UserModel';
import { sendErrorResponse } from '../utils/errorResponse';
import { authService } from '../services/authService';

declare module 'express' {
  interface Request {
    user?: UserInterface;
  }
}

export default class AuthMiddleware {
  authenticate: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const token: string | undefined = req.header('Authorization');
    if (!token) {
      return sendErrorResponse(res, 2000);
    }

    try {
      const isUser: false | UserInterface = authService.verifyToken(token);
      if (isUser === false) {
        return sendErrorResponse(res, 2001);
      }

      const user = await UserModel.findOne({ email: isUser.email });
      if (!user) {
        return sendErrorResponse(res, 2001);
      }

      req.user = user;
      next();
    } catch (error) {
      return sendErrorResponse(res, 2000);
    }
  };
}
