// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import OrganizationalStructure from "./pages/OrganizationalStructure";
import StudentWorks from "./pages/StudentWorks";
import Facilities from "./pages/Facilities";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/Admin";
import SignIn from "./pages/auth/signin";
import SignUp from "./pages/auth/signup";
import AuthCallback from "./pages/auth/AuthCallback";
import GalleryPage from "./pages/gallery";
import PrestasiPage from "./pages/Prestasi";
import UnitProduksiPage from "./pages/UnitProduksi";
import AlumniPage from "./pages/Alumni";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import KurikulumPage from './components/KurikulumPage';
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <ScrollToTop />
        <Navigation />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/struktur-organisasi" element={<OrganizationalStructure />} />
          <Route path="/karya-siswa" element={<StudentWorks />} />
          <Route path="/fasilitas" element={<Facilities />} />
          <Route path="/prestasi" element={<PrestasiPage />} />
          <Route path="/unit-produksi" element={<UnitProduksiPage />} />
          <Route path="/alumni" element={<AlumniPage />} />
          <Route path="/berita" element={<News />} />
          <Route path="/berita/:id" element={<NewsDetail />} />
          <Route path="/kontak" element={<Contact />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/kurikulum" element={<KurikulumPage />} />

          {/* Auth routes */}
          <Route path="/auth" element={<Navigate to="/signin" replace />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Protected user route */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <div>Halaman Profil</div>
              </ProtectedRoute>
            }
          />

          {/* Protected admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all not found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
