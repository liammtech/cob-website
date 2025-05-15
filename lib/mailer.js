const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.eu',
    port: 465,
    secure: true,
    auth: {
        user: process.env.ZOHO_USER,
        pass: process.env.ZOHO_PASS,
    },
});

async function sendContactEmail({ name, email, message }) {
    const mailOptions = {
        from: `"${name}" <${process.env.ZOHO_USER}>`,
        to: process.env.ZOHO_USER,
        subject: `New Contact Form Submission from ${name}`,
        text: `From: ${name}\nEmail: ${email}\n\n${message}`
    };

    return transporter.sendMail(mailOptions);
}

module.exports = { sendContactEmail };