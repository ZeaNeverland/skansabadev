import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Function to compress a single image with size checking
async function compressImage(inputPath, quality = 80) {
    try {
        const ext = path.extname(inputPath).toLowerCase();
        const tempOutputPath = inputPath + '.tmp';

        // Get original file size
        const originalStat = fs.statSync(inputPath);
        const originalSize = originalStat.size;

        if (ext === '.png') {
            // For PNG files, convert to JPEG to save more space
            await sharp(inputPath)
                .jpeg({ quality })
                .toFile(tempOutputPath);

            // Check if compressed file is smaller
            const compressedStat = fs.statSync(tempOutputPath);
            if (compressedStat.size < originalSize) {
                // Remove original and rename temp file
                fs.unlinkSync(inputPath);
                fs.renameSync(tempOutputPath, inputPath.replace('.png', '.jpg'));
                console.log(`Converted and compressed: ${inputPath} -> ${inputPath.replace('.png', '.jpg')}`);
                return compressedStat.size;
            } else {
                // Keep original if compression doesn't help
                fs.unlinkSync(tempOutputPath);
                console.log(`Skipped compression (no size benefit): ${inputPath}`);
                return originalSize;
            }
        } else {
            // For JPG/JPEG files, compress with specified quality
            await sharp(inputPath)
                .jpeg({ quality })
                .toFile(tempOutputPath);

            // Check if compressed file is smaller
            const compressedStat = fs.statSync(tempOutputPath);
            if (compressedStat.size < originalSize) {
                // Remove original and rename temp file
                fs.unlinkSync(inputPath);
                fs.renameSync(tempOutputPath, inputPath);
                console.log(`Compressed: ${inputPath}`);
                return compressedStat.size;
            } else {
                // Keep original if compression doesn't help
                fs.unlinkSync(tempOutputPath);
                console.log(`Skipped compression (no size benefit): ${inputPath}`);
                return originalSize;
            }
        }
    } catch (error) {
        console.error(`Error compressing ${inputPath}:`, error.message);
        // Clean up temp file if it exists
        const tempOutputPath = inputPath + '.tmp';
        if (fs.existsSync(tempOutputPath)) {
            fs.unlinkSync(tempOutputPath);
        }
        return null;
    }
}

// Function to get all image files in a directory
function getImageFiles(dir) {
    const files = fs.readdirSync(dir);
    const imageFiles = [];

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Recursively get images from subdirectories
            imageFiles.push(...getImageFiles(filePath));
        } else {
            const ext = path.extname(file).toLowerCase();
            if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.jfif') {
                imageFiles.push(filePath);
            }
        }
    });

    return imageFiles;
}

// Main function to compress all images
async function compressAllImages() {
    const imagesDir = path.join(process.cwd(), 'src', 'assets', 'images');
    const imageFiles = getImageFiles(imagesDir);

    console.log(`Found ${imageFiles.length} images to process`);

    // Filter out already compressed images (below 500KB)
    const largeImages = imageFiles.filter(filePath => {
        const stat = fs.statSync(filePath);
        return stat.size > 500 * 1024; // 500KB threshold
    });

    console.log(`Found ${largeImages.length} large images to compress`);

    let totalOriginalSize = 0;
    let totalCompressedSize = 0;

    // Compress each large image
    for (const imagePath of largeImages) {
        const stat = fs.statSync(imagePath);
        const originalSize = stat.size;
        totalOriginalSize += originalSize;

        // Skip if already small enough
        if (originalSize <= 500 * 1024) {
            totalCompressedSize += originalSize;
            continue;
        }

        // Determine quality based on size
        let quality = 80;
        if (originalSize > 10 * 1024 * 1024) { // > 10MB
            quality = 50;
        } else if (originalSize > 5 * 1024 * 1024) { // > 5MB
            quality = 60;
        } else if (originalSize > 2 * 1024 * 1024) { // > 2MB
            quality = 70;
        }

        const newSize = await compressImage(imagePath, quality);
        if (newSize !== null) {
            totalCompressedSize += newSize;
        } else {
            totalCompressedSize += originalSize; // In case of error, count original size
        }
    }

    const reduction = totalOriginalSize > 0 ?
        ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(1) : 0;

    console.log(`\nSummary:`);
    console.log(`Total original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Total compressed size: ${(totalCompressedSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Space saved: ${((totalOriginalSize - totalCompressedSize) / 1024 / 1024).toFixed(2)}MB (${reduction}% reduction)`);
    console.log('Image compression completed!');
}

// Run the compression
compressAllImages().catch(console.error);