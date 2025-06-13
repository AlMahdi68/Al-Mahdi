let userSettings = {}

export default async function handler(req, res) {
  const { method } = req

  if (method === 'GET') {
    const { userId } = req.query
    if (!userId) {
      res.statusCode = 400
      return res.end(JSON.stringify({ error: 'userId is required' }))
    }

    const settings = userSettings[userId] || getDefaultSettings()
    res.statusCode = 200
    return res.end(JSON.stringify(settings))
  }

  if (method === 'POST') {
    try {
      const { userId, settings } = await parseBody(req)
      if (!userId || typeof settings !== 'object') {
        res.statusCode = 400
        return res.end(JSON.stringify({ error: 'userId and settings object are required' }))
      }

      userSettings[userId] = {
        ...getDefaultSettings(),
        ...settings,
        updatedAt: new Date().toISOString(),
      }

      res.statusCode = 200
      return res.end(JSON.stringify({ message: 'Settings saved', settings: userSettings[userId] }))
    } catch (err) {
      res.statusCode = 500
      return res.end(JSON.stringify({ error: 'Failed to parse settings' }))
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.statusCode = 405
  return res.end(JSON.stringify({ error: `Method ${method} Not Allowed` }))
}

function getDefaultSettings() {
  return {
    theme: 'dark',
    region: 'ME',
    notifications: true,
    updatedAt: new Date().toISOString(),
  }
}

async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk.toString()
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(body))
      } catch (err) {
        reject(err)
      }
    })
  })
}
