import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import { IMAGES } from "@/assets/images";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  read_time?: string;
  category?: string;
  featured?: boolean;
  image_url?: string; // Tambahkan field untuk URL gambar
}

const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Array gambar untuk berita
  const localImages = [IMAGES.news1, IMAGES.news2];
  const getLocalImage = (index: number) => localImages[index % localImages.length];

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("date", { ascending: false });
      if (error) throw error;
      setNews(data as NewsItem[] || []);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Akademik: "bg-blue-100 text-blue-800",
      Kemitraan: "bg-green-100 text-green-800",
      Workshop: "bg-purple-100 text-purple-800",
      Fasilitas: "bg-orange-100 text-orange-800",
      Pelatihan: "bg-pink-100 text-pink-800",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Memuat berita...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Semua Berita</h1>
              <p className="text-muted-foreground mt-2">
                Informasi terbaru seputar Jurusan Rekayasa Perangkat Lunak
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {news.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    Belum ada berita yang tersedia.
                  </p>
                </CardContent>
              </Card>
            ) : (
              news.map((item, index) => (
                <Card
                  key={item.id}
                  className="border-primary/20 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  {/* Bagian Gambar */}
                  <div className="h-64 overflow-hidden">
                    <img
                      src={item.image_url || getLocalImage(index)}
                      alt={item.title || "Berita"}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  <CardContent className="p-6">
                    <div className="flex flex-wrap items-start gap-4 mb-4">
                      {item.category && (
                        <Badge className={getCategoryColor(item.category)}>
                          {item.category}
                        </Badge>
                      )}
                      {item.featured && (
                        <Badge variant="default">Berita Utama</Badge>
                      )}
                    </div>

                    <h2 className="text-2xl font-bold text-foreground mb-3">
                      {item.title}
                    </h2>

                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {item.excerpt}
                    </p>

                    {item.content && (
                      <div className="prose prose-sm max-w-none mb-4">
                        <p className="text-foreground">{item.content}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(item.date)}
                      </div>
                      {item.read_time && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {item.read_time}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;