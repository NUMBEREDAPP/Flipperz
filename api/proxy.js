export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const query = req.method === 'POST' ? req.body?.url : req.query?.url;
  if (!query) {
    return res.status(400).json({ error: 'Missing eBay query URL' });
  }

  const rawToken = process.env.EBAY_ACCESS_TOKEN;
  if (!rawToken) {
    return res.status(500).json({ error: 'Missing EBAY_ACCESS_TOKEN' });
  }

  let token;
  try {
    token = JSON.parse(rawToken).access_token;
  } catch (err) {
    return res.status(500).json({ error: 'Token parse failed', details: err.message });
  }

  try {
    const ebayRes = await fetch(decodeURIComponent(query), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await ebayRes.json();
    return res.status(ebayRes.ok ? 200 : ebayRes.status).json(data);
  } catch (err) {
    console.error('Proxy fetch failed:', err);
    return res.status(500).json({ error: 'Proxy fetch error', details: err.message });
  }
}
