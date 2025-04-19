import express, { NextFunction, Request, Response } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { patientController } from "./patient.controller";

const router = express.Router();

router.get(
    '/',
    patientController.getAllFromDb
);

router.get(
    '/:id',
    patientController.getByIdFromDB
);

router.patch(
    '/:id',
    patientController.updateIntoDB
)

router.delete(
    '/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    patientController.deleteFromDB
);

router.delete(
    '/soft/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    patientController.softDelete);


export const patientRoutes = router;