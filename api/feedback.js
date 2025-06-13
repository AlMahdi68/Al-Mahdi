let feedbackList = []

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { userId, type, message } = await parseBody(req)

      if (!userId || !type || !message) {
        res.statusCode = 400
        return res.end(JSON.stringify({ error: 'userId, type, and message are required.' }))
      }

      const entry = {
        id: Date.now().toString(),
        userId,
        type,
        message,
        createdAt: new Date().toISOString()
      }

      feedbackList.push(entry)
      res.statusCode = 201
      return res.end(JSON.stringify({ message: 'Feedback received', feedback: entry }))
    } catch (error) {
      res.statusCode = 500
      return res.end(JSON.stringify({ error: 'Invalid request body' }))
    }
  }

  if (req.method === 'GET') {
    const { userId } = req.query
    const results = userId
      ? feedbackList.filter((f) => f.userId === userId)
      : feedbackList

    res.statusCode = 200
    return res.end(JSON.stringify(results))
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.statusCode = 405
  res.end(JSON.stringify({ error: `Method ${req.method} Not Allowed` }))
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
