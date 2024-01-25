import { Request, Response } from "express"

export declare class IndexControllerInterface {
    static create(req: Request & { body: IndexRequest }, res: Response): Promise<void>
    static delete(req: Request & { body: IndexRequest }, res: Response): Promise<void>
}

export interface IndexRequest {
    indexValue?: number
    date: string
}

export const IndexCreateRequestBody: IndexRequest = {
    indexValue: 0,
    date: "string"
}

export const IndexDeleteRequestBody: IndexRequest = {
    date: "string"
}
