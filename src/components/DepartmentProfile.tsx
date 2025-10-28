import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Users, Award, BookOpen, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const DepartmentProfile = () => {
  const features = [
    {
      icon: Code,
      title: "Kurikulum Modern",
      description: "Menggunakan teknologi terkini seperti React, Node.js, Python, dan framework modern lainnya"
    },
    {
      icon: Users,
      title: "Tenaga Pengajar Berkualitas",
      description: "Instruktur berpengalaman dengan sertifikasi industri dan background profesional"
    },
    {
      icon: Award,
      title: "Prestasi Gemilang",
      description: "Meraih berbagai penghargaan di kompetisi programming tingkat regional dan nasional"
    },
    {
      icon: BookOpen,
      title: "Pembelajaran Praktis",
      description: "70% praktik dan 30% teori dengan project-based learning yang aplikatif"
    }
  ];

  const careerProspects = {
    "Pemrograman Dasar": [
      "Software Developer",
      "Application Developer"
    ],
    "Pemrograman Web": [
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "Web Application Developer"
    ],
    "Pemrograman Mobile": [
      "Mobile Application Developer (Android/iOS)",
      "Flutter Developer",
    ],
    "Database Management": [
      "Data Engineer",
      "Database Analyst",
    ],
    "UI/UX Design": [
      "UI Designer",
      "UX Designer",
    ],
    "Project Management": [
      "IT Consultant"
    ],
    "Keamanan Siber": [
      "Cybersecurity Analyst",
      "Information Security Officer",
      "Security Consultant",
    ],
    "Algoritma & Struktur Data": [
      "Algorithm Engineer",
      "Software Architect",
      "Data Scientist",
      "Research Scientist in Computer Science"
    ],
    "Pemrograman Berorientasi Objek": [
      "Software Engineer",
      "Systems Analyst",
      "Application Architect"
    ],
    "Rekayasa Perangkat Lunak": [
      "Systems Engineer",
      "Software Architect",
      "DevOps Engineer"
    ],
    "Sistem Operasi": [
      "Systems Administrator",
      "Embedded Systems Developer",
    ],
    "Pemrograman API": [
      "API Developer",
      "Backend Developer",
    ],
    "Cloud Computing": [
      "Cloud Engineer",
      "DevOps Engineer",
    ],
    "Internet of Things (IoT)": [
      "IoT Developer",
      "IoT Solutions Architect",
    ],
    "Kecerdasan Buatan Dasar": [
      "AI Engineer",
      "Data Scientist",
      "AI Researcher",
    ],
    "Pengembangan Aplikasi Enterprise": [
      "Enterprise Application Developer",

    ],
    "Manajemen Proyek IT": [
      "IT Consultant"
    ],
    "Kewirausahaan Teknologi": [
      "Innovation Manager"
    ],
    "Dasar-dasar Pemrograman": [
      "Software Developer",
      "Application Developer"
    ],
    "Basis Data": [
      "Database Administrator",
      "Data Engineer",
      "Database Analyst",
    ],
    "Pemrograman berbasis Teks, Grafis, dan Multimedia": [
      "Game Developer",
      "Creative Technologist",
    ]
  };

  // Extract all unique career prospects
  const allCareers = [...new Set(Object.values(careerProspects).flat())];
  
  // Top subjects with descriptions
  const topSubjects = [
    {
      name: "Pemrograman Web & Mobile",
      description: "Mengembangkan aplikasi website dan mobile dengan teknologi modern"
    },
    {
      name: "Database Management",
      description: "Mengelola dan mengoptimalkan sistem database untuk aplikasi enterprise"
    },
    {
      name: "UI/UX Design",
      description: "Mendesain antarmuka pengguna yang menarik dan mudah digunakan"
    },
    {
      name: "Keamanan Siber",
      description: "Melindungi sistem dan data dari ancaman keamanan digital"
    },
    {
      name: "Cloud Computing",
      description: "Mengembangkan solusi berbasis cloud untuk skala enterprise"
    },
    {
      name: "Kecerdasan Buatan",
      description: "Membangun sistem AI dan machine learning untuk aplikasi cerdas"
    },
    {
      name: "Pengembangan Aplikasi Enterprise",
      description: "Membuat solusi perangkat lunak untuk kebutuhan bisnis skala besar"
    }
  ];

  return (
    <section id="profil" className="py-16 bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
              Profil Konsentrasi Keahlian RPL
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Rekayasa Perangkat Lunak adalah program keahlian yang fokus pada pengembangan
              aplikasi dan sistem software dengan standar industri global
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`group hover:shadow-xl transition-all duration-500 border-primary/20 hover:border-primary/40 overflow-hidden transform hover:-translate-y-1 ${feature.title === 'Tenaga Pengajar Berkualitas' || feature.title === 'Kurikulum Modern' ? 'cursor-pointer' : ''}`}
              >
                {feature.title === 'Tenaga Pengajar Berkualitas' ? (
                  <Link to="/struktur-organisasi" className="block h-full">
                    <CardContent className="p-6 text-center h-full flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 shadow-md">
                        <feature.icon className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </CardContent>
                  </Link>
                ) : feature.title === 'Kurikulum Modern' ? (
                  <Link to="/kurikulum" className="block h-full">
                    <CardContent className="p-6 text-center h-full flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 shadow-md">
                        <feature.icon className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </CardContent>
                  </Link>
                ) : (
                  <CardContent className="p-6 text-center h-full flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 shadow-md">
                      <feature.icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Prospek Karir - 2 Baris */}
            <Card className="border-primary/20 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-foreground flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  Prospek Karir
                </CardTitle>
                <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {allCareers.map((career, index) => (
                    <div
                      key={index}
                      className="bg-accent/50 px-4 py-3 rounded-lg text-sm font-medium text-accent-foreground hover:bg-accent hover:shadow-sm transition-all duration-300 border border-transparent hover:border-primary/20"
                    >
                      {career}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mata Pelajaran Unggulan */}
            <Card className="border-primary/20 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-foreground flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  Mata Pelajaran Unggulan
                </CardTitle>
                <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {topSubjects.map((subject, index) => (
                    <div 
                      key={index} 
                      className="bg-gradient-to-r from-primary/5 to-primary/10 p-5 rounded-lg border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-sm"
                    >
                      <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
                        {subject.name}
                      </h4>
                      <p className="text-muted-foreground text-sm pl-4 border-l-2 border-primary/20">
                        {subject.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DepartmentProfile;