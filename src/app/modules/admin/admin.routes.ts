import express from "express";
import { adminController } from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";
import { adminValidationSchema } from "./admin.validation.schema";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();



router.get(
    "/",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    adminController.getAllFromDB
);

router.get(
    "/:id",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    adminController.getSingleDataById
);

router.patch(
    "/:id",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    validateRequest(adminValidationSchema.update),
    adminController.updateAdmin
);

router.delete(
    "/:id",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    adminController.deletedAdmin
);

router.delete(
    "/soft/:id",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    adminController.softDeletedAdmin
);


export const adminRoutes = router;