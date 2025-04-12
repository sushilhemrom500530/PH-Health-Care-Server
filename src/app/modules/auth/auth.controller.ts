import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { authService } from "./auth.service";
import sendResponse from "../../../shared/sentResponse";
import status from "http-status";


const loginUser = catchAsync(async (req: Request, res: Response) => {
    const result = await authService.loginUser();

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "User logged in successfully",
        data: result
    })
})

export const authController = {
    loginUser,

}