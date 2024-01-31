import express, { Router } from 'express';
import IndexController from '../controllers/indexController';
import AuthMiddleware from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { validateCreateIndex, validateDeleteIndex } from '../types/indexType';

export function useIndexRouter() {
  const indexRouter: Router = express.Router();
  const authMiddleware: AuthMiddleware = new AuthMiddleware();
  const indexController: IndexController = new IndexController();

  indexRouter.post(
    '/',
    [authMiddleware.authenticate, validate(validateCreateIndex)],
    indexController.create,
  );
  indexRouter.delete(
    '/',
    [authMiddleware.authenticate, validate(validateDeleteIndex)],
    indexController.delete,
  );

  return indexRouter;
}
