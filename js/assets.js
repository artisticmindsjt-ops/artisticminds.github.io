/**
 * Asset Management Module for ArtisticMinds Gallery
 * Handles local assets, image optimization, and fallbacks
 */

import { CONSTANTS } from './constants.js';

/**
 * Asset Manager Class
 * Provides utilities for managing local assets and fallbacks
 */
export class AssetManager {
    constructor() {
        this.imageCache = new Map();
        this.loadedAssets = new Set();
        this.fallbackEnabled = true;
    }

    /**
     * Generate image URL with fallback support
     * @param {string} type - Type of image (artwork, thumbnail, placeholder)
     * @param {string|number} id - Image identifier
     * @param {Object} options - Additional options (width, height, format)
     * @returns {string} Image URL
     */
    getImageUrl(type = 'artwork', id, options = {}) {
        const {
            width = CONSTANTS.IMAGES.DEFAULT_WIDTH,
            height = CONSTANTS.IMAGES.DEFAULT_HEIGHT,
            format = 'jpg',
            fallback = true
        } = options;

        // Determine base path based on type
        let basePath;
        switch (type) {
            case 'artwork':
                basePath = CONSTANTS.IMAGES.ARTWORKS_PATH;
                break;
            case 'thumbnail':
                basePath = CONSTANTS.IMAGES.THUMBNAILS_PATH;
                break;
            case 'placeholder':
                basePath = CONSTANTS.IMAGES.PLACEHOLDERS_PATH;
                break;
            case 'background':
                basePath = CONSTANTS.IMAGES.BACKGROUNDS_PATH;
                break;
            default:
                basePath = CONSTANTS.IMAGES.IMAGES_PATH;
        }

        // Generate local asset path
        const filename = this.generateFilename(type, id, format);
        const localUrl = `${basePath}${filename}`;

        // Return fallback URL if local assets aren't available
        if (fallback && this.fallbackEnabled) {
            return this.getImageUrlWithFallback(localUrl, width, height, id);
        }

        return localUrl;
    }

    /**
     * Get image URL with fallback to external service
     * @param {string} localUrl - Local image URL
     * @param {number} width - Image width
     * @param {number} height - Image height
     * @param {string|number} id - Image identifier for external service
     * @returns {string} Image URL with fallback
     */
    getImageUrlWithFallback(localUrl, width, height, id) {
        // Check if local asset exists (you'd implement this check)
        if (this.localAssetExists(localUrl)) {
            return localUrl;
        }

        // Fallback to external service
        return `${CONSTANTS.IMAGES.PLACEHOLDER_SERVICE}/${width}/${height}?random=${id}`;
    }

    /**
     * Generate standardized filename
     * @param {string} type - Asset type
     * @param {string|number} id - Asset identifier
     * @param {string} format - File format
     * @returns {string} Generated filename
     */
    generateFilename(type, id, format = 'jpg') {
        const paddedId = String(id).padStart(3, '0');
        
        switch (type) {
            case 'artwork':
                return `artwork-${paddedId}.${format}`;
            case 'thumbnail':
                return `thumb-${paddedId}.${format}`;
            case 'placeholder':
                return `placeholder-${paddedId}.${format}`;
            case 'background':
                return `bg-${paddedId}.${format}`;
            default:
                return `image-${paddedId}.${format}`;
        }
    }

    /**
     * Get icon URL
     * @param {string} category - Icon category (ui, social, status)
     * @param {string} name - Icon name
     * @param {string} format - File format (default: svg)
     * @returns {string} Icon URL
     */
    getIconUrl(category, name, format = 'svg') {
        const basePath = `${CONSTANTS.IMAGES.ICONS_PATH}${category}/`;
        return `${basePath}${name}.${format}`;
    }

    /**
     * Get logo URL
     * @param {string} name - Logo name
     * @param {string} format - File format
     * @returns {string} Logo URL
     */
    getLogoUrl(name, format = 'svg') {
        return `${CONSTANTS.IMAGES.LOGOS_PATH}${name}.${format}`;
    }

    /**
     * Preload critical assets
     * @param {Array} assetUrls - Array of asset URLs to preload
     * @returns {Promise} Promise that resolves when all assets are loaded
     */
    async preloadAssets(assetUrls) {
        const promises = assetUrls.map(url => this.preloadImage(url));
        
        try {
            await Promise.all(promises);
            console.log('✅ Critical assets preloaded successfully');
        } catch (error) {
            console.warn('⚠️ Some assets failed to preload:', error);
        }
    }

    /**
     * Preload single image
     * @param {string} url - Image URL to preload
     * @returns {Promise} Promise that resolves when image is loaded
     */
    preloadImage(url) {
        return new Promise((resolve, reject) => {
            if (this.imageCache.has(url)) {
                resolve(this.imageCache.get(url));
                return;
            }

            const img = new Image();
            img.onload = () => {
                this.imageCache.set(url, img);
                this.loadedAssets.add(url);
                resolve(img);
            };
            img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
            img.src = url;
        });
    }

    /**
     * Check if local asset exists (simplified check)
     * In a real implementation, this would make a HEAD request or use a manifest
     * @param {string} url - Asset URL to check
     * @returns {boolean} Whether asset exists locally
     */
    localAssetExists(url) {
        // For now, assume external service is needed
        // In production, you'd check against an asset manifest or make HEAD requests
        return false;
    }

    /**
     * Generate responsive image sources
     * @param {string} baseUrl - Base image URL without size
     * @param {Array} sizes - Array of size objects {width, height, descriptor}
     * @returns {Object} Object with srcset and sizes
     */
    generateResponsiveSources(baseUrl, sizes = []) {
        const defaultSizes = [
            { width: 400, height: 300, descriptor: '400w' },
            { width: 800, height: 600, descriptor: '800w' },
            { width: 1200, height: 900, descriptor: '1200w' }
        ];

        const sizesToUse = sizes.length ? sizes : defaultSizes;
        
        const srcset = sizesToUse.map(size => {
            const url = `${baseUrl}?w=${size.width}&h=${size.height}`;
            return `${url} ${size.descriptor}`;
        }).join(', ');

        const sizesAttr = sizesToUse.map((_, index) => {
            if (index === sizesToUse.length - 1) return `${sizesToUse[index].width}px`;
            return `(max-width: ${sizesToUse[index].width}px) ${sizesToUse[index].width}px`;
        }).join(', ');

        return {
            srcset,
            sizes: sizesAttr
        };
    }

    /**
     * Create optimized img element
     * @param {Object} options - Image options
     * @returns {HTMLImageElement} Optimized img element
     */
    createOptimizedImage(options = {}) {
        const {
            src,
            alt = '',
            className = '',
            loading = 'lazy',
            responsive = false,
            sizes = []
        } = options;

        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.className = className;
        img.loading = loading;

        if (responsive) {
            const { srcset, sizes: sizesAttr } = this.generateResponsiveSources(src, sizes);
            img.srcset = srcset;
            img.sizes = sizesAttr;
        }

        return img;
    }

    /**
     * Get asset manifest (for production builds)
     * @returns {Object} Asset manifest object
     */
    getAssetManifest() {
        // In production, this would load from a generated manifest.json
        return {
            artworks: {
                count: 0,
                formats: ['jpg', 'webp'],
                sizes: ['thumbnail', 'standard', 'large']
            },
            icons: {
                ui: ['heart', 'interest', 'filter', 'sort'],
                social: ['instagram', 'twitter', 'facebook'],
                status: ['available', 'sold', 'reserved']
            },
            logos: ['main', 'admin', 'favicon']
        };
    }

    /**
     * Enable or disable fallback to external services
     * @param {boolean} enabled - Whether fallback is enabled
     */
    setFallbackEnabled(enabled) {
        this.fallbackEnabled = enabled;
        console.log(`Asset fallback ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Clear asset cache
     */
    clearCache() {
        this.imageCache.clear();
        this.loadedAssets.clear();
        console.log('Asset cache cleared');
    }

    /**
     * Get cache statistics
     * @returns {Object} Cache statistics
     */
    getCacheStats() {
        return {
            cachedImages: this.imageCache.size,
            loadedAssets: this.loadedAssets.size,
            fallbackEnabled: this.fallbackEnabled
        };
    }
}

// Export singleton instance
export const assetManager = new AssetManager();

// Helper functions for common use cases
export const getArtworkUrl = (id, options) => assetManager.getImageUrl('artwork', id, options);
export const getThumbnailUrl = (id, options) => assetManager.getImageUrl('thumbnail', id, options);
export const getIconUrl = (category, name) => assetManager.getIconUrl(category, name);
export const getLogoUrl = (name, format) => assetManager.getLogoUrl(name, format);

// Export constants for convenience
export const ASSET_PATHS = CONSTANTS.IMAGES;

