// api/insights.js

import { json } from 'micro'

let insightsDB = []

function generateDummyInsights(userId) {
  return {
    userId,
    totalPosts: Math.floor(Math.random() * 100),
    totalViews: Math.floor(Math.random() * 10000),
    totalClicks: Math.floor(Math.random() * 5000),
    monetizationEarned: parseFloat((Math.random() * 200).toFixed(2)),
    trendingPlatforms: ['Instagram', 'TikTok', 'YouTube'].sort(() => 0.5 - Math.random()).slice(0, 2),
    lastUpdated: new Date().toISOString()
  }
}

export default async function handler(req, res) {
  try {
    const method = req.method

    if (method === 'GET') {
      const { userId } = req.query

      if (!userId) {
        res.statusCode = 400
        return res.end(JSON.stringify({ error: 'Missing userId query parameter' }))
      }

      // Check if insights exist
      const existing = insightsDB.find(i => i.userId === userId)

      if (existing) {
        res.statusCode = 200
        return res.end(JSON.stringify(existing))
      }

      // Generate and store dummy data
      const newInsight = generateDummyInsights(userId)
      insightsDB.push(newInsight)

      res.statusCode = 201
      return res.end(JSON.stringify(newInsight))
    }

    res.setHeader('Allow', ['GET'])
    res.statusCode = 405
    return res.end(JSON.stringify({ error: `Method ${method} Not Allowed` }))
  } catch (err) {
    console.error('Error in insights API:', err)
    res.statusCode = 500
    return res.end(JSON.stringify({ error: 'Internal server error' }))
  }
}
