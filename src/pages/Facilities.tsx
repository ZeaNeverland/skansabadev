import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { FACILITY_IMAGES } from "@/assets/images";
import { Monitor, Users, Server } from "lucide-react";

interface Facility {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  image: string;
  features: string[];
}

interface DocumentationItem {
  src: string | { src: string };
  alt: string;
  caption: string;
}

const Facilities = () => {
  const facilities: Facility[] = [
    {
      title: "Lab Komputer 16",
      description: "Laboratorium komputer dengan spesifikasi tinggi untuk pembelajaran programming dan pengembangan software",
      icon: Monitor,
      image: FACILITY_IMAGES.lab1,
      features: ["32 Unit PC High-End", "Intel Core i7 10th Gen", "16GB RAM", "SSD 512GB", "3 Unit AC"]
    },
    {
      title: "Lab Komputer 18",
      description: "Laboratorium jaringan komputer untuk praktik jaringan dan keamanan siber",
      icon: Server,
      image: FACILITY_IMAGES.lab2,
      features: ["Cisco Packet Tracer", "MikroTik RouterOS", "Wireshark", "GNS3", "36 Unit Laptop Asus", "Intel Core i7 11th Gen", "8GB RAM", "SSD 1TB", "2 Unit AC"]
    },
    {
      title: "Lab Komputer 19",
      description: "Ruang kerja kolaboratif untuk pengembangan project dan diskusi tim",
      icon: Users,
      image: FACILITY_IMAGES.lab3,
      features: ["Meja Kerja Kelompok", "36 Unit PC High-End dengan Monitor 24 Inch", "Intel Core i5 ", "8GB RAM ", "HDD 1TB", "Whiteboard Digital", "2 Unit AC"]
    },
  ];

  const documentation: DocumentationItem[] = [
    {
      src: FACILITY_IMAGES.lab2,
      alt: "Siswa sedang belajar pemrograman di lab komputer",
      caption: "Pembelajaran intensif di Lab Komputer bersama siswa kelas XI RPL"
    },
    {
      src: FACILITY_IMAGES.lab1,
      alt: "Kegiatan presentasi project",
      caption: "Presentasi hasil project akhir menggunakan proyektor interaktif"
    },
    {
      src: FACILITY_IMAGES.lab3,
      alt: "Kegiatan di coworking space",
      caption: "Kolaborasi tim di ruang coworking space jurusan"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="pb-12 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Fasilitas <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">Konsentrasi Keahlian</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Fasilitas lengkap dan modern untuk mendukung pembelajaran dan pengembangan skill programming siswa
          </p>
          <Badge variant="secondary" className="text-sm px-4 py-2">
            12+ Fasilitas Unggulan
          </Badge>
        </div>
      </section>

      {/* Grid Fasilitas */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {facilities.map((facility, index) => {
              const IconComponent = facility.icon;
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
                  <CardContent className="p-0">
                    <img
                      src={facility.image}
                      alt={facility.title}
                      className="w-full h-48 object-cover rounded-t-md"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = 'https://placehold.co/400x200?text=Image+Not+Found';
                      }}
                    />
                  </CardContent>
                  <CardHeader className="pt-4 px-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl text-foreground">{facility.title}</CardTitle>
                    </div>
                    <CardDescription className="text-muted-foreground">{facility.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <h4 className="font-semibold text-sm text-foreground mb-3">Fitur Unggulan:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {(Array.isArray(facility.features) ? facility.features : [facility.features]).map((feature: string, i: number) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dokumentasi Fasilitas */}
      <section className="py-16 bg-muted/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Dokumentasi Kegiatan di Fasilitas RPL
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {documentation.map((item, index) => (
              <div key={index} className="rounded-lg overflow-hidden shadow-sm border border-border/30 bg-background hover:shadow-md transition-all">
                <img
                  src={typeof item.src === "string" ? item.src : item.src.src}
                  alt={item.alt}
                  className="w-full h-60 object-cover"
                />
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">{item.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Facilities;

