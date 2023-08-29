require('dotenv').config();
const nodemailer = require('nodemailer');

const AD_HOST = process.env.ALWAYSDATA_EMAIL_HOST;
const AD_USER = process.env.ALWAYSDATA_EMAIL_USER;
const AD_PASS = process.env.ALWAYSDATA_EMAIL_PASS;

const createTrans = () => {
    const transporter = nodemailer.createTransport({
        host: AD_HOST,
        auth: {
            user: AD_USER,
            pass: AD_PASS
        }
    });

    return transporter;
}

const sendMail = async (mailOptions, attachment, attachmentName) => {
    const transporter = createTrans();
    const info = await transporter.sendMail({
        from: '"TIENDA DE PRUEBA" <test@test.com>', // sender address
        to: mailOptions.to, // list of receivers
        subject: mailOptions.subject, // Subject line
        text: mailOptions.text, // plain text body
        html: mailOptions.html, // html body
        attachments: [
            {
                content: attachment,
                filename: attachmentName,
            }
        ]
    });

    return info.messageId;
}

module.exports = sendMail;