import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Calendar, User, Code } from "lucide-react";


import { IMAGES } from "@/assets/images";

const StudentWorks = () => {
  const studentWorks = [
    {
      id: 1,
      title: "Sistem Manajemen Perpustakaan",
      student: "Ahmad Rizki Pratama",
      class: "XII RPL 1",
      year: "2024",
      description: "Website untuk mengelola peminjaman dan pengembalian buku perpustakaan dengan fitur notifikasi otomatis",
      technologies: ["PHP", "MySQL", "Bootstrap", "JavaScript"],
      photo: IMAGES.perpustakaan,
      url: "https://github.com/ahmadrizki/library-management",
      category: "Web Development"
    },
    {
      id: 2,
      title: "Aplikasi E-Commerce Mobile",
      student: "Siti Nurhaliza",
      class: "XII RPL 2",
      year: "2024",
      description: "Aplikasi mobile untuk jual beli online dengan sistem pembayaran digital terintegrasi",
      technologies: ["Flutter", "Firebase", "Dart", "REST API"],
      photo: IMAGES.ecommerce,
      url: "https://play.google.com/store/apps/details?id=com.siti.ecommerce",
      category: "Mobile Development"
    },
    {
      id: 3,
      title: "Dashboard Monitoring IoT",
      student: "Muhammad Fauzi",
      class: "XII RPL 1",
      year: "2024",
      description: "Dashboard web untuk monitoring sensor suhu dan kelembaban menggunakan Arduino dan ESP32",
      technologies: ["React", "Node.js", "Socket.io", "MongoDB"],
      photo: IMAGES.dashboard,
      url: "https://iot-dashboard-fauzi.vercel.app",
      category: "IoT Development"
    },
    {
      id: 4,
      title: "Game Edukatif Matematika",
      student: "Dewi Kusuma Sari",
      class: "XI RPL 2",
      year: "2024",
      description: "Game berbasis web untuk pembelajaran matematika tingkat SD dengan animasi menarik",
      technologies: ["Unity", "C#", "WebGL", "Firebase"],
      photo: IMAGES.matematika,
      url: "https://mathgame-dewi.itch.io/math-adventure",
      category: "Game Development"
    },
    {
      id: 5,
      title: "Sistem Informasi Sekolah",
      student: "Budi Santoso",
      class: "XII RPL 3",
      year: "2023",
      description: "Website sistem informasi untuk mengelola data siswa, guru, dan akademik sekolah",
      technologies: ["Laravel", "MySQL", "Vue.js", "Tailwind CSS"],
      photo: IMAGES.sistem,
      url: "https://siakad-budi.herokuapp.com",
      category: "Web Development"
    },
    {
      id: 6,
      title: "Platform Kolaborasi Tim",
      student: "Lisa Handayani & Tim",
      class: "XII RPL 2",
      year: "2023",
      description: "Platform web untuk kolaborasi tim dengan fitur chat, file sharing, dan project management",
      technologies: ["React", "Express.js", "PostgreSQL", "Socket.io"],
      photo: IMAGES.dashboard,
      url: "https://teamwork-lisa.netlify.app",
      category: "Web Development"
    },
    {
      id: 7,
      title: "Smart Home Controller",
      student: "Agus Ramadhan",
      class: "XI RPL 1",
      year: "2023",
      description: "Aplikasi mobile untuk mengontrol perangkat rumah pintar menggunakan teknologi IoT",
      technologies: ["React Native", "Arduino", "ESP32", "MQTT"],
      photo: IMAGES.controller,
      url: "https://github.com/agusramadhan/smart-home-app",
      category: "IoT Development"
    },
    {
      id: 8,
      title: "Code Editor Online",
      student: "Rina Septiani",
      class: "XI RPL 3",
      year: "2023",
      description: "Editor kode online dengan syntax highlighting dan fitur collaborative coding real-time",
      technologies: ["JavaScript", "CodeMirror", "WebSocket", "Node.js"],
      photo: IMAGES.editor,
      url: "https://codeeditor-rina.vercel.app",
      category: "Web Development"
    }
  ];

  const categories = [...new Set(studentWorks.map(work => work.category))];

  const handleWorkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header Section */}
      <section className="pb-12 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Code className="h-8 w-8 text-primary" />
              <span className="text-primary font-medium">Karya Siswa</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Karya & Proyeknya
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent"> Siswa Konsentrasi KeahlianRPL</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Kumpulan karya terbaik siswa-siswi RPL yang menunjukkan kreativitas,
              inovasi, dan penguasaan teknologi dalam berbagai bidang pengembangan perangkat lunak
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <Badge key={category} variant="secondary" className="px-4 py-2 text-sm">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Works Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {studentWorks.map((work) => (
                <Card
                  key={work.id}
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-primary/20 overflow-hidden"
                  onClick={() => handleWorkClick(work.url)}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={work.photo}
                      alt={work.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-white text-center">
                        <ExternalLink className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm font-medium">Lihat Karya</p>
                      </div>
                    </div>
                    <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground">
                      {work.category}
                    </Badge>
                  </div>

                  <CardContent className="p-6">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {work.title}
                    </h3>

                    {/* Student Info */}
                    <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{work.student}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{work.year}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {work.description}
                    </p>

                    {/* Class Badge */}
                    <div className="mb-4">
                      <Badge variant="outline" className="text-xs">
                        {work.class}
                      </Badge>
                    </div>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2">
                      {work.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-secondary/50 text-xs rounded-md text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default StudentWorks;