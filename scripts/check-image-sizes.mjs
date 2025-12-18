import fs from 'fs';
import path from 'path';

// Function to get all image files in a directory with their sizes
function getImageFilesWithSizes(dir) {
    const files = fs.readdirSync(dir);
    const imageFiles = [];

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Recursively get images from subdirectories
            imageFiles.push(...getImageFilesWithSizes(filePath));
        } else {
            const ext = path.extname(file).toLowerCase();
            if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.jfif') {
                imageFiles.push({
                    path: filePath,
                    size: stat.size,
                    name: file
                });
            }
        }
    });

    return imageFiles;
}

// Main function to analyze image sizes
function analyzeImageSizes() {
    const imagesDir = path.join(process.cwd(), 'src', 'assets', 'images');
    const imageFiles = getImageFilesWithSizes(imagesDir);

    // Sort by size (largest first)
    imageFiles.sort((a, b) => b.size - a.size);

    console.log('Largest images:');
    console.log('================');

    let totalSize = 0;
    imageFiles.forEach((file, index) => {
        totalSize += file.size;
        if (index < 20) { // Show top 20 largest images
            console.log(`${(file.size / 1024 / 1024).toFixed(2)}MB - ${file.name}`);
        }
    });

    console.log(`\nTotal images: ${imageFiles.length}`);
    console.log(`Total size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Average size: ${(totalSize / imageFiles.length / 1024).toFixed(2)}KB`);

    // Count images by size ranges
    const sizeRanges = {
        '0-100KB': 0,
        '100KB-500KB': 0,
        '500KB-1MB': 0,
        '1MB-5MB': 0,
        '5MB+': 0
    };

    imageFiles.forEach(file => {
        const sizeMB = file.size / 1024 / 1024;
        if (sizeMB < 0.1) {
            sizeRanges['0-100KB']++;
        } else if (sizeMB < 0.5) {
            sizeRanges['100KB-500KB']++;
        } else if (sizeMB < 1) {
            sizeRanges['500KB-1MB']++;
        } else if (sizeMB < 5) {
            sizeRanges['1MB-5MB']++;
        } else {
            sizeRanges['5MB+']++;
        }
    });

    console.log('\nSize distribution:');
    console.log('==================');
    for (const [range, count] of Object.entries(sizeRanges)) {
        console.log(`${range}: ${count} images`);
    }
}

// Run the analysis
analyzeImageSizes();