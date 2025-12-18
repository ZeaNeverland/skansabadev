import { existsSync, mkdirSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Source and destination directories
const srcDir = join(__dirname, '../src/assets/images');
const destDir = join(__dirname, '../public/images');

// Create public/images directory if it doesn't exist
if (!existsSync(destDir)) {
  mkdirSync(destDir, { recursive: true });
}

// List of gallery images to copy
const galleryImages = [
  'IMG_1880.JPG',
  'IMG_1889.JPG',
  'IMG_2068.JPG',
  'IMG_2083.JPG',
  'IMG_2089.JPG',
  'IMG_5627.JPG',
  'P1180247.JPG',
  'P1180251.JPG',
  'P1180264.JPG',
  'P1180269.JPG',
  'lab16.jpg',
  'lab18.jpg',
  'lab19.jpg',
  'lab_18.jpg'
];

// Copy each image to the public directory
galleryImages.forEach(file => {
  const srcPath = join(srcDir, file);
  const destPath = join(destDir, file);

  try {
    if (existsSync(srcPath)) {
      copyFileSync(srcPath, destPath);
      console.log(`Copied: ${file}`);
    } else {
      console.warn(`Warning: Source file not found: ${file}`);
    }
  } catch (err) {
    console.error(`Error copying ${file}:`, err);
  }
});

console.log('Gallery images copy process completed.');

// Copy images.ts from src to public
const srcPath = join(__dirname, '..', 'src', 'assets', 'images.ts');
const publicAssetsDir = join(__dirname, '..', 'public', 'assets');
const destPath = join(publicAssetsDir, 'images.ts');

// Create public/assets directory if it doesn't exist
if (!existsSync(publicAssetsDir)) {
  mkdirSync(publicAssetsDir, { recursive: true });
}

copyFileSync(srcPath, destPath);
console.log('Copied images.ts from src to public');