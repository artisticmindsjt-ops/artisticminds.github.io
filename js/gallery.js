// Gallery display and interaction module
import { CONFIG } from './config.js';
import { dom, events, storage, animation, debounce } from './utils.js';

export class Gallery {
    constructor(artworkManager) {
        this.artworkManager = artworkManager;
        this.currentPage = 0;
        this.itemsPerPage = CONFIG.ITEMS_PER_PAGE;
        this.isLoading = false;
        this.filteredArtworks = [];
        this.currentFilters = {
            category: 'all',
            theme: 'all',
            priceRange: 'all',
            newOnly: false,
            sortBy: 'newest',
            search: ''
        };
        
        // DOM elements
        this.galleryGrid = dom.$('#galleryGrid');
        this.loadingElement = dom.$('#loading');
        this.resultsCount = dom.$('#resultsCount');
        
        this.init();
    }
    
    init() {
        this.filteredArtworks = this.artworkManager.getAllArtworks();
        this.setupEventListeners();
        this.loadInitialArtworks();
        this.updateResultsCount();
    }
    
    setupEventListeners() {
        // Infinite scroll
        window.addEventListener('scroll', debounce(() => {
            if (this.shouldLoadMore()) {
                this.loadMoreArtworks();
            }
        }, 200));
        
        // Artwork click events (using event delegation)
        events.delegate(this.galleryGrid, '.art-item', 'click', (e) => {
            const artId = e.currentTarget.dataset.artId;
            this.openArtworkModal(artId);
        });
        
        // Like button events
        events.delegate(this.galleryGrid, '.like-btn', 'click', (e) => {
            e.stopPropagation();
            const artId = e.currentTarget.closest('.art-item').dataset.artId;
            this.toggleLike(artId, e.currentTarget);
        });
        
        // Interest button events
        events.delegate(this.galleryGrid, '.interest-btn', 'click', (e) => {
            e.stopPropagation();
            const artId = e.currentTarget.closest('.art-item').dataset.artId;
            this.toggleInterest(artId, e.currentTarget);
        });
    }
    
    shouldLoadMore() {
        const scrollPosition = window.innerHeight + window.scrollY;
        const documentHeight = document.documentElement.offsetHeight;
        return scrollPosition >= documentHeight - CONFIG.SCROLL_THRESHOLD && !this.isLoading;
    }
    
    loadInitialArtworks() {
        this.currentPage = 0;
        this.galleryGrid.innerHTML = '';
        this.loadMoreArtworks();
    }
    
    loadMoreArtworks() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoading();
        
        // Simulate loading delay
        setTimeout(() => {
            const startIndex = this.currentPage * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;
            const artworksToLoad = this.filteredArtworks.slice(startIndex, endIndex);
            
            artworksToLoad.forEach(artwork => {
                this.createArtworkElement(artwork);
            });
            
            this.currentPage++;
            this.isLoading = false;
            this.hideLoading();
            
            // Update results count after first load
            if (this.currentPage === 1) {
                this.updateResultsCount();
            }
            
            // Hide loading if we've reached the end
            if (endIndex >= this.filteredArtworks.length) {
                dom.hide(this.loadingElement);
            }
        }, CONFIG.LOADING_DELAY);
    }
    
    createArtworkElement(artwork) {
        const artItem = dom.create('div', 'art-item');
        artItem.dataset.artId = artwork.id;
        
        // Get user likes and interests
        const userLikes = storage.get(CONFIG.STORAGE_KEYS.LIKES) || [];
        const userInterests = storage.get(CONFIG.STORAGE_KEYS.INTERESTS) || [];
        const isLiked = userLikes.includes(artwork.id.toString());
        const isInterested = userInterests.includes(artwork.id.toString());
        
        artItem.innerHTML = `
            <div class="art-image-container">
                <img src="${artwork.imageUrl}" alt="${artwork.title}" class="art-image" loading="lazy">
                <div class="image-protection-overlay"></div>
                ${artwork.isNew ? '<span class="new-badge">New</span>' : ''}
                ${artwork.isFeatured ? '<span class="featured-badge">Featured</span>' : ''}
                ${artwork.isLimitedEdition ? '<span class="limited-badge">Limited</span>' : ''}
                <div class="art-overlay">
                    <div class="art-actions">
                        <button class="like-btn ${isLiked ? 'liked' : ''}" data-art-id="${artwork.id}">
                            <span class="heart">❤️</span>
                            <span class="like-count">${artwork.likes}</span>
                        </button>
                        <button class="interest-btn ${isInterested ? 'interested' : ''}" data-art-id="${artwork.id}">
                            <span class="interest-icon">💌</span>
                            <span class="interest-count">${artwork.interests}</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="art-info">
                <h3 class="art-title">${artwork.title}</h3>
                <p class="art-artist">by ${artwork.artist}</p>
                <div class="art-details">
                    <span class="art-price">${artwork.getFormattedPrice()}</span>
                    <span class="art-category">${artwork.category}</span>
                </div>
                <div class="art-tags">
                    ${artwork.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        
        // Add animation
        artItem.style.opacity = '0';
        artItem.style.transform = 'translateY(20px)';
        
        this.galleryGrid.appendChild(artItem);
        
        // Animate in
        requestAnimationFrame(() => {
            artItem.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            artItem.style.opacity = '1';
            artItem.style.transform = 'translateY(0)';
        });
    }
    
    toggleLike(artId, button) {
        const userLikes = storage.get(CONFIG.STORAGE_KEYS.LIKES) || [];
        const artwork = this.artworkManager.getArtworkById(artId);
        
        if (!artwork) return;
        
        const isLiked = userLikes.includes(artId.toString());
        const likeCountElement = button.querySelector('.like-count');
        
        if (isLiked) {
            // Remove like
            const index = userLikes.indexOf(artId.toString());
            userLikes.splice(index, 1);
            artwork.likes = Math.max(0, artwork.likes - 1);
            dom.removeClass(button, 'liked');
        } else {
            // Add like
            userLikes.push(artId.toString());
            artwork.likes += 1;
            dom.addClass(button, 'liked');
            
            // Add animation
            button.style.transform = 'scale(1.2)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 200);
        }
        
        likeCountElement.textContent = artwork.likes;
        storage.set(CONFIG.STORAGE_KEYS.LIKES, userLikes);
        this.artworkManager.saveArtworks();
        
        // Prevent event bubbling
        return false;
    }
    
    toggleInterest(artId, button) {
        const userInterests = storage.get(CONFIG.STORAGE_KEYS.INTERESTS) || [];
        const artwork = this.artworkManager.getArtworkById(artId);
        
        if (!artwork) return;
        
        const isInterested = userInterests.includes(artId.toString());
        const interestCountElement = button.querySelector('.interest-count');
        
        if (isInterested) {
            // Remove interest
            const index = userInterests.indexOf(artId.toString());
            userInterests.splice(index, 1);
            artwork.interests = Math.max(0, artwork.interests - 1);
            dom.removeClass(button, 'interested');
        } else {
            // Add interest
            userInterests.push(artId.toString());
            artwork.interests += 1;
            dom.addClass(button, 'interested');
            
            // Add animation
            button.style.transform = 'scale(1.2)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 200);
        }
        
        interestCountElement.textContent = artwork.interests;
        storage.set(CONFIG.STORAGE_KEYS.INTERESTS, userInterests);
        this.artworkManager.saveArtworks();
        
        // Prevent event bubbling
        return false;
    }
    
    openArtworkModal(artId) {
        const artwork = this.artworkManager.getArtworkById(artId);
        if (!artwork) return;
        
        // Dispatch custom event for modal to handle
        const event = new CustomEvent('openArtworkModal', {
            detail: { artwork }
        });
        document.dispatchEvent(event);
    }
    
    applyFilters(filters) {
        this.currentFilters = { ...this.currentFilters, ...filters };
        
        // Filter artworks
        this.filteredArtworks = this.artworkManager.filterArtworks(this.currentFilters);
        
        // Sort artworks
        this.filteredArtworks = this.artworkManager.sortArtworks(
            this.filteredArtworks, 
            this.currentFilters.sortBy
        );
        
        // Reset pagination and reload
        this.currentPage = 0;
        this.galleryGrid.innerHTML = '';
        dom.show(this.loadingElement);
        this.loadMoreArtworks();
        this.updateResultsCount();
    }
    
    updateResultsCount() {
        if (!this.resultsCount) return;
        
        const count = this.filteredArtworks.length;
        const total = this.artworkManager.getAllArtworks().length;
        
        this.resultsCount.textContent = count === total 
            ? 'Showing all artworks'
            : `Showing ${count} of ${total} artworks`;
    }
    
    clearFilters() {
        this.currentFilters = {
            category: 'all',
            theme: 'all',
            priceRange: 'all',
            newOnly: false,
            sortBy: 'newest',
            search: ''
        };
        
        this.applyFilters(this.currentFilters);
    }
    
    showLoading() {
        if (this.loadingElement) {
            dom.show(this.loadingElement, 'flex');
        }
    }
    
    hideLoading() {
        if (this.loadingElement && this.currentPage > 0) {
            dom.hide(this.loadingElement);
        }
    }
    
    // Search functionality
    search(query) {
        this.applyFilters({ search: query });
    }
    
    // Get current filters
    getCurrentFilters() {
        return { ...this.currentFilters };
    }
    
    // Get filtered artworks count
    getFilteredCount() {
        return this.filteredArtworks.length;
    }
    
    // Refresh gallery
    refresh() {
        this.artworkManager.loadArtworks();
        this.filteredArtworks = this.artworkManager.getAllArtworks();
        this.applyFilters(this.currentFilters);
    }
}

