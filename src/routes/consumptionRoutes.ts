import express, { Router } from 'express';
import AuthMiddleware from '../middleware/authMiddleware';
import ConsumptionController from '../controllers/consumptionController';

export function useConsumptionRouter() {
  const consumptionRouter: Router = express.Router();
  const authMiddleware: AuthMiddleware = new AuthMiddleware();
  const consumptionController: ConsumptionController = new ConsumptionController();

  consumptionRouter.get('/', [authMiddleware.authenticate], consumptionController.index);

  return consumptionRouter;
}
