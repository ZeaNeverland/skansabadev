import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AuthCallback = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Memproses login...");

  useEffect(() => {
    (async () => {
      try {
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        if (error) {
          setMessage(`Login gagal: ${error.message}`);
          return;
        }
        const redirectTo = sessionStorage.getItem("post_login_redirect") || "/admin";
        sessionStorage.removeItem("post_login_redirect");
        navigate(redirectTo, { replace: true });
      } catch (e) {
        setMessage("Terjadi kesalahan saat memproses login.");
        // eslint-disable-next-line no-console
        console.error("Unexpected error handling auth callback:", e);
      }
    })();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-sm text-muted-foreground" id="auth-status">
        {message}
      </div>
    </div>
  );
};

export default AuthCallback;
