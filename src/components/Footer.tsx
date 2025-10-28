import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Instagram, Globe } from "lucide-react";
import { IMAGES } from "@/assets/images";

import { Link } from "react-router-dom";

// Ikon TikTok custom (karena lucide belum ada)
const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    fill="currentColor"
    {...props}
  >
    <path d="M448,209.9a210,210,0,0,1-122.4-39.2V349.4c0,89.4-72.6,162-162,162S2,438.8,2,349.4,74.6,187.4,164,187.4a161,161,0,0,1,26.5,2.2V273a92.3,92.3,0,1,0,65.1,87.8V0h70.1a140.6,140.6,0,0,0,122.3,122.2Z" />
  </svg>
);

const Footer = () => {
  return (
    <footer
      id="kontak"
      className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* School Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img
                  src={IMAGES.logo}
                  alt="Logo Skansaba"
                  className="w-10 h-auto object-contain"
                />
                <div>
                  <h1 className="font-bold text-lg text-white">
                    Konsentrasi Keahlian RPL
                  </h1>
                  <p className="text-xs font-semibold text-white">
                    SMK Negeri 1 Bantul
                  </p>
                </div>
              </div>
              <p className="text-sm opacity-90 leading-relaxed mb-4">
                Mengembangkan talenta programmer Indonesia yang kompeten,
                inovatif, dan berakhlak mulia melalui pendidikan teknologi
                terdepan.
              </p>
              <div className="flex space-x-2">
                <a
                  href="https://www.instagram.com/skansaba.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit our Instagram page"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                  >
                    <Instagram className="h-5 w-5" />
                  </Button>
                </a>
                <a
                  href="https://www.tiktok.com/@skansabadev"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit our TikTok page"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                  >
                    <TikTokIcon className="h-5 w-5" />
                  </Button>
                </a>
                <a
                  href="https://up.skansaba.dev/" // 🔗 ganti dengan link hosting jurusan
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit our Hosting Website"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                  >
                    <Globe className="h-5 w-5" />
                  </Button>
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div>
            <Button 
                asChild 
                variant="ghost" 
                className="font-bold text-lg p-0 h-auto justify-start hover:bg-transparent hover:text-primary"
                >
                <Link to="/kontak" className="mb-4">
                  Kontak
                </Link>
              </Button>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 opacity-90" />
                  <div>
                    <p className="text-sm">
                      Jl. Parangtritis No.KM.11, Dukuh, Sabdodadi, Kec. Bantul,
                      Kabupaten Bantul
                    </p>
                    <p className="text-sm opacity-90">
                      Daerah Istimewa Yogyakarta 55715
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 opacity-90" />
                  <div>
                    <p className="text-sm opacity-90">+62 851 7427 0974</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 opacity-90" />
                  <div>
                    <p className="text-sm">rpl@skansaba.dev</p>
                    <p className="text-sm opacity-90">skansabar.dev.rpl@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Lokasi Kami</h2>
              <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.4752989257574!2d110.35305441477882!3d-7.889908394335283!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7b00889ad8f84d%3A0x2e0009ca7815eaf0!2sSMK%20Negeri%201%20Bantul!5e0!3m2!1sid!2sid!4v1655123456789!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  title="Peta lokasi SMK Negeri 1 Bantul"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <p className="text-sm opacity-90">
              © 2024 Jurusan RPL SMK Negeri 1 Bantul. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
