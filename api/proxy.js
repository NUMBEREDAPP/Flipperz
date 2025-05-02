export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const query = req.method === 'POST' ? req.body.url : req.query.url;
  if (!query) {
    return res.status(400).json({ error: 'Missing eBay query URL' });
  }

  const token = process.env.EBAY_ACCESS_TOKEN;
  const appId = process.env.EBAY_APP_ID || 'Numbered-Flipperz-PRD-b0e716b3d-f74e52e3';

  if (!token && !appId) {
    return res.status(500).json({ error: 'Missing eBay App ID or token' });
  }

  try {
    const headers = {
      'Content-Type': 'application/json'
    };

    let usedToken = false;

    if (token) {
      try {
        const parsed = JSON.parse(token);
        if (parsed.access_token) {
          headers['X-EBAY-API-IAF-TOKEN'] = parsed.access_token;
          usedToken = true;
        }
      } catch (e) {
        headers['X-EBAY-API-IAF-TOKEN'] = token;
        usedToken = true;
      }
    }

    if (!usedToken) {
      headers['X-EBAY-SOA-SECURITY-APPNAME'] = appId;
    }

    const response = await fetch(decodeURIComponent(query), {
      method: 'GET',
      headers
    });

    const data = await response.json();
    return res.status(response.ok ? 200 : response.status).json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({ error: 'Proxy request failed', details: err.message });
  }
}
