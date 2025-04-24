import { PaymentStatus } from '@prisma/client';
import axios from "axios";
import config from "../../../config";
import prisma from "../../../shared/prisma";
import { sslService } from './../ssl/ssl.service';

const initiatePayment = async (appointmentId:string) => {
    const paymentData = await prisma.payment.findFirstOrThrow({
        where:{
            appointmentId
        },
        include:{
            appointment:{
                include:{
                    patient:true
                }
            }
        }
    });
    // console.log({paymentData})
   

    const initPaymentData = {
        amount: paymentData.amount,
        transactionId: paymentData.transactionId,
        name: paymentData.appointment.patient.name,
        email: paymentData.appointment.patient.email,
        address: paymentData.appointment.patient.address,
        phoneNumber: paymentData.appointment.patient.contactNumber
    }

    const result = await sslService.initPayment(initPaymentData);
    // const result = await SSLService.initPayment(initPaymentData);
    return {
        paymentUrl: result.GatewayPageURL
    };

}

const validatePayment = async(payload:any)=>{
    // use for production 

    if(!payload || !payload.status || (!payload.status === 'VALID')){
        return {
            message:"Invalid Payment!"
        }
    }

    const response = await sslService.validatePayment(payload);

    if(response?.status !== 'VALID'){
            return {
                message:"Payment Failed!"
            }
        }
    // const response = payload;

    await prisma.$transaction(async (tx) => {
        const updatedPaymentData = await tx.payment.update({
            where: {
                transactionId: response.tran_id
            },
            data: {
                status: PaymentStatus.PAID,
                paymentGatewayData: response
            }
        });

        await tx.appointment.update({
            where: {
                id: updatedPaymentData.appointmentId
            },
            data: {
                paymentStatus: PaymentStatus.PAID
            }
        })
    });

    return {
        message:"Payment Success"
    }

   

}



export const paymentService = {
    initiatePayment,
    validatePayment,


}