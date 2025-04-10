import { Request, Response } from "express";
import { adminService } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterAbleFields, adminPaginationAndSort } from "./admin.constant";




const getAllFromDB = async (req: Request, res: Response) => {
    try {
        const filters = await pick(req.query, adminFilterAbleFields)
        const options = await pick(req.query, adminPaginationAndSort)
        // console.log({ options })
        const result = await adminService.getAllFromDB(filters, options);
        res.status(200).json({
            success: true,
            message: "Admin retrive successfully",
            meta: result.meta,
            data: result.data
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error?.name || "Something went wrong!",
            data: error
        })
    }
}



const getSingleDataById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await adminService.getSingleDataById(id);
        res.status(200).json({
            success: true,
            message: "Admin fetched successfully",
            data: result
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error?.name || "Something went wrong!",
            data: error
        })
    }
}

const updateAdmin = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
        const result = await adminService.updateAdmin(id, updateData);
        res.status(200).json({
            success: true,
            message: "Admin updated successfully",
            data: result
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error?.name || "Something went wrong!",
            data: error
        })
    }
}


const deletedAdmin = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await adminService.deletedAdmin(id);
        res.status(200).json({
            success: true,
            message: "Admin deleted successfully",
            data: result
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error?.name || "Something went wrong!",
            data: error
        })
    }
}
const softDeletedAdmin = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await adminService.softDeletedAdmin(id);
        res.status(200).json({
            success: true,
            message: "Admin deleted successfully",
            data: result
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error?.name || "Something went wrong!",
            data: error
        })
    }
}


export const adminController = {
    getAllFromDB,
    getSingleDataById,
    updateAdmin,
    deletedAdmin,
    softDeletedAdmin
}