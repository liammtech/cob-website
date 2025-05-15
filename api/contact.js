import { sendContactEmail } from '../lib/mailer.js';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message, honeypot, token } = req.body || {};

  if (honeypot) {
    return res.status(400).json({ error: 'Spam detected' });
  }

  if (!name || !email || !message || !token) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  // 👮 Verify reCAPTCHA token
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${process.env.RECAPTCHA_SECRET}&response=${token}`,
  });

  const data = await response.json();
  if (!data.success) {
    console.warn('reCAPTCHA failed:', data);
    return res.status(400).json({ error: 'reCAPTCHA verification failed.' });
  }

  try {
    await sendContactEmail({ name, email, message });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Mail error:', err);
    return res.status(500).json({ error: 'Failed to send message.' });
  }
}
