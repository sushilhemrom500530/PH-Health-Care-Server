import { Request, Response } from "express";
import sendResponse from "../../../shared/sentResponse";
import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import { scheduleService } from "./schedule.service";


const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
    const result = await scheduleService.getAllFromDB()
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Schedule rettrive successfully",
        data: result
    })
});

export const scheduleController = {
    getAllFromDb,
}