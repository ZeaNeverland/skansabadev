"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Calendar, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import Navigation from "@/components/Navigation";
import { supabase } from "@/lib/supabase";
import { IMAGES } from "@/assets/images";

// Type untuk activity
type Activity = {
  id: string;
  title: string;
  description: string;
  cover_image_url: string;
  drive_url: string;
  activity_date: string;
  participants: string;
  category?: string;
  created_at?: string;
  updated_at?: string;
};

// Data kegiatan statis sebagai fallback
const staticActivities = [
  {
    id: "bootcamp",
    title: "Bootcamp Programming",
    description: "Kegiatan pelatihan intensif programming untuk siswa",
    cover_image_url: IMAGES.bootcamp,
    drive_url: "https://drive.google.com/drive/folders/1auvuclFbvPH5-82SFf3eMLwW95scKgBz?usp=drive_link",
    activity_date: "15-20 Januari 2024",
    participants: "45 Siswa",
    category: "pelatihan"
  },
  {
    id: "seminar",
    title: "Seminar Karir",
    description: "Seminar persiapan karir untuk siswa kelas 12",
    cover_image_url: IMAGES.seminar,
    drive_url: "https://drive.google.com/drive/folders/1auvuclFbvPH5-82SFf3eMLwW95scKgBz?usp=drive_link",
    activity_date: "5 Maret 2024",
    participants: "120 Siswa",
    category: "seminar"
  },
  {
    id: "field-trip",
    title: "Field Trip Industri",
    description: "Kunjungan industri ke perusahaan teknologi",
    cover_image_url: IMAGES.fieldTrip,
    drive_url: "https://drive.google.com/drive/folders/field-trip-folder-id",
    activity_date: "22 April 2024",
    participants: "60 Siswa",
    category: "ekstrakurikuler"
  },
  {
    id: "competition",
    title: "Kompetisi Sains",
    description: "Lomba sains tingkat kabupaten",
    cover_image_url: IMAGES.competition,
    drive_url: "https://drive.google.com/drive/folders/competition-folder-id",
    activity_date: "10 Mei 2024",
    participants: "30 Tim",
    category: "kompetisi"
  },
  {
    id: "graduation",
    title: "Wisuda Kelas 12",
    description: "Acara wisuda siswa kelas 12",
    cover_image_url: IMAGES.graduation,
    drive_url: "https://drive.google.com/drive/folders/graduation-folder-id",
    activity_date: "15 Juni 2024",
    participants: "200 Siswa",
    category: "acara"
  },
  {
    id: "workshop",
    title: "Workshop Kewirausahaan",
    description: "Pelatihan kewirausahaan untuk siswa",
    cover_image_url: IMAGES.workshop,
    drive_url: "https://drive.google.com/drive/folders/workshop-folder-id",
    activity_date: "8 Juli 2024",
    participants: "80 Siswa",
    category: "pelatihan"
  }
];

const CATEGORIES = [
  { value: "all", label: "Semua Kategori" },
  { value: "pelatihan", label: "Pelatihan" },
  { value: "seminar", label: "Seminar" },
  { value: "ekstrakurikuler", label: "Ekstrakurikuler" },
  { value: "kompetisi", label: "Kompetisi" },
  { value: "acara", label: "Acara" }
];

export default function GalleryPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // If no activities in database, use static data as fallback
      if (!data || data.length === 0) {
        setActivities(staticActivities);
      } else {
        setActivities(data);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      // Use static data as fallback if there's an error
      setActivities(staticActivities);
    } finally {
      setLoading(false);
    }
  };

  // Filter activities based on search query and category
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      const matchesSearch = searchQuery === "" ||
        activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === "all" || activity.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [activities, searchQuery, selectedCategory]);

  const handleOpenGallery = (url: string) => {
    window.open(url, "_blank");
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  const hasActiveFilters = searchQuery !== "" || selectedCategory !== "all";

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Gallery Kegiatan <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">Konsentrasi Keahlian</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
              Memuat galeri kegiatan...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Gallery Kegiatan <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">Konsentrasi Keahlian</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            Dokumentasi lengkap berbagai kegiatan yang telah dilaksanakan
          </p>
        </div>

        {/* Filter Section */}
        <div className="mb-8 bg-secondary/10 p-4 rounded-lg">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              {/* Search Input */}
              <div className="relative w-full md:w-64">
                <Input
                  type="text"
                  placeholder="Cari kegiatan..."
                  className="pl-10 pr-4 py-2 rounded-full border shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-muted-foreground h-5 w-5" />
              </div>

              {/* Category Filter */}
              <div className="w-full md:w-48">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
                Reset Filter
              </button>
            )}
          </div>

          {hasActiveFilters && (
            <div className="mt-3 text-center text-sm text-muted-foreground">
              Menampilkan {filteredActivities.length} dari {activities.length} kegiatan
            </div>
          )}
        </div>

        {filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Tidak ada kegiatan yang sesuai dengan filter.</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 text-primary hover:underline"
              >
                Reset filter
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => (
              <Card
                key={activity.id}
                className="group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm cursor-pointer"
                onClick={() => handleOpenGallery(activity.drive_url)}
              >
                <div className="relative overflow-hidden aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                  <img
                    src={activity.cover_image_url}
                    alt={activity.title}
                    className="object-cover w-full h-full transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://via.placeholder.com/800x450/e2e8f0/64748b?text=${encodeURIComponent(activity.title)}`;
                      target.alt = `Gambar ${activity.title} tidak tersedia`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <div className="text-center">
                      <p className="text-white text-lg font-semibold mb-2">Lihat Foto Lengkap</p>
                      <div className="inline-flex items-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full transition-colors">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Buka di Google Drive
                      </div>
                    </div>
                  </div>
                </div>
                <CardHeader className="p-5">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {activity.title}
                    </CardTitle>
                    {activity.category && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full capitalize">
                        {activity.category}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {activity.description}
                  </p>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      {activity.activity_date}
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4" />
                      {activity.participants}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}