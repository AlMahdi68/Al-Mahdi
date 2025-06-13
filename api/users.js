import { json } from 'micro'

let users = []

function validateUserPayload(payload) {
  if (!payload) return false
  const { id, email, username, status, profile } = payload
  if (
    (id && typeof id !== 'string') ||
    (email && typeof email !== 'string') ||
    (username && typeof username !== 'string') ||
    (status && typeof status !== 'string') ||
    (profile && typeof profile !== 'object')
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

      if (!payload.email || !payload.username) {
        res.statusCode = 400
        return res.end(JSON.stringify({ error: 'Email and username are required' }))
      }

      if (!validateUserPayload(payload)) {
        res.statusCode = 400
        return res.end(JSON.stringify({ error: 'Invalid user payload' }))
      }

      // Check if email or username already exists
      const emailExists = users.some((u) => u.email === payload.email)
      const usernameExists = users.some((u) => u.username === payload.username)

      if (emailExists || usernameExists) {
        res.statusCode = 409
        return res.end(JSON.stringify({ error: 'Email or username already exists' }))
      }

      const newUser = {
        id: Date.now().toString(),
        email: payload.email,
        username: payload.username,
        status: payload.status || 'active',
        profile: payload.profile || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      users.push(newUser)
      res.statusCode = 201
      return res.end(JSON.stringify({ message: 'User created', user: newUser }))
    }

    if (method === 'GET') {
      const { id, email, username, status } = req.query
      let filteredUsers = users

      if (id) filteredUsers = filteredUsers.filter((u) => u.id === id)
      if (email) filteredUsers = filteredUsers.filter((u) => u.email === email)
      if (username) filteredUsers = filteredUsers.filter((u) => u.username === username)
      if (status) filteredUsers = filteredUsers.filter((u) => u.status === status)

      res.statusCode = 200
      return res.end(JSON.stringify(filteredUsers))
    }

    if (method === 'PUT') {
      const payload = await json(req)
      const { id, email, username, status, profile } = payload

      if (!id) {
        res.statusCode = 400
        return res.end(JSON.stringify({ error: 'User id is required for update' }))
      }

      const index = users.findIndex((u) => u.id === id)
      if (index === -1) {
        res.statusCode = 404
        return res.end(JSON.stringify({ error: 'User not found' }))
      }

      // Prevent duplicate email or username if updating
      if (email && users.some((u, i) => u.email === email && i !== index)) {
        res.statusCode = 409
        return res.end(JSON.stringify({ error: 'Email already exists' }))
      }

      if (username && users.some((u, i) => u.username === username && i !== index)) {
        res.statusCode = 409
        return res.end(JSON.stringify({ error: 'Username already exists' }))
      }

      if (email) users[index].email = email
      if (username) users[index].username = username
      if (status) users[index].status = status
      if (profile && typeof profile === 'object') {
        users[index].profile = { ...users[index].profile, ...profile }
      }

      users[index].updatedAt = new Date().toISOString()

      res.statusCode = 200
      return res.end(JSON.stringify({ message: 'User updated', user: users[index] }))
    }

    if (method === 'DELETE') {
      const { id } = req.query
      if (!id) {
        res.statusCode = 400
        return res.end(JSON.stringify({ error: 'User id query parameter is required for deletion' }))
      }
      const beforeLength = users.length
      users = users.filter((u) => u.id !== id)
      if (users.length === beforeLength) {
        res.statusCode = 404
        return res.end(JSON.stringify({ error: 'User not found' }))
      }
      res.statusCode = 200
      return res.end(JSON.stringify({ message: 'User deleted' }))
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
    res.statusCode = 405
    return res.end(JSON.stringify({ error: `Method ${method} Not Allowed` }))
  } catch (error) {
    res.statusCode = 500
    return res.end(JSON.stringify({ error: 'Internal Server Error' }))
  }
}
