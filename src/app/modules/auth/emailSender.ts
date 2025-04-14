import nodemailer from "nodemailer";
import config from "../../../config";

const emailSender = async (
    email: string,
    html: string
) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: config.email_sender.email,
            pass: config.email_sender.password,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const info = await transporter.sendMail({
        from: '"PH Health Care "<sushil500530@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Reset Password", // Subject line
        html, // html body
    });

    console.log("Message sent: %s", info.messageId);
}

export default emailSender;