import { supabase } from './supabaseclient.js';

// Example usage
const { data, error } = await supabase.from('users').select('*');

// dashboard.js
// Handles dashboard page logic for Al Mahdi platform

const SUPABASE_URL = 'https://jaqjxmttwwcenndrsizq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphcWp4bXR0d3djZW5uZHJzaXpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NzU5MjgsImV4cCI6MjA2NTM1MTkyOH0.PjDBZk79fHnmMgKhtSTo_BtkwN9YeGsz9Sd1lZqhTwQ';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const welcomeMsg = document.getElementById('welcome-msg');
const adminLink = document.getElementById('admin-link');
const logoutBtn = document.getElementById('logout-btn');
const postsList = document.getElementById('posts-list');
const totalPostsSpan = document.getElementById('total-posts');
const totalFollowersSpan = document.getElementById('total-followers');
const totalEarningsSpan = document.getElementById('total-earnings');

async function loadDashboard() {
  // Get current user session
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    // User not logged in, redirect to signin page
    window.location.href = '/account/signin.html';
    return;
  }

  // Fetch user profile info from 'users' table
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('username, email, role')
    .eq('id', user.id)
    .single();

  if (profileError) {
    welcomeMsg.textContent = `Welcome, ${user.email}`;
  } else {
    welcomeMsg.textContent = `Welcome, ${profile.username || profile.email}`;
    if (profile.role === 'admin') {
      adminLink.style.display = 'inline-block';
    }
  }

  // Fetch recent posts by user (limit 5)
  const { data: posts, error: postsError } = await supabase
    .from('posts')
    .select('id, title, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  if (postsError) {
    postsList.innerHTML = '<li>Failed to load posts.</li>';
  } else if (!posts.length) {
    postsList.innerHTML = '<li>No posts found.</li>';
  } else {
    postsList.innerHTML = '';
    posts.forEach((post) => {
      const li = document.createElement('li');
      li.textContent = `${post.title} — ${new Date(post.created_at).toLocaleDateString()}`;
      postsList.appendChild(li);
    });
  }

  // Show some placeholder stats (update when real data available)
  totalPostsSpan.textContent = posts?.length || 0;
  totalFollowersSpan.textContent = Math.floor(Math.random() * 1000);
  totalEarningsSpan.textContent = `$${(Math.random() * 500).toFixed(2)}`;
}

// Logout function
logoutBtn.addEventListener('click', async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    alert('Logout failed: ' + error.message);
  } else {
    window.location.href = '/account/signin.html';
  }
});

// Initialize dashboard on page load
