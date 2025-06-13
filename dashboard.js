import { supabase } from './supabaseclient.js';

async function checkSession() {
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = "login.html"; // ✅ corrected path
    return;
  }

  const user = session.user;
  const { data: profile, error } = await supabase
    .from('users')
    .select('username')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error.message);
  } else {
    document.getElementById('username').textContent = profile?.username || 'User';
  }

  // Placeholder stats (replace with actual logic when agents are live)
  document.getElementById('posts-count').textContent = "24";
  document.getElementById('engagement-rate').textContent = "12.4%";
  document.getElementById('earnings').textContent = "147.55";
}

document.getElementById("logout-button").addEventListener("click", async () => {
  await supabase.auth.signOut();
  window.location.href = "login.html"; // ✅ corrected path
});

checkSession();
