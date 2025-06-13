import { json } from 'micro'

let analyticsStore = []

export default async function handler(req, res) {
  try {
    const method = req.method

    if (method === 'POST') {
      const payload = await json(req)
      const { userId, type, value } = payload

      if (typeof userId !== 'string' || typeof type !== 'string' || typeof value !== 'number') {
        res.statusCode = 400
        return res.end(JSON.stringify({ error: 'Invalid payload. Expected userId (string), type (string), value (number).' }))
      }

      const newRecord = {
        id: Date.now().toString(),
        userId,
        type, // example: 'views', 'clicks', 'conversions'
        value,
        createdAt: new Date().toISOString()
      }

      analyticsStore.push(newRecord)
      res.statusCode = 201
      return res.end(JSON.stringify({ message: 'Analytics record added', record: newRecord }))
    }

    if (method === 'GET') {
      const { userId, type } = req.query

      let filtered = analyticsStore
      if (userId) filtered = filtered.filter(r => r.userId === userId)
      if (type) filtered = filtered.filter(r => r.type === type)

      res.statusCode = 200
      return res.end(JSON.stringify(filtered))
    }

    if (method === 'DELETE') {
      const { id } = req.query

      if (!id) {
        res.statusCode = 400
        return res.end(JSON.stringify({ error: 'ID required for deletion.' }))
      }

      const before = analyticsStore.length
      analyticsStore = analyticsStore.filter(r => r.id !== id)

      if (analyticsStore.length === before) {
        res.statusCode = 404
        return res.end(JSON.stringify({ error: 'Record not found.' }))
      }

      res.statusCode = 200
      return res.end(JSON.stringify({ message: 'Record deleted' }))
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
    res.statusCode = 405
    return res.end(JSON.stringify({ error: `Method ${method} not allowed.` }))
  } catch (err) {
    console.error('Analytics API error:', err)
    res.statusCode = 500
    return res.end(JSON.stringify({ error: 'Internal Server Error' }))
  }
}
