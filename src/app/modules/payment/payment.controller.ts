import { status } from 'http-status';
import { paymentService } from './payment.service';
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sentResponse";


const initiatePayment =catchAsync(async (req: Request, res: Response) => {
    const result = await paymentService.initiatePayment();
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Payment initiate successfully",
        data: result
    })
});

export const paymentController = {
    initiatePayment,
}