import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '..', 'src', 'assets');
const targetDir = path.join(__dirname, '..', 'public', 'assets');
const targetPartnersDir = path.join(targetDir, 'partners');

// Create target directories if they don't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}
if (!fs.existsSync(targetPartnersDir)) {
  fs.mkdirSync(targetPartnersDir, { recursive: true });
}

// Function to copy files
const copyFiles = (source, target) => {
  try {
    const files = fs.readdirSync(source);
    
    files.forEach(file => {
      const sourcePath = path.join(source, file);
      const targetPath = path.join(target, file);
      
      // Skip directories (we'll handle them separately)
      if (fs.statSync(sourcePath).isDirectory()) {
        if (!fs.existsSync(targetPath)) {
          fs.mkdirSync(targetPath, { recursive: true });
        }
        copyFiles(sourcePath, targetPath);
        return;
      }
      
      // Skip if file already exists in target
      if (fs.existsSync(targetPath)) {
        console.log(`Skipping ${file} - already exists in target`);
        return;
      }
      
      // Copy file
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`Copied ${file} to ${targetPath}`);
    });
    
    console.log('All files copied successfully!');
  } catch (error) {
    console.error('Error copying files:', error);
  }
};

// Start the copy process
copyFiles(sourceDir, targetDir);

// Update images.ts with new paths
const imagesTsPath = path.join(__dirname, '..', 'src', 'utils', 'images.ts');
if (fs.existsSync(imagesTsPath)) {
  let content = fs.readFileSync(imagesTsPath, 'utf8');
  
  // Update paths to use /assets/ instead of /src/assets/
  content = content.replace(/\/src\/assets\//g, '/assets/');
  
  fs.writeFileSync(imagesTsPath, content, 'utf8');
  console.log('Updated image paths in images.ts');
}
