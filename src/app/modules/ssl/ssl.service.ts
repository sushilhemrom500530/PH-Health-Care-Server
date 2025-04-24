import { TSSL } from './ssl.interface';
import config from "../../../config";
import axios from 'axios';

const initPayment = async(initPaymentData:TSSL)=>{
   try {
    const data = {
        store_id:config.ssl.store_id,
        store_passwd:config.ssl.store_passwd,
        total_amount: initPaymentData.amount,
        currency: 'BDT',
        tran_id: initPaymentData.transactionId, // use unique tran_id for each api call
        success_url:config.ssl.success_url,
        fail_url: config.ssl.fail_url,
        cancel_url: config.ssl.cancel_url,
        ipn_url: 'http://localhost:3030/ipn',
        shipping_method: 'N/A',
        product_name: 'Appointment.',
        product_category: 'Service',
        product_profile: 'general',
        cus_name: initPaymentData.name || 'Sushil Hemrom',
        cus_email: initPaymentData.email || 'sushilhemrom@gmail.com',
        cus_add1:  initPaymentData.address ||'Dhaka',
        cus_add2: 'N/A',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone:  initPaymentData.phoneNumber || '01711111111',
        cus_fax: '01711111111',
        ship_name: 'N/A',
        ship_add1: 'N/A',
        ship_add2: 'N/A',
        ship_city: 'N/A',
        ship_state: 'N/A',
        ship_postcode: 1000,
        ship_country: 'N/A',
    };
    
    const response = await axios({
        method:'post',
        url:config.ssl.ssl_payment_api,
        data:data,
        headers:{'Content-Type':'application/x-www-form-urlencoded'}
    })
    
    // console.log("response:", response.data)
    // console.log({initPaymentData})

    return response.data;


   } catch (error) {
    return {
        status:404,
        success:false,
        message:"Something want wrong!",
        data:error
    }
   }
}

const validatePayment = async(payload:any)=>{
    try {
        // amount=1150.00&bank_tran_id=151114130739MqCBNx5&card_brand=VISA&card_issuer=BRAC+BANK%2C+LTD.&card_issuer_country=Bangladesh&card_issuer_country_code=BD&card_no=432149XXXXXX0667&card_type=VISA-Brac+bank¤cy=BDT&status=VALID&store_amount=1104.00&store_id=nextd68084fc0c73cd&tran_date=2015-11-14+13%3A07%3A12&tran_id=5646dd9d4b484&val_id=151114130742Bj94IBUk4uE5GRj&verify_sign=9a3950ab99a4e0d2d4879ba4514e1dd4&verify_key=amount%2Cbank_tran_id%2Ccard_brand%2Ccard_issuer%2Ccard_issuer_country%2Ccard_issuer_country_code%2Ccard_no%2Ccard_type%2Ccurrency%2Cstatus%2Cstore_amount%2Cstore_id%2Ctran_date%2Ctran_id%2Cval_id

    const response = await axios({
        method:'GET',
        url:`${config.ssl.ssl_validation_api}?val_id=${payload.val_id}&store_id=${config.ssl.store_id}&store_passwd=${config.ssl.store_passwd}&format=json`
    });
    return response.data;

    } catch (error) {
        throw new Error("Payment Validation Failed!")
        
    }
}

export const sslService = {
    initPayment,
    validatePayment
}