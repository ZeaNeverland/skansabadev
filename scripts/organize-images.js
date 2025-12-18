import { promises as fs } from 'fs';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the mapping of old filenames to new filenames
const imageMappings = {
  // Organization
  'persegi.png': 'logo_square.png',
  'persegi remove.png': 'logo_square_remove.png',
  'skansabadev.png': 'logo.png',
  
  // Team & Staff
  'bu diah.jpeg': 'headmaster.jpeg',
  'pak haris.jpeg': 'wakasek_kurikulum.jpeg',
  'pak rusdi.jpeg': 'wakasek_sarana.jpeg',
  'bu rosy.jpeg': 'kajur_rpl.jpeg',
  'bu dinda.jpeg': 'guru_web.jpeg',
  'bu reny.jpeg': 'guru_mobile.jpeg',
  'kepsek.jpeg': 'kepala_sekolah.jpeg',
  
  // Facilities
  'lab16.jpg': 'lab_16.jpg',
  'lab18.jpg': 'lab_18.jpg',
  'lab19.jpg': 'lab_19.jpg',
  
  // News
  'bootcamp.jpg': 'news_1.jpg',
  'images1.jpg': 'gallery_1.jpg',
  'images2.jpg': 'news_2.jpg',
  'images3.jpg': 'gallery_3.jpg',
  
  // Partners
  'gamatechno.jpg': 'partners/gamatechno.jpg',
  'aino.png': 'partners/aino.png',
  'bisaai.jpeg': 'partners/bisaai.jpeg',
  'gits.webp': 'partners/gits.webp',
  'node.webp': 'partners/node.webp',
  'ini.png': 'partners/ini.png'
};

async function organizeImages() {
  const assetsDir = path.join(__dirname, '..', 'src', 'assets');
  
  // Create partners directory if it doesn't exist
  const partnersDir = path.join(assetsDir, 'partners');
  if (!existsSync(partnersDir)) {
    mkdirSync(partnersDir, { recursive: true });
  }
  
  try {
    const files = await fs.readdir(assetsDir);
    
    for (const file of files) {
      if (imageMappings[file]) {
        const oldPath = path.join(assetsDir, file);
        const newPath = path.join(assetsDir, imageMappings[file]);
        
        // Create directory if it doesn't exist
        const newDir = path.dirname(newPath);
        try {
          await fs.access(newDir);
        } catch {
          await fs.mkdir(newDir, { recursive: true });
        }
        
        await fs.rename(oldPath, newPath);
        console.log(`Renamed: ${file} -> ${imageMappings[file]}`);
      }
    }
    
    console.log('Image organization complete!');
  } catch (error) {
    console.error('Error organizing images:', error);
  }
}

organizeImages();
