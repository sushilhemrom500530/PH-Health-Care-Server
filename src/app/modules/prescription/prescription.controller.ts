import { Request, Response } from "express";
import sendResponse from "../../../shared/sentResponse";
import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import { TTokenUser } from "../../interfaces";
import { prescriptionService } from "./prescription.service";
import pick from "../../../shared/pick";
import { appointmentFilters, appointmentOptions } from "./appointment.constant";

const getAllFromDB = catchAsync(async (req: Request & { user?: TTokenUser }, res: Response) => {
    // home work 
    const result = await prescriptionService.getAllFromDB
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Schedule rettrive successfully",
        data: result
    })
});
const insertIntoDB = catchAsync(async (req: Request & { user?: TTokenUser }, res: Response) => {
    const user = req.user;
    const result = await prescriptionService.insertIntoDB(user as TTokenUser,req.body)
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Prescription created successfully",
        data: result
    })
});



export const prescriptionController = {
    getAllFromDB,
    insertIntoDB,
}