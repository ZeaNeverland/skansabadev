import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DevelopersModal } from "@/components/DevelopersModal";
import type { Database } from "@/integrations/supabase/types";
import { IMAGES } from "@/assets/images";

import dycode from "@/assets/images/dycode.jfif";
import javan from "@/assets/images/javan.jfif";
import mitra from "@/assets/images/mitra.jfif";
import solusi from "@/assets/images/solusi.jfif";
// Tipe berita dari Supabase
type NewsItem = Database["public"]["Tables"]["news"]["Row"];

// Array gambar untuk berita
const localImages = [IMAGES.news1, IMAGES.news2];
const getLocalImage = (index: number) => localImages[index % localImages.length];
const LatestNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleNewsCount, setVisibleNewsCount] = useState(4); // Awalnya tampilkan 4 berita
  const [otherNewsCount] = useState(3); // Jumlah berita di bagian "Berita Lainnya"

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: newsData, error } = await supabase
        .from("news")
        .select("*")
        .order("date", { ascending: false });
      if (error) throw error;
      setNews(newsData || []);
    } catch (err) {
      console.error("Gagal memuat data berita:", err);
      setError("Gagal memuat berita. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Akademik: "bg-blue-100 text-blue-800",
      Kemitraan: "bg-green-100 text-green-800",
      Workshop: "bg-purple-100 text-purple-800",
      Fasilitas: "bg-orange-100 text-orange-800",
      Pelatihan: "bg-pink-100 text-pink-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const featuredNews = news.find((item) => item.featured);
  const regularNews = news.filter((item) => !item.featured);

  // Debug log untuk melihat data
  console.log("Total berita:", news.length);
  console.log("Berita unggulan:", featuredNews ? "Ada" : "Tidak ada");
  console.log("Berita biasa:", regularNews.length);

  // Berita untuk bagian utama (featured + regular news)
  const mainNews = featuredNews
    ? [featuredNews, ...regularNews.slice(0, visibleNewsCount - 1)]
    : regularNews.slice(0, visibleNewsCount);

  // Berita untuk bagian "Berita Lainnya" - ambil berita yang tidak ada di mainNews
  const otherNews = news.filter(item =>
    !mainNews.some(mainItem => mainItem.id === item.id)
  ).slice(0, otherNewsCount);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Memuat berita...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center max-w-md">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchData} variant="outline">
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Bagian Berita */}
      <section id="berita" className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Berita Terkini</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Informasi terbaru seputar kegiatan, prestasi, dan perkembangan Jurusan Rekayasa Perangkat Lunak
            </p>
            <Button variant="ghost" className="mx-auto mt-4" onClick={fetchData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Muat Ulang Berita
            </Button>
          </div>
          {news.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Tidak ada berita tersedia saat ini.</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Bagian Kiri - Berita Utama */}
              <div className="lg:col-span-2">
                {featuredNews ? (
                  // Jika ada berita unggulan, tampilkan satu card besar
                  <Card className="border-primary/20 hover:shadow-lg transition-all duration-300 h-full overflow-hidden">
                    <div className="h-72 md:h-80 overflow-hidden">
                      <img
                        src={getLocalImage(0)}
                        alt={featuredNews.title || "Berita"}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {formatDate(featuredNews.date)}
                        </div>
                        {featuredNews.read_time && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {featuredNews.read_time}
                          </div>
                        )}
                        <Badge className={getCategoryColor(featuredNews.category!)}>
                          {featuredNews.category}
                        </Badge>
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-3">{featuredNews.title}</h3>
                      <p className="text-muted-foreground leading-relaxed mb-5">{featuredNews.excerpt}</p>
                      <Button variant="outline" className="group" asChild>
                        <Link to={`/berita/${featuredNews.id}`}>
                          Baca Selengkapnya
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  // Jika tidak ada berita unggulan, tampilkan grid card berita
                  <div className="grid md:grid-cols-2 gap-6">
                    {regularNews.slice(0, 2).map((item, index) => (
                      <Card key={item.id} className="border-primary/20 hover:shadow-lg transition-all duration-300 h-full overflow-hidden">
                        <div className="h-48 overflow-hidden">
                          <img
                            src={getLocalImage(index)}
                            alt={item.title || "Berita"}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                        <CardContent className="p-5 flex flex-col h-full">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {formatDate(item.date)}
                            </div>
                            <Badge className={`text-xs ${getCategoryColor(item.category!)}`}>
                              {item.category}
                            </Badge>
                          </div>
                          <h3 className="font-bold text-foreground text-lg mb-2 line-clamp-2">{item.title}</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1 line-clamp-3">{item.excerpt}</p>
                          <div className="mt-auto">
                            <Button variant="outline" size="sm" className="group w-full" asChild>
                              <Link to={`/berita/${item.id}`}>
                                Baca Selengkapnya
                                <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
              {/* Bagian Kanan - Berita Lainnya */}
              <div className="lg:col-span-1">
                <div className="bg-muted/30 rounded-xl p-5 border border-border">
                  <h3 className="text-xl font-bold text-foreground mb-5 pb-2 border-b border-border">Berita Lainnya</h3>
                  <div className="space-y-5">
                    {otherNews.length > 0 ? (
                      otherNews.map((item, index) => (
                        <Card key={item.id} className="border-border hover:shadow-md transition-all duration-300 overflow-hidden">
                          <div className="flex">
                            <div className="w-1/3">
                              <div className="h-full overflow-hidden">
                                <img
                                  src={getLocalImage(index % 2)}
                                  alt={item.title || "Berita"}
                                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                  loading="lazy"
                                />
                              </div>
                            </div>
                            <div className="w-2/3">
                              <CardContent className="p-3 h-full flex flex-col">
                                <div className="mb-1">
                                  <Badge className={`text-xs ${getCategoryColor(item.category!)}`}>
                                    {item.category}
                                  </Badge>
                                </div>
                                <h4 className="font-bold text-foreground text-sm leading-tight line-clamp-2 mb-2">{item.title}</h4>
                                <div className="mt-auto flex items-center justify-between">
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    <span>{formatDate(item.date)}</span>
                                  </div>
                                  <Button variant="link" className="p-0 h-auto text-xs" asChild>
                                    <Link to={`/berita/${item.id}`}>
                                      Baca
                                    </Link>
                                  </Button>
                                </div>
                              </CardContent>
                            </div>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        Tidak ada berita lainnya tersedia.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          )}
          {/* Tombol Lihat Semua Berita */}
          {news.length > 0 && (
            <div className="mt-10 text-center">
              <Button variant="outline" size="lg" asChild>
                <Link to="/berita" className="flex items-center gap-2 mx-auto">
                  Lihat Semua Berita
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
          <div className="mt-12 text-center">
            <DevelopersModal />
          </div>
        </div>
      </section>
      {/* Mitra Industri - Bidang RPL */}
      <section id="mitra" className="py-16 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Mitra Industri</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Perusahaan teknologi yang berkolaborasi dalam pengembangan sistem informasi dan solusi digital bidang RPL.
            </p>
          </div>
          <div className="grid gap-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 max-w-6xl mx-auto">
            {[
              { name: "PT Gamatechno Indonesia", logo: IMAGES.gamatechno },
              { name: "PT Solusi247", logo: solusi},
              { name: "PT Javan Cipta Solusi", logo: javan },
              { name: "PT Mitra Integrasi Informatika", logo: mitra},
              { name: "PT Aino Indonesia", logo: IMAGES.aino },
              { name: "PT BISA AI", logo: IMAGES.bisaai },
              { name: "PT DycodeX Teknologi Nusantara", logo: dycode },
              { name: "PT GITS Indonesia", logo: IMAGES.gits },
              { name: "PT Inixindo Jogja", logo: IMAGES.ini },
              { name: "PT Nodeflux Teknologi Indonesia", logo: IMAGES.node }
            ].map((partner, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center bg-background border border-border rounded-xl p-4 hover:shadow-md transition-all"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="w-20 h-20 object-contain mb-3"
                  loading="lazy"
                />
                <p className="text-sm font-medium text-center text-foreground">{partner.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
export default LatestNews;