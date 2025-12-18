// src/components/ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [approved, setApproved] = useState(false);
  const [role, setRole] = useState<string>("user");
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 🔑 Ambil user dari Supabase Auth
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
          console.error("Error getting user:", error);
        }

        setUser(user);

        if (user) {
          // 🔎 Ambil data profile dari tabel profiles
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("approved, role")
            .eq("id", user.id)
            .single();

          if (profileError) {
            console.error("Error fetching profile:", profileError);
          } else {
            setApproved(profile?.approved || false);
            setRole(profile?.role || "user");
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // ⏳ Loading spinner saat cek auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // ❌ Kalau belum login → redirect ke /signin
  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // ❌ Kalau belum approved → redirect ke halaman pending
  if (!approved) {
    return <Navigate to="/admin" replace />;
  }

  // ❌ Kalau butuh admin tapi role bukan admin → redirect ke /
  if (adminOnly && role !== "admin") {
    return <Navigate to="/" replace />;
  }
  // ✅ Kalau lolos semua pengecekan → render children
  return <>{children}</>;
}
