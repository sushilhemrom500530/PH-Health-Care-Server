import config from "../../../config";
import axios from 'axios';

const initPayment = async(initPaymentData:any)=>{
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

const validatePayment = async()=>{

}

export const sslService = {
    initPayment
}