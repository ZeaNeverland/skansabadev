import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// For checking if file exists
import { access, constants } from 'fs/promises';

async function fileExists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

// Map of old import paths to new ones
const importMappings = {
  // Organization
  'persegi.png': 'LOGO_SQUARE',
  'persegi remove.png': 'LOGO_SQUARE_REMOVE',
  'skansabadev.png': 'LOGO',
  
  // Team & Staff
  'bu diah.jpeg': 'HEADMASTER',
  'pak haris.jpeg': 'WAKASEK_KURIKULUM',
  'pak rusdi.jpeg': 'WAKASEK_SARANA',
  'bu rosy.jpeg': 'KAJUR_RPL',
  'bu dinda.jpeg': 'GURU_WEB',
  'bu reny.jpeg': 'GURU_MOBILE',
  'kepsek.jpeg': 'HEADMASTER',
  
  // Facilities
  'lab16.jpg': 'LAB_16',
  'lab18.jpg': 'LAB_18',
  'lab19.jpg': 'LAB_19',
  
  // Student Works
  'controller.jpg': 'CONTROLLER',
  'dashboard.png': 'DASHBOARD',
  'ecommerce.png': 'ECOMMERCE',
  'editor.png': 'EDITOR',
  'monday.png': 'MONDAY',
  'matematika.png': 'MATEMATIKA',
  'perpustakaan.png': 'PERPUSTAKAAN',
  'sistem.jpg': 'SISTEM',
  
  // News & Gallery
  'bootcamp.jpg': 'NEWS_1',
  'images1.jpg': 'GALLERY_1',
  'images2.jpg': 'NEWS_2',
  'images3.jpg': 'GALLERY_3',
  
  // Partners
  'gamatechno.jpg': 'GAMATECHNO',
  'aino.png': 'AINO',
  'bisaai.jpeg': 'BISAAI',
  'gits.webp': 'GITS',
  'node.webp': 'NODE',
  'ini.png': 'INI'
};

async function updateImportsInFile(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    let updated = false;
    
    // Replace import statements
    for (const [oldFile, newConst] of Object.entries(importMappings)) {
      const oldImportRegex = new RegExp(`import\s+[\w_]+\s+from\s+["']@/assets/${oldFile.replace('.', '\.')}["']`, 'g');
      
      if (oldImportRegex.test(content)) {
        // Remove the old import
        content = content.replace(oldImportRegex, '');
        
        // Add to the IMAGES import if not already there
        if (!content.includes('import { IMAGES } from "@/utils/images"')) {
          content = 'import { IMAGES } from "@/utils/images";\n' + content;
        }
        
        // Replace usages of the old import with IMAGES.NEW_CONST
        const varNameMatch = content.match(new RegExp(`import\s+([\w_]+)\s+from\s+["']@/assets/${oldFile.replace('.', '\.')}["']`));
        if (varNameMatch && varNameMatch[1]) {
          const oldVarName = varNameMatch[1];
          const usageRegex = new RegExp(`\b${oldVarName}\b`, 'g');
          content = content.replace(usageRegex, `IMAGES.${newConst}`);
        }
        
        updated = true;
      }
    }
    
    if (updated) {
await fs.writeFile(filePath, content, 'utf8');
      console.log(`Updated imports in ${path.basename(filePath)}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

async function updateAllImports() {
  const srcDir = path.join(__dirname, '..', 'src');
  
  // Get all TypeScript and JavaScript files
  const files = await findFiles(srcDir, ['.tsx', '.ts', '.jsx', '.js']);
  
  for (const file of files) {
    await updateImportsInFile(file);
  }
  
  console.log('All imports have been updated!');
}

async function findFiles(dir, extensions) {
  const files = [];
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        const subFiles = await findFiles(fullPath, extensions);
        files.push(...subFiles);
      } else if (extensions.includes(path.extname(entry.name).toLowerCase())) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }
  
  return files;
}

updateAllImports().catch(console.error);
