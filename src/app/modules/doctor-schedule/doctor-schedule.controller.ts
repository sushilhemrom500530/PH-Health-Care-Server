import { Request, Response } from "express";
import sendResponse from "../../../shared/sentResponse";
import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import { doctorScheduleService } from "./doctor-schedule.service";

const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
    const result = await doctorScheduleService.getAllFromDB()
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Doctor Schedule rettrive successfully",
        data: result
    })
});
const insertIntoDB = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    // console.log({ user })
    const result = await doctorScheduleService.insertIntoDB(user, req.body)
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Doctor Schedule created successfully",
        data: result
    })
});

export const doctorScheduleController = {
    getAllFromDb,
    insertIntoDB,
}