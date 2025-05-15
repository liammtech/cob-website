const { sendContactEmail } = require('../lib/mailer');

module.exports = async (req, res) => {
  console.log('Request method:', req.method);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message, honeypot } = req.body || {};

    if (honeypot) {
      console.warn('Honeypot triggered.');
      return res.status(400).json({ error: 'Spam detected' });
    }

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await sendContactEmail({ name, email, message });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Internal server error:', err);
    return res.status(500).json({ error: 'A server error occurred. Please try again later.' });
  }
};
