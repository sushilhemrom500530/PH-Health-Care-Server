import { Request, Response } from "express";
import sendResponse from "../../../shared/sentResponse";
import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import { doctorScheduleService } from "./doctor-schedule.service";
import { TTokenUser } from "../../interfaces";
import pick from "../../../shared/pick";
import { doctorScheduleFilters, doctorScheduleOptionFilters } from "./doctor.schedule.constant";

const getMySchedule = catchAsync(async (req: Request & { user?: TTokenUser }, res: Response) => {
    const filters = pick(req.query, doctorScheduleFilters);
    const options = pick(req.query, doctorScheduleOptionFilters);
    const user = req.user;
    const result = await doctorScheduleService.getMySchedule(filters, options, user as TTokenUser)
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "My Schedule rettrive successfully",
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
const deleteFromDB = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const { id } = req.params;
    const result = await doctorScheduleService.deleteFromDB(user as TTokenUser, id)
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "My Schedule deleted successfully",
        data: result
    })
});

export const doctorScheduleController = {
    getMySchedule,
    insertIntoDB,
    deleteFromDB
}