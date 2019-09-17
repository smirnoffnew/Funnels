const nodemailer = require('nodemailer');
const letter = require('./letter.js');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.DEV_EMAIL,
        pass: process.env.DEV_EMAIL_PASSWORD,
    }
});
const getMailoptions = (sender,name,token) => {
    return {
        from: process.env.DEV_EMAIL,
        to: sender,
        subject: 'Reset password',
        html: letter(name,token),
    }
};

module.exports = {
    transporter: transporter,
    getMailoptions: getMailoptions,
};