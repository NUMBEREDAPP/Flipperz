// /api/proxy.js

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const appId = process.env.EBAY_APP_ID;
  if (!appId) {
    return res.status(500).json({ error: 'Missing eBay App ID' });
  }

  const query = req.body?.query;
  if (!query) {
    return res.status(400).json({ error: 'Missing search query' });
  }

  const encodedQuery = encodeURIComponent(query);
  const url = `https://svcs.ebay.com/services/search/FindingService/v1` +
    `?OPERATION-NAME=findCompletedItems` +
    `&SERVICE-VERSION=1.0.0` +
    `&SECURITY-APPNAME=${appId}` +
    `&RESPONSE-DATA-FORMAT=JSON` +
    `&REST-PAYLOAD=true` +
    `&keywords=${encodedQuery}` +
    `&itemFilter(0).name=SoldItemsOnly` +
    `&itemFilter(0).value=true` +
    `&sortOrder=EndTimeNewest` +
    `&paginationInput.entriesPerPage=10`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    return res.status(response.ok ? 200 : response.status).json(data);
  } catch (err) {
    console.error('Proxy fetch error:', err);
    return res.status(500).json({ error: 'Proxy request failed', details: err.message });
  }
}
