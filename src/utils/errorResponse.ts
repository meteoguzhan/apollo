import { Response } from "express"

export interface ErrorResponse {
    code: number
    message: string
}

export const sendErrorResponse = (res: Response, errorCode: number): void => {
    const message: string = getErrorMessage(errorCode)
    const httpStatusCode: number = getHttpStatus(errorCode)

    res.status(httpStatusCode).json({ code: errorCode, message } as ErrorResponse)
}

const getHttpStatus = (errorCode: number): number => {
    if (errorCode >= 1000 && errorCode <= 1999) {
        return 400 // Bad Request
    } else if (errorCode >= 2000 && errorCode <= 2999) {
        return 401 // Unauthorized
    }

    return 500
}

const getErrorMessage = (errorCode: number): string => {
    const errorMessages: { [key: number]: string } = {
        1000: "Email, password, and company name are required!",
        1001: "Email and password are required!",
        1002: "Invalid email or password!",
        1003: "E-mail address is used, please enter a different e-mail address!",
        1004: "Company name is used, please enter a different company name!",
        1005: "Adding index failed!",
        1006: "Deleting index failed!",
        1007: "Consumption could not be calculated!",
        1008: "Invalid email, password or company name!",
        1009: "Invalid value or date!",
        1010: "Invalid date!",
        1011: "Consumption list not found!",
        1012: "Cannot be negative value!",

        // Unauthorized
        2000: "Authentication required",
        2001: "Invalid token",

        // Internal Server Error
        5000: "Internal Server Error"
    }

    return errorMessages[errorCode] || "Internal Server Error"
}
