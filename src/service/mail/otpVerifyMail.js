const config = require('../../config/env.json');
const sgMail = require('@sendgrid/mail');
const handlebars = require('handlebars');
const fs = require('fs');
let { template } = require('handlebars');
const otpVerificationRegisterTemplate = fs.readFileSync("src/emailTemplate/OtpVerifyTemplate.html","utf8");
const otpVerificationForgotPasswordTemplate = fs.readFileSync("src/emailTemplate/forgotPasswordOtpVerifyTemplate.html","utf8");

sgMail.setApiKey(config.MAIL_API);

const  otpMailSender = (reciver, sender, subject, content, details)=> {
    console.log("trigger",details);
    let templateView = "";
    let replacements = {};
    if(content == "otpVerifyRegister"){
        template = handlebars.compile(otpVerificationRegisterTemplate);
        if(details){
            replacements = {
                subject: subject,
                otp: details
            };
        }
    } 
    if(content == "otpVerifyForgotPassword") {
       template = handlebars.compile(otpVerificationForgotPasswordTemplate);
       if(details){
        replacements = {
            subject: subject,
            otp: details
        };
    }
    }
    templateView = template(replacements);
    try {
        let data = {
             to : reciver,
             from : sender,
             subject : subject ,
             html : templateView
        }
        return sgMail.send(data);
    }
    catch(err) {
        console.log(err,"enoknlor");
        return new Error(err);
    }
}


module.exports = { otpMailSender };