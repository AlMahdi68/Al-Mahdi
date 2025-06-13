// notification.js

let notifications = []

export function sendNotification(userId, message, type = 'info') {
  if (!userId || !message) return null

  const notification = {
    id: Date.now().toString(),
    userId,
    message,
    type, // 'info', 'success', 'error', etc.
    read: false,
    createdAt: new Date().toISOString(),
  }

  notifications.push(notification)
  return notification
}

export function getNotifications(userId) {
  return notifications.filter((n) => n.userId === userId)
}

export function markAsRead(id) {
  const notification = notifications.find((n) => n.id === id)
  if (notification) {
    notification.read = true
    return notification
  }
  return null
}

export function clearNotifications(userId) {
  const before = notifications.length
  notifications = notifications.filter((n) => n.userId !== userId)
  return before - notifications.length
}
