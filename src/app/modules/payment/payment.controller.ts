import { status } from 'http-status';
import { paymentService } from './payment.service';
import catchAsync from "../../../shared/catchAsync";
import { Response ,Request} from 'express';
import sendResponse from './../../../shared/sentResponse';


const initiatePayment =catchAsync(async (req: Request, res: Response) => {
    const {appointmentId}  = req.params;
    const result = await paymentService.initiatePayment(appointmentId);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Payment initiate successfully",
        data: result
    })
});

const validatePayment = catchAsync(async (req: Request, res: Response) => {
    const result = await paymentService.validatePayment(req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Payment Validate successfully",
        data: result
    })
});

export const paymentController = {
    initiatePayment,
    validatePayment
}