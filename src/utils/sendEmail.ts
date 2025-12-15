import nodemailer from "nodemailer";
import "dotenv/config";

const {UKR_NET_PASSWORD, UKR_NET_FROM} = process.env

//nodemailer is a lib and a config object has to be created
const nodemailerConfig = {
    host: "smtp.ukr.net",
    port: 465,
    secure: true,
    auth: {
        user: UKR_NET_FROM,
        pass: UKR_NET_PASSWORD
    }
}

const transporter = nodemailer.createTransport(nodemailerConfig);

//email is just an object
const email = {
    to: "sashasavenko3@gmail.com",
    from: UKR_NET_FROM,
    subject: "Test email from SSavenko Co.",
    html: "<h1>Test email</h1>"
}

//method .sendMail has to be called on transporter and it will return Promise, the same could be done in a function
transporter.sendMail(email).then(() => console.log("Email send successfully")).catch(error => console.log(error.message))

interface SendEmailProps {
    to: string,
    subject: string,
    html: string
}
export const sendEmail = (data: SendEmailProps) => {
    const email = {...data, from: UKR_NET_FROM};
    return transporter.sendMail(email).then(() => console.log("Email send successfully")).catch(error => console.log(error.message))
}
