// signup.js
// Handles new user registration into Supabase users table

document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const confirmPassword = document.getElementById('confirm-password').value.trim();

  if (!email || !username || !password || !confirmPassword) {
    alert('All fields are required.');
    return;
  }

  if (password !== confirmPassword) {
    alert('Passwords do not match.');
    return;
  }

  try {
    const newUser = await Auth.registerUser(email, username, password);
    Auth.saveSession(newUser);

    // Redirect to dashboard after signup
    window.location.href = 'dashboard.html';
  } catch (err) {
    alert(err.message);
  }
});
