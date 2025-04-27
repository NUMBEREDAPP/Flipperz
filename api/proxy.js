export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'No URL provided.' });
  }

  try {
    const ebayRes = await fetch(url, {
      method: 'GET',
      headers: {
        "X-EBAY-SOA-SECURITY-APPNAME": "Numbered-Flipperz-PRD-b0e716b3d-f74e52e3",
        "Content-Type": "application/json",
      }
    });

    if (!ebayRes.ok) {
      throw new Error(`eBay API request failed: ${ebayRes.status}`);
    }

    const data = await ebayRes.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Proxy request failed." });
  }
}
