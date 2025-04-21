import express, { NextFunction, Request, Response } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { doctorScheduleController } from "./doctor-schedule.controller";

const router = express.Router();

router.get(
    '/my-schedule',
    auth(UserRole.DOCTOR),
    doctorScheduleController.getMySchedule
);
router.post(
    '/create',
    auth(UserRole.DOCTOR),
    doctorScheduleController.insertIntoDB
);
router.delete(
    '/:id',
    auth(UserRole.DOCTOR),
    doctorScheduleController.deleteFromDB
);



export const doctorScheduleRoute = router;