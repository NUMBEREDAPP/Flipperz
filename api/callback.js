// /api/callback.js
export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Missing authorization code');
  }

  const basicAuth = Buffer.from(
    'Numbered-Flipperz-PRD-b0e716b3d-f74e52e3:PRD-0e716b3d8506-dd47-421f-84fa-34ed'
  ).toString('base64');

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: 'https://flipperz-pied.vercel.app/api/callback',
  });

  try {
    const response = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    const data = await response.json();
    console.log('eBay Token Response:', data);
    res.status(200).json(data);
  } catch (error) {
    console.error('Callback error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
