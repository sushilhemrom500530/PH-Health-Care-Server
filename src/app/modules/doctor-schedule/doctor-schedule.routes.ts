import express, { NextFunction, Request, Response } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { doctorScheduleController } from "./doctor-schedule.controller";

const router = express.Router();

router.get(
    '/',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    doctorScheduleController.getAllFromDb
);
router.post(
    '/create',
    doctorScheduleController.insertIntoDB
);



export const doctorScheduleRoute = router;