export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const query = req.query.url;
  if (!query) {
    return res.status(400).json({ error: 'Missing eBay query URL' });
  }

  const token = process.env.EBAY_ACCESS_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'Missing eBay access token' });
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
    res.status(response.ok ? 200 : response.status).json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy request failed', details: err.message });
  }
}
