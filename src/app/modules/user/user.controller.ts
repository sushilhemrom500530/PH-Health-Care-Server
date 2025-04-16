import { Request, Response } from "express";
import { userService } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sentResponse";
import status from "http-status";
import pick from "../../../shared/pick";
import { userFilterAbleFields, userPaginationAndSort } from "./user.constant";


const createAdmin = async (req: Request, res: Response) => {
    try {
        // console.log(req.body)
        const result = await userService.createAdmin(req);
        res.status(200).json({
            seccess: true,
            messaga: "Admin Created successfully",
            data: result
        })
    } catch (error: any) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error?.name || "Something went wrong!",
            error
        })
    }
};

const createDoctor = async (req: Request, res: Response) => {
    // console.log(req.body)
    try {
        const result = await userService.createDoctor(req);
        res.status(200).json({
            seccess: true,
            messaga: "Doctor Created successfully",
            data: result
        })
    } catch (error: any) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error?.name || "Something went wrong!",
            error
        })
    }
}

const createPatient = async (req: Request, res: Response) => {
    // console.log(req.body)
    try {
        const result = await userService.createPatient(req);
        res.status(200).json({
            seccess: true,
            messaga: "Patient Created successfully",
            data: result
        })
    } catch (error: any) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error?.name || "Something went wrong!",
            error
        })
    }
}


const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = await pick(req.query, userFilterAbleFields)
    const options = await pick(req.query, userPaginationAndSort)
    // console.log({ options })
    const result = await userService.getAllFromDB(filters, options);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "User rettrive successfully",
        meta: result.meta,
        data: result.data
    })
})

export const userController = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllFromDB,

}