const { sendContactEmail } = require('../lib/mailer');

module.exports = async (req, res) => {
  console.log('Incoming request');
  console.log('Method:', req.method);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;
    console.log('Request body:', body);

    const { name, email, message, honeypot } = body || {};

    if (honeypot) {
      console.warn('Honeypot triggered!');
      return res.status(400).json({ error: 'Spam detected' });
    }

    if (!name || !email || !message) {
      console.warn('Missing fields:', { name, email, message });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Sending email...');
    await sendContactEmail({ name, email, message });

    console.log('Email sent successfully');
    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'A server error occurred. Please try again later.' });
  }
};
