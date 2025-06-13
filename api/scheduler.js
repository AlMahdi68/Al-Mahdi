export default async function handler(req, res) {
  if (!global.scheduledPosts) global.scheduledPosts = []

  if (req.method === 'POST') {
    try {
      const { userId, platform, content, scheduledTime } = await parseBody(req)

      if (!userId || !platform || !content || !scheduledTime) {
        res.statusCode = 400
        return res.end(JSON.stringify({ error: 'Missing required fields' }))
      }

      const newPost = {
        id: Date.now().toString(),
        userId,
        platform,
        content,
        scheduledTime,
        status: 'scheduled',
        createdAt: new Date().toISOString()
      }

      global.scheduledPosts.push(newPost)

      res.statusCode = 201
      return res.end(JSON.stringify({ message: 'Post scheduled', post: newPost }))
    } catch (err) {
      res.statusCode = 500
      return res.end(JSON.stringify({ error: 'Internal Server Error' }))
    }
  }

  if (req.method === 'GET') {
    const { userId, status } = req.query
    let results = global.scheduledPosts

    if (userId) results = results.filter(p => p.userId === userId)
    if (status) results = results.filter(p => p.status === status)

    res.statusCode = 200
    return res.end(JSON.stringify(results))
  }

  if (req.method === 'PUT') {
    try {
      const { id, status } = await parseBody(req)
      const index = global.scheduledPosts.findIndex(p => p.id === id)

      if (index === -1) {
        res.statusCode = 404
        return res.end(JSON.stringify({ error: 'Scheduled post not found' }))
      }

      if (status) global.scheduledPosts[index].status = status

      res.statusCode = 200
      return res.end(JSON.stringify({ message: 'Post updated', post: global.scheduledPosts[index] }))
    } catch (err) {
      res.statusCode = 500
      return res.end(JSON.stringify({ error: 'Internal Server Error' }))
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT'])
  res.statusCode = 405
  res.end(JSON.stringify({ error: `Method ${req.method} not allowed` }))
}

async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => {
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
