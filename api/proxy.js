export default async function handler(req, res) {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: "No URL provided." });
  }

  try {
    const ebayRes = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": "Bearer v^1.1#i^1#f^0#p^3#r^0#I^3#t^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",
        "Content-Type": "application/json",
        "X-EBAY-C-MARKETPLACE-ID": "EBAY_US"
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
