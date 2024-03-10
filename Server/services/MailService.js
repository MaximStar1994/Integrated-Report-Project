const config = require('../config/config')
var nodemailer = require("nodemailer");
"use strict";
class MailService {
    constructor () {
        this.transporter = nodemailer.createTransport({
            host: "relay.keppelgroup.com",
            port: 25,
            secure: false, // upgrade later with STARTTLS
            auth: {
              user: config.SMTPEmail,
              pass: config.SMTPPW
            }
        });
    }
    /*
    attachments : [{  
        filename: 'text3.txt',
        path: '/path/to/file.txt' 
    }]
    */
    SendMail(recipients, subject, text, attachments,callback) {
        this.transporter.sendMail({
            from: config.SMTPEmail, 
            to: recipients.join(','),
            subject: subject,
            text: text, 
            // html: "<b>Hello world?</b>", // html body
            attachments : attachments
        }).then(info => {
            callback(info,null)
        }).catch(err => {
            callback(null,err)
        });
    }
}
module.exports = MailService;

