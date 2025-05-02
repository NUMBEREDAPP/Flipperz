export default async function handler(req, res) {
  try {
    const rawToken = process.env.EBAY_ACCESS_TOKEN;
    if (!rawToken) {
      return res.status(500).json({ error: 'EBAY_ACCESS_TOKEN not set' });
    }

    const parsed = JSON.parse(rawToken);
    return res.status(200).json({
      status: 'Token loaded successfully',
      startsWith: parsed.access_token?.substring(0, 10),
      expires_in: parsed.expires_in,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to parse token', details: err.message });
  }
}
