import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import { adminController } from "./admin.controller";

const router = express.Router();

const prisma = new PrismaClient();

router.get("/", adminController.getAllFromDB)


export const adminRoutes = router;