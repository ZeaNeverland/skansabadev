import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Function to optimize a single image with resizing and compression
async function optimizeImage(inputPath, maxWidth = 1920, quality = 80) {
    try {
        const ext = path.extname(inputPath).toLowerCase();
        const tempOutputPath = inputPath + '.tmp';

        // Get original file size and dimensions
        const originalStat = fs.statSync(inputPath);
        const originalSize = originalStat.size;
        const metadata = await sharp(inputPath).metadata();

        console.log(`Processing ${path.basename(inputPath)} (${(originalSize / 1024 / 1024).toFixed(2)}MB, ${metadata.width}x${metadata.height})`);

        // Calculate new dimensions maintaining aspect ratio
        let newWidth = metadata.width;
        let newHeight = metadata.height;

        if (metadata.width > maxWidth) {
            const ratio = metadata.height / metadata.width;
            newWidth = maxWidth;
            newHeight = Math.round(maxWidth * ratio);
        }

        if (ext === '.png') {
            // For PNG files, convert to JPEG to save more space
            await sharp(inputPath)
                .resize(newWidth, newHeight, { fit: 'inside', withoutEnlargement: true })
                .jpeg({ quality })
                .toFile(tempOutputPath);

            // Check if optimized file is smaller
            const optimizedStat = fs.statSync(tempOutputPath);
            if (optimizedStat.size < originalSize) {
                // Remove original and rename temp file
                fs.unlinkSync(inputPath);
                fs.renameSync(tempOutputPath, inputPath.replace('.png', '.jpg'));
                const reduction = ((originalSize - optimizedStat.size) / originalSize * 100).toFixed(1);
                console.log(`✓ Converted and optimized: ${path.basename(inputPath)} -> ${path.basename(inputPath).replace('.png', '.jpg')} (${reduction}% smaller)`);
                return optimizedStat.size;
            } else {
                // Keep original if optimization doesn't help
                fs.unlinkSync(tempOutputPath);
                console.log(`- Skipped optimization (no size benefit): ${path.basename(inputPath)}`);
                return originalSize;
            }
        } else {
            // For JPG/JPEG files, resize and compress
            await sharp(inputPath)
                .resize(newWidth, newHeight, { fit: 'inside', withoutEnlargement: true })
                .jpeg({ quality })
                .toFile(tempOutputPath);

            // Check if optimized file is smaller
            const optimizedStat = fs.statSync(tempOutputPath);
            if (optimizedStat.size < originalSize) {
                // Remove original and rename temp file
                fs.unlinkSync(inputPath);
                fs.renameSync(tempOutputPath, inputPath);
                const reduction = ((originalSize - optimizedStat.size) / originalSize * 100).toFixed(1);
                console.log(`✓ Optimized: ${path.basename(inputPath)} (${reduction}% smaller)`);
                return optimizedStat.size;
            } else {
                // Keep original if optimization doesn't help
                fs.unlinkSync(tempOutputPath);
                console.log(`- Skipped optimization (no size benefit): ${path.basename(inputPath)}`);
                return originalSize;
            }
        }
    } catch (error) {
        console.error(`Error optimizing ${inputPath}:`, error.message);
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

// Main function to optimize all images
async function optimizeAllImages() {
    const imagesDir = path.join(process.cwd(), 'src', 'assets', 'images');
    const imageFiles = getImageFiles(imagesDir);

    console.log(`Found ${imageFiles.length} images to process\n`);

    // Filter images by size for different optimization strategies
    const largeImages = imageFiles.filter(filePath => {
        const stat = fs.statSync(filePath);
        return stat.size > 1024 * 1024; // > 1MB
    });

    const mediumImages = imageFiles.filter(filePath => {
        const stat = fs.statSync(filePath);
        return stat.size > 500 * 1024 && stat.size <= 1024 * 1024; // 500KB - 1MB
    });

    console.log(`Found ${largeImages.length} large images (>1MB)`);
    console.log(`Found ${mediumImages.length} medium images (500KB-1MB)\n`);

    let totalOriginalSize = 0;
    let totalOptimizedSize = 0;

    // Process large images (resize to 1920px width)
    console.log('Processing large images (resizing to 1920px width)...');
    for (const imagePath of largeImages) {
        const stat = fs.statSync(imagePath);
        const originalSize = stat.size;
        totalOriginalSize += originalSize;

        const newSize = await optimizeImage(imagePath, 1920, 80);
        if (newSize !== null) {
            totalOptimizedSize += newSize;
        } else {
            totalOptimizedSize += originalSize; // In case of error, count original size
        }
    }

    // Process medium images (resize to 1280px width)
    console.log('\nProcessing medium images (resizing to 1280px width)...');
    for (const imagePath of mediumImages) {
        const stat = fs.statSync(imagePath);
        const originalSize = stat.size;
        totalOriginalSize += originalSize;

        const newSize = await optimizeImage(imagePath, 1280, 85);
        if (newSize !== null) {
            totalOptimizedSize += newSize;
        } else {
            totalOptimizedSize += originalSize; // In case of error, count original size
        }
    }

    // Process remaining images (smaller than 500KB) with compression only
    const smallImages = imageFiles.filter(filePath => {
        const stat = fs.statSync(filePath);
        return stat.size <= 500 * 1024; // <= 500KB
    });

    console.log(`\nProcessing ${smallImages.length} small images (compression only)...`);
    for (const imagePath of smallImages) {
        const stat = fs.statSync(imagePath);
        const originalSize = stat.size;
        totalOriginalSize += originalSize;

        const newSize = await optimizeImage(imagePath, null, 90); // No resize, just compression
        if (newSize !== null) {
            totalOptimizedSize += newSize;
        } else {
            totalOptimizedSize += originalSize; // In case of error, count original size
        }
    }

    const reduction = totalOriginalSize > 0 ?
        ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1) : 0;

    console.log(`\n=== SUMMARY ===`);
    console.log(`Total original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Total optimized size: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Space saved: ${((totalOriginalSize - totalOptimizedSize) / 1024 / 1024).toFixed(2)}MB (${reduction}% reduction)`);
    console.log('Image optimization completed!');
}

// Run the optimization
optimizeAllImages().catch(console.error);