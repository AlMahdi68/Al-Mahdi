// Login
document.getElementById("login-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    document.getElementById("login-error").textContent = error.message;
    return;
  }
  window.location.href = "dashboard.html";
});

// Signup
document.getElementById("signup-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    document.getElementById("signup-error").textContent = error.message;
    return;
  }
  // Optionally insert user profile into 'users' table
  if (data.user) {
    await supabase.from("users").insert([{ id: data.user.id, name, email }]);
    window.location.href = "dashboard.html";
  }
});
