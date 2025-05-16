import { sendContactEmail } from '../lib/mailer.js';

const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 3;

export default async function handler(req, res) {

  // Rate handling
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, time: now };

  if (now - entry.time < RATE_LIMIT_WINDOW_MS) {
    if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
      return res.status(429).json({ success: false, error: 'Too many requests. Please try again later.' });
    } else {
      entry.count += 1;
      rateLimitMap.set(ip, entry);
    }
  } else {
    rateLimitMap.set(ip, { count: 1, time: now });
  }

  // Mail send
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message, honeypot } = req.body || {};

  if (honeypot) {
    console.warn('Honeypot triggered');
    return res.status(400).json({ error: 'Spam detected' });
  }

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    await sendContactEmail({ name, email, message });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Mail error:', err);
    return res.status(500).json({ error: 'Failed to send message.' });
  }
}
