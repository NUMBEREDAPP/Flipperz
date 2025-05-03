export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Missing search query' });

  const appId = process.env.EBAY_APP_ID; // Make sure this is defined in Vercel
  if (!appId) return res.status(500).json({ error: 'Missing eBay App ID' });

  const ebayApiUrl = `https://svcs.ebay.com/services/search/FindingService/v1` +
    `?OPERATION-NAME=findCompletedItems&SERVICE-VERSION=1.0.0` +
    `&SECURITY-APPNAME=${appId}` +
    `&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD` +
    `&keywords=${encodeURIComponent(query)}` +
    `&itemFilter(0).name=SoldItemsOnly&itemFilter(0).value=true` +
    `&sortOrder=EndTimeNewest&paginationInput.entriesPerPage=20`;

  try {
    const response = await fetch(ebayApiUrl, {
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();
    res.status(200).json(data.findCompletedItemsResponse?.[0]?.searchResult?.[0] || {});
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy request failed', details: err.message });
  }
}
