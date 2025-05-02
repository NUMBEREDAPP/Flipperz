export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const rawUrl = req.method === 'POST' ? req.body.url : req.query.url;
  if (!rawUrl) {
    return res.status(400).json({ error: 'Missing eBay query URL' });
  }

  const appId = process.env.EBAY_APP_ID || 'Numbered-Flipperz-PRD-b0e716b3d-f74e52e3';
  if (!appId) {
    return res.status(500).json({ error: 'Missing eBay App ID' });
  }

  // Append app ID to query string directly (Finding API requires this in the URL)
  const urlWithAppId = rawUrl.includes('SECURITY-APPNAME=') ?
    decodeURIComponent(rawUrl) :
    `${decodeURIComponent(rawUrl)}&SECURITY-APPNAME=${appId}`;

  try {
    const response = await fetch(urlWithAppId, { method: 'GET' });
    const data = await response.json();
    return res.status(response.ok ? 200 : response.status).json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({ error: 'Proxy request failed', details: err.message });
  }
}
