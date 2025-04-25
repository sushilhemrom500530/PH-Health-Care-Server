import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { reviewController } from './review.controller';
import { metaController } from './meta.controller';

const router = express.Router();

router.get(
    '/',
    auth(UserRole.SUPER_ADMIN,UserRole.ADMIN,UserRole.DOCTOR,UserRole.PATIENT),
    metaController.fetchDashboardMetaData
)



export const metaRoutes = router;