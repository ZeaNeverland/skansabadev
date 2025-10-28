// Supabase OAuth callback handler for Vite React
// - Expects VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to be defined in your env
// - Add a route to serve this file or import it in a callback page if needed

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error('Supabase env vars missing: VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

(async () => {
  try {
    // This exchanges the `code` in the current URL for a session (PKCE flow)
    const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
    if (error) {
      // eslint-disable-next-line no-console
      console.error('Supabase auth callback error:', error.message);
      // Optionally show a minimal UI error if this script is run in a page
      const el = document.getElementById('auth-status');
      if (el) el.textContent = `Login gagal: ${error.message}`;
      return;
    }
    // Redirect to your app page after successful login
    const redirectTo = sessionStorage.getItem('post_login_redirect') || '/';
    sessionStorage.removeItem('post_login_redirect');
    window.location.replace(redirectTo);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Unexpected error handling auth callback:', e);
    const el = document.getElementById('auth-status');
    if (el) el.textContent = 'Terjadi kesalahan saat memproses login.';
  }
})();
