export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const query = req.method === 'POST' ? req.body.url : req.query.url;
  if (!query) {
    return res.status(400).json({ error: 'Missing eBay query URL' });
  }

  const appId = process.env.EBAY_APP_ID;
  if (!appId) {
    return res.status(500).json({ error: 'Missing eBay App ID' });
  }

  try {
    const response = await fetch(decodeURIComponent(query), {
      method: 'GET',
      headers: {
        'X-EBAY-SOA-SECURITY-APPNAME': appId,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    return res.status(response.ok ? 200 : response.status).json(data);
  } catch (err) {
    console.error('Proxy fetch failed:', err);
    return res.status(500).json({ error: 'Proxy request failed', details: err.message });
  }
}
