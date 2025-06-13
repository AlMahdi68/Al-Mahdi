// supabaseclient.js

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fmofmuvhvjqawjcxpofg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtb2ZtdXZodmpxYXdqY3hwb2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3ODE5NTEsImV4cCI6MjA2NTM1Nzk1MX0.UL5nlwIUPy8fnYcU8bY32Dd0Zcf7r5QZB5IKuAoggl4'
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
