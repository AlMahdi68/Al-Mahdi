# Social Automation Platform (Flat Repo Quickstart)

Monetize and automate your socials with AI-powered agents.  
**Frontend:** Static HTML/JS/CSS (no frameworks)  
**Backend:** Supabase (DB + Auth + Functions)

---

## Supabase Credentials (use these in your code!)

- **Supabase Project URL**: `https://jaqjxmttwwcenndrsizq.supabase.co`
- **Supabase Anon Public Key**:  
  `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphcWp4bXR0d3djZW5uZHJzaXpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NzU5MjgsImV4cCI6MjA2NTM1MTkyOH0.PjDBZk79fHnmMgKhtSTo_BtkwN9YeGsz9Sd1lZqhTwQ`

---

## 📦 Flat Repo Structure

All files are in the root.  
Upload only what you need to GitHub Pages (frontend) or Supabase (backend).

### Main Files:
- `index.html`, `login.html`, `signup.html`, `dashboard.html`, `admin.html`
- `style.css`
- `supabaseClient.js`, `auth.js`, `dashboard.js`, `admin.js`
- `contentAgent.ts`, `viralBoostAgent.ts`, `monetizationAgent.ts`, `analyticsAgent.ts`, `platformAgent.ts` (for Supabase Edge Functions)
- `schema.sql` (Supabase database setup)

## 🟢 Quickstart

1. **GitHub Pages**
   - Upload all frontend files above to your repo root.
   - In GitHub repo settings: Pages → Source: root (`/`) folder.
   - Wait for deployment, visit your GitHub Pages URL.

2. **Supabase Setup**
   - Create a Supabase project.
   - In Supabase dashboard → SQL Editor, run `schema.sql`.
   - Deploy each `*.ts` agent file via [Supabase CLI](https://supabase.com/docs/guides/functions/cli) or the dashboard if supported.

3. **Configure**
   - Supabase credentials are already set in `supabaseClient.js`.

4. **Test**
   - Sign up, log in, and use the dashboard.

5. **Next Steps**
   - Build out dashboard logic.
   - Hook up frontend to Edge Functions.
   - Add OAuth, analytics, scheduling, etc.

---

**All files above are ready to drag-and-drop or upload directly.**
