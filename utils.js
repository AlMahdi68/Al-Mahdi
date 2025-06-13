// utils.js
// Shared utility functions for Al Mahdi platform

// Format date into readable form
export function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return dateString;
  }
}

// Generate a random ID (used for mock or temporary items)
export function generateId(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).substring(2, 10)}`;
}

// Validate email format
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Capitalize first letter
export function capitalize(text) {
  return typeof text === 'string' && text.length > 0
    ? text.charAt(0).toUpperCase() + text.slice(1)
    : text;
}

// Tier display formatter
export function formatTier(tier) {
  switch (tier) {
    case 'free':
      return 'Free';
    case 'pro':
      return 'Pro';
    case 'premium':
      return 'Premium';
    default:
      return capitalize(tier || 'Unknown');
  }
}

// Check if object has required keys
export function hasKeys(obj, keys = []) {
  if (typeof obj !== 'object' || obj === null) return false;
  return keys.every((key) => obj.hasOwnProperty(key));
}
