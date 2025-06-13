import { json } from 'micro'

let users = []

function validateUserPayload(payload) {
  if (!payload) return false
  const { id, email, username, role } = payload
  if (
    (id && typeof id !== 'string') ||
    typeof email !== 'string' ||
    typeof username !== 'string' ||
    !['user', 'admin'].includes(role)
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

      if (!validateUserPayload(payload)) {
        res.statusCode = 400
        return res.end(JSON.stringify({ error: 'Invalid payload. Required: email (string), username (string), role ("user" or "admin").' }))
      }

      if (users.find(u => u.email === payload.email || u.username === payload.username)) {
        res.statusCode = 409
        return res.end(JSON.stringify({ error: 'User with this email or username already exists.' }))
      }

      const newUser = {
        id: payload.id || Date.now().toString(),
        email: payload.email,
        username: payload.username,
        role: payload.role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      users.push(newUser)
      res.statusCode = 201
      return res.end(JSON.stringify({ message: 'User created', user: newUser }))
    }

    if (method === 'GET') {
      const { id, email } = req.query

      let result = users

      if (id) {
        result = result.filter(u => u.id === id)
      } else if (email) {
        result = result.filter(u => u.email === email)
      }

      res.statusCode = 200
      return res.end(JSON.stringify(result))
    }

    if (method === 'PUT') {
      const payload = await json(req)
      const { id, email, username, role } = payload

      if (!id) {
        res.statusCode = 400
        return res.end(JSON.stringify({ error: 'User id is required for update.' }))
      }

      const userIndex = users.findIndex(u => u.id === id)
      if (userIndex === -1) {
        res.statusCode = 404
        return res.end(JSON.stringify({ error: 'User not found.' }))
      }

      if (email) users[userIndex].email = email
      if (username) users[userIndex].username = username
      if (role && ['user', 'admin'].includes(role)) users[userIndex].role = role

      users[userIndex].updatedAt = new Date().toISOString()

      res.statusCode = 200
      return res.end(JSON.stringify({ message: 'User updated', user: users[userIndex] }))
    }

    if (method === 'DELETE') {
      const { id } = req.query

      if (!id) {
        res.statusCode = 400
        return res.end(JSON.stringify({ error: 'User id query parameter required for deletion.' }))
      }

      const beforeLength = users.length
      users = users.filter(u => u.id !== id)

      if (users.length === beforeLength) {
        res.statusCode = 404
        return res.end(JSON.stringify({ error: 'User not found.' }))
      }

      res.statusCode = 200
      return res.end(JSON.stringify({ message: 'User deleted' }))
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
    res.statusCode = 405
    return res.end(JSON.stringify({ error: `Method ${method} Not Allowed` }))
  } catch (error) {
    console.error('User API error:', error)
    res.statusCode = 500
    return res.end(JSON.stringify({ error: 'Internal Server Error' }))
  }
}
