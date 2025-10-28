import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, '..', 'src', 'assets');

// Function to remove files and directories recursively
const removeFiles = (dir) => {
  if (!fs.existsSync(dir)) {
    console.log(`Directory ${dir} does not exist.`);
    return;
  }

  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    
    if (fs.statSync(filePath).isDirectory()) {
      // Recursively remove files in subdirectories
      removeFiles(filePath);
      // Remove the directory if it's empty
      if (fs.readdirSync(filePath).length === 0) {
        fs.rmdirSync(filePath);
        console.log(`Removed directory: ${filePath}`);
      }
    } else {
      // Remove file
      fs.unlinkSync(filePath);
      console.log(`Removed file: ${filePath}`);
    }
  }

  // Remove the main assets directory if empty
  if (fs.existsSync(assetsDir) && fs.readdirSync(assetsDir).length === 0) {
    fs.rmdirSync(assetsDir);
    console.log(`Removed directory: ${assetsDir}`);
  }
};

// Start the cleanup
console.log('Starting cleanup of old assets...');
removeFiles(assetsDir);
console.log('Cleanup completed!');
