import { supabase } from './supabaseclient.js';

const signupForm = document.getElementById('signup-form');
const errorMsg = document.getElementById('error-msg');
const successMsg = document.getElementById('success-msg');

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorMsg.style.display = 'none';
  successMsg.style.display = 'none';

  const username = signupForm.username.value.trim();
  const email = signupForm.email.value.trim();
  const password = signupForm.password.value.trim();

  if (!username || !email || !password) {
    errorMsg.textContent = 'Please fill in all fields.';
    errorMsg.style.display = 'block';
    return;
  }
  if (password.length < 6) {
    errorMsg.textContent = 'Password must be at least 6 characters.';
    errorMsg.style.display = 'block';
    return;
  }

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    errorMsg.textContent = error.message || 'Failed to sign up.';
    errorMsg.style.display = 'block';
    return;
  }

  const userId = data.user.id;

  const { error: profileError } = await supabase
    .from('users')
    .upsert({ id: userId, username: username })
    .eq('id', userId);

  if (profileError) {
    errorMsg.textContent = 'Signup succeeded but failed to save username.';
    errorMsg.style.display = 'block';
    return;
  }

  successMsg.textContent = 'Signup successful! Please check your email to confirm your account.';
  successMsg.style.display = 'block';

  signupForm.reset();
  setTimeout(() => {
    window.location.href = '/account/signin.html';
  }, 4000);
});
