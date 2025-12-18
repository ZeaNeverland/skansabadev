import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import {
  Calendar,
  MapPin,
  Users,
  BookOpen,
  Target
} from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Stat {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const PrestasiPage = () => {

  // Prestasi unggulan
  const featuredAchievements = [
    {
      id: 1,
      title: "Juara 1 Kompetisi Programming Nasional",
      category: "tech",
      date: "November 2023",
      location: "Jakarta",
      participants: "Tim RPL SMKN 1 Bantul",
      description: "Mengalahkan 50+ tim dari seluruh Indonesia dalam kompetisi programming tingkat nasional.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=400&q=80"
    },
    {
      id: 2,
      title: "Medali Emas Olimpiade Sains",
      category: "academic",
      date: "September 2023",
      location: "Yogyakarta",
      participants: "Ahmad Fauzi (XII RPL 1)",
      description: "Meraih medali emas dalam Olimpiade Sains bidang Informatika tingkat provinsi.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=400&q=80"
    },
    {
      id: 3,
      title: "Juara 1 Lomba Debat Bahasa Inggris",
      category: "academic",
      date: "Juli 2023",
      location: "Surabaya",
      participants: "Tim Debat RPL",
      description: "Menjuarai kompetisi debat bahasa Inggris tingkat regional Jawa Timur.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=400&q=80"
    }
  ];

  // Categories for filtering
  const categories: Category[] = [
    { id: "all", name: "Semua Prestasi" },
    { id: "academic", name: "Akademik" },
    { id: "tech", name: "Teknologi" },
    { id: "sports", name: "Olahraga" },
    { id: "arts", name: "Seni & Budaya" }
  ];

  // Achievement statistics
  const achievementStats: Stat[] = [
    { title: "150+", description: "Alumni Tersertifikasi", icon: <BookOpen className="h-6 w-6" /> },
    { title: "25+", description: "Penghargaan Diraih", icon: <Target className="h-6 w-6" /> },
    { title: "95%", description: "Tingkat Kelulusan", icon: <Calendar className="h-6 w-6" /> },
    { title: "85%", description: "Langsung Bekerja", icon: <Users className="h-6 w-6" /> }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Hero Section */}
      <section className="pb-12 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-3">Prestasi</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Prestasi Siswa RPL</h1>
            <p className="text-muted-foreground text-lg mb-6">Kumpulan prestasi yang diraih oleh siswa-siswi RPL SMK Negeri 1 Bantul di berbagai bidang.</p>

            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {categories.map((category) => (
                <Badge key={category.id} variant="outline" className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground">
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {achievementStats.map((stat, index) => (
              <div key={index} className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="flex justify-center mb-2">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-primary">{stat.title}</div>
                <div className="text-muted-foreground">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Achievements */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">Prestasi Unggulan</h2>
              <p className="text-muted-foreground">Prestasi terbaik yang telah diraih oleh siswa RPL SMK Negeri 1 Bantul</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredAchievements.map((achievement) => (
                <Card key={achievement.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="h-64 overflow-hidden flex items-center justify-center bg-muted/20">
                    <img
                      src={achievement.image}
                      alt={achievement.participants}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{achievement.title}</CardTitle>
                      <Badge variant="secondary" className="capitalize">
                        {categories.find(c => c.id === achievement.category)?.name}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{achievement.date}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{achievement.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{achievement.participants}</span>
                      </div>
                      <p className="text-sm mt-2">{achievement.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">Testimonial Siswa</h2>
              <p className="text-muted-foreground">Apa kata siswa tentang pengalaman meraih prestasi</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold">Ahmad Fauzi</h3>
                      <p className="text-sm text-muted-foreground mb-3">XII RPL 1</p>
                      <p className="text-sm">"Dengan bimbingan guru yang luar biasa, saya bisa meraih medali emas di olimpiade sains. RPL memberikan saya fondasi yang kuat untuk bersaing di tingkat nasional."</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold">Siti Nurhaliza</h3>
                      <p className="text-sm text-muted-foreground mb-3">XI RPL 2</p>
                      <p className="text-sm">"Kompetisi programming yang saya ikuti sangat menantang, tetapi dengan latihan yang intensif di sekolah, saya bisa membawa tim kami menjadi juara."</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default PrestasiPage;