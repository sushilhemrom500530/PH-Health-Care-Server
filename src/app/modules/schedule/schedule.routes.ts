import express, { NextFunction, Request, Response } from "express";
import { scheduleController } from "./schedule.controller";

const router = express.Router();

router.get(
    '/',
    scheduleController.getAllFromDb
);



export const scheduleRoute = router;