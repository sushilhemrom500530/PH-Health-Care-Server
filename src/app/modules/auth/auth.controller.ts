import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { authService } from "./auth.service";
import sendResponse from "../../../shared/sentResponse";
import status from "http-status";


const loginUser = catchAsync(async (req: Request, res: Response) => {
    const result = await authService.loginUser(req.body);
    const { refreshToken } = result;

    await res.cookie("refreshToken", refreshToken, {
        secure: false,
        httpOnly: true
    })

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "User logged in successfully",
        data: {
            refreshToken,
            needPasswordChange: result.needPasswordChange
        }
    })
})


const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    // console.log({ refreshToken })
    const result = await authService.refreshToken(refreshToken);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "User logged in successfully",
        data: result
        // data: {
        //     refreshToken,
        //     needPasswordChange: result.needPasswordChange
        // }
    })
})

export const authController = {
    loginUser,
    refreshToken,
}