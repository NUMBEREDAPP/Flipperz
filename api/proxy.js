// api/proxy.js

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Support both GET and POST for local testing or front-end flexibility
  const query = req.method === 'POST' ? req.body.url : req.query.url;
  if (!query) {
    return res.status(400).json({ error: 'Missing eBay query URL' });
  }

  const rawToken = process.env.EBAY_ACCESS_TOKEN;
  if (!rawToken) {
    return res.status(500).json({ error: 'Missing eBay access token' });
  }

  let token;
  try {
    // Uncomment this if your token is stored as a JSON string
    token = JSON.parse(rawToken).access_token;

    // OR, if your token is stored as a plain string, use this instead:
    // token = rawToken;
  } catch (err) {
    return res.status(500).json({ error: 'Token parse failed', details: err.message });
  }

  try {
    const response = await fetch(decodeURIComponent(query), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return res.status(response.ok ? 200 : response.status).json(data);
  } catch (err) {
    console.error('Proxy fetch failed:', {
      error: err.message,
      query,
      tokenPreview: token ? token.slice(0, 12) + '...' : 'undefined',
    });
    return res.status(500).json({
      error: 'Proxy request failed',
      details: err.message,
    });
  }
}
