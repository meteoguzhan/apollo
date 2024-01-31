import express, { Router } from 'express';
import AuthController from '../controllers/authController';
import AuthMiddleware from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { validateAuthLogin, validateAuthRegister } from '../types/authType';

export function useAuthRouter() {
  const authRouter: Router = express.Router();
  const authMiddleware: AuthMiddleware = new AuthMiddleware();
  const authController: AuthController = new AuthController();

  authRouter.post('/register', [validate(validateAuthRegister)], authController.register);
  authRouter.post('/login', [validate(validateAuthLogin)], authController.login);
  authRouter.post('/logout', authMiddleware.authenticate, authController.logout);

  return authRouter;
}
