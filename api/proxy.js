export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "No URL provided." });
  }

  try {
    const ebayRes = await fetch(url, {
      method: 'GET',
      headers: {
        "X-EBAY-SOA-SECURITY-APPNAME": "Numbered-Flipperz-PRD-b0e716b3d-f74e52e3", // <-- your App ID
        "Content-Type": "application/json"
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
