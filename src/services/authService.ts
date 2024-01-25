import { UserModel } from "../models/UserModel"
import process from "process"
import jwt from "jsonwebtoken"

class AuthService {
    static async verifyToken(token: string): Promise<UserModel | false> {
        try {
            if (!process.env.PRIVATE_KEY) return false
            return jwt.verify(token, process.env.PRIVATE_KEY) as UserModel
        } catch (error) {
            return false
        }
    }

    static async generateToken(user: UserModel): Promise<string | false> {
        try {
            if (!process.env.PRIVATE_KEY) return false
            return jwt.sign({ id: user.id, email: user.email }, process.env.PRIVATE_KEY, { expiresIn: "24h" })
        } catch (error) {
            return false
        }
    }
}

export default AuthService
