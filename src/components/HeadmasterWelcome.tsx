import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";
import { IMAGES } from "@/assets/images";

const HeadmasterWelcome = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-background/80 backdrop-blur-sm border-primary/20 shadow-lg">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-1 text-center">
                  <div className="relative inline-block">
                    <img
                      src={IMAGES.kepalaSekolah}
                      alt="Kepala Sekolah"
                      className="w-48 h-48 rounded-full mx-auto object-cover border-4 border-primary/20 shadow-lg"
                    />
                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <Quote className="h-6 w-6 text-primary-foreground" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mt-4">Raharjo, S.IP, M.Pd</h3>
                  <p className="text-muted-foreground">Kepala Sekolah</p>
                </div>
                
                <div className="md:col-span-2">
                  <h2 className="text-3xl font-bold text-foreground mb-6">
                    Sambutan Kepala Sekolah
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      Selamat datang di website Jurusan Rekayasa Perangkat Lunak SMK Teknologi. 
                      Sebagai kepala sekolah, saya sangat bangga dengan pencapaian dan dedikasi 
                      siswa-siswi jurusan RPL kami.
                    </p>
                    <p>
                      Jurusan RPL telah menjadi salah satu program unggulan di sekolah kami, 
                      menghasilkan lulusan yang kompeten dan siap bersaing di era digital. 
                      Dengan fasilitas laboratorium modern dan tenaga pengajar yang berpengalaman, 
                      kami berkomitmen memberikan pendidikan terbaik.
                    </p>
                    <p className="font-medium text-primary">
                      "Mari bersama-sama membangun generasi programmer Indonesia yang unggul 
                      dan berakhlak mulia."
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HeadmasterWelcome;