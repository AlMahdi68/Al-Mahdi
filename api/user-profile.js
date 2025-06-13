// user-profile.js

let userProfiles = []

export function createUserProfile({ id, name, email, username, plan = 'Free' }) {
  if (!id || !email) return null

  const profile = {
    id,
    name: name || '',
    email,
    username: username || '',
    plan,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  userProfiles.push(profile)
  return profile
}

export function getUserProfile(id) {
  return userProfiles.find((p) => p.id === id) || null
}

export function updateUserProfile(id, updates) {
  const index = userProfiles.findIndex((p) => p.id === id)
  if (index === -1) return null

  const profile = userProfiles[index]
  userProfiles[index] = {
    ...profile,
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  return userProfiles[index]
}

export function deleteUserProfile(id) {
  const before = userProfiles.length
  userProfiles = userProfiles.filter((p) => p.id !== id)
  return before !== userProfiles.length
}
