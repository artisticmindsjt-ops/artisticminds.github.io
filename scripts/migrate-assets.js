#!/usr/bin/env node

/**
 * Asset Migration Script for ArtisticMinds Gallery
 * Helps migrate from external Lorem Picsum images to local assets
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
    PROJECT_ROOT: path.resolve(__dirname, '..'),
    ASSETS_DIR: path.resolve(__dirname, '..', 'assets'),
    ARTWORKS_DIR: path.resolve(__dirname, '..', 'assets', 'images', 'artworks'),
    THUMBNAILS_DIR: path.resolve(__dirname, '..', 'assets', 'images', 'thumbnails'),
    
    // Download settings
    ARTWORK_COUNT: 50,
    ARTWORK_SIZE: { width: 1200, height: 800 },
    THUMBNAIL_SIZE: { width: 400, height: 300 },
    
    // Quality settings
    JPEG_QUALITY: 85,
    WEBP_QUALITY: 80,
};

/**
 * Download image from URL
 * @param {string} url - Image URL
 * @param {string} filepath - Local file path
 * @returns {Promise} Download promise
 */
function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
                return;
            }
            
            response.pipe(file);
            
            file.on('finish', () => {
                file.close();
                resolve();
            });
            
            file.on('error', (err) => {
                fs.unlink(filepath, () => {}); // Clean up on error
                reject(err);
            });
        }).on('error', reject);
    });
}

/**
 * Generate filename with padding
 * @param {string} prefix - Filename prefix
 * @param {number} index - Image index
 * @param {string} extension - File extension
 * @returns {string} Generated filename
 */
function generateFilename(prefix, index, extension = 'jpg') {
    const paddedIndex = String(index).padStart(3, '0');
    return `${prefix}-${paddedIndex}.${extension}`;
}

/**
 * Create directory if it doesn't exist
 * @param {string} dirPath - Directory path
 */
function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`📁 Created directory: ${dirPath}`);
    }
}

/**
 * Download sample artworks from Lorem Picsum
 */
async function downloadSampleArtworks() {
    console.log('🎨 Starting artwork download...');
    
    ensureDir(CONFIG.ARTWORKS_DIR);
    ensureDir(CONFIG.THUMBNAILS_DIR);
    
    const downloadPromises = [];
    
    for (let i = 1; i <= CONFIG.ARTWORK_COUNT; i++) {
        // Full-size artwork
        const artworkUrl = `https://picsum.photos/${CONFIG.ARTWORK_SIZE.width}/${CONFIG.ARTWORK_SIZE.height}?random=${i}`;
        const artworkFilename = generateFilename('artwork', i, 'jpg');
        const artworkPath = path.join(CONFIG.ARTWORKS_DIR, artworkFilename);
        
        // Thumbnail
        const thumbnailUrl = `https://picsum.photos/${CONFIG.THUMBNAIL_SIZE.width}/${CONFIG.THUMBNAIL_SIZE.height}?random=${i}`;
        const thumbnailFilename = generateFilename('thumb', i, 'jpg');
        const thumbnailPath = path.join(CONFIG.THUMBNAILS_DIR, thumbnailFilename);
        
        // Add to download queue
        downloadPromises.push(
            downloadImage(artworkUrl, artworkPath).then(() => {
                console.log(`✅ Downloaded artwork ${i}/${CONFIG.ARTWORK_COUNT}`);
            }),
            downloadImage(thumbnailUrl, thumbnailPath).then(() => {
                console.log(`🖼️ Downloaded thumbnail ${i}/${CONFIG.ARTWORK_COUNT}`);
            })
        );
        
        // Add delay to avoid rate limiting
        if (i % 10 === 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    try {
        await Promise.all(downloadPromises);
        console.log('🎉 All artworks downloaded successfully!');
    } catch (error) {
        console.error('❌ Error downloading artworks:', error);
    }
}

/**
 * Generate asset manifest
 */
function generateAssetManifest() {
    console.log('📝 Generating asset manifest...');
    
    const manifest = {
        version: '1.0.0',
        generated: new Date().toISOString(),
        assets: {
            artworks: {
                count: CONFIG.ARTWORK_COUNT,
                path: './assets/images/artworks/',
                format: 'jpg',
                size: CONFIG.ARTWORK_SIZE,
                naming: 'artwork-{id}.jpg'
            },
            thumbnails: {
                count: CONFIG.ARTWORK_COUNT,
                path: './assets/images/thumbnails/',
                format: 'jpg',
                size: CONFIG.THUMBNAIL_SIZE,
                naming: 'thumb-{id}.jpg'
            },
            icons: {
                ui: ['heart', 'interest', 'filter', 'sort', 'close'],
                social: ['instagram'],
                path: './assets/icons/',
                format: 'svg'
            },
            logos: {
                files: ['main', 'admin', 'favicon'],
                path: './assets/logos/',
                formats: ['svg', 'png', 'ico']
            }
        }
    };
    
    const manifestPath = path.join(CONFIG.ASSETS_DIR, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`✅ Asset manifest generated: ${manifestPath}`);
}

/**
 * Update artwork.js to use local assets
 */
function updateArtworkModule() {
    console.log('🔧 Updating artwork module...');
    
    const artworkPath = path.join(CONFIG.PROJECT_ROOT, 'js', 'artwork.js');
    let content = fs.readFileSync(artworkPath, 'utf8');
    
    // Replace Lorem Picsum URLs with local asset function
    const oldPattern = /imageUrl: generateImageUrl\(i\)/g;
    const newPattern = `imageUrl: assetManager.getImageUrl('artwork', i)`;
    
    content = content.replace(oldPattern, newPattern);
    
    // Add asset manager import
    if (!content.includes('import { assetManager }')) {
        const importStatement = `import { assetManager } from './assets.js';\n`;
        content = importStatement + content;
    }
    
    fs.writeFileSync(artworkPath, content);
    console.log('✅ Artwork module updated');
}

/**
 * Create sample placeholder images
 */
async function createPlaceholders() {
    console.log('🖼️ Creating placeholder images...');
    
    const placeholderDir = path.join(CONFIG.ASSETS_DIR, 'images', 'placeholders');
    ensureDir(placeholderDir);
    
    // Create simple SVG placeholders
    const placeholderSvg = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f0f0"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="16" fill="#999">
            Artwork Loading...
        </text>
    </svg>`;
    
    const placeholderPath = path.join(placeholderDir, 'loading.svg');
    fs.writeFileSync(placeholderPath, placeholderSvg);
    console.log('✅ Placeholder images created');
}

/**
 * Display migration summary
 */
function displaySummary() {
    console.log('\n🎉 Asset Migration Complete!');
    console.log('===============================');
    console.log(`📁 Assets directory: ${CONFIG.ASSETS_DIR}`);
    console.log(`🎨 Artworks: ${CONFIG.ARTWORK_COUNT} files`);
    console.log(`🖼️ Thumbnails: ${CONFIG.ARTWORK_COUNT} files`);
    console.log(`📝 Manifest: assets/manifest.json`);
    console.log('\n📋 Next Steps:');
    console.log('1. Update your HTML to use index-modular.html');
    console.log('2. Test the local asset loading');
    console.log('3. Add your own artwork files to assets/images/artworks/');
    console.log('4. Update the asset manifest as needed');
    console.log('\n💡 Pro Tip: Use WebP format for better compression!');
}

/**
 * Main migration function
 */
async function migrate() {
    console.log('🚀 Starting ArtisticMinds Gallery Asset Migration');
    console.log('==================================================\n');
    
    try {
        await downloadSampleArtworks();
        generateAssetManifest();
        await createPlaceholders();
        updateArtworkModule();
        displaySummary();
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

// Handle command line arguments
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
    case 'download':
        downloadSampleArtworks();
        break;
    case 'manifest':
        generateAssetManifest();
        break;
    case 'placeholders':
        createPlaceholders();
        break;
    case 'update':
        updateArtworkModule();
        break;
    case 'help':
        console.log(`
Usage: node migrate-assets.js [command]

Commands:
  download     Download sample artworks from Lorem Picsum
  manifest     Generate asset manifest file
  placeholders Create placeholder images
  update       Update artwork module to use local assets
  help         Show this help message

Run without arguments to execute full migration.
        `);
        break;
    default:
        migrate();
}

export { migrate, downloadSampleArtworks, generateAssetManifest };

