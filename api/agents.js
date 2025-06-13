import { json } from 'micro'

let agentTasks = []

function validateTaskPayload(payload) {
  if (!payload) return false
  const { userId, taskType, data } = payload
  if (
    typeof userId !== 'string' ||
    typeof taskType !== 'string' ||
    typeof data !== 'object' ||
    data === null
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

      if (!validateTaskPayload(payload)) {
        res.statusCode = 400
        return res.end(JSON.stringify({ error: 'Invalid payload. Required: userId (string), taskType (string), data (object).' }))
      }

      const newTask = {
        id: Date.now().toString(),
        userId: payload.userId,
        taskType: payload.taskType,
        data: payload.data,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      agentTasks.push(newTask)
      res.statusCode = 201
      return res.end(JSON.stringify({ message: 'Agent task created', task: newTask }))
    }

    if (method === 'GET') {
      const { userId, status } = req.query

      let tasks = agentTasks

      if (userId) {
        tasks = tasks.filter((task) => task.userId === userId)
      }

      if (status) {
        tasks = tasks.filter((task) => task.status === status)
      }

      res.statusCode = 200
      return res.end(JSON.stringify(tasks))
    }

    if (method === 'PUT') {
      const payload = await json(req)
      const { id, status, data } = payload

      if (!id) {
        res.statusCode = 400
        return res.end(JSON.stringify({ error: 'Task id is required for update.' }))
      }

      const taskIndex = agentTasks.findIndex((t) => t.id === id)
      if (taskIndex === -1) {
        res.statusCode = 404
        return res.end(JSON.stringify({ error: 'Task not found.' }))
      }

      if (status) {
        agentTasks[taskIndex].status = status
      }

      if (data && typeof data === 'object') {
        agentTasks[taskIndex].data = { ...agentTasks[taskIndex].data, ...data }
      }

      agentTasks[taskIndex].updatedAt = new Date().toISOString()

      res.statusCode = 200
      return res.end(JSON.stringify({ message: 'Task updated', task: agentTasks[taskIndex] }))
    }

    if (method === 'DELETE') {
      const { id } = req.query

      if (!id) {
        res.statusCode = 400
        return res.end(JSON.stringify({ error: 'Task id query parameter is required for deletion.' }))
      }

      const beforeLength = agentTasks.length
      agentTasks = agentTasks.filter((t) => t.id !== id)

      if (agentTasks.length === beforeLength) {
        res.statusCode = 404
        return res.end(JSON.stringify({ error: 'Task not found.' }))
      }

      res.statusCode = 200
      return res.end(JSON.stringify({ message: 'Task deleted' }))
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
    res.statusCode = 405
    return res.end(JSON.stringify({ error: `Method ${method} Not Allowed` }))
  } catch (error) {
    console.error('Agent API error:', error)
    res.statusCode = 500
    return res.end(JSON.stringify({ error: 'Internal Server Error' }))
  }
}
