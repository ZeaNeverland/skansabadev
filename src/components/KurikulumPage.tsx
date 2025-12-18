import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, BookOpen, GraduationCap, Award } from "lucide-react";

const KurikulumPage = () => {
    // Data kurikulum yang tersedia
    const kurikulumData = [
        {
            id: 1,
            title: "Kurikulum 2024 - Rekayasa Perangkat Lunak",
            description: "Kurikulum lengkap untuk program studi Rekayasa Perangkat Lunak tahun 2024 yang mencakup semua mata pelajaran dan kompetensi",
            category: "Kurikulum Inti",
            fileUrl: "/documents/kurikulum-2024-rpl.pdf",
            fileSize: "5.2 MB",
            updateDate: "15 Mei 2024",
            icon: BookOpen
        },
        {
            id: 2,
            title: "Silabus Pemrograman Web",
            description: "Silabus lengkap untuk mata pelajaran Pemrograman Web mencakup HTML, CSS, JavaScript, dan framework modern",
            category: "Silabus Mata Pelajaran",
            fileUrl: "/documents/silabus-pemrograman-web.pdf",
            fileSize: "1.8 MB",
            updateDate: "10 Mei 2024",
            icon: FileText
        },
        {
            id: 3,
            title: "Silabus Pemrograman Mobile",
            description: "Silabus untuk pengembangan aplikasi mobile dengan React Native dan Flutter",
            category: "Silabus Mata Pelajaran",
            fileUrl: "/documents/silabus-pemrograman-mobile.pdf",
            fileSize: "1.5 MB",
            updateDate: "5 Mei 2024",
            icon: FileText
        },
        {
            id: 4,
            title: "Struktur Kurikulum SMK RPL",
            description: "Struktur lengkap kurikulum SMK untuk konsentrasi keahlian Rekayasa Perangkat Lunak",
            category: "Struktur Kurikulum",
            fileUrl: "/documents/struktur-kurikulum-smk-rpl.pdf",
            fileSize: "3.1 MB",
            updateDate: "20 April 2024",
            icon: GraduationCap
        },
        {
            id: 5,
            title: "Capaian Pembelajaran RPL",
            description: "Dokumen capaian pembelajaran untuk setiap mata pelajaran di konsentrasi RPL",
            category: "Capaian Pembelajaran",
            fileUrl: "/documents/capaian-pembelajaran-rpl.pdf",
            fileSize: "2.7 MB",
            updateDate: "12 April 2024",
            icon: Award
        },
        {
            id: 6,
            title: "Pedoman Praktikum RPL",
            description: "Pedoman lengkap untuk kegiatan praktikum di laboratorium RPL",
            category: "Pedoman Praktikum",
            fileUrl: "/documents/pedoman-praktikum-rpl.pdf",
            fileSize: "4.2 MB",
            updateDate: "1 April 2024",
            icon: BookOpen
        }
    ];

    // State untuk kategori yang dipilih
    const [selectedCategory, setSelectedCategory] = useState("Semua");

    // Daftar kategori unik
    const categories = ["Semua", ...new Set(kurikulumData.map(item => item.category))];
    
    // Filter data berdasarkan kategori
    const filteredData = selectedCategory === "Semua"
        ? kurikulumData
        : kurikulumData.filter(item => item.category === selectedCategory);

    return (
        <div className="min-h-screen bg-background pt-24 md:pt-28 py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-foreground to-primary mb-3">
                            Kumpulan Kurikulum RPL
                        </h1>
                        <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-primary/40 to-transparent mb-4" />
                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                            Jelajahi dan unduh kurikulum, silabus, dan pedoman terbaru RPL.
                            Disusun untuk mendukung pembelajaran modern dan berstandar industri.
                        </p>
                    </div>

                    {/* Filter Kategori */}
                    <div className="flex flex-wrap justify-center gap-3 mb-10">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? "default" : "outline"}
                                onClick={() => setSelectedCategory(category)}
                                className="mb-2"
                            >
                                {category}
                            </Button>
                        ))}
                    </div>

                    {/* Daftar Dokumen */}
                    {filteredData.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredData.map((item) => (
                                <Card key={item.id} className="border-primary/20 hover:shadow-lg transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-glow rounded-lg flex items-center justify-center flex-shrink-0">
                                                <item.icon className="h-6 w-6 text-primary-foreground" />
                                            </div>
                                            <div className="flex-1">
                                                <CardTitle className="text-lg text-foreground mb-1">
                                                    {item.title}
                                                </CardTitle>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                                                        {item.category}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{item.fileSize}</span>
                                                    <span>•</span>
                                                    <span>Update: {item.updateDate}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <p className="text-muted-foreground mb-4">
                                            {item.description}
                                        </p>
                                        <div className="flex justify-end">
                                            <Button asChild>
                                                <a
                                                    href={item.fileUrl}
                                                    download
                                                    className="flex items-center gap-2"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Download className="h-4 w-4" />
                                                    Unduh Dokumen
                                                </a>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="mb-4 text-muted-foreground">
                                <FileText className="h-16 w-16 mx-auto" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Tidak ada dokumen</h3>
                            <p className="text-muted-foreground">
                                Tidak ada dokumen yang tersedia untuk kategori "{selectedCategory}".
                            </p>
                        </div>
                    )}

                    {/* Info Tambahan */}
                    <div className="mt-12 p-6 bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-lg">
                        <h3 className="text-xl font-bold text-foreground mb-3">Informasi Penting</h3>
                        <ul className="space-y-2 text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                </div>
                                <span>Semua dokumen kurikulum tersedia dalam format PDF</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                </div>
                                <span>Dokumen diperbarui secara berkala sesuai dengan perkembangan teknologi</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                </div>
                                <span>Untuk informasi lebih lanjut, hubungi bagian kurikulum sekolah</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KurikulumPage;