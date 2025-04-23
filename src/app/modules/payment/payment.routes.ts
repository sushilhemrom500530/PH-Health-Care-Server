import express from "express";
import { paymentController } from './payment.controller';

const router = express.Router();

router.post(
    '/init',
    paymentController.initiatePayment
)


export const paymentRoutes = router;