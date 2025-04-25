import { Request, Response } from "express";
import sendResponse from "../../../shared/sentResponse";
import status from "http-status";
import { TTokenUser } from "../../interfaces";
import pick from "../../../shared/pick";
import { appointmentFilters, appointmentOptions } from "./appointment.constant";
import catchAsync from './../../../shared/catchAsync';
import { metaService } from './meta.service';


const fetchDashboardMetaData = catchAsync(async (req: Request &{user?:TTokenUser} , res: Response) => {
    const user = req.user;
    const result = await metaService.dashboardMetaData(user as TTokenUser)
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Meta Data rettrieve successfully",
        data: result
    })
});




export const metaController = {
    fetchDashboardMetaData,
   

}