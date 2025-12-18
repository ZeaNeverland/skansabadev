import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, Home } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";

interface NewsItem {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    read_time?: string;
    category?: string;
    featured?: boolean;
    created_at: string;
    updated_at?: string;
}

const NewsDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNewsDetail = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from("news")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (error) throw error;
                setNewsItem(data as NewsItem);
            } catch (err) {
                console.error("Error fetching news detail:", err);
                setError("Gagal memuat berita. Silakan coba lagi nanti.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchNewsDetail();
        }
    }, [id]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const getCategoryColor = (category?: string) => {
        if (!category) return "bg-gray-100 text-gray-800";
        const colors: Record<string, string> = {
            Akademik: "bg-blue-100 text-blue-800",
            Kemitraan: "bg-green-100 text-green-800",
            Workshop: "bg-purple-100 text-purple-800",
            Fasilitas: "bg-orange-100 text-orange-800",
            Pelatihan: "bg-pink-100 text-pink-800",
        };
        return colors[category] || "bg-gray-100 text-gray-800";
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !newsItem) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navigation />
                <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <h1 className="text-3xl font-bold mb-4">Berita Tidak Ditemukan</h1>
                    <p className="text-muted-foreground mb-6 max-w-md">
                        Maaf, berita yang Anda cari tidak dapat ditemukan atau mungkin telah dihapus.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button onClick={() => navigate(-1)} className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </Button>
                        <Button variant="outline" asChild>
                            <Link to="/" className="flex items-center gap-2">
                                <Home className="h-4 w-4" />
                                Halaman Utama
                            </Link>
                        </Button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navigation />
            <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
                {/* Tombol Navigasi (bukan di navbar) */}
                <div className="flex flex-wrap gap-3 mb-8 bg-background/80 backdrop-blur-sm p-4 rounded-lg border sticky top-24 z-10">
                    <Button variant="ghost" asChild className="flex-1 sm:flex-none">
                        <Link to="/berita" className="flex items-center justify-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke Daftar Berita
                        </Link>
                    </Button>

                    <Button variant="default" asChild className="flex-1 sm:flex-none bg-primary/90 hover:bg-primary">
                        <Link to="/" className="flex items-center justify-center gap-2">
                            <Home className="h-4 w-4" />
                            Kembali ke Halaman Utama
                        </Link>
                    </Button>
                </div>

                {/* Artikel */}
                <article className="bg-card rounded-2xl shadow-sm p-6 border">
                    <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
                        <time dateTime={newsItem.date} className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(newsItem.date)}
                        </time>
                        {newsItem.read_time && (
                            <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {newsItem.read_time}
                            </span>
                        )}
                        {newsItem.category && (
                            <Badge className={getCategoryColor(newsItem.category)}>
                                {newsItem.category}
                            </Badge>
                        )}
                    </div>

                    <h1 className="text-4xl font-extrabold mb-6 leading-snug">{newsItem.title}</h1>

                    {newsItem.excerpt && (
                        <p className="text-lg text-muted-foreground mb-8 italic">
                            {newsItem.excerpt}
                        </p>
                    )}

                    {newsItem.content && (
                        <div
                            className="prose prose-lg dark:prose-invert max-w-none leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: newsItem.content }}
                        />
                    )}
                </article>
            </main>
        </div>
    );
};

export default NewsDetail;
