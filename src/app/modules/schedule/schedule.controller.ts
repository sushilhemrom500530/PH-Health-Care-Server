import { Request, Response } from "express";
import sendResponse from "../../../shared/sentResponse";
import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import { scheduleService } from "./schedule.service";
import pick from "../../../shared/pick";
import { scheduleFilters, scheduleOptionFilters } from "./schedule.constant";
import { TTokenUser } from "../../interfaces";

const getAllFromDb = catchAsync(async (req: Request & { user?: TTokenUser }, res: Response) => {
    const filters = pick(req.query, scheduleFilters);
    const options = pick(req.query, scheduleOptionFilters);
    const user = req.user;
    const result = await scheduleService.getAllFromDB(filters, options, user as TTokenUser)
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Schedule rettrive successfully",
        data: result
    })
});
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
    const result = await scheduleService.insertIntoDB(req.body)
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Schedule created successfully",
        data: result
    })
});

const getSingleFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await scheduleService.getSingleFromDB(id)
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Schedule rettrive successfully",
        data: result
    })
})

export const scheduleController = {
    getAllFromDb,
    insertIntoDB,
    getSingleFromDB,
}