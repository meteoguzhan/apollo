import express, { Router } from "express"
import AuthController from "../controllers/authController"
import { authenticate } from "../middleware/authMiddleware"

const authRouter: Router = express.Router()

authRouter.post("/register", AuthController.register)
authRouter.post("/login", AuthController.login)
authRouter.post("/logout", authenticate, AuthController.logout)

export default authRouter
