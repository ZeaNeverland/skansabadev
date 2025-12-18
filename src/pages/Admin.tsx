import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import {
  Newspaper,
  Building,
  Trophy,
  FolderOpen,
  Images,
  BookOpen,
  Users,
  GraduationCap,
  LogOut,
  User,
  Home
} from 'lucide-react';

// Lazy-load modular components to speed up initial paint
const News = lazy(() => import('@/app/admin/news'));
const Facilities = lazy(() => import('@/app/admin/facilities'));
const StudentWorks = lazy(() => import('@/app/admin/student-works'));
const Gallery = lazy(() => import('@/app/admin/gallery'));
const Achievements = lazy(() => import('@/app/admin/achievements').then(m => ({ default: m.Achievements })));
const Kurikulum = lazy(() => import('@/app/admin/kurikulum').then(m => ({ default: m.Kurikulum })));
const OrganizationAdmin = lazy(() => import('@/app/admin/organization').then(m => ({ default: m.OrganizationAdmin })));
const AlumniAdmin = lazy(() => import('@/app/admin/alumni'));

// Types
type User = {
  id: string;
  email?: string;
};
type Profile = {
  display_name: string | null;
  role: string | null;
  approved: boolean | null;
};

// Sidebar items configuration
const sidebarItems = [
  { id: 'news', label: 'Berita', icon: Newspaper },
  { id: 'facilities', label: 'Fasilitas', icon: Building },
  { id: 'achievements', label: 'Prestasi', icon: Trophy },
  { id: 'student_works', label: 'Karya Siswa', icon: FolderOpen },
  { id: 'gallery', label: 'Galeri', icon: Images },
  { id: 'kurikulum', label: 'Kurikulum', icon: BookOpen },
  { id: 'organization', label: 'Struktur Organisasi', icon: Users },
  { id: 'alumni', label: 'Alumni', icon: GraduationCap },
];

// ================ Component ================
const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('news');

  // Check if we're on admin page to hide navigation
  useEffect(() => {
    const isAdminPage = location.pathname.startsWith('/admin');
    if (isAdminPage) {
      // Hide the navigation component if it exists
      const navElement = document.querySelector('nav');
      if (navElement) {
        navElement.setAttribute('style', 'display: none !important');
      }
      
      // Also hide footer if it exists
      const footerElement = document.querySelector('footer');
      if (footerElement) {
        footerElement.setAttribute('style', 'display: none !important');
      }
    }
    
    return () => {
      // Restore navigation and footer when leaving admin page
      const navElement = document.querySelector('nav');
      if (navElement) {
        navElement.setAttribute('style', '');
      }
      
      const footerElement = document.querySelector('footer');
      if (footerElement) {
        footerElement.setAttribute('style', '');
      }
    };
  }, [location.pathname]);

  // ================= Auth =================
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        if (!session?.user) {
          navigate('/login');
          return;
        }
        setUser(session.user);
        // Allow UI to render quickly; fetch profile in background
        setLoading(false);
        try {
          const { data: prof } = await supabase
            .from('profiles')
            .select('display_name, role, approved')
            .eq('user_id', session.user.id)
            .single();
          setProfile(prof as Profile);
        } catch (e) {
          // Non-blocking if profile not found
          console.warn('Profile fetch warning:', e);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        setAuthError('Terjadi kesalahan saat memverifikasi autentikasi');
        toast({
          title: 'Error Autentikasi',
          description: 'Gagal memverifikasi sesi Anda. Silakan login kembali.',
          variant: 'destructive',
        });
        navigate('/login');
      } finally {
        // Ensure loading ends in any case (already set earlier on success)
        setLoading(false);
      }
    };
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        navigate('/login');
      } else {
        setUser(session.user);
        setAuthError(null);
        // Refresh profile when auth state changes
        try {
          const { data } = await supabase
            .from('profiles')
            .select('display_name, role, approved')
            .eq('user_id', session.user.id)
            .single();
          setProfile(data as Profile);
        } catch (_e) {
          // ignore profile refresh errors
        }
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  // Handle sign out
  const handleSignOut = useCallback(async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: 'Berhasil',
        description: 'Anda telah keluar dari sistem',
        variant: 'default',
      });
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Error',
        description: 'Gagal keluar. Silakan coba lagi.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [navigate, toast]);

  // Navigate to home page
  const handleGoHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error Autentikasi</CardTitle>
            <CardDescription>{authError}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/login')} className="w-full">
              Kembali ke Halaman Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login due to useEffect
  }

  // ================= Sidebar Content =================
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar className="w-64 border-r bg-white">
          <SidebarHeader className="border-b p-4">
            <h2 className="text-lg font-semibold">Admin Panel</h2>
          </SidebarHeader>
          
          <SidebarContent>
            {/* Back to Home Button */}
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={handleGoHome}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    >
                      <Home className="h-4 w-4" />
                      <span>Kembali ke Beranda</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            {/* Admin Menu Items */}
            <SidebarGroup>
              <SidebarGroupLabel>Menu Admin</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveTab(item.id)}
                        isActive={activeTab === item.id}
                        className="flex items-center gap-2"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="border-t p-4 bg-gray-50">
            <div className="flex flex-col gap-4">
              <div className="bg-white p-3 rounded-lg border shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {profile?.display_name || user.email}
                  </span>
                </div>
                {profile?.role && (
                  <Badge variant="secondary" className="uppercase text-xs">
                    {profile.role}
                  </Badge>
                )}
                {profile?.approved !== null && (
                  <div className="mt-1">
                    <span className={`text-xs ${profile?.approved ? 'text-green-600' : 'text-yellow-600'}`}>
                      {profile?.approved ? 'Approved' : 'Pending approval'}
                    </span>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="w-full flex items-center gap-2"
                disabled={loading}
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">
              {sidebarItems.find(item => item.id === activeTab)?.label || 'Admin Panel'}
            </h1>
          </div>

          {/* ================= NEWS ================= */}
          {activeTab === 'news' && (
            <Suspense fallback={<div className="text-sm text-muted-foreground">Memuat Berita...</div>}>
              <News />
            </Suspense>
          )}

          {/* ================= FACILITIES ================= */}
          {activeTab === 'facilities' && (
            <Suspense fallback={<div className="text-sm text-muted-foreground">Memuat Fasilitas...</div>}>
              <Facilities />
            </Suspense>
          )}

          {/* ================= ACHIEVEMENTS ================= */}
          {activeTab === 'achievements' && (
            <Suspense fallback={<div className="text-sm text-muted-foreground">Memuat Prestasi...</div>}>
              <Achievements />
            </Suspense>
          )}

          {/* ================= STUDENT WORKS ================= */}
          {activeTab === 'student_works' && (
            <Suspense fallback={<div className="text-sm text-muted-foreground">Memuat Karya Siswa...</div>}>
              <StudentWorks />
            </Suspense>
          )}

          {/* ================= GALLERY ================= */}
          {activeTab === 'gallery' && (
            <Suspense fallback={<div className="text-sm text-muted-foreground">Memuat Galeri...</div>}>
              <Gallery />
            </Suspense>
          )}

          {/* ================= KURIKULUM ================= */}
          {activeTab === 'kurikulum' && (
            <Suspense fallback={<div className="text-sm text-muted-foreground">Memuat Kurikulum...</div>}>
              <Kurikulum />
            </Suspense>
          )}

          {/* ================= ORGANIZATION ================= */}
          {activeTab === 'organization' && (
            <Suspense fallback={<div className="text-sm text-muted-foreground">Memuat Struktur Organisasi...</div>}>
              <OrganizationAdmin />
            </Suspense>
          )}

          {/* ================= ALUMNI ================= */}
          {activeTab === 'alumni' && (
            <Suspense fallback={<div className="text-sm text-muted-foreground">Memuat Alumni...</div>}>
              <AlumniAdmin />
            </Suspense>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Admin;