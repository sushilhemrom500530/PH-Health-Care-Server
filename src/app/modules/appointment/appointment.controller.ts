import { Request, Response } from "express";
import sendResponse from "../../../shared/sentResponse";
import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import { TTokenUser } from "../../interfaces";
import { appointmentService } from "./appointment.services";
import pick from "../../../shared/pick";
import { appointmentFilters, appointmentOptions } from "./appointment.constant";

const getAllFromDB = catchAsync(async (req: Request & { user?: TTokenUser }, res: Response) => {

    const result = await appointmentService.getAllFromDB
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Schedule rettrive successfully",
        data: result
    })
});
const insertIntoDB = catchAsync(async (req: Request & { user?: TTokenUser }, res: Response) => {
    const user = req.user;
    // console.log({ user })
    const result = await appointmentService.insertIntoDB(user as TTokenUser, req.body)
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Appointment Booked successfully",
        data: result
    })
});

const myAppointment = catchAsync(async (req: Request & { user?: TTokenUser }, res: Response) => {
    const user = req.user;
    const filters = pick(req.query, appointmentFilters);
    const options = pick(req.query, appointmentOptions)
    const result = await appointmentService.getMyAppointment(user as TTokenUser, filters, options)
    console.log({ result })
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "My Appointment rettrive successfully",
        data: result
    })
})
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
    const result = await appointmentService
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Schedule deleted successfully",
        data: result
    })
})

export const appointmentController = {
    getAllFromDB,
    myAppointment,
    insertIntoDB,
    getSingleFromDB,
    deleteFromDB
}