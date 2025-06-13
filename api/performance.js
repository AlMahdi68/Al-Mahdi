let performanceRecords = []

export default async function handler(req, res) {
  const { method } = req

  if (method === 'GET') {
    const { userId, date } = req.query
    let results = performanceRecords

    if (userId) {
      results = results.filter((record) => record.userId === userId)
    }

    if (date) {
      results = results.filter((record) => record.date === date)
    }

    res.statusCode = 200
    return res.end(JSON.stringify(results))
  }

  if (method === 'POST') {
    try {
      const payload = await parseBody(req)
      const { userId, metrics } = payload

      if (!userId || typeof metrics !== 'object') {
        res.statusCode = 400
        return res.end(JSON.stringify({ error: 'userId and metrics object are required' }))
      }

      const newRecord = {
        id: Date.now().toString(),
        userId,
        metrics,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
      }

      performanceRecords.push(newRecord)

      res.statusCode = 201
      return res.end(JSON.stringify({ message: 'Performance logged', data: newRecord }))
    } catch (err) {
      console.error('Performance API error:', err)
      res.statusCode = 500
      return res.end(JSON.stringify({ error: 'Internal Server Error' }))
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.statusCode = 405
  return res.end(JSON.stringify({ error: `Method ${method} Not Allowed` }))
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
