import { Request, Response } from "express"

export declare class AuthControllerInterface {
    static register(req: Request & { body: AuthRequest }, res: Response): Promise<void>
    static login(req: Request & { body: AuthRequest }, res: Response): Promise<void>
    static logout(req: Request, res: Response): Promise<void>
}

export interface AuthRequest {
    email: string
    password: string
    companyName?: string
}

export const AuthLoginRequestBody: AuthRequest = {
    email: "string",
    password: "string"
}

export const AuthRegisterRequestBody: AuthRequest = {
    email: "string",
    password: "string",
    companyName: "string"
}

export interface LoginAndRegisterResponse {
    token: string
}
