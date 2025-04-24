import { Request, Response } from "express";
import sendResponse from "../../../shared/sentResponse";
import status from "http-status";
import { TTokenUser } from "../../interfaces";
import pick from "../../../shared/pick";
import { appointmentFilters, appointmentOptions } from "./appointment.constant";
import catchAsync from './../../../shared/catchAsync';
import { reviewService } from './review.service';


const getAllFromDB = catchAsync(async (req: Request , res: Response) => {
   
    const result = await reviewService.getAllFromDB()
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "review created successfully",
        data: result
    })
});

const insertIntoDB = catchAsync(async (req: Request , res: Response) => {
    const user = req.user;
    const result = await reviewService.insertIntoDB(user as TTokenUser, req.body)
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "review created successfully",
        data: result
    })
});


export const reviewController = {
    getAllFromDB,
    insertIntoDB,

}