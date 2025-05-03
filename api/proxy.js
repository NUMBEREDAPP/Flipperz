// This handler is deprecated since we now use public eBay search and no longer need the proxy
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const query = req.method === 'POST' ? req.body.url : req.query.url;

  if (!query) {
    return res.status(400).json({ error: 'Missing search query' });
  }

  const searchUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}&_sacat=0&_from=R40&LH_Sold=1&LH_Complete=1&_sop=13`;

  return res.status(200).json({ redirectUrl: searchUrl });
}
