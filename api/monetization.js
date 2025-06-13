// api/monetization.js

import { json } from 'micro'

let monetizationEvents = []

export default async function handler(req, res) {
  try {
    const method = req.method

    if (method === 'POST') {
      const payload = await json(req)
      const { userId, contentId, eventType, amount, metadata } = payload

      if (!userId || !contentId || !eventType) {
        res.statusCode = 400
        return res.end(JSON.stringify({ error: 'Missing required fields: userId, contentId, eventType' }))
      }

      const newEvent = {
        id: Date.now().toString(),
        userId,
        contentId,
        eventType, // e.g., 'affiliate_click', 'purchase', 'ad_impression'
        amount: amount || 0,
        metadata: metadata || {},
        timestamp: new Date().toISOString()
      }

      monetizationEvents.push(newEvent)

      res.statusCode = 201
      return res.end(JSON.stringify({ message: 'Monetization event recorded', event: newEvent }))
    }

    if (method === 'GET') {
      const { userId, contentId } = req.query
      let filtered = monetizationEvents

      if (userId) filtered = filtered.filter(e => e.userId === userId)
      if (contentId) filtered = filtered.filter(e => e.contentId === contentId)

      res.statusCode = 200
      return res.end(JSON.stringify(filtered))
    }

    res.setHeader('Allow', ['GET', 'POST'])
    res.statusCode = 405
    return res.end(JSON.stringify({ error: `Method ${method} Not Allowed` }))
  } catch (err) {
    console.error('Monetization API error:', err)
    res.statusCode = 500
    return res.end(JSON.stringify({ error: 'Internal Server Error' }))
  }
}
