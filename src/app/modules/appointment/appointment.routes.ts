import express from "express";
import { appointmentController } from "./appointment.controller";

const router = express.Router();

router.post(
    '/create',
    appointmentController.insertIntoDB
)


export const appointmentRouters = router;