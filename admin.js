// admin.js
// Admin dashboard logic for Al Mahdi platform

// HTML element selectors
const usersTable = document.getElementById('users-table-body');
const postsQueueTable = document.getElementById('posts-queue-body');
const totalUsersSpan = document.getElementById('total-users');
const totalPendingPostsSpan = document.getElementById('total-pending-posts');
const logoutBtn = document.getElementById('logout-btn');

// Load users from Supabase
async function loadUsers() {
  const { data, error } = await window.supabase
    .from('users')
    .select('id, email, username, tier, role, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading users:', error.message);
    return;
  }

  usersTable.innerHTML = '';
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

// Load pending posts
async function loadPendingPosts() {
  const { data, error } = await window.supabase
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

  document.querySelectorAll('.approve-btn').forEach(btn => {
    btn.addEventListener('click', () => updatePostStatus(btn.dataset.id, 'approved'));
  });
  document.querySelectorAll('.reject-btn').forEach(btn => {
    btn.addEventListener('click', () => updatePostStatus(btn.dataset.id, 'rejected'));
  });
}

// Approve/Reject post
async function updatePostStatus(postId, status) {
  const { error } = await window.supabase
    .from('posts')
    .update({ status })
    .eq('id', postId);

  if (error) {
    alert(`Failed to update post: ${error.message}`);
    return;
  }

  alert(`Post ${status} successfully.`);
  loadPendingPosts();
}

// Verify admin session
async function checkAdminSession() {
  const { data: { user } } = await window.supabase.auth.getUser();

  if (!user) {
    window.location.href = '/login.html';
    return;
  }

  const { data, error } = await window.supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error || !data || data.role !== 'admin') {
    alert('Access denied. Admin only.');
    window.location.href = '/';
  }
}

// Logout
async function logout() {
  await window.supabase.auth.signOut();
  window.location.href = '/login.html';
}

// Initialize
async function initAdminDashboard() {
  await checkAdminSession();
  await loadUsers();
  await loadPendingPosts();
}

logoutBtn.addEventListener('click', logout);
initAdminDashboard();
