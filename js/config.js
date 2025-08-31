// Configuration module for ArtisticMinds Gallery
import { CONSTANTS, ARTWORK, GALLERY, PRICING } from './constants.js';

// Re-export commonly used constants for backward compatibility
export const CONFIG = {
    // Gallery settings
    ITEMS_PER_PAGE: GALLERY.ITEMS_PER_PAGE,
    LOADING_DELAY: GALLERY.LOADING_DELAY,
    SCROLL_THRESHOLD: GALLERY.SCROLL_THRESHOLD,
    TRANSITION_DURATION: GALLERY.TRANSITION_DURATION,
    
    // Admin credentials
    ADMIN_EMAIL: CONSTANTS.AUTH.ADMIN_EMAIL,
    ADMIN_PASSWORD: CONSTANTS.AUTH.ADMIN_PASSWORD,
    
    // Instagram settings
    INSTAGRAM_HANDLE: CONSTANTS.SOCIAL.INSTAGRAM_HANDLE,
    INSTAGRAM_URL: CONSTANTS.SOCIAL.INSTAGRAM_URL,
    
    // Image protection settings
    PROTECTION_ENABLED: CONSTANTS.PROTECTION.ENABLED,
    DEV_TOOLS_DETECTION: CONSTANTS.PROTECTION.DEV_TOOLS_DETECTION,
    WATERMARK_ENABLED: CONSTANTS.PROTECTION.WATERMARK_ENABLED,
    
    // Local storage keys
    STORAGE_KEYS: CONSTANTS.STORAGE,
    
    // Gallery data
    CATEGORIES: ARTWORK.CATEGORIES,
    THEMES: ARTWORK.THEMES,
    ARTISTS: ARTWORK.SAMPLE_ARTISTS,
    PRICE_RANGES: PRICING.GENERATION_RANGES,
    DESCRIPTIONS: ARTWORK.SAMPLE_DESCRIPTIONS
};

// Utility functions for configuration
export const getRandomElement = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

export const getRandomPrice = () => {
    const range = getRandomElement(CONFIG.PRICE_RANGES);
    return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
};

export const generateImageUrl = (id, width = 400, height = 600) => {
    return `https://picsum.photos/${width}/${height}?random=${id}`;
};
