export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const response = await fetch('https://svcs.ebay.com/services/search/FindingService/v1', {
      method: 'POST',
      headers: {
        'X-EBAY-SOA-SECURITY-APPNAME': 'Numbered-Flipperz-PRD-b0e716b3d-f74e52e3',
        'X-EBAY-SOA-OPERATION-NAME': 'findCompletedItems',
        'X-EBAY-SOA-SERVICE-VERSION': '1.0.0',
        'X-EBAY-SOA-REQUEST-DATA-FORMAT': 'JSON',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy request failed.' });
  }
}
