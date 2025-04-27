export default async function handler(req, res) {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: "No URL provided." });
  }

  try {
    const ebayRes = await fetch(url); // 👈 No extra headers!

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
