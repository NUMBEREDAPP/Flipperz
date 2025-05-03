export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const query = req.method === 'POST' ? req.body.query : req.query.query;

  const appId = process.env.EBAY_APP_ID;

  const url = `https://svcs.ebay.com/services/search/FindingService/v1`
    + `?OPERATION-NAME=findCompletedItems`
    + `&SERVICE-VERSION=1.0.0`
    + `&SECURITY-APPNAME=${appId}`
    + `&RESPONSE-DATA-FORMAT=JSON`
    + `&keywords=${encodeURIComponent(query || '')}`
    + `&itemFilter(0).name=SoldItemsOnly&itemFilter(0).value=true`
    + `&sortOrder=EndTimeNewest`
    + `&paginationInput.entriesPerPage=10`;

  if (!query) {
    return res.status(400).json({ error: 'Missing search query', constructedUrl: url });
  }

  if (!appId) {
    return res.status(500).json({ error: 'Missing eBay App ID', constructedUrl: url });
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(response.ok ? 200 : response.status).json({ ...data, constructedUrl: url });
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy request failed', details: err.message, constructedUrl: url });
  }
}
