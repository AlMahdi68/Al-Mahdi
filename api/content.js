import { json } from 'micro'

let contentItems = []

function validateContentPayload(payload) {
  if (!payload) return false
  const { userId, type, title, body } = payload
  return (
    typeof userId === 'string' &&
    typeof type === 'string' &&
    typeof title === 'string' &&
    typeof body === 'string'
  )
}

export default async function handler(req, res) {
  try {
    const method = req.method

    if (method === 'POST') {
      const payload = await json(req)

      if (!validateContentPayload(payload)) {
        res.statusCode = 400
        return res.end(JSON.stringify({ error: 'Invalid content payload.' }))
      }

      const newContent = {
        id: Date.now().toString(),
        userId: payload.userId,
        type: payload.type,
        title: payload.title,
        body: payload.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      contentItems.push(newContent)

      res.statusCode = 201
      return res.end(JSON.stringify({ message: 'Content created', content: newContent }))
    }

    if (method === 'GET') {
      const { userId, type } = req.query

      let filtered = contentItems

      if (userId) {
        filtered = filtered.filter(item => item.userId === userId)
      }

      if (type) {
        filtered = filtered.filter(item => item.type === type)
      }

      res.statusCode = 200
      return res.end(JSON.stringify(filtered))
    }

    if (method === 'PUT') {
      const payload = await json(req)
      const { id, title, body } = payload

      const itemIndex = contentItems.findIndex(c => c.id === id)
      if (itemIndex === -1) {
        res.statusCode = 404
        return res.end(JSON.stringify({ error: 'Content not found.' }))
      }

      if (title) contentItems[itemIndex].title = title
      if (body) contentItems[itemIndex].body = body
      contentItems[itemIndex].updatedAt = new Date().toISOString()

      res.statusCode = 200
      return res.end(JSON.stringify({ message: 'Content updated', content: contentItems[itemIndex] }))
    }

    if (method === 'DELETE') {
      const { id } = req.query
      const beforeLength = contentItems.length
      contentItems = contentItems.filter(c => c.id !== id)

      if (contentItems.length === beforeLength) {
        res.statusCode = 404
        return res.end(JSON.stringify({ error: 'Content not found.' }))
      }

      res.statusCode = 200
      return res.end(JSON.stringify({ message: 'Content deleted' }))
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
    res.statusCode = 405
    return res.end(JSON.stringify({ error: `Method ${method} Not Allowed` }))
  } catch (error) {
    console.error('Content API error:', error)
    res.statusCode = 500
    return res.end(JSON.stringify({ error: 'Internal Server Error' }))
  }
}
