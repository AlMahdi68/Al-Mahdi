// dashboard.js
// User dashboard logic for Al Mahdi platform using Supabase and local session

const API_BASE = '/api';
const user = Auth.getSession();

if (!user) {
  window.location.href = 'login.html'; // Redirect if not logged in
}

// Display welcome message
document.getElementById('user-welcome').textContent = `Welcome, ${user.username || user.email}!`;

// Load user-specific stats and data
async function loadDashboardData() {
  try {
    // Fetch posts
    const postsRes = await fetch(`${API_BASE}/content.js?userId=${user.id}`);
    const posts = await postsRes.json();

    const postsCount = posts.length;
    const approvedPosts = posts.filter(p => p.status === 'approved').length;
    const pendingPosts = posts.filter(p => p.status === 'pending').length;

    document.getElementById('total-posts').textContent = postsCount;
    document.getElementById('approved-posts').textContent = approvedPosts;
    document.getElementById('pending-posts').textContent = pendingPosts;

    // Load monetization data
    const monetizationRes = await fetch(`${API_BASE}/monetization.js?userId=${user.id}`);
    const monetization = await monetizationRes.json();

    document.getElementById('revenue-earned').textContent = monetization.totalRevenue || '0.00';
    document.getElementById('clicks-count').textContent = monetization.totalClicks || '0';
  } catch (err) {
    console.error('Error loading dashboard data:', err);
    alert('Failed to load dashboard data.');
  }
}

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
  Auth.logout();
  window.location.href = 'login.html';
});

// Initialize dashboard
loadDashboardData();
