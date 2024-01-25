import express, { Router } from "express"
import { authenticate } from "../middleware/authMiddleware"
import ConsumptionController from "../controllers/consumptionController"

const indexRouter: Router = express.Router()

indexRouter.get("/", authenticate, ConsumptionController.index)

export default indexRouter
