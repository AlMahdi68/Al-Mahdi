// auth.js
// Handles user authentication for Al Mahdi using Supabase Auth

const SUPABASE_URL = 'https://jaqjxmttwwcenndrsizq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphcWp4bXR0d3djZW5uZHJzaXpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NzU5MjgsImV4cCI6MjA2NTM1MTkyOH0.PjDBZk79fHnmMgKhtSTo_BtkwN9YeGsz9Sd1lZqhTwQ';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Elements for Sign Up
const signupForm = document.getElementById('signup-form');
const signupEmailInput = document.getElementById('signup-email');
const signupPasswordInput = document.getElementById('signup-password');
const signupErrorMsg = document.getElementById('signup-error');

// Elements for Sign In
const signinForm = document.getElementById('signin-form');
const signinEmailInput = document.getElementById('signin-email');
const signinPasswordInput = document.getElementById('signin-password');
const signinErrorMsg = document.getElementById('signin-error');

// Elements for Logout (if on a page with logout button)
const logoutBtn = document.getElementById('logout-btn');

// Sign Up handler
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    signupErrorMsg.textContent = '';

    const email = signupEmailInput.value.trim();
    const password = signupPasswordInput.value;

    if (!email || !password) {
      signupErrorMsg.textContent = 'Email and password are required.';
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      signupErrorMsg.textContent = error.message;
      return;
    }

    alert('Sign up successful! Please check your email for verification.');
    // Optionally redirect to sign-in page
    window.location.href = '/account/signin.html';
  });
}

// Sign In handler
if (signinForm) {
  signinForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    signinErrorMsg.textContent = '';

    const email = signinEmailInput.value.trim();
    const password = signinPasswordInput.value;

    if (!email || !password) {
      signinErrorMsg.textContent = 'Email and password are required.';
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      signinErrorMsg.textContent = error.message;
      return;
    }

    // Redirect user based on role or to dashboard by default
    // For now, redirect to user dashboard
    window.location.href = '/dashboard.html';
  });
}

// Logout handler
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert('Failed to log out: ' + error.message);
      return;
    }
    window.location.href = '/account/signin.html';
  });
}

// Optional: check auth session and redirect if user already signed in
async function checkAuthSession() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // If user is on signin or signup page and already logged in, redirect to dashboard
    if (
      window.location.pathname.includes('signin.html') ||
      window.location.pathname.includes('signup.html')
    ) {
      window.location.href = '/dashboard.html';
    }
  } else {
    // If user is on a protected page without auth, redirect to signin
    const protectedPages = ['/dashboard.html', '/admin.html'];
    if (protectedPages.some((page) => window.location.pathname.includes(page))) {
      window.location.href = '/account/signin.html';
    }
  }
}

// Run on page load
checkAuthSession();
