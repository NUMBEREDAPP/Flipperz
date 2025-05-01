// api/proxy.js

export default async function handler(req, res) {
  const { query } = req;
  const keywords = query.q || '';

  const token = process.env.EBAY_ACCESS_TOKEN; // or however you store it

  const url = 'https://svcs.ebay.com/services/search/FindingService/v1?' +
    new URLSearchParams({
      'OPERATION-NAME': 'findCompletedItems',
      'SERVICE-VERSION': '1.0.0',
      'RESPONSE-DATA-FORMAT': 'JSON',
      'REST-PAYLOAD': 'true',
      'keywords': keywords,
      'paginationInput.entriesPerPage': '10',
      'itemFilter(0).name': 'SoldItemsOnly',
      'itemFilter(0).value': 'true',
      'sortOrder': 'EndTimeNewest'
    });

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`, // 🔐 this is new
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch eBay results' });
  }
}
