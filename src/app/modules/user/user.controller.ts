import { Request, Response } from "express";
import { userService } from "./user.service";


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
}

export const userController = {
    createAdmin
}