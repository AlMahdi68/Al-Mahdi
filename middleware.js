// middleware.js
// Reusable middleware and helper functions for API-level access control, validation, logging

// Check if request is from an authorized user (can be extended with roles)
export function requireAuth(req, res) {
  const apiKey = req.headers['authorization'];

  if (!apiKey || apiKey !== process.env.ADMIN_SECRET_KEY) {
    res.statusCode = 401;
    res.end(JSON.stringify({ error: 'Unauthorized: Invalid API key' }));
    return false;
  }
  return true;
}

// Basic logger for request method, URL, and timestamp
export function logRequest(req) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
}

// Simple rate limiter (IP-based placeholder, not persistent)
const requestCounts = {};

export function rateLimit(req, res, limit = 100) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  requestCounts[ip] = requestCounts[ip] || { count: 0, lastRequest: Date.now() };

  const now = Date.now();
  if (now - requestCounts[ip].lastRequest > 60 * 1000) {
    requestCounts[ip].count = 1;
    requestCounts[ip].lastRequest = now;
  } else {
    requestCounts[ip].count += 1;
  }

  if (requestCounts[ip].count > limit) {
    res.statusCode = 429;
    res.end(JSON.stringify({ error: 'Too many requests. Please slow down.' }));
    return false;
  }

  return true;
}
