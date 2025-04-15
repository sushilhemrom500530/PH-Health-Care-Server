import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpers/fileUploader";
import { userValidation } from "./userValidation";

const router = express.Router();


router.post("/",
    fileUploader.upload.single('file'),
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data))
        return userController.createAdmin(req, res)
    }

)


export const userRoutes = router;