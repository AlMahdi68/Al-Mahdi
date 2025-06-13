// auth.js
// Handles login and registration logic using Supabase DB directly (not Supabase Auth)

const SUPABASE_URL = 'https://jaqjxmttwwcenndrsizq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Truncated for safety
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// REGISTER NEW USER
async function registerUser(email, username, password) {
  const { data, error } = await supabase
    .from('users')
    .insert([
      { email, username, password, tier: 'Free', role: 'user' }
    ]);

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
}

// LOGIN EXISTING USER
async function loginUser(email, password) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .eq('password', password)
    .single();

  if (error || !data) {
    throw new Error('Invalid email or password');
  }

  return data;
}

// SAVE SESSION TO LOCAL STORAGE
function saveSession(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

// LOGOUT
function logoutUser() {
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

// GET SESSION USER
function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// AUTH REDIRECT GUARD (optional, redirect if no session)
function checkAuthOrRedirect() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
  }
}

// EXPORT
window.Auth = {
  registerUser,
  loginUser,
  saveSession,
  logoutUser,
  getCurrentUser,
  checkAuthOrRedirect,
};
