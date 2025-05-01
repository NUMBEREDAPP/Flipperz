// api/callback.js

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' });
  }

  // RECOMMENDED: use a clean ENV name in Vercel like EBAY_CLIENT_SECRET
  const clientId = 'Numbered-Flipperz-PRD-b0e716b3d-f74e52e3';
  const clientSecret = process.env.EBAY_CLIENT_SECRET; // <-- set this in Vercel
  const redirectUri = 'Numbered_Tech__-Numbered-Flippe-uvyrzbbmf';

  if (!clientSecret) {
    console.error('Missing clientSecret. Check your environment variables.');
    return res.status(500).json({ error: 'Server misconfiguration: client secret not found.' });
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const response = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('eBay token error:', data);
      return res.status(response.status).json({ error: data });
    }

    console.log('eBay token success:', data);
    return res.status(200).json(data);
  } catch (err) {
    console.error('Callback handler error:', err);
    return res.status(500).json({ error: 'Token exchange failed' });
  }
}
