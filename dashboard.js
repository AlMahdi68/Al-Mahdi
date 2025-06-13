import { supabase } from './supabaseclient.js';

async function checkSession() {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error("Session error:", sessionError.message);
    return;
  }

  if (!session) {
    window.location.href = "login.html"; // ✅ Slash removed
    return;
  }

  const user = session.user;

  // Fetch user profile data
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('username')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error("Error fetching user profile:", profileError.message);
  } else {
    const username = profile?.username || "User";
    document.getElementById("username").textContent = username;
  }

  // Placeholder values (these will be dynamic when agents are integrated)
  loadAgentStats();
}

// Simulate stats (replace with actual Supabase or agent logic later)
function loadAgentStats() {
  // In future, fetch this from Supabase or agent outputs
  const posts = 42;
  const engagement = 8.7;
  const earnings = 319.45;

  document.getElementById("posts-count").textContent = posts;
  document.getElementById("engagement-rate").textContent = `${engagement}%`;
  document.getElementById("earnings").textContent = earnings.toFixed(2);
}

// Logout logic
document.getElementById("logout-button").addEventListener("click", async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Logout error:", error.message);
    return;
  }
  window.location.href = "login.html"; // ✅ Slash removed
});

// On page load
checkSession();
