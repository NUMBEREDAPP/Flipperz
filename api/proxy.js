export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'Missing target URL' });
    }

    const token = process.env.EBAY_ACCESS_TOKEN;

    const response = await fetch(decodeURIComponent(url), {
      headers: {
        Authorization: `Bearer ${JSON.parse(token).access_token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    res.status(response.ok ? 200 : response.status).json(data);

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy request failed', details: error.message });
  }
}
