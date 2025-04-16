import { Request, Response } from "express";
import { adminService } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterAbleFields, adminPaginationAndSort } from "./admin.constant";
import sendResponse from "../../../shared/sentResponse";
import status from "http-status";
import catchAsync from "../../../shared/catchAsync";




const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = await pick(req.query, adminFilterAbleFields)
    const options = await pick(req.query, adminPaginationAndSort)
    // console.log({ options })
    const result = await adminService.getAllFromDB(filters, options);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Admin rettrive successfully",
        meta: result.meta,
        data: result.data
    })
})



const getSingleDataById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminService.getSingleDataById(id);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Admin fetched successfully",
        data: result
    })
})

const updateAdmin = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    const result = await adminService.updateAdmin(id, updateData);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Admin updated successfully",
        data: result
    })
})

const deletedAdmin = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminService.deletedAdmin(id);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Admin deleted successfully",
        data: result
    })
})

const softDeletedAdmin = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminService.softDeletedAdmin(id);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Admin deleted successfully",
        data: result
    })
})


export const adminController = {
    getAllFromDB,
    getSingleDataById,
    updateAdmin,
    deletedAdmin,
    softDeletedAdmin
}