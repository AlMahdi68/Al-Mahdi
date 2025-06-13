document.addEventListener("DOMContentLoaded", async () => {
  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  document.getElementById("stats").textContent = `Welcome to your dashboard, ${user.email}!`;

  // Log out
  document.getElementById("logout-btn").addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.href = "index.html";
  });
});
