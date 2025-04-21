import express, { NextFunction, Request, Response } from "express";
import { scheduleController } from "./schedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
    '/',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    scheduleController.getAllFromDb
);
router.post(
    '/create',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    scheduleController.insertIntoDB
);



export const scheduleRoute = router;