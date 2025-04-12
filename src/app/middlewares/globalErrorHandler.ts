import { NextFunction, Request, Response } from "express";
import status from "http-status";



const globalErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error?.name || "Something went wrong!",
        data: error
    })
}

export default globalErrorHandler;