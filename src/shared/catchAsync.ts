import { NextFunction, Request, RequestHandler, Response } from "express";
import { json } from "stream/consumers";


const catchAsync = (fn: RequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next)
        } catch (error: any) {
            return {
                status: false,
                message: error.message || "Something went wrong!",
                error
            }
        }
    }
}

export default catchAsync;