import { Request, Response } from "express";
import { adminService } from "./admin.service";
import pick from "../../../shared/pick";




const getAllFromDB = async (req: Request, res: Response) => {
    try {
        const filters = await pick(req.query, ['name', 'email', 'searchTerm', 'contactNumber'])
        const result = await adminService.getAllFromDB(filters);
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