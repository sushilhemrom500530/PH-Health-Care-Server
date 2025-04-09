import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const router = express.Router();

const prisma = new PrismaClient();

router.get("/", async (req: Request, res: Response) => {
    try {
        const result = await prisma.admin.findMany();
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
})


export const adminRoutes = router;