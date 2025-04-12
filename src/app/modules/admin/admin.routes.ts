import express from "express";
import { adminController } from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";
import { adminValidationSchema } from "./admin.validation.schema";

const router = express.Router();



router.get("/", adminController.getAllFromDB);
router.get("/:id", adminController.getSingleDataById);
router.patch("/:id", validateRequest(adminValidationSchema.update), adminController.updateAdmin);
router.delete("/:id", adminController.deletedAdmin);
router.delete("/soft/:id", adminController.softDeletedAdmin);


export const adminRoutes = router;