import express from "express";
import { prescriptionController } from "./prescription.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
    '/',
    prescriptionController.getAllFromDB
);
router.post(
    '/',
    auth(UserRole.DOCTOR),
    prescriptionController.insertIntoDB
);



export const prescriptionRouters = router;