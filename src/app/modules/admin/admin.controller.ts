import { Request, Response } from "express";
import { adminService } from "./admin.service";

const getAllFromDB = async (req: Request, res: Response) => {
    try {
        const result = await adminService.getAllFromDB(req.query);
        res.status(200).json({
            success: true,
            message: "Admin retrive successfully",
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
    getAllFromDB
}