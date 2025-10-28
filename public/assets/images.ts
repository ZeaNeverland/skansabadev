// Import facility images using import.meta.glob
const facilityImages = import.meta.glob<string>('./images/lab_*.jpg', { eager: true, query: '?url', import: 'default' });
const perpustakaanImg = import.meta.glob<string>('./images/perpustakaan.png', { eager: true, query: '?url', import: 'default' });

// Facility Images
export const FACILITY_IMAGES = {
  lab1: facilityImages['./images/lab_16.jpg'],
  lab2: facilityImages['./images/lab_18.jpg'],
  lab3: facilityImages['./images/lab_19.jpg'],
  perpustakaan: perpustakaanImg['./images/perpustakaan.png'],
} as const;

// Import profile images using import.meta.glob
const profileImages = import.meta.glob<string>('./images/*.{jpeg,jpg}', { eager: true, query: '?url', import: 'default' });

// Extract profile images
const kepalaSekolah = profileImages['./images/kepala_sekolah.jpeg'];
const pakrusdi = profileImages['./images/pak rusdi.jpeg'];
const pakharis = profileImages['./images/pak haris.jpeg'];
const buDiah = profileImages['./images/bu diah.jpeg'];
const buDinda = profileImages['./images/bu dinda.jpeg'];
const buReny = profileImages['./images/bu reny.jpeg'];
const buRosy = profileImages['./images/bu rosy.jpeg'];
const alip = profileImages['./images/alip.jpg'];
const abyan = profileImages['./images/abyan.jpg'];
const nai = profileImages['./images/nai.jpg'];

// Profile Images
export const PROFILE_IMAGES = {
  kepalaSekolah,
  pakrusdi,  // Changed from wakasekKurikulum
  pakharis,  // Changed from wakasekSarana
  buDinda,
  buReny,
  buDiah,
  buRosy,
  alip,
  abyan,
  nai,
} as const;

// Import gallery images using import.meta.glob
const galleryImages = import.meta.glob<string>('./images/gallery_*.jpg', { eager: true, query: '?url', import: 'default' });
const imgImages = import.meta.glob<string>('./images/IMG_*.JPG', { eager: true, query: '?url', import: 'default' });

// Extract gallery images
const gallery1 = galleryImages['./images/gallery_1.jpg'];
const gallery2 = imgImages['./images/IMG_1889.JPG'];
const gallery3 = imgImages['./images/IMG_2068.JPG'];
const gallery4 = imgImages['./images/IMG_1880.JPG']; // Changed from IMG_2083.JPG which doesn't exist
const gallery5 = imgImages['./images/IMG_2089.JPG'];
const gallery6 = imgImages['./images/IMG_5627.JPG'];
const gallery7 = imgImages['./images/P1180251.JPG'];
const gallery8 = imgImages['./images/SNY00080.JPG'];
const gallery9 = imgImages['./images/SNY00126.JPG'];
const gallery10 = galleryImages['./images/gallery_3.jpg']; // Using gallery_3.jpg as gallery10

// Gallery Images
export const GALLERY_IMAGES = {
  gallery1,
  gallery2,
  gallery3,
  gallery4,
  gallery5,
  gallery6,
  gallery7,
  gallery8,
  gallery9,
  gallery10,
} as const;

// Import news images using import.meta.glob
const newsImages = import.meta.glob<string>('./images/news_*.jpg', { eager: true, query: '?url', import: 'default' });
const news1 = newsImages['./images/news_1.jpg'];
const news2 = newsImages['./images/news_2.jpg'];

// News Images
export const NEWS_IMAGES = {
  news1,
  news2,
} as const;

// Import logos using import.meta.glob
const logoImages = import.meta.glob<string>('./images/logo*.png', { eager: true, query: '?url', import: 'default' });
const suitmediaLogoImg = import.meta.glob<string>('./images/Suitmedialogo.png', { eager: true, query: '?url', import: 'default' });

const logo = logoImages['./images/logo.png'];
const logoSquare = logoImages['./images/logo_square.png'];
const logoSquareRemove = logoImages['./images/logo_square_remove.png'];
const suitmediaLogo = suitmediaLogoImg['./images/Suitmedialogo.png'];

// Logo & Icons
export const LOGOS = {
  logo,
  logoSquare,
  logoSquareRemove,
  suitmediaLogo,
} as const;

// Import partner logos using import.meta.glob
const partnerLogos = import.meta.glob<string>('./images/partners/*.{png,jpg,jpeg,webp}', { eager: true, query: '?url', import: 'default' });

// Partner Logos
export const PARTNER_LOGOS = {
  aino: partnerLogos['./images/partners/aino.png'],
  bisaai: partnerLogos['./images/partners/bisaai.jpeg'],
  gamatechno: partnerLogos['./images/partners/gamatechno.jpg'],
  gits: partnerLogos['./images/partners/gits.webp'],
  ini: partnerLogos['./images/partners/ini.png'],
  node: partnerLogos['./images/partners/node.webp'],
} as const;

// Import other images using import.meta.glob
const otherImages = import.meta.glob<string>('./images/*.{png,jpg,jpeg,webp,JPG,JPEG,PNG,jfif}', { eager: true, query: '?url', import: 'default' });

// Other Images
export const OTHER_IMAGES = {
  dashboard: otherImages['./images/dashboard.png'],
  ecommerce: otherImages['./images/ecommerce.png'],
  editor: otherImages['./images/editor.png'],
  controller: otherImages['./images/controller.jpg'],
  sistem: otherImages['./images/sistem.jpg'],
  matematika: otherImages['./images/matematika.jpg'],
  wgs: otherImages['./images/wgs.png'],
  // Adding missing images for gallery
  bootcamp: otherImages['./images/bootcamp.JPG'],
  seminar: otherImages['./images/news_1.jpg'],
  fieldTrip: otherImages['./images/gallery_1.jpg'],
  competition: otherImages['./images/news_2.jpg'],
  graduation: otherImages['./images/gallery_3.jpg'],
  workshop: otherImages['./images/workshop.JPG'],
} as const;

// Export all images in a single object for backward compatibility
export const IMAGES = {
  ...FACILITY_IMAGES,
  ...PROFILE_IMAGES,
  ...GALLERY_IMAGES,
  ...NEWS_IMAGES,
  ...LOGOS,
  ...PARTNER_LOGOS,
  ...OTHER_IMAGES,
} as const;
