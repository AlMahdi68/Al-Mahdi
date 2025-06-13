// admin.js
// Admin dashboard main logic for Al Mahdi platform connected to Supabase

// Your Supabase project info (replace with your actual keys)
const SUPABASE_URL = 'https://jaqjxmttwwcenndrsizq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphcWp4bXR0d3djZW5uZHJzaXpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NzU5MjgsImV4cCI6MjA2NTM1MTkyOH0.PjDBZk79fHnmMgKhtSTo_BtkwN9YeGsz9Sd1lZqhTwQ';

// Initialize Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Elements from your HTML (adjust IDs accordingly)
const usersTable = document.getElementById('users-table-body');
const postsQueueTable = document.getElementById('posts-queue-body');
const totalUsersSpan = document.getElementById('total-users');
const totalPendingPostsSpan = document.getElementById('total-pending-posts');
const logoutBtn = document.getElementById('logout-btn');

// Fetch and render list of users with roles and tiers
async function loadUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, username, tier, role, created_at')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error loading users:', error.message);
    return;
  }

  usersTable.innerHTML = ''; // clear existing rows

  data.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.id}</td>
      <td>${user.email}</td>
      <td>${user.username || '-'}</td>
      <td>${user.tier || 'Free'}</td>
      <td>${user.role || 'User'}</td>
      <td>${new Date(user.created_at).toLocaleDateString()}</td>
    `;
    usersTable.appendChild(tr);
  });

  totalUsersSpan.textContent = data.length;
}

// Fetch and render posts/content pending approval
async function loadPendingPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, user_id, status, created_at')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error loading pending posts:', error.message);
    return;
  }

  postsQueueTable.innerHTML = '';

  data.forEach(post => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${post.id}</td>
      <td>${post.title}</td>
      <td>${post.user_id}</td>
      <td>${new Date(post.created_at).toLocaleString()}</td>
      <td>
        <button class="approve-btn" data-id="${post.id}">Approve</button>
        <button class="reject-btn" data-id="${post.id}">Reject</button>
      </td>
    `;
    postsQueueTable.appendChild(tr);
  });

  totalPendingPostsSpan.textContent = data.length;

  // Attach event listeners for approve/reject
  document.querySelectorAll('.approve-btn').forEach(btn => {
    btn.addEventListener('click', () => handlePostApproval(btn.dataset.id, true));
  });
  document.querySelectorAll('.reject-btn').forEach(btn => {
    btn.addEventListener('click', () => handlePostApproval(btn.dataset.id, false));
  });
}

// Approve or reject a post by updating its status
async function handlePostApproval(postId, approve) {
  const newStatus = approve ? 'approved' : 'rejected';
  const { error } = await supabase
    .from('posts')
    .update({ status: newStatus })
    .eq('id', postId);

  if (error) {
    alert(`Failed to ${approve ? 'approve' : 'reject'} post: ${error.message}`);
    return;
  }
  alert(`Post ${approve ? 'approved' : 'rejected'} successfully.`);
  // Refresh the pending posts list
  loadPendingPosts();
}

// Simple admin authentication check (optional, if using Supabase Auth)
async function checkAdminSession() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    window.location.href = '/account/signin.html'; // redirect to login page
    return;
  }

  // Check user role, redirect if not admin
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error || !data || data.role !== 'admin') {
    alert('Access denied. You must be an admin to view this page.');
    window.location.href = '/';
  }
}

// Logout admin
async function logout() {
  await supabase.auth.signOut();
  window.location.href = '/account/signin.html';
}

// Initialize dashboard on load
async function initAdminDashboard() {
  await checkAdminSession();
  await loadUsers();
  await loadPendingPosts();
}

// Event listeners
logoutBtn.addEventListener('click', logout);

// Run the dashboard
initAdminDashboard();

