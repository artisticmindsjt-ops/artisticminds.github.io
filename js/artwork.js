// Artwork data model and management
import { CONSTANTS, ARTWORK, PRICING, STORAGE } from './constants.js';
import { CONFIG, getRandomElement, getRandomPrice, generateImageUrl } from './config.js';
import { storage, generateId, format } from './utils.js';

export class Artwork {
    constructor(data = {}) {
        this.id = data.id || generateId();
        this.title = data.title || '';
        this.artist = data.artist || '';
        this.imageUrl = data.imageUrl || '';
        this.category = data.category || '';
        this.theme = data.theme || '';
        this.price = data.price || 0;
        this.currency = data.currency || 'USD';
        this.isNew = data.isNew || false;
        this.dateAdded = data.dateAdded || new Date().toISOString();
        this.likes = data.likes || 0;
        this.interests = data.interests || 0;
        this.status = data.status || 'available';
        this.tags = data.tags || [];
        this.dimensions = data.dimensions || '';
        this.medium = data.medium || '';
        this.description = data.description || '';
        this.isFeatured = data.isFeatured || false;
        this.isLimitedEdition = data.isLimitedEdition || false;
    }
    
    // Format price for display
    getFormattedPrice() {
        return format.currency(this.price, this.currency);
    }
    
    // Get formatted date
    getFormattedDate() {
        return format.date(this.dateAdded);
    }
    
    // Check if artwork is new (added within last 7 days)
    isNewArrival() {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return new Date(this.dateAdded) > oneWeekAgo;
    }
    
    // Get popularity score
    getPopularityScore() {
        return this.likes + (this.interests * 0.5);
    }
    
    // Check if artwork matches filters
    matchesFilters(filters) {
        // Category filter
        if (filters.category && filters.category !== 'all' && 
            this.category.toLowerCase() !== filters.category.toLowerCase()) {
            return false;
        }
        
        // Theme filter
        if (filters.theme && filters.theme !== 'all' && 
            this.theme.toLowerCase() !== filters.theme.toLowerCase()) {
            return false;
        }
        
        // Price range filter
        if (filters.priceRange && filters.priceRange !== 'all') {
            const [min, max] = filters.priceRange.split('-').map(Number);
            if (max) {
                if (this.price < min || this.price > max) return false;
            } else {
                // Handle "5000+" case
                if (this.price < min) return false;
            }
        }
        
        // New arrivals filter
        if (filters.newOnly && !this.isNewArrival()) {
            return false;
        }
        
        // Search filter
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            const searchableText = [
                this.title,
                this.artist,
                this.description,
                ...this.tags
            ].join(' ').toLowerCase();
            
            if (!searchableText.includes(searchTerm)) {
                return false;
            }
        }
        
        return true;
    }
    
    // Convert to JSON for storage
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            artist: this.artist,
            imageUrl: this.imageUrl,
            category: this.category,
            theme: this.theme,
            price: this.price,
            currency: this.currency,
            isNew: this.isNew,
            dateAdded: this.dateAdded,
            likes: this.likes,
            interests: this.interests,
            status: this.status,
            tags: this.tags,
            dimensions: this.dimensions,
            medium: this.medium,
            description: this.description,
            isFeatured: this.isFeatured,
            isLimitedEdition: this.isLimitedEdition
        };
    }
}

export class ArtworkManager {
    constructor() {
        this.artworks = [];
        this.loadArtworks();
    }
    
    // Load artworks from storage
    loadArtworks() {
        const savedArtworks = storage.get(STORAGE.ARTWORKS);
        if (savedArtworks && savedArtworks.length > 0) {
            this.artworks = savedArtworks.map(data => new Artwork(data));
        } else {
            this.generateSampleArtworks();
            this.saveArtworks();
        }
    }
    
    // Save artworks to storage
    saveArtworks() {
        const artworkData = this.artworks.map(artwork => artwork.toJSON());
        storage.set(STORAGE.ARTWORKS, artworkData);
    }
    
    // Generate sample artworks
    generateSampleArtworks() {
        const sampleArtworks = [];
        
        for (let i = 1; i <= 50; i++) {
            const artwork = new Artwork({
                id: i,
                title: this.generateArtworkTitle(),
                artist: getRandomElement(ARTWORK.SAMPLE_ARTISTS),
                imageUrl: generateImageUrl(i),
                category: getRandomElement(ARTWORK.CATEGORIES),
                theme: getRandomElement(ARTWORK.THEMES),
                price: getRandomPrice(),
                isNew: Math.random() < 0.3, // 30% chance of being new
                dateAdded: this.generateRandomDate(),
                likes: Math.floor(Math.random() * 100),
                interests: Math.floor(Math.random() * 50),
                status: Math.random() < 0.9 ? 'available' : 'sold',
                tags: this.generateTags(),
                dimensions: this.generateDimensions(),
                medium: this.generateMedium(),
                description: getRandomElement(ARTWORK.SAMPLE_DESCRIPTIONS),
                isFeatured: Math.random() < 0.2, // 20% chance of being featured
                isLimitedEdition: Math.random() < 0.15 // 15% chance of being limited edition
            });
            
            sampleArtworks.push(artwork);
        }
        
        this.artworks = sampleArtworks;
    }
    
    // Generate artwork title
    generateArtworkTitle() {
        const adjective = getRandomElement(ARTWORK.TITLE_ADJECTIVES);
        const noun = getRandomElement(ARTWORK.TITLE_NOUNS);
        const hasNumber = Math.random() < 0.3;
        
        return hasNumber 
            ? `${adjective} ${noun} ${getRandomElement(ARTWORK.ROMAN_NUMERALS)}`
            : `${adjective} ${noun}`;
    }
    
    // Generate random date within last year
    generateRandomDate() {
        const now = new Date();
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        const randomTime = oneYearAgo.getTime() + Math.random() * (now.getTime() - oneYearAgo.getTime());
        return new Date(randomTime).toISOString();
    }
    
    // Generate tags
    generateTags() {
        const numTags = Math.floor(Math.random() * 4) + 1;
        const tags = [];
        
        for (let i = 0; i < numTags; i++) {
            const tag = getRandomElement(ARTWORK.SAMPLE_TAGS);
            if (!tags.includes(tag)) {
                tags.push(tag);
            }
        }
        
        return tags;
    }
    
    // Generate dimensions
    generateDimensions() {
        const width = getRandomElement(PRICING.DIMENSION_OPTIONS.WIDTHS);
        const height = getRandomElement(PRICING.DIMENSION_OPTIONS.HEIGHTS);
        
        return `${width}x${height} cm`;
    }
    
    // Generate medium
    generateMedium() {
        return getRandomElement(ARTWORK.SAMPLE_MEDIUMS);
    }
    
    // Get all artworks
    getAllArtworks() {
        return this.artworks;
    }
    
    // Get artwork by ID
    getArtworkById(id) {
        return this.artworks.find(artwork => artwork.id == id);
    }
    
    // Add new artwork
    addArtwork(artworkData) {
        const artwork = new Artwork(artworkData);
        this.artworks.push(artwork);
        this.saveArtworks();
        return artwork;
    }
    
    // Update artwork
    updateArtwork(id, updateData) {
        const artworkIndex = this.artworks.findIndex(artwork => artwork.id == id);
        if (artworkIndex !== -1) {
            Object.assign(this.artworks[artworkIndex], updateData);
            this.saveArtworks();
            return this.artworks[artworkIndex];
        }
        return null;
    }
    
    // Delete artwork
    deleteArtwork(id) {
        const artworkIndex = this.artworks.findIndex(artwork => artwork.id == id);
        if (artworkIndex !== -1) {
            const deletedArtwork = this.artworks.splice(artworkIndex, 1)[0];
            this.saveArtworks();
            return deletedArtwork;
        }
        return null;
    }
    
    // Filter artworks
    filterArtworks(filters) {
        return this.artworks.filter(artwork => artwork.matchesFilters(filters));
    }
    
    // Sort artworks
    sortArtworks(artworks, sortBy) {
        return [...artworks].sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.dateAdded) - new Date(a.dateAdded);
                case 'oldest':
                    return new Date(a.dateAdded) - new Date(b.dateAdded);
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'popular':
                    return b.getPopularityScore() - a.getPopularityScore();
                case 'alphabetical':
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });
    }
    
    // Get featured artworks
    getFeaturedArtworks() {
        return this.artworks.filter(artwork => artwork.isFeatured);
    }
    
    // Get statistics
    getStatistics() {
        const total = this.artworks.length;
        const available = this.artworks.filter(a => a.status === 'available').length;
        const sold = this.artworks.filter(a => a.status === 'sold').length;
        const totalLikes = this.artworks.reduce((sum, a) => sum + a.likes, 0);
        const totalInterests = this.artworks.reduce((sum, a) => sum + a.interests, 0);
        const totalValue = this.artworks.reduce((sum, a) => sum + a.price, 0);
        
        return {
            total,
            available,
            sold,
            totalLikes,
            totalInterests,
            totalValue,
            averagePrice: total > 0 ? Math.round(totalValue / total) : 0
        };
    }
}
