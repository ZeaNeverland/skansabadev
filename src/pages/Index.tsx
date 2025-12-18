import Navigation from "@/components/Navigation";
import PhotoGallery from "@/components/PhotoGallery";
import HeadmasterWelcome from "@/components/HeadmasterWelcome";
import DepartmentProfile from "@/components/DepartmentProfile";
import StudentAchievements from "@/components/StudentAchievements";
import LatestNews from "@/components/LatestNews";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section id="beranda" className="pb-8 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 pt-8">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                Konsentrasi Keahlian <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">RPL</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Rekayasa Perangkat Lunak - Membangun Masa Depan Digital Indonesia
              </p>
            </div>

            {/* Photo Gallery */}
            <PhotoGallery />

            {/* Scroll Indicator */}
            <div className="text-center mt-12">
              <Button variant="ghost" size="icon" className="animate-bounce">
                <ChevronDown className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <HeadmasterWelcome />
      <DepartmentProfile />
      <StudentAchievements />
      <LatestNews />
    </div>
  );
};

export default Index;