import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicAssetsDir = path.join(__dirname, '..', 'public', 'assets');

// Mapping of current filenames to original filenames
const filenameMappings = {
  'IMG_1880.JPG': 'IMG1880.jpg',
  // Add more mappings if needed
};

// Function to rename files
const restoreFilenames = () => {
  try {
    // Create src/assets directory if it doesn't exist
    const srcAssetsDir = path.join(__dirname, '..', 'src', 'assets');
    if (!fs.existsSync(srcAssetsDir)) {
      fs.mkdirSync(srcAssetsDir, { recursive: true });
    }

    // Move and rename files
    for (const [currentName, originalName] of Object.entries(filenameMappings)) {
      const currentPath = path.join(publicAssetsDir, currentName);
      const originalPath = path.join(srcAssetsDir, originalName);
      
      if (fs.existsSync(currentPath)) {
        // Copy file to src/assets with original name
        fs.copyFileSync(currentPath, originalPath);
        console.log(`Copied ${currentName} to src/assets/${originalName}`);
        
        // Remove from public/assets
        fs.unlinkSync(currentPath);
        console.log(`Removed ${currentName} from public/assets`);
      } else {
        console.log(`File not found: ${currentName}`);
      }
    }

    console.log('File restoration completed!');
  } catch (error) {
    console.error('Error restoring files:', error);
  }
};

// Run the restoration
restoreFilenames();
