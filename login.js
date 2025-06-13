// login.js
// Handles user login using local Supabase users table

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    alert('Please fill in both email and password.');
    return;
  }

  try {
    const user = await Auth.loginUser(email, password);
    Auth.saveSession(user);

    // Redirect to dashboard after login
    window.location.href = 'dashboard.html';
  } catch (err) {
    alert(err.message);
  }
});
