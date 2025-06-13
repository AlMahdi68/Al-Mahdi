export default async function handler(req, res) {
  const availablePlatforms = [
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: '📱',
      monetizable: true
    },
    {
      id: 'youtube',
      name: 'YouTube Shorts',
      icon: '📺',
      monetizable: true
    },
    {
      id: 'instagram',
      name: 'Instagram Reels',
      icon: '📸',
      monetizable: true
    },
    {
      id: 'facebook',
      name: 'Facebook Reels',
      icon: '📘',
      monetizable: true
    },
    {
      id: 'x',
      name: 'X (Twitter)',
      icon: '🐦',
      monetizable: false
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: '💼',
      monetizable: false
    }
  ]

  if (req.method === 'GET') {
    res.statusCode = 200
    return res.end(JSON.stringify({ platforms: availablePlatforms }))
  }

  res.setHeader('Allow', ['GET'])
  res.statusCode = 405
  res.end(JSON.stringify({ error: `Method ${req.method} Not Allowed` }))
}
