import express, { NextFunction, Request, Response } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { specialitiesController } from "./specialities.controller";
import { fileUploader } from "../../../helpers/fileUploader";
import { specialitiesValidation } from "./specialities.validation";

const router = express.Router();

router.get('/',
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = specialitiesValidation.create.parse(JSON.parse(req.body.data))
        return specialitiesController.insertIntoDB(req, res)
    },
);




export const specialities = router;