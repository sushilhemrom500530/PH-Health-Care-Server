import express from "express";
import { appointmentController } from "./appointment.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
    '/create',
    auth(UserRole.PATIENT),
    // apply jod validation here (HOME WORK)
    appointmentController.insertIntoDB
);

router.get(
    '/my-appointment',
    auth(UserRole.DOCTOR, UserRole.PATIENT),
    appointmentController.myAppointment
);

router.get(
    '/',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    appointmentController.getAllFromDB
);
router.patch(
    '/status/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN,UserRole.DOCTOR),
    appointmentController.changeAppointmentStatus
);


export const appointmentRouters = router;