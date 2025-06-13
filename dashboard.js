// dashboard.js
// Al Mahdi user dashboard logic (Frontend + Supabase + Agent sync)

// Initialize Supabase
const SUPABASE_URL = 'https://jaqjxmttwwcenndrsizq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // (Use full key)
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM elements
const userEmailSpan = document.getElementById('user-email');
const userTierSpan = document.getElementById('user-tier');
const logoutBtn = document.getElementById('logout-btn');
const automationToggle = document.getElementById('automation-toggle');
const scheduledPostsContainer = document.getElementById('scheduled-posts');
const followersCount = document.getElementById('followers-count');
const viewsCount = document.getElementById('views-count');
const clicksCount = document.getElementById('clicks-count');
const totalIncome = document.getElementById('total-income');

// Load current user
async function getUserProfile() {
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();
  if (error || !user) {
    window.location.href = '/login.html';
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('Error loading user profile:', profileError);
    return null;
  }

  return profile;
}

// Render user info
async function renderUser() {
  const profile = await getUserProfile();
  if (!profile) return;

  userEmailSpan.textContent = profile.email;
  userTierSpan.textContent = profile.tier || 'Free';
  automationToggle.checked = profile.automation_enabled || false;
}

// Handle automation toggle
automationToggle.addEventListener('change', async () => {
  const enabled = automationToggle.checked;
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return;

  const { error } = await supabase
    .from('users')
    .update({ automation_enabled: enabled })
    .eq('id', user.id);

  if (error) {
    alert('Failed to update automation setting.');
    automationToggle.checked = !enabled;
  } else {
    alert(`Automation ${enabled ? 'enabled' : 'disabled'} successfully.`);
  }
});

// Load scheduled posts
async function loadScheduledPosts() {
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: posts, error } = await supabase
    .from('scheduled_posts')
    .select('*')
    .eq('user_id', user.id)
    .order('scheduled_at', { ascending: true });

  if (error) {
    console.error('Error loading scheduled posts:', error);
    return;
  }

  if (posts.length === 0) {
    scheduledPostsContainer.innerHTML = '<p>No content scheduled yet.</p>';
    return;
  }

  scheduledPostsContainer.innerHTML = '';
  posts.forEach(post => {
    const div = document.createElement('div');
    div.innerHTML = `
      <p><strong>${post.title}</strong> — Scheduled for: ${new Date(
      post.scheduled_at
    ).toLocaleString()}</p>
    `;
    scheduledPostsContainer.appendChild(div);
  });
}

// Load performance metrics
async function loadPerformance() {
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data, error } = await supabase
    .from('performance')
    .select('views, followers, clicks')
    .eq('user_id', user.id)
    .single();

  if (error || !data) {
    console.error('Error loading performance:', error);
    return;
  }

  viewsCount.textContent = data.views || 0;
  followersCount.textContent = data.followers || 0;
  clicksCount.textContent = data.clicks || 0;
}

// Load monetization
async function loadMonetization() {
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data, error } = await supabase
    .from('monetization')
    .select('income')
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error loading monetization:', error);
    return;
  }

  totalIncome.textContent = `$${(data?.income || 0).toFixed(2)}`;
}

// Logout
logoutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.href = '/login.html';
});

// Init dashboard
async function initDashboard() {
  await renderUser();
  await loadScheduledPosts();
  await loadPerformance();
  await loadMonetization();
}

initDashboard();
