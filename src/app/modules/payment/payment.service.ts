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
    if(!payload || !payload.status || (!payload.status === 'VALID')){
        return {
            message:"Invalid Payment!"
        }
    }
    // amount=1150.00&bank_tran_id=151114130739MqCBNx5&card_brand=VISA&card_issuer=BRAC+BANK%2C+LTD.&card_issuer_country=Bangladesh&card_issuer_country_code=BD&card_no=432149XXXXXX0667&card_type=VISA-Brac+bank¤cy=BDT&status=VALID&store_amount=1104.00&store_id=nextd68084fc0c73cd&tran_date=2015-11-14+13%3A07%3A12&tran_id=5646dd9d4b484&val_id=151114130742Bj94IBUk4uE5GRj&verify_sign=9a3950ab99a4e0d2d4879ba4514e1dd4&verify_key=amount%2Cbank_tran_id%2Ccard_brand%2Ccard_issuer%2Ccard_issuer_country%2Ccard_issuer_country_code%2Ccard_no%2Ccard_type%2Ccurrency%2Cstatus%2Cstore_amount%2Cstore_id%2Ctran_date%2Ctran_id%2Cval_id

    const response = await axios({
        method:'GET',
        url:`${config.ssl.ssl_validation_api}?val_id=${payload.val_id}&store_id=${config.ssl.store_id}&store_passwd=${config.ssl.store_passwd}&format=json`
    })
}



export const paymentService = {
    initiatePayment,
    validatePayment,


}