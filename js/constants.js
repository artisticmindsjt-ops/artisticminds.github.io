// Constants and hardcoded values for ArtisticMinds Gallery
// Centralized location for all strings, credentials, and configuration values

export const CONSTANTS = {
    // ===================
    // AUTHENTICATION
    // ===================
    AUTH: {
        ADMIN_EMAIL: 'admin@gallery.com',
        ADMIN_PASSWORD: null, // Set via secure prompt - not stored in code
        SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    },

    // ===================
    // SOCIAL MEDIA
    // ===================
    SOCIAL: {
        INSTAGRAM_HANDLE: 'artistic.minds.jt',
        INSTAGRAM_URL: 'https://instagram.com/artistic.minds.jt',
        INSTAGRAM_DISPLAY_NAME: '@artistic.minds.jt',
    },

    // ===================
    // BRANDING & UI TEXT
    // ===================
    BRANDING: {
        SITE_NAME: 'ArtisticMinds by JT',
        SITE_TAGLINE: 'Discover Beautiful Art',
        ADMIN_PORTAL_NAME: 'ArtisticMinds by JT Admin',
        HERO_SUBTITLE: 'Explore our curated collection of stunning artwork',
        COPYRIGHT_TEXT: '© 2025 ArtisticMinds by JT. All rights reserved.',
        FOOTER_TAGLINE: 'Gallery Management Portal',
    },

    // ===================
    // NAVIGATION & MENU
    // ===================
    NAVIGATION: {
        HOME: 'Home',
        COLLECTIONS: 'Collections',
        ABOUT: 'About',
        ADMIN_DASHBOARD: 'Admin Dashboard',
    },

    // ===================
    // GALLERY SETTINGS
    // ===================
    GALLERY: {
        ITEMS_PER_PAGE: 6,
        LOADING_DELAY: 1000,
        SCROLL_THRESHOLD: 100,
        TRANSITION_DURATION: 300,
        MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
        SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    },

    // ===================
    // USER MESSAGES
    // ===================
    MESSAGES: {
        // Loading states
        LOADING_ARTWORKS: 'Loading artworks...',
        LOADING_MORE: 'Loading more artworks...',
        
        // Gallery states
        SHOWING_ALL: 'Showing all artworks',
        SHOWING_FILTERED: 'Showing {count} of {total} artworks',
        NO_ARTWORKS_FOUND: 'No artworks found matching your criteria',
        
        // Actions
        LIKE_ARTWORK: 'Like',
        SHOW_INTEREST: 'Show Interest',
        CLEAR_FILTERS: 'Clear Filters',
        
        // Admin messages
        UPLOAD_SUCCESS: 'Artwork uploaded successfully!',
        UPLOAD_ERROR: 'Error uploading artwork. Please try again.',
        DELETE_CONFIRM: 'Are you sure you want to delete this artwork?',
        DELETE_SUCCESS: 'Artwork deleted successfully',
        LOGIN_ERROR: 'Invalid credentials. Please try again.',
        ACCESS_DENIED: 'Access denied. Admin privileges required.',
        
        // Form validation
        REQUIRED_FIELD: 'This field is required',
        INVALID_EMAIL: 'Please enter a valid email address',
        INVALID_PRICE: 'Please enter a valid price',
        FILE_TOO_LARGE: 'File size must be less than 10MB',
        INVALID_FILE_TYPE: 'Please select a valid image file (JPEG, PNG, WebP)',
        
        // Image protection
        PROTECTION_WARNING: 'Content is protected',
        RIGHT_CLICK_DISABLED: 'Right-click is disabled on this content',
        COPY_DISABLED: 'Copying is disabled on this content',
        DEV_TOOLS_WARNING: 'Developer tools detected. Content protection is active.',
    },

    // ===================
    // ARTWORK DATA
    // ===================
    ARTWORK: {
        CATEGORIES: [
            'Abstract', 'Landscape', 'Portrait', 'Still Life', 
            'Modern', 'Contemporary', 'Sculpture', 'Digital Art'
        ],
        
        THEMES: [
            'Nature', 'Urban', 'Minimalist', 'Colorful', 
            'Monochrome', 'Vintage', 'Futuristic', 'Classic'
        ],
        
        STATUS_OPTIONS: [
            'available', 'sold', 'reserved', 'draft'
        ],
        
        CURRENCY: 'USD',
        DEFAULT_DIMENSIONS: '60x80 cm',
        
        SAMPLE_ARTISTS: [
            'Elena Rodriguez', 'Marcus Chen', 'Aria Thompson', 'David Kim', 'Sofia Petrov',
            'James Wilson', 'Maya Patel', 'Alex Morgan', 'Luna Zhang', 'Gabriel Santos',
            'Isabella Cruz', 'Ethan Park', 'Zoe Anderson', 'Oliver Smith', 'Mia Johnson'
        ],
        
        SAMPLE_DESCRIPTIONS: [
            'A captivating piece that explores the intersection of emotion and color.',
            'Bold strokes and vibrant hues create a dynamic visual experience.',
            'This artwork invites contemplation through its subtle interplay of light and shadow.',
            'A stunning representation of contemporary artistic expression.',
            'Intricate details reveal new discoveries with each viewing.',
            'The perfect balance of chaos and harmony captured on canvas.',
            'A timeless piece that speaks to the universal human experience.',
            'Modern techniques meet classical inspiration in this remarkable work.'
        ],
        
        SAMPLE_MEDIUMS: [
            'Oil on canvas', 'Acrylic on canvas', 'Watercolor on paper',
            'Digital print', 'Mixed media', 'Charcoal on paper',
            'Pastel on paper', 'Ink and wash', 'Photography'
        ],
        
        SAMPLE_TAGS: [
            'modern', 'classic', 'colorful', 'minimalist', 'abstract', 
            'realistic', 'expressive', 'peaceful', 'energetic', 'contemplative',
            'bold', 'subtle', 'dramatic', 'serene', 'vibrant'
        ],
        
        TITLE_ADJECTIVES: [
            'Ethereal', 'Vibrant', 'Serene', 'Bold', 'Mysterious', 
            'Luminous', 'Dramatic', 'Gentle', 'Radiant', 'Tranquil'
        ],
        
        TITLE_NOUNS: [
            'Dreams', 'Whispers', 'Echoes', 'Reflection', 'Journey', 
            'Harmony', 'Vision', 'Symphony', 'Essence', 'Rhythm'
        ],
        
        ROMAN_NUMERALS: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'],
    },

    // ===================
    // PRICE RANGES
    // ===================
    PRICING: {
        RANGES: [
            { label: '$0 - $100', min: 0, max: 100 },
            { label: '$100 - $500', min: 100, max: 500 },
            { label: '$500 - $1,000', min: 500, max: 1000 },
            { label: '$1,000 - $5,000', min: 1000, max: 5000 },
            { label: '$5,000+', min: 5000, max: null }
        ],
        
        GENERATION_RANGES: [
            { min: 100, max: 500 },
            { min: 500, max: 1000 },
            { min: 1000, max: 2500 },
            { min: 2500, max: 5000 },
            { min: 5000, max: 10000 }
        ],
        
        DIMENSION_OPTIONS: {
            WIDTHS: [30, 40, 50, 60, 70, 80, 90, 100],
            HEIGHTS: [40, 50, 60, 70, 80, 90, 100, 120]
        }
    },

    // ===================
    // FILTER OPTIONS
    // ===================
    FILTERS: {
        SORT_OPTIONS: [
            { value: 'newest', label: 'Newest First' },
            { value: 'oldest', label: 'Oldest First' },
            { value: 'price-low', label: 'Price: Low to High' },
            { value: 'price-high', label: 'Price: High to Low' },
            { value: 'popular', label: 'Most Popular' },
            { value: 'alphabetical', label: 'Alphabetical' }
        ],
        
        DEFAULT_FILTERS: {
            category: 'all',
            theme: 'all',
            priceRange: 'all',
            newOnly: false,
            sortBy: 'newest',
            search: ''
        }
    },

    // ===================
    // ADMIN DASHBOARD
    // ===================
    ADMIN: {
        TABS: {
            UPLOAD: { id: 'upload', label: '📤 Upload Artwork' },
            MANAGE: { id: 'manage', label: '📋 Manage Artworks' },
            ANALYTICS: { id: 'analytics', label: '📊 Analytics' },
            USERS: { id: 'users', label: '👥 User Management' }
        },
        
        BULK_ACTIONS: [
            { value: 'delete', label: '🗑️ Delete Selected' },
            { value: 'available', label: 'Mark as Available' },
            { value: 'sold', label: 'Mark as Sold' },
            { value: 'reserved', label: 'Mark as Reserved' },
            { value: 'draft', label: 'Mark as Draft' },
            { value: 'export', label: '📤 Export Selected' }
        ],
        
        ITEMS_PER_PAGE: 10,
        
        ANALYTICS_PERIODS: [
            { value: '7', label: 'Last 7 days' },
            { value: '30', label: 'Last 30 days' },
            { value: '90', label: 'Last 3 months' },
            { value: '365', label: 'Last year' }
        ]
    },

    // ===================
    // LOCAL STORAGE KEYS
    // ===================
    STORAGE: {
        ARTWORKS: 'artworks',
        LIKES: 'userLikes',
        INTERESTS: 'userInterests',
        ADMIN_USER: 'adminUser',
        CURRENT_USER: 'currentUser',
        FILTERS: 'savedFilters',
        CART: 'shoppingCart',
        WISHLIST: 'wishlist'
    },

    // ===================
    // IMAGE SETTINGS
    // ===================
    IMAGES: {
        // Asset paths
        BASE_PATH: './assets/',
        IMAGES_PATH: './assets/images/',
        ARTWORKS_PATH: './assets/images/artworks/',
        THUMBNAILS_PATH: './assets/images/thumbnails/',
        PLACEHOLDERS_PATH: './assets/images/placeholders/',
        BACKGROUNDS_PATH: './assets/images/backgrounds/',
        
        // Icons and logos
        ICONS_PATH: './assets/icons/',
        UI_ICONS_PATH: './assets/icons/ui/',
        SOCIAL_ICONS_PATH: './assets/icons/social/',
        LOGOS_PATH: './assets/logos/',
        
        // External fallback
        PLACEHOLDER_SERVICE: 'https://picsum.photos',
        
        // Image settings
        DEFAULT_WIDTH: 400,
        DEFAULT_HEIGHT: 600,
        LAZY_LOADING: true,
        WEBP_SUPPORT: true,
        
        // Supported formats
        SUPPORTED_FORMATS: ['jpg', 'jpeg', 'png', 'webp', 'svg'],
        
        // Image sizes
        THUMBNAIL_SIZE: { width: 400, height: 300 },
        ARTWORK_SIZE: { width: 1200, height: 800 },
        HERO_SIZE: { width: 1920, height: 1080 },
    },

    // ===================
    // PROTECTION SETTINGS
    // ===================
    PROTECTION: {
        ENABLED: true,
        DEV_TOOLS_DETECTION: true,
        WATERMARK_ENABLED: true,
        DISABLE_RIGHT_CLICK: true,
        DISABLE_DRAG: true,
        DISABLE_SELECT: true,
        DISABLE_SHORTCUTS: true,
        BLUR_ON_DEV_TOOLS: true,
        CONSOLE_CLEAR_INTERVAL: 1000,
    },

    // ===================
    // FORM VALIDATION
    // ===================
    VALIDATION: {
        EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        MIN_TITLE_LENGTH: 2,
        MAX_TITLE_LENGTH: 100,
        MIN_ARTIST_LENGTH: 2,
        MAX_ARTIST_LENGTH: 50,
        MIN_DESCRIPTION_LENGTH: 10,
        MAX_DESCRIPTION_LENGTH: 1000,
        MIN_PRICE: 0.01,
        MAX_PRICE: 1000000,
        MAX_TAGS: 10,
        MAX_TAG_LENGTH: 20,
    },

    // ===================
    // DATE/TIME FORMATS
    // ===================
    FORMATS: {
        DATE_SHORT: { year: 'numeric', month: 'short', day: 'numeric' },
        DATE_LONG: { year: 'numeric', month: 'long', day: 'numeric' },
        DATE_TIME: { 
            year: 'numeric', month: 'short', day: 'numeric', 
            hour: '2-digit', minute: '2-digit' 
        },
        CURRENCY: { style: 'currency', currency: 'USD' },
        NUMBER: { maximumFractionDigits: 0 }
    },

    // ===================
    // API ENDPOINTS (Future use)
    // ===================
    API: {
        BASE_URL: '/api/v1',
        ENDPOINTS: {
            ARTWORKS: '/artworks',
            UPLOAD: '/upload',
            ANALYTICS: '/analytics',
            AUTH: '/auth',
            USERS: '/users'
        }
    },

    // ===================
    // FEATURE FLAGS
    // ===================
    FEATURES: {
        ENABLE_CART: false,
        ENABLE_WISHLIST: true,
        ENABLE_COMMENTS: false,
        ENABLE_RATINGS: false,
        ENABLE_SHARING: true,
        ENABLE_PRINT: false,
        ENABLE_FULLSCREEN: true,
        ENABLE_ZOOM: true,
        ENABLE_SLIDESHOW: false,
    },

    // ===================
    // RESPONSIVE BREAKPOINTS
    // ===================
    BREAKPOINTS: {
        MOBILE: 768,
        TABLET: 1024,
        DESKTOP: 1200,
        LARGE_DESKTOP: 1400
    },

    // ===================
    // COLORS (CSS Custom Properties)
    // ===================
    COLORS: {
        PRIMARY: '#45b7d1',
        SECONDARY: '#ff6b6b',
        SUCCESS: '#28a745',
        ERROR: '#dc3545',
        WARNING: '#ffc107',
        INFO: '#17a2b8',
        DARK: '#1a1a1a',
        LIGHT: '#ffffff',
        MUTED: '#6c757d'
    }
};

// Helper function to get nested constant values
export const getConstant = (path) => {
    return path.split('.').reduce((obj, key) => obj?.[key], CONSTANTS);
};

// Helper function to format message templates
export const formatMessage = (template, variables = {}) => {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
        return variables[key] !== undefined ? variables[key] : match;
    });
};

// Export individual sections for easier imports
export const AUTH = CONSTANTS.AUTH;
export const SOCIAL = CONSTANTS.SOCIAL;
export const BRANDING = CONSTANTS.BRANDING;
export const MESSAGES = CONSTANTS.MESSAGES;
export const ARTWORK = CONSTANTS.ARTWORK;
export const GALLERY = CONSTANTS.GALLERY;
export const PRICING = CONSTANTS.PRICING;
export const ADMIN = CONSTANTS.ADMIN;
export const STORAGE = CONSTANTS.STORAGE;
export const PROTECTION = CONSTANTS.PROTECTION;
