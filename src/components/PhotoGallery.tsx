import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IMAGES } from "@/assets/images";

// Default images for the gallery
const defaultImages = [
  IMAGES.gallery1,
  IMAGES.news2,
  IMAGES.gallery3
];

const PhotoGallery = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: defaultImages[0],
      title: "Praktikum Pemrograman",
      description: "Siswa RPL sedang mengembangkan aplikasi dalam laboratorium modern"
    },
    {
      image: defaultImages[1],
      title: "Presentasi Proyek",
      description: "Presentasi hasil karya siswa RPL kepada panel penguji industri"
    },
    {
      image: defaultImages[2],
      title: "Kompetisi Programming",
      description: "Siswa RPL berpartisipasi dalam kompetisi pemrograman tingkat nasional"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 to-primary-glow/10">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-3xl font-bold text-white mb-2">{slide.title}</h3>
                <p className="text-lg text-white/90">{slide.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 rounded-full w-10 h-10 z-10 shadow-md"
        aria-label="Previous slide"
        title="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 rounded-full w-10 h-10 z-10 shadow-md"
        aria-label="Next slide"
        title="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? "bg-white scale-110"
                : "bg-white/50 hover:bg-white/75 scale-100"
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            title={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery;