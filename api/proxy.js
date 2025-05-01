// /api/proxy.js

export default async function handler(req, res) {
  const query = req.query.url;

  if (!query) {
    return res.status(400).json({ error: 'Missing eBay query URL' });
  }

  const token = process.env.EBAY_ACCESS_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'Missing access token in environment' });
  }

  try {
    const response = await fetch(decodeURIComponent(query), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${JSON.parse(token).access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('eBay API error:', error);
      return res.status(response.status).json({ error: 'Failed to fetch from eBay', details: error });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error('Proxy fetch error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}
