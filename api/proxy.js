// New FIXED proxy.js for eBay Finding API POST

export default async function handler(req, res) {
  const { url, query } = req.query;

  if (!url || !query) {
    return res.status(400).json({ error: "Missing URL or query." });
  }

  try {
    const ebayRes = await fetch(url, {
      method: 'POST',
      headers: {
        "X-EBAY-SOA-SECURITY-APPNAME": "Numbered-Flipperz-PRD-b0e716b3d-f74e52e3",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        keywords: query,
        itemFilter: [
          {
            name: "SoldItemsOnly",
            value: true
          }
        ],
        sortOrder: "EndTimeNewest",
        paginationInput: {
          entriesPerPage: 10
        }
      })
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
