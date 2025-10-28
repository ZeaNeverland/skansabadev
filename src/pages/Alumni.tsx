import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Briefcase, Quote, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Alumni = {
  id: string;
  name: string;
  angkatan: string;
  pekerjaan: string | null;
  perusahaan: string | null;
  lokasi: string | null;
  image_url: string | null;
  quote: string | null;
  linkedin: string | null;
};

const AlumniPage = () => {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selectedAngkatan, setSelectedAngkatan] = useState<string>("all");
  const [selectedPekerjaan, setSelectedPekerjaan] = useState<string>("all");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('alumni')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setAlumni(data || []);
      } catch (e: any) {
        setError(e?.message || 'Gagal memuat data alumni');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Get unique angkatan and pekerjaan values for filters
  const uniqueAngkatan = useMemo(() => {
    const angkatanSet = new Set(alumni.map(al => al.angkatan));
    return Array.from(angkatanSet).sort((a, b) => Number(b) - Number(a)); // Sort descending
  }, [alumni]);

  const uniquePekerjaan = useMemo(() => {
    const pekerjaanSet = new Set(alumni.map(al => al.pekerjaan).filter(Boolean) as string[]);
    return Array.from(pekerjaanSet).sort();
  }, [alumni]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return alumni.filter(al => {
      // Text search filter
      const matchesSearch = !q ||
        [al.name, al.angkatan, al.pekerjaan, al.perusahaan, al.lokasi]
          .filter(Boolean)
          .some(v => String(v).toLowerCase().includes(q));

      // Angkatan filter
      const matchesAngkatan = selectedAngkatan === "all" || al.angkatan === selectedAngkatan;

      // Pekerjaan filter
      const matchesPekerjaan = selectedPekerjaan === "all" || al.pekerjaan === selectedPekerjaan;

      return matchesSearch && matchesAngkatan && matchesPekerjaan;
    });
  }, [alumni, query, selectedAngkatan, selectedPekerjaan]);

  const clearFilters = () => {
    setQuery("");
    setSelectedAngkatan("all");
    setSelectedPekerjaan("all");
  };

  const hasActiveFilters = query || selectedAngkatan !== "all" || selectedPekerjaan !== "all";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-3">Alumni</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Alumni RPL SMK Negeri 1 Bantul</h1>
            <p className="text-muted-foreground text-lg mb-6">Cerita singkat perjalanan para alumni RPL SMK Negeri 1 Bantul.</p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Input
                type="text"
                placeholder="Cari alumni..."
                className="pl-10 pr-4 py-3 rounded-full border shadow-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-3 text-muted-foreground h-5 w-5" />
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-6 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-3">
                <div className="w-48">
                  <Select value={selectedAngkatan} onValueChange={setSelectedAngkatan}>
                    <SelectTrigger>
                      <SelectValue placeholder="Semua Angkatan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Angkatan</SelectItem>
                      {uniqueAngkatan.map(angkatan => (
                        <SelectItem key={angkatan} value={angkatan}>
                          Angkatan {angkatan}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-48">
                  <Select value={selectedPekerjaan} onValueChange={setSelectedPekerjaan}>
                    <SelectTrigger>
                      <SelectValue placeholder="Semua Pekerjaan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Pekerjaan</SelectItem>
                      {uniquePekerjaan.map(pekerjaan => (
                        <SelectItem key={pekerjaan} value={pekerjaan}>
                          {pekerjaan}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Reset Filter
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Alumni Cards */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading && (
            <div className="text-center text-muted-foreground">Memuat data...</div>
          )}
          {error && (
            <div className="text-center text-destructive">{error}</div>
          )}
          {!loading && !error && (
            <>
              {hasActiveFilters && (
                <div className="mb-4 text-center text-sm text-muted-foreground">
                  Menampilkan {filtered.length} dari {alumni.length} alumni
                </div>
              )}

              {filtered.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Tidak ada alumni yang sesuai dengan filter.</p>
                  {hasActiveFilters && (
                    <Button variant="outline" className="mt-4" onClick={clearFilters}>
                      Reset Filter
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((al) => (
                    <Card key={al.id} className="hover:shadow-lg transition-shadow duration-300 overflow-hidden border-0 shadow-md">
                      <CardHeader className="pb-3 bg-gradient-to-r from-primary/10 to-secondary/10">
                        <div className="flex flex-col items-center">
                          <img
                            src={al.image_url || 'https://placehold.co/200x200?text=Alumni'}
                            alt={al.name}
                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md mb-3"
                          />
                          <CardTitle className="text-xl text-center">{al.name}</CardTitle>
                          <Badge variant="outline" className="mt-1 bg-white/80">Angkatan {al.angkatan}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex items-center text-sm">
                            <Briefcase className="h-4 w-4 mr-2 text-primary" />
                            <span className="font-medium">{al.pekerjaan || '-'}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{[al.perusahaan, al.lokasi].filter(Boolean).join(', ')}</span>
                          </div>

                          <div className="pt-2 border-t border-border">
                            <div className="flex items-start">
                              <Quote className="h-4 w-4 mr-2 text-primary mt-1 flex-shrink-0" />
                              <p className="text-sm italic text-muted-foreground">{al.quote ? `"${al.quote}"` : ' '}</p>
                            </div>
                          </div>

                          <div className="pt-3 flex justify-center">
                            {al.linkedin && (
                              <Button size="sm" variant="outline" className="rounded-full">
                                <a href={al.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                  Lihat Profil LinkedIn
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-6">Apa Kata Mereka Tentang RPL?</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="italic text-lg mb-4">"RPL SMK Negeri 1 Bantul memberikan fondasi teknologi yang kuat bagi saya. Guru-guru yang kompeten dan kurikulum yang relevan membuat saya siap menghadapi dunia kerja."</p>
              <div className="font-medium">- Alumni Angkatan 2017, Software Engineer di Microsoft</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AlumniPage;