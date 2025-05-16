import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.eu',
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_USER,
    pass: process.env.ZOHO_PASS,
  },
});

/**
 * Sends an email to your studio inbox
 * @param {{ name: string, email: string, message: string }}
 */
export async function sendContactEmail({ name, email, message }) {
  const mailOptions = {
    from: `"${name}" <${process.env.ZOHO_USER}>`,
    to: process.env.ZOHO_USER,
    subject: `New Contact Form Submission from ${name}`,
    text: `From: ${name}\nEmail: ${email}\n\n${message}`,
  };

  return transporter.sendMail(mailOptions);
}

/**
 * Sends a simple auto-reply to the user
 * @param {string} userEmail
 */
export async function sendContactAutoReply(userEmail) {
  return transporter.sendMail({
    from: '"Notorious C.O.B." <info@notoriouscob.art>',
    to: userEmail,
    subject: 'Thanks for getting in touch with Notorious C.O.B.',
    text: `Hi,

Thanks for reaching out via the website — your message has been received safely.

I'll be in touch soon, but in the meantime, thanks again for your interest and support.

All the best,  
Notorious C.O.B.`,
  });
}
