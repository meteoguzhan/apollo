import express, { Router } from "express"
import IndexController from "../controllers/indexController"
import { authenticate } from "../middleware/authMiddleware"

const indexRouter: Router = express.Router()

indexRouter.post("/", authenticate, IndexController.create)
indexRouter.delete("/", authenticate, IndexController.delete)

export default indexRouter
