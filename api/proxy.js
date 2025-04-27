export default async function handler(req, res) {
  const url = req.query.url;

  // 💬 Fix CORS problem
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (!url) {
    return res.status(400).json({ error: "No URL provided." });
  }

  try {
    const ebayRes = await fetch(url, {
      headers: {
        "X-EBAY-SOA-SECURITY-APPNAME": "Numbered-Flipperz-PRD-b0e716b3d-f74e52e3"
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
