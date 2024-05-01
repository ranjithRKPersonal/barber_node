const config = require('../../config/env.json');
const sgMail = require('@sendgrid/mail');
const handlebars = require('handlebars');
const fs = require('fs');
let { template } = require('handlebars');
const  tenantRegisterWelcomeTemplate = fs.readFileSync("src/emailTemplate/tenantRegisterWelcomeTemplate.html","utf8");

sgMail.setApiKey(config.MAIL_API);

const  tenantRegisterSuccessMail = async(reciver, sender, subject, content, details)=> {
    try {
        let templateView = "";
        let replacements = {};
        if(content == "tenantRegisterWelcome"){
            template = handlebars.compile(tenantRegisterWelcomeTemplate);
            if(details){
                replacements = {
                    subject: subject,
                    tenantName: details.tenantName,
                    workspaceName: details.workspaceName,
                    userEmail: details.userEmail,
                    verificationToken: details.verificationToken
                };
            }
        } 
        templateView = template(replacements);
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


module.exports = { tenantRegisterSuccessMail };