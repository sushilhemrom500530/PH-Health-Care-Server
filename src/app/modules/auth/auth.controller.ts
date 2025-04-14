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
        message: "Refresh token generated successfully",
        data: result
        // data: {
        //     refreshToken,
        //     needPasswordChange: result.needPasswordChange
        // }
    })
})
const changePassword = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;

    const result = await authService.changePassword(user, req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Password change successfully",
        data: result
    })
})
const forgotPassword = catchAsync(async (req: Request, res: Response) => {

    await authService.forgotPassword(req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Check your email and forgot password!",
        data: null
    })
})

const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const token = req.headers.authorization || "";

    await authService.resetPassword(token, req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Password reset successfully",
        data: null
    })
})

export const authController = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword,
}