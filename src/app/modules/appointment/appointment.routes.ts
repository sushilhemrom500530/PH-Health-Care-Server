import express from "express";
import { appointmentController } from "./appointment.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
    '/create',
    auth(UserRole.PATIENT),
    appointmentController.insertIntoDB
)
router.get(
    '/my-appointment',
    auth(UserRole.PATIENT),
    appointmentController.myAppointment
)


export const appointmentRouters = router;