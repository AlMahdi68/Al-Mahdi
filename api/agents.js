import { json } from 'micro'

let agents = []

function validateAgentPayload(payload) {
  if (!payload) return false
  const { id, name, status, data } = payload
  if (
    (id && typeof id !== 'string') ||
    (name && typeof name !== 'string') ||
    (status && typeof status !== 'string') ||
    (data && typeof data !== 'object')
  ) {
    return false
  }
  return true
}

export default async function handler(req, res) {
  try {
    const method = req.method

    if (method === 'POST') {
      const payload = await json(req)

      if (!payload.name) {
        res.statusCode = 400
        return res.end(JSON.stringify({ error: 'Agent name is required' }))
      }

      if (!validateAgentPayload(payload)) {
        res.statusCode = 400
        return res.end(JSON.stringify({ error: 'Invalid agent payload' }))
      }

      const newAgent = {
        id: Date.now().toString(),
        name: payload.name,
        status: payload.status || 'active',
        data: payload.data || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      agents.push(newAgent)
      res.statusCode = 201
      return res.end(JSON.stringify({ message: 'Agent created', agent: newAgent }))
    }

    if (method === 'GET') {
      res.statusCode = 200
      return res.end(JSON.stringify(agents))
    }

    if (method === 'PUT') {
      const payload = await json(req)
      const { id, name, status, data } = payload

      if (!id) {
        res.statusCode = 400
        return res.end(JSON.stringify({ error: 'Agent id is required for update' }))
      }

      const index = agents.findIndex((a) => a.id === id)
      if (index === -1) {
        res.statusCode = 404
        return res.end(JSON.stringify({ error: 'Agent not found' }))
      }

      if (name) agents[index].name = name
      if (status) agents[index].status = status
      if (data && typeof data === 'object') {
        agents[index].data = { ...agents[index].data, ...data }
      }

      agents[index].updatedAt = new Date().toISOString()
      res.statusCode = 200
      return res.end(JSON.stringify({ message: 'Agent updated', agent: agents[index] }))
    }

    if (method === 'DELETE') {
      const { id } = req.query
      if (!id) {
        res.statusCode = 400
        return res.end(JSON.stringify({ error: 'Agent id is required for deletion' }))
      }
      const lengthBefore = agents.length
      agents = agents.filter((a) => a.id !== id)
      if (agents.length === lengthBefore) {
        res.statusCode = 404
        return res.end(JSON.stringify({ error: 'Agent not found' }))
      }
      res.statusCode = 200
      return res.end(JSON.stringify({ message: 'Agent deleted' }))
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
    res.statusCode = 405
    return res.end(JSON.stringify({ error: `Method ${method} Not Allowed` }))
  } catch (error) {
    res.statusCode = 500
    return res.end(JSON.stringify({ error: 'Internal Server Error' }))
  }
}
