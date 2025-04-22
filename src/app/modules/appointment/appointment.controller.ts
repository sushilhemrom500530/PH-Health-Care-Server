import { Request, Response } from "express";
import sendResponse from "../../../shared/sentResponse";
import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import { TTokenUser } from "../../interfaces";
import { appointmentService } from "./appointment.services";

const getAllFromDB = catchAsync(async (req: Request & { user?: TTokenUser }, res: Response) => {

    const result = await appointmentController.getAllFromDB
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Schedule rettrive successfully",
        data: result
    })
});
const insertIntoDB = catchAsync(async (req: Request & { user?: TTokenUser }, res: Response) => {
    const user = req.user;
    console.log({ user })
    const result = await appointmentService.insertIntoDB(user as TTokenUser, req.body)
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Appointment Booked successfully",
        data: result
    })
});

const getSingleFromDB = catchAsync(async (req: Request, res: Response) => {
    const result = await appointmentController.getSingleFromDB
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Schedule rettrive successfully",
        data: result
    })
})
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
    const result = await appointmentController.deleteFromDB
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Schedule deleted successfully",
        data: result
    })
})

export const appointmentController = {
    getAllFromDB,
    insertIntoDB,
    getSingleFromDB,
    deleteFromDB
}