import { Button } from "@/components/ui/button";
import { Menu, X, User as UserIcon, ChevronDown } from "lucide-react";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import { IMAGES } from "@/assets/images";

type NavItem = {
  name: string;
  href: string;
  external?: boolean;
};

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const adminMenuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [navHeight, setNavHeight] = useState<number>(64);

  const navItems: NavItem[] = useMemo(
    () => [
      { name: "Beranda", href: "/" },
      { name: "Struktur Organisasi", href: "/struktur-organisasi" },
      { name: "Prestasi Siswa", href: "/prestasi" },
      { name: "Karya Siswa", href: "/karya-siswa" },
      { name: "Fasilitas", href: "/fasilitas" },
      { name: "Unit Produksi", href: "/unit-produksi" },
      { name: "Dokumen", href: "/kurikulum" },
      { name: "Gallery", href: "/gallery" },
      { name: "Alumni", href: "/alumni" },
    ],
    []
  );

  const isActive = useCallback(
    (path: string) =>
      location.pathname === path ||
      (path !== "/" && location.pathname.startsWith(path)),
    [location.pathname]
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };
    checkUser();
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target as Node)) {
        setIsAdminMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
      setIsMenuOpen(false);
      setIsAdminMenuOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, [navigate]);

  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const toggleAdminMenu = useCallback(() => setIsAdminMenuOpen((prev) => !prev), []);

  // Close all menus when route changes
  useEffect(() => {
    closeMenu();
    setIsAdminMenuOpen(false);
  }, [location, closeMenu]);

  useEffect(() => {
    // Keep spacer height in sync with the actual nav height. Use ResizeObserver when available
    const observed = navRef.current;
    if (!observed) return;

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => {
        setNavHeight(observed.offsetHeight || 0);
      });
      ro.observe(observed);
      // set initial
      setNavHeight(observed.offsetHeight || 0);
      return () => ro.disconnect();
    }

    const update = () => setNavHeight(observed.offsetHeight || 0);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (isLoading) {
    return (
      <>
        {/* Spacer while loading so content doesn't jump under the nav */}
        <div aria-hidden="true" style={{ height: navHeight }} />
        <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-sm h-16" aria-label="Main navigation loading">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="h-10 w-40 bg-muted rounded animate-pulse" />
              <div className="h-8 w-8 bg-muted rounded-full" />
            </div>
          </div>
        </nav>
      </>
    );
  }

  return (
    <>
  {/* Spacer: Prevent content from being covered by navbar */}
  <div aria-hidden="true" style={{ height: navHeight }} />

      <nav
        ref={navRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-16",
          isScrolled ? "shadow-md bg-background/95 backdrop-blur-md border-b border-border" : "bg-background"
        )}
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                to="/"
                onClick={closeMenu}
                className="flex items-center space-x-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Home"
              >
                <img
                  src={IMAGES.logoSquare}
                  alt="SMK Negeri 1 Bantul"
                  className="h-10 w-auto"
                  loading="eager"
                />
                <div className="flex flex-col leading-tight">
                  <h1 className="text-lg font-bold">Rekayasa Perangkat Lunak</h1>
                  <p className="text-xs text-muted-foreground">SMK Negeri 1 Bantul</p>
                </div>
              </Link>

              {user && (
                <div className="hidden md:block ml-4 relative" ref={adminMenuRef}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-2 py-1 text-sm flex items-center space-x-1"
                    onClick={toggleAdminMenu}
                    aria-expanded={isAdminMenuOpen}
                    aria-haspopup="true"
                  >
                    <UserIcon className="h-4 w-4" />
                    <span>Admin</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isAdminMenuOpen && "rotate-180"
                      )}
                    />
                  </Button>
                  {isAdminMenuOpen && (
                    <div
                      className="absolute left-0 mt-1 w-44 bg-background border border-border rounded-md shadow-lg py-1 z-50"
                      role="menu"
                      aria-label="Admin menu"
                    >
                      <Button
                        variant="ghost"
                        asChild
                        className="w-full justify-start px-2 py-1.5 h-8 text-sm"
                        role="menuitem"
                      >
                        <Link to="/admin" onClick={() => setIsAdminMenuOpen(false)}>
                          <UserIcon className="h-4 w-4 mr-1" />
                          <span>Panel Admin</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-2 py-1.5 h-8 text-sm text-destructive hover:text-destructive"
                        onClick={handleSignOut}
                        role="menuitem"
                      >
                        Keluar
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center space-x-0.5">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  asChild
                  variant="ghost"
                  className={cn(
                    "px-2 py-1 h-9 text-sm",
                    isActive(item.href) && "text-primary font-medium"
                  )}
                  onClick={closeMenu}
                >
                  <Link to={item.href}>{item.name}</Link>
                </Button>
              ))}
            </div>

            {/* Auth */}
            <div className="hidden md:flex items-center space-x-2 ml-2">
              {!user && (
                <Button variant="ghost" asChild className="h-9 px-2 py-1 text-sm">
                  <Link to="/auth">
                    <UserIcon className="h-4 w-4 mr-1" />
                    <span>Masuk</span>
                  </Link>
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div
              className="md:hidden absolute top-full left-0 right-0 bg-background border-t border-border shadow-lg z-40"
              role="dialog"
              aria-label="Mobile navigation"
            >
              <div className="container mx-auto px-3 py-1.5">
                {navItems.map((item) => (
                  <Button
                    key={item.href}
                    asChild
                    variant="ghost"
                    className={cn(
                      "w-full justify-start py-1.5 h-9 text-sm",
                      isActive(item.href) && "bg-muted"
                    )}
                    onClick={closeMenu}
                  >
                    <Link to={item.href}>{item.name}</Link>
                  </Button>
                ))}
                <div className="border-t border-border my-1" />
                {user ? (
                  <>
                    <Button
                      variant="ghost"
                      asChild
                      className="w-full justify-start py-1.5 h-9 text-sm"
                      onClick={closeMenu}
                    >
                      <Link to="/admin">Panel Admin</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start py-1.5 h-9 text-sm text-destructive hover:text-destructive"
                      onClick={handleSignOut}
                    >
                      Keluar
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    asChild
                    className="w-full justify-start py-1.5 h-9 text-sm"
                    onClick={closeMenu}
                  >
                    <Link to="/auth">Masuk</Link>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navigation;