import fetch from 'node-fetch';
import { sendContactEmail } from '../lib/mailer.js';

export default async function handler(req, res) {
  console.log('🧪 API endpoint hit');
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);

  if (req.method !== 'POST') {
    console.warn('Blocked non-POST request');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body = req.body;
  if (!body) {
    try {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const rawBody = Buffer.concat(chunks).toString();
      body = JSON.parse(rawBody);
    } catch (err) {
      console.error('Failed to parse body manually:', err);
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
  }

  console.log('Parsed body:', body);

  const { name, email, message, honeypot, token } = body || {};

  if (honeypot) {
    console.warn('Honeypot triggered');
    return res.status(400).json({ error: 'Spam detected' });
  }

  if (!name || !email || !message || !token) {
    console.warn('Missing field:', { name, email, message, token });
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Validate reCAPTCHA
    const captchaRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.RECAPTCHA_SECRET}&response=${token}`,
    });

    const captchaData = await captchaRes.json();
    console.log('reCAPTCHA result:', captchaData);

    if (!captchaData.success) {
      console.warn('Failed CAPTCHA:', captchaData);
      return res.status(400).json({ error: 'reCAPTCHA failed.' });
    }

    await sendContactEmail({ name, email, message });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Final catch error:', err);
    return res.status(500).json({ error: 'Server crashed during processing' });
  }
}
