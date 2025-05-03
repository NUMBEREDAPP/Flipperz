export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const query = req.method === 'POST' ? req.body.query : req.query.query;
  if (!query) {
    return res.status(400).json({ error: 'Missing eBay search query' });
  }

  const rawToken = process.env.EBAY_ACCESS_TOKEN;
  if (!rawToken) {
    return res.status(500).json({ error: 'Missing access token' });
  }

  let token;
  try {
    token = JSON.parse(rawToken).access_token;
  } catch (err) {
    return res.status(500).json({ error: 'Token parse failed', details: err.message });
  }

  const encodedQuery = encodeURIComponent(query);
  const browseUrl = `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodedQuery}&filter=buyingOptions:{FIXED_PRICE},price:[1..]&limit=10&sort=price DESC`; // Customize filters as needed

  try {
    const response = await fetch(browseUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return res.status(response.ok ? 200 : response.status).json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({ error: 'Proxy request failed', details: err.message });
  }
}
