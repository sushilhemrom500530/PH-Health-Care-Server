import express, { Request, Response } from "express";
import { adminController } from "./admin.controller";

const router = express.Router();

router.get("/", adminController.getAllFromDB);
router.get("/:id", adminController.getSingleDataById)
router.patch("/:id", adminController.updateAdmin)


export const adminRoutes = router;