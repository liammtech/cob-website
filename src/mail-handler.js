import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).send({ message: 'Missing required fields' });
  }

  // Create reusable transporter object using SMTP
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.eu',
    port: 465,
    secure: true,
    auth: {
      user: 'info@notoriouscob.art',
      pass: process.env.ZOHO_APP_PASSWORD,
    },
  });

  try {
    // Send main email to your studio inbox
    await transporter.sendMail({
      from: '"Portfolio Website" <info@notoriouscob.art>',
      to: 'info@notoriouscob.art',
      subject: `[Website Contact] ${subject}`,
      text: `
New message from the Notorious C.O.B. contact form:

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `,
    });

    // Send auto-reply to user
    await transporter.sendMail({
      from: '"Notorious C.O.B." <info@notoriouscob.art>',
      to: email,
      subject: 'Thanks for getting in touch with Notorious C.O.B.',
      text: `Hi,

Thanks for reaching out via the website — your message has been received safely.

I'll be in touch soon, but in the meantime, thanks again for your interest and support.

All the best,  
Notorious C.O.B.`,
    });

    return res.status(200).send({ message: 'Email sent successfully' });
  } catch (err) {
    console.error('Error sending mail:', err);
    return res.status(500).send({ message: 'Something went wrong' });
  }
}
