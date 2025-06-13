// api/engagement.js

import { json } from 'micro'

let engagements = []

export default async function handler(req, res) {
  try {
    const method = req.method

    if (method === 'POST') {
      const payload = await json(req)
      const { userId, contentId, type } = payload

      if (!userId || !contentId || !type) {
        res.statusCode = 400
        return res.end(JSON.stringify({ error: 'Missing userId, contentId, or type' }))
      }

      const newEngagement = {
        id: Date.now().toString(),
        userId,
        contentId,
        type, // 'like', 'comment', 'share', 'view'
        timestamp: new Date().toISOString()
      }

      engagements.push(newEngagement)

      res.statusCode = 201
      return res.end(JSON.stringify({ message: 'Engagement logged', engagement: newEngagement }))
    }

    if (method === 'GET') {
      const { contentId, type } = req.query

      let filtered = engagements
      if (contentId) {
        filtered = filtered.filter(e => e.contentId === contentId)
      }
      if (type) {
        filtered = filtered.filter(e => e.type === type)
      }

      res.statusCode = 200
      return res.end(JSON.stringify(filtered))
    }

    res.setHeader('Allow', ['GET', 'POST'])
    res.statusCode = 405
    return res.end(JSON.stringify({ error: `Method ${method} Not Allowed` }))
  } catch (err) {
    console.error('Engagement API error:', err)
    res.statusCode = 500
    return res.end(JSON.stringify({ error: 'Internal Server Error' }))
  }
}
