/**
 * Vercel serverless: records investor interest (optional webhook).
 * Set INVESTOR_LEAD_WEBHOOK to a Zapier / Make / Discord / Slack incoming URL
 * to receive JSON: { name, email, source, submittedAt }.
 */

function parseBody(req) {
  const raw = req.body;
  if (raw == null) return {};
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw || '{}');
    } catch {
      return {};
    }
  }
  if (typeof raw === 'object') return raw;
  return {};
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = parseBody(req);
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!name || !email || !emailOk) {
    return res.status(400).json({ error: 'Name and a valid email are required.' });
  }

  const payload = {
    name,
    email,
    source: 'senary_website',
    submittedAt: new Date().toISOString(),
  };

  const webhook = process.env.INVESTOR_LEAD_WEBHOOK;
  if (webhook) {
    try {
      const r = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!r.ok) {
        console.error('INVESTOR_LEAD_WEBHOOK non-OK', r.status, await r.text());
      }
    } catch (e) {
      console.error('INVESTOR_LEAD_WEBHOOK error', e);
    }
  }

  return res.status(200).json({ ok: true });
};
