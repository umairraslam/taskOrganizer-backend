const nodemailer = require('nodemailer');

module.exports = {
    async sendEmail(receiver, subject, text, html) {
        let transporter = nodemailer.createTransport({
            service: process.env.email_service,
            auth: {
                user: process.env.support_email,
                pass: process.env.support_email_password
            }
        });

        var mailOptions = {
            from: process.env.support_email,
            to: receiver,
            subject: subject,
            text: text,
            html: html
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}