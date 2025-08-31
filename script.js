// Art gallery application
class ArtGallery {
    constructor() {
        this.artworks = [];
        this.filteredArtworks = [];
        this.currentPage = 0;
        this.itemsPerPage = 6;
        this.isLoading = false;
        this.likes = this.loadLikes();
        this.interests = this.loadInterests();
        this.currentUser = this.loadCurrentUser();
        this.currentFilters = {
            category: 'all',
            theme: 'all',
            priceRange: 'all',
            newOnly: false,
            sortBy: 'newest'
        };
        
        this.galleryGrid = document.getElementById('galleryGrid');
        this.loading = document.getElementById('loading');
        this.modal = document.getElementById('artModal');
        this.modalClose = document.getElementById('modalClose');
        
        this.init();
    }
    
    init() {
        // Load saved artworks or generate new ones
        const savedArtworks = this.loadSavedArtworks();
        if (savedArtworks && savedArtworks.length > 0) {
            this.artworks = savedArtworks;
        } else {
            this.generateSampleArtworks();
            this.saveArtworks();
        }
        
        this.filteredArtworks = [...this.artworks];
        
        this.setupEventListeners();
        this.setupFilters();
        this.loadInitialArtworks();
        this.setupImageProtection();
    }
    
    generateSampleArtworks() {
        // Generate sample artwork data
        const categories = ['Abstract', 'Landscape', 'Portrait', 'Still Life', 'Modern', 'Contemporary', 'Sculpture', 'Digital Art'];
        const themes = ['Nature', 'Urban', 'Minimalist', 'Colorful', 'Monochrome', 'Vintage', 'Futuristic', 'Classic'];
        const artists = [
            'Elena Rodriguez', 'Marcus Chen', 'Aria Thompson', 'David Kim', 'Sofia Petrov',
            'James Wilson', 'Maya Patel', 'Alex Morgan', 'Luna Zhang', 'Gabriel Santos',
            'Isabella Cruz', 'Ethan Park', 'Zoe Anderson', 'Oliver Smith', 'Mia Johnson'
        ];
        
        const descriptions = [
            'A captivating piece that explores the intersection of emotion and color.',
            'Bold strokes and vivid hues create a mesmerizing visual experience.',
            'A contemporary interpretation of classical themes with modern sensibilities.',
            'Intricate details and masterful composition showcase artistic excellence.',
            'A thought-provoking work that challenges conventional artistic boundaries.',
            'Harmonious blend of technique and creativity resulting in visual poetry.',
            'Dynamic composition that captures the essence of movement and energy.',
            'Subtle textures and rich colors create an atmosphere of tranquility.',
            'A powerful statement piece that resonates with deep emotional undertones.',
            'Innovative approach to traditional mediums yields stunning results.'
        ];
        
        // Generate 50 sample artworks with enhanced data
        for (let i = 1; i <= 50; i++) {
            const width = Math.random() > 0.5 ? 400 : 600;
            const height = Math.random() > 0.5 ? 300 : 500;
            const basePrice = Math.floor(Math.random() * 5000) + 500; // $500 - $5500
            const isNew = Math.random() > 0.7; // 30% chance of being new
            const dateAdded = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000); // Within last 90 days
            
            this.artworks.push({
                id: i,
                title: `${categories[Math.floor(Math.random() * categories.length)]} Masterpiece ${i}`,
                artist: artists[Math.floor(Math.random() * artists.length)],
                description: descriptions[Math.floor(Math.random() * descriptions.length)],
                imageUrl: `https://picsum.photos/${width}/${height}?random=${i}`,
                category: categories[Math.floor(Math.random() * categories.length)],
                theme: themes[Math.floor(Math.random() * themes.length)],
                price: basePrice,
                currency: 'USD',
                isNew: isNew,
                dateAdded: dateAdded,
                likes: Math.floor(Math.random() * 100), // Random initial likes
                interests: Math.floor(Math.random() * 25), // Random initial interests
                status: 'available', // available, sold, reserved
                tags: this.generateRandomTags(),
                dimensions: `${width/10}x${height/10} inches`,
                medium: this.getRandomMedium()
            });
        }
    }
    
    generateRandomTags() {
        const allTags = ['trending', 'featured', 'limited edition', 'bestseller', 'new arrival', 'vintage', 'collectible', 'handmade'];
        const numTags = Math.floor(Math.random() * 3) + 1; // 1-3 tags
        const selectedTags = [];
        
        for (let i = 0; i < numTags; i++) {
            const randomTag = allTags[Math.floor(Math.random() * allTags.length)];
            if (!selectedTags.includes(randomTag)) {
                selectedTags.push(randomTag);
            }
        }
        
        return selectedTags;
    }
    
    getRandomMedium() {
        const mediums = ['Oil on Canvas', 'Acrylic', 'Watercolor', 'Digital Print', 'Mixed Media', 'Charcoal', 'Pastel', 'Photography'];
        return mediums[Math.floor(Math.random() * mediums.length)];
    }
    
    setupEventListeners() {
        // Infinite scroll
        window.addEventListener('scroll', () => {
            if (this.isNearBottom() && !this.isLoading) {
                this.loadMoreArtworks();
            }
        });
        
        // Modal events
        this.modalClose.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
        
        // Prevent right-click context menu on images
        document.addEventListener('contextmenu', (e) => {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
            }
        });
        
        // Prevent drag and drop on images
        document.addEventListener('dragstart', (e) => {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
            }
        });
    }
    
    setupImageProtection() {
        this.implementAdvancedImageProtection();
        this.setupKeyboardProtection();
        this.setupDevToolsProtection();
        this.setupImageObfuscation();
        this.setupWatermarkOverlay();
    }
    
    implementAdvancedImageProtection() {
        // Enhanced keyboard shortcuts protection
        document.addEventListener('keydown', (e) => {
            const isOnImage = e.target.tagName === 'IMG' || 
                            e.target.closest('.art-item') || 
                            e.target.closest('.art-image-container') ||
                            e.target.closest('.modal');
            
            if (isOnImage) {
                // Disable common save/copy shortcuts
                if (e.ctrlKey && ['s', 'a', 'c', 'v', 'x', 'z', 'y'].includes(e.key.toLowerCase())) {
                    e.preventDefault();
                    this.showProtectionWarning('Image copying is not allowed');
                    return false;
                }
                
                // Disable print screen
                if (e.key === 'PrintScreen') {
                    e.preventDefault();
                    this.showProtectionWarning('Screenshots are not allowed');
                    return false;
                }
            }
            
            // Global dev tools protection
            if (e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key)) ||
                (e.ctrlKey && e.key.toLowerCase() === 'u')) {
                e.preventDefault();
                this.showProtectionWarning('Developer tools access is restricted');
                return false;
            }
        });
        
        // Enhanced right-click protection
        document.addEventListener('contextmenu', (e) => {
            if (e.target.tagName === 'IMG' || 
                e.target.closest('.art-image-container') ||
                e.target.classList.contains('art-image') ||
                e.target.classList.contains('modal-image')) {
                e.preventDefault();
                this.showProtectionWarning('Right-click is disabled on artwork images');
                return false;
            }
        });
        
        // Prevent drag and drop of images
        document.addEventListener('dragstart', (e) => {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
                this.showProtectionWarning('Image dragging is not allowed');
                return false;
            }
        });
        
        // Disable text selection on images
        document.addEventListener('selectstart', (e) => {
            if (e.target.tagName === 'IMG' || 
                e.target.closest('.art-image-container')) {
                e.preventDefault();
                return false;
            }
        });
    }
    
    setupKeyboardProtection() {
        // Additional keyboard protection
        document.addEventListener('keyup', (e) => {
            // Disable print screen key
            if (e.keyCode === 44) {
                e.preventDefault();
                this.showProtectionWarning('Print screen is disabled');
            }
        });
        
        // Disable specific key combinations
        let ctrlPressed = false;
        let shiftPressed = false;
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Control') ctrlPressed = true;
            if (e.key === 'Shift') shiftPressed = true;
            
            // Disable inspect element combinations
            if (ctrlPressed && shiftPressed && e.key === 'C') {
                e.preventDefault();
                this.showProtectionWarning('Developer tools access is restricted');
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (e.key === 'Control') ctrlPressed = false;
            if (e.key === 'Shift') shiftPressed = false;
        });
    }
    
    setupDevToolsProtection() {
        // Enhanced developer tools detection
        let devtools = {
            open: false,
            orientation: null
        };
        
        // Monitor window size changes
        setInterval(() => {
            const widthThreshold = window.outerWidth - window.innerWidth > 160;
            const heightThreshold = window.outerHeight - window.innerHeight > 160;
            
            if (widthThreshold || heightThreshold) {
                if (!devtools.open) {
                    devtools.open = true;
                    this.handleDevToolsOpen();
                }
            } else {
                devtools.open = false;
            }
        }, 1000);
        
        // Console detection
        let element = new Image();
        Object.defineProperty(element, 'id', {
            get: function() {
                devtools.open = true;
                this.handleDevToolsOpen();
            }
        });
        
        setInterval(() => {
            console.log('%c', element);
        }, 1000);
        
        // Disable common console methods
        if (typeof console !== 'undefined') {
            console.log = () => {};
            console.warn = () => {};
            console.error = () => {};
            console.info = () => {};
            console.debug = () => {};
        }
    }
    
    setupImageObfuscation() {
        // Add invisible overlay to all artwork images
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                const artImages = document.querySelectorAll('.art-image, .modal-image');
                artImages.forEach(img => {
                    this.addImageProtectionOverlay(img);
                });
            }, 100);
        });
        
        // Monitor for new images added dynamically
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        const images = node.querySelectorAll('.art-image, .modal-image');
                        images.forEach(img => {
                            this.addImageProtectionOverlay(img);
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    addImageProtectionOverlay(img) {
        if (img.dataset.protected) return; // Already protected
        
        const container = img.parentElement;
        if (!container.classList.contains('art-image-container')) return;
        
        // Create invisible protection overlay
        const overlay = document.createElement('div');
        overlay.className = 'image-protection-overlay';
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10;
            pointer-events: none;
            background: transparent;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        `;
        
        container.appendChild(overlay);
        img.dataset.protected = 'true';
        
        // Add additional image protection attributes
        img.style.userSelect = 'none';
        img.style.webkitUserSelect = 'none';
        img.style.mozUserSelect = 'none';
        img.style.msUserSelect = 'none';
        img.style.webkitUserDrag = 'none';
        img.style.webkitTouchCallout = 'none';
        img.draggable = false;
        
        // Disable right-click specifically on this image
        img.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showProtectionWarning('Image downloading is not allowed');
            return false;
        });
    }
    
    setupWatermarkOverlay() {
        // Add watermark to images
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                this.addWatermarks();
            }, 500);
        });
    }
    
    addWatermarks() {
        const artImages = document.querySelectorAll('.art-image');
        artImages.forEach(img => {
            if (img.dataset.watermarked) return;
            
            const container = img.parentElement;
            const watermark = document.createElement('div');
            watermark.className = 'watermark-overlay';
            watermark.innerHTML = 'ArtGallery©';
            watermark.style.cssText = `
                position: absolute;
                bottom: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 2px 6px;
                font-size: 10px;
                font-family: Arial, sans-serif;
                border-radius: 3px;
                z-index: 5;
                pointer-events: none;
                user-select: none;
                opacity: 0.8;
            `;
            
            container.appendChild(watermark);
            img.dataset.watermarked = 'true';
        });
    }
    
    handleDevToolsOpen() {
        // Blur images when dev tools are detected
        const artImages = document.querySelectorAll('.art-image, .modal-image');
        artImages.forEach(img => {
            img.style.filter = 'blur(10px)';
        });
        
        this.showProtectionWarning('Developer tools detected. Content protection active.');
        
        // Clear sensitive content
        setTimeout(() => {
            console.clear();
        }, 100);
    }
    
    showProtectionWarning(message) {
        // Create and show protection warning
        const warning = document.createElement('div');
        warning.className = 'protection-warning';
        warning.innerHTML = `
            <div class="warning-content">
                <span class="warning-icon">🛡️</span>
                <span class="warning-text">${message}</span>
            </div>
        `;
        warning.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4757;
            color: white;
            padding: 12px 16px;
            border-radius: 6px;
            font-weight: 500;
            z-index: 100000;
            box-shadow: 0 4px 12px rgba(255, 71, 87, 0.3);
            animation: slideInWarning 0.3s ease;
        `;
        
        document.body.appendChild(warning);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            warning.remove();
        }, 3000);
    }
    
    isNearBottom() {
        return window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000;
    }
    
    loadInitialArtworks() {
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
            
            // Update results count after first load to replace "Loading artworks..."
            if (this.currentPage === 1) {
                this.updateResultsCount();
            }
            
            // Stop loading if we've reached the end
            if (endIndex >= this.filteredArtworks.length) {
                this.loading.style.display = 'none';
            }
        }, 1000);
    }
    
    createArtworkElement(artwork) {
        const artItem = document.createElement('div');
        artItem.className = 'art-item';
        artItem.dataset.artId = artwork.id;
        
        const likeCount = this.likes[artwork.id] || 0;
        const isLiked = likeCount > 0;
        const interestCount = this.interests[artwork.id] || 0;
        const isInterested = interestCount > 0;
        
        // Create tags HTML
        const tagsHTML = artwork.tags.map(tag => {
            let tagClass = 'tag';
            if (tag === 'new arrival' || artwork.isNew) tagClass += ' new';
            if (tag === 'featured') tagClass += ' featured';
            if (tag === 'trending') tagClass += ' trending';
            return `<span class="${tagClass}">${tag}</span>`;
        }).join('');
        
        artItem.innerHTML = `
            <div class="art-image-container">
                <img src="${artwork.imageUrl}" alt="${artwork.title}" class="art-image" loading="lazy">
                ${artwork.isNew ? '<div class="new-badge">NEW</div>' : ''}
            </div>
            <div class="art-info">
                <h3 class="art-title">${artwork.title}</h3>
                <p class="art-artist">by ${artwork.artist}</p>
                <p class="art-price">$${artwork.price.toLocaleString()}</p>
                <div class="art-tags">${tagsHTML}</div>
                <p class="art-description">${artwork.description}</p>
                <div class="art-actions">
                    <button class="like-btn ${isLiked ? 'liked' : ''}" data-art-id="${artwork.id}">
                        <span class="heart">${isLiked ? '♥' : '♡'}</span>
                        <span class="like-count">${likeCount}</span>
                    </button>
                    <button class="interest-btn ${isInterested ? 'interested' : ''}" data-art-id="${artwork.id}">
                        <span class="interest-icon">💌</span>
                        <span class="interest-count">${interestCount}</span>
                    </button>
                </div>
            </div>
        `;
        
        // Add click event for modal
        artItem.addEventListener('click', (e) => {
            if (!e.target.closest('.like-btn') && !e.target.closest('.interest-btn')) {
                this.openModal(artwork);
            }
        });
        
        // Enhanced like button events for better reliability
        const likeBtn = artItem.querySelector('.like-btn');
        if (likeBtn) {
            // Mouse click
            likeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleLike(artwork.id);
            });
            
            // Touch events for mobile
            likeBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleLike(artwork.id);
            });
            
            // Ensure it's focusable and clickable
            likeBtn.style.pointerEvents = 'auto';
            likeBtn.style.cursor = 'pointer';
        }
        
        // Enhanced interest button events for better reliability
        const interestBtn = artItem.querySelector('.interest-btn');
        if (interestBtn) {
            // Mouse click
            interestBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleInterest(artwork.id);
            });
            
            // Touch events for mobile
            interestBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleInterest(artwork.id);
            });
            
            // Ensure it's focusable and clickable
            interestBtn.style.pointerEvents = 'auto';
            interestBtn.style.cursor = 'pointer';
        }
        
        this.galleryGrid.appendChild(artItem);
    }
    
    openModal(artwork) {
        const modal = document.getElementById('artModal');
        const modalImage = document.getElementById('modalImage');
        const modalTitle = document.getElementById('modalTitle');
        const modalArtist = document.getElementById('modalArtist');
        const modalPrice = document.getElementById('modalPrice');
        const modalDimensions = document.getElementById('modalDimensions');
        const modalMedium = document.getElementById('modalMedium');
        const modalDescription = document.getElementById('modalDescription');
        const modalTags = document.getElementById('modalTags');
        const modalLikeBtn = document.getElementById('modalLikeBtn');
        const modalLikeCount = document.getElementById('modalLikeCount');
        const modalInterestBtn = document.getElementById('modalInterestBtn');
        const modalInterestCount = document.getElementById('modalInterestCount');
        
        modalImage.src = artwork.imageUrl;
        modalImage.alt = artwork.title;
        modalTitle.textContent = artwork.title;
        modalArtist.textContent = `by ${artwork.artist}`;
        modalPrice.textContent = `$${artwork.price.toLocaleString()}`;
        modalDimensions.textContent = `Dimensions: ${artwork.dimensions}`;
        modalMedium.textContent = `Medium: ${artwork.medium}`;
        modalDescription.textContent = artwork.description;
        
        // Create tags HTML
        const tagsHTML = artwork.tags.map(tag => {
            let tagClass = 'tag';
            if (tag === 'new arrival' || artwork.isNew) tagClass += ' new';
            if (tag === 'featured') tagClass += ' featured';
            if (tag === 'trending') tagClass += ' trending';
            return `<span class="${tagClass}">${tag}</span>`;
        }).join('');
        modalTags.innerHTML = tagsHTML;
        
        const likeCount = this.likes[artwork.id] || 0;
        const isLiked = likeCount > 0;
        const interestCount = this.interests[artwork.id] || 0;
        const isInterested = interestCount > 0;
        
        modalLikeBtn.className = `like-btn modal-like-btn ${isLiked ? 'liked' : ''}`;
        modalLikeBtn.querySelector('.heart').textContent = isLiked ? '♥' : '♡';
        modalLikeCount.textContent = likeCount;
        
        modalInterestBtn.className = `interest-btn modal-interest-btn ${isInterested ? 'interested' : ''}`;
        modalInterestCount.textContent = interestCount;
        
        // Set up modal like button
        modalLikeBtn.onclick = (e) => {
            e.stopPropagation();
            this.toggleLike(artwork.id);
            // Update modal like button
            const newLikeCount = this.likes[artwork.id] || 0;
            const newIsLiked = newLikeCount > 0;
            modalLikeBtn.className = `like-btn modal-like-btn ${newIsLiked ? 'liked' : ''}`;
            modalLikeBtn.querySelector('.heart').textContent = newIsLiked ? '♥' : '♡';
            modalLikeCount.textContent = newLikeCount;
        };
        
        // Set up modal interest button
        modalInterestBtn.onclick = (e) => {
            e.stopPropagation();
            this.toggleInterest(artwork.id);
            // Update modal interest button
            const newInterestCount = this.interests[artwork.id] || 0;
            const newIsInterested = newInterestCount > 0;
            modalInterestBtn.className = `interest-btn modal-interest-btn ${newIsInterested ? 'interested' : ''}`;
            modalInterestCount.textContent = newInterestCount;
        };
        
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        this.modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    
    toggleLike(artworkId) {
        const currentLikes = this.likes[artworkId] || 0;
        
        if (currentLikes > 0) {
            // Unlike
            this.likes[artworkId] = 0;
        } else {
            // Like
            this.likes[artworkId] = 1;
        }
        
        this.saveLikes();
        this.updateLikeDisplay(artworkId);
    }
    
    updateLikeDisplay(artworkId) {
        const artItem = document.querySelector(`[data-art-id="${artworkId}"]`);
        if (artItem) {
            const likeBtn = artItem.querySelector('.like-btn');
            const heart = likeBtn.querySelector('.heart');
            const likeCount = likeBtn.querySelector('.like-count');
            
            const likes = this.likes[artworkId] || 0;
            const isLiked = likes > 0;
            
            likeBtn.className = `like-btn ${isLiked ? 'liked' : ''}`;
            heart.textContent = isLiked ? '♥' : '♡';
            likeCount.textContent = likes;
        }
    }
    
    loadLikes() {
        const savedLikes = localStorage.getItem('artGalleryLikes');
        return savedLikes ? JSON.parse(savedLikes) : {};
    }
    
    saveLikes() {
        localStorage.setItem('artGalleryLikes', JSON.stringify(this.likes));
    }
    
    loadInterests() {
        const savedInterests = localStorage.getItem('artGalleryInterests');
        return savedInterests ? JSON.parse(savedInterests) : {};
    }
    
    saveInterests() {
        localStorage.setItem('artGalleryInterests', JSON.stringify(this.interests));
    }
    
    loadCurrentUser() {
        const savedUser = localStorage.getItem('artGalleryCurrentUser');
        return savedUser ? JSON.parse(savedUser) : null;
    }
    
    saveCurrentUser(user) {
        localStorage.setItem('artGalleryCurrentUser', JSON.stringify(user));
    }
    
    // Authentication System
    setupAuthentication() {
        // Login modal events
        document.getElementById('loginBtn').addEventListener('click', () => {
            this.showModal('loginModal');
        });
        
        document.getElementById('registerBtn').addEventListener('click', () => {
            this.showModal('registerModal');
        });
        
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });
        
        document.getElementById('adminDashboardBtn').addEventListener('click', () => {
            this.showModal('adminModal');
        });
        
        // Modal close events
        document.getElementById('loginModalClose').addEventListener('click', () => {
            this.hideModal('loginModal');
        });
        
        document.getElementById('registerModalClose').addEventListener('click', () => {
            this.hideModal('registerModal');
        });
        
        document.getElementById('adminModalClose').addEventListener('click', () => {
            this.hideModal('adminModal');
        });
        
        // Switch between login and register
        document.getElementById('switchToRegister').addEventListener('click', () => {
            this.hideModal('loginModal');
            this.showModal('registerModal');
        });
        
        document.getElementById('switchToLogin').addEventListener('click', () => {
            this.hideModal('registerModal');
            this.showModal('loginModal');
        });
        
        // Form submissions
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });
        
        // Create demo accounts if they don't exist
        this.createDemoAccounts();
    }
    
    createDemoAccounts() {
        const existingUsers = JSON.parse(localStorage.getItem('artGalleryUsers') || '[]');
        
        const demoUsers = [
            {
                id: 1,
                name: 'Admin User',
                email: 'admin@gallery.com',
                password: 'demo123',
                type: 'admin'
            },
            {
                id: 2,
                name: 'Visitor User',
                email: 'visitor@gallery.com',
                password: 'demo123',
                type: 'visitor'
            }
        ];
        
        if (existingUsers.length === 0) {
            localStorage.setItem('artGalleryUsers', JSON.stringify(demoUsers));
        }
    }
    
    handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        const users = JSON.parse(localStorage.getItem('artGalleryUsers') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            this.saveCurrentUser(user);
            this.updateUIForUser();
            this.hideModal('loginModal');
            this.showNotification(`Welcome back, ${user.name}!`, 'success');
        } else {
            this.showNotification('Invalid email or password', 'error');
        }
    }
    
    handleRegister() {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const type = document.getElementById('userType').value;
        
        const users = JSON.parse(localStorage.getItem('artGalleryUsers') || '[]');
        
        if (users.find(u => u.email === email)) {
            this.showNotification('Email already exists', 'error');
            return;
        }
        
        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            type
        };
        
        users.push(newUser);
        localStorage.setItem('artGalleryUsers', JSON.stringify(users));
        
        this.currentUser = newUser;
        this.saveCurrentUser(newUser);
        this.updateUIForUser();
        this.hideModal('registerModal');
        this.showNotification(`Welcome to ArtGallery, ${name}!`, 'success');
    }
    
    logout() {
        this.currentUser = null;
        localStorage.removeItem('artGalleryCurrentUser');
        this.updateUIForUser();
        this.hideModal('adminModal');
        this.showNotification('Logged out successfully', 'success');
    }
    
    updateUIForUser() {
        const guestActions = document.getElementById('guestActions');
        const userProfile = document.getElementById('userProfile');
        const userWelcome = document.getElementById('userWelcome');
        const adminDashboardBtn = document.getElementById('adminDashboardBtn');
        
        if (this.currentUser) {
            guestActions.style.display = 'none';
            userProfile.style.display = 'flex';
            userWelcome.textContent = `Hello, ${this.currentUser.name}`;
            
            if (this.currentUser.type === 'admin') {
                adminDashboardBtn.style.display = 'block';
            } else {
                adminDashboardBtn.style.display = 'none';
            }
        } else {
            guestActions.style.display = 'flex';
            userProfile.style.display = 'none';
        }
    }
    
    // Filtering and Sorting System
    setupFilters() {
        const categoryFilter = document.getElementById('categoryFilter');
        const themeFilter = document.getElementById('themeFilter');
        const priceFilter = document.getElementById('priceFilter');
        const sortFilter = document.getElementById('sortFilter');
        const newOnlyFilter = document.getElementById('newOnlyFilter');
        const clearFiltersBtn = document.getElementById('clearFilters');
        
        // Enhanced filter events for better reliability
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentFilters.category = e.target.value;
                this.applyFilters();
            });
            categoryFilter.style.pointerEvents = 'auto';
        }
        
        if (themeFilter) {
            themeFilter.addEventListener('change', (e) => {
                this.currentFilters.theme = e.target.value;
                this.applyFilters();
            });
            themeFilter.style.pointerEvents = 'auto';
        }
        
        if (priceFilter) {
            priceFilter.addEventListener('change', (e) => {
                this.currentFilters.priceRange = e.target.value;
                this.applyFilters();
            });
            priceFilter.style.pointerEvents = 'auto';
        }
        
        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.currentFilters.sortBy = e.target.value;
                this.applyFilters();
            });
            sortFilter.style.pointerEvents = 'auto';
        }
        
        if (newOnlyFilter) {
            newOnlyFilter.addEventListener('change', (e) => {
                this.currentFilters.newOnly = e.target.checked;
                this.applyFilters();
            });
            newOnlyFilter.style.pointerEvents = 'auto';
        }
        
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.clearFilters();
            });
            clearFiltersBtn.style.pointerEvents = 'auto';
            clearFiltersBtn.style.cursor = 'pointer';
        }
    }
    
    applyFilters() {
        this.filteredArtworks = this.artworks.filter(artwork => {
            // Category filter
            if (this.currentFilters.category !== 'all' && artwork.category !== this.currentFilters.category) {
                return false;
            }
            
            // Theme filter
            if (this.currentFilters.theme !== 'all' && artwork.theme !== this.currentFilters.theme) {
                return false;
            }
            
            // Price range filter
            if (this.currentFilters.priceRange !== 'all') {
                const [min, max] = this.currentFilters.priceRange.includes('+') 
                    ? [parseInt(this.currentFilters.priceRange.replace('+', '')), Infinity]
                    : this.currentFilters.priceRange.split('-').map(Number);
                
                if (artwork.price < min || artwork.price > max) {
                    return false;
                }
            }
            
            // New only filter
            if (this.currentFilters.newOnly && !artwork.isNew) {
                return false;
            }
            
            return true;
        });
        
        // Apply sorting
        this.sortArtworks();
        
        // Reset pagination and reload
        this.currentPage = 0;
        this.galleryGrid.innerHTML = '';
        this.loadMoreArtworks();
        this.updateResultsCount();
    }
    
    sortArtworks() {
        this.filteredArtworks.sort((a, b) => {
            switch (this.currentFilters.sortBy) {
                case 'newest':
                    return new Date(b.dateAdded) - new Date(a.dateAdded);
                case 'oldest':
                    return new Date(a.dateAdded) - new Date(b.dateAdded);
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'popular':
                    return (b.likes + b.interests) - (a.likes + a.interests);
                case 'name':
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });
    }
    
    clearFilters() {
        this.currentFilters = {
            category: 'all',
            theme: 'all',
            priceRange: 'all',
            newOnly: false,
            sortBy: 'newest'
        };
        
        document.getElementById('categoryFilter').value = 'all';
        document.getElementById('themeFilter').value = 'all';
        document.getElementById('priceFilter').value = 'all';
        document.getElementById('sortFilter').value = 'newest';
        document.getElementById('newOnlyFilter').checked = false;
        
        this.applyFilters();
    }
    
    updateResultsCount() {
        const resultsCount = document.getElementById('resultsCount');
        const count = this.filteredArtworks.length;
        resultsCount.textContent = count === this.artworks.length 
            ? 'Showing all artworks'
            : `Showing ${count} of ${this.artworks.length} artworks`;
    }
    
    // Admin Dashboard System
    setupAdminDashboard() {
        this.selectedTags = [];
        this.selectedArtworks = [];
        this.currentManagePage = 1;
        this.manageItemsPerPage = 10;
        
        // Tab switching
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                this.switchAdminTab(targetTab);
            });
        });
        
        // Upload artwork form and features
        this.setupUploadFeatures();
        
        // Manage artworks features
        this.setupManageFeatures();
        
        // Analytics features
        this.setupAnalyticsFeatures();
    }
    
    setupUploadFeatures() {
        const form = document.getElementById('uploadArtworkForm');
        const imageInput = document.getElementById('artworkImage');
        const tagsInput = document.getElementById('artworkTags');
        const widthInput = document.getElementById('artworkWidth');
        const heightInput = document.getElementById('artworkHeight');
        
        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleArtworkUpload();
        });
        
        // Image preview
        imageInput.addEventListener('input', (e) => {
            this.updateImagePreview(e.target.value);
        });
        
        // Auto-generate dimensions from width/height
        widthInput.addEventListener('input', () => this.updateDimensions());
        heightInput.addEventListener('input', () => this.updateDimensions());
        
        // Tags system
        tagsInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.addTag(e.target.value.trim());
                e.target.value = '';
            }
        });
        
        // Tag suggestions - multiple event handlers for reliability
        document.querySelectorAll('.tag-suggestion').forEach(suggestion => {
            // Mouse click
            suggestion.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.addTag(suggestion.dataset.tag);
            });
            
            // Touch events for mobile
            suggestion.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.addTag(suggestion.dataset.tag);
            });
            
            // Keyboard accessibility
            suggestion.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.addTag(suggestion.dataset.tag);
                }
            });
            
            // Make focusable
            suggestion.setAttribute('tabindex', '0');
        });
        
        // Preview and draft buttons with enhanced event handling
        const previewBtn = document.getElementById('previewArtwork');
        const draftBtn = document.getElementById('saveAsDraft');
        
        if (previewBtn) {
            previewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.previewArtwork();
            });
            
            previewBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.previewArtwork();
            });
        }
        
        if (draftBtn) {
            draftBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.saveAsDraft();
            });
            
            draftBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.saveAsDraft();
            });
        }
        
        // Populate artist suggestions
        this.populateArtistSuggestions();
    }
    
    setupManageFeatures() {
        // Search and filters
        document.getElementById('searchArtworks').addEventListener('input', (e) => {
            this.filterArtworksList();
        });
        
        document.getElementById('statusFilter').addEventListener('change', () => {
            this.filterArtworksList();
        });
        
        document.getElementById('categoryManageFilter').addEventListener('change', () => {
            this.filterArtworksList();
        });
        
        document.getElementById('sortManageBy').addEventListener('change', () => {
            this.filterArtworksList();
        });
        
        document.getElementById('clearSearch').addEventListener('click', () => {
            document.getElementById('searchArtworks').value = '';
            this.filterArtworksList();
        });
        
        // Bulk operations
        document.getElementById('selectAllArtworks').addEventListener('change', (e) => {
            this.toggleSelectAll(e.target.checked);
        });
        
        document.getElementById('bulkDelete').addEventListener('click', () => {
            this.bulkDeleteArtworks();
        });
        
        document.getElementById('bulkStatusChange').addEventListener('click', () => {
            this.bulkChangeStatus();
        });
        
        document.getElementById('bulkExport').addEventListener('click', () => {
            this.bulkExportArtworks();
        });
        
        // Pagination
        document.getElementById('prevPage').addEventListener('click', () => {
            this.changePage(-1);
        });
        
        document.getElementById('nextPage').addEventListener('click', () => {
            this.changePage(1);
        });
    }
    
    setupAnalyticsFeatures() {
        document.getElementById('refreshAnalytics').addEventListener('click', () => {
            this.loadAnalytics();
        });
        
        document.getElementById('exportReport').addEventListener('click', () => {
            this.exportAnalyticsReport();
        });
        
        document.getElementById('analyticsRange').addEventListener('change', () => {
            this.loadAnalytics();
        });
    }
    
    switchAdminTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}Tab`).classList.add('active');
        
        // Load specific tab content
        if (tabName === 'manage') {
            this.loadArtworksList();
        } else if (tabName === 'analytics') {
            this.loadAnalytics();
        }
    }
    
    // Enhanced Upload Features
    updateImagePreview(imageUrl) {
        const preview = document.getElementById('imagePreview');
        const status = document.getElementById('imageStatus');
        const dimensions = document.getElementById('imageDimensions');
        
        if (!imageUrl) {
            preview.innerHTML = `
                <div class="preview-placeholder">
                    <span>📷</span>
                    <p>Enter image URL to see preview</p>
                </div>
            `;
            status.textContent = 'No image loaded';
            dimensions.textContent = '-';
            return;
        }
        
        status.textContent = 'Loading...';
        
        const img = new Image();
        img.onload = () => {
            preview.innerHTML = `<img src="${imageUrl}" alt="Preview">`;
            status.textContent = 'Image loaded successfully';
            dimensions.textContent = `${img.naturalWidth} x ${img.naturalHeight}px`;
        };
        
        img.onerror = () => {
            preview.innerHTML = `
                <div class="preview-placeholder">
                    <span>❌</span>
                    <p>Failed to load image</p>
                </div>
            `;
            status.textContent = 'Failed to load image';
            dimensions.textContent = '-';
        };
        
        img.src = imageUrl;
    }
    
    updateDimensions() {
        const width = document.getElementById('artworkWidth').value;
        const height = document.getElementById('artworkHeight').value;
        
        if (width && height) {
            // Auto-update the old dimensions field for backward compatibility
            const dimensionsField = document.getElementById('artworkDimensions');
            if (dimensionsField) {
                dimensionsField.value = `${width}x${height} inches`;
            }
        }
    }
    
    addTag(tagText) {
        if (!tagText || this.selectedTags.includes(tagText)) return;
        
        this.selectedTags.push(tagText);
        this.updateTagsDisplay();
    }
    
    removeTag(tagText) {
        this.selectedTags = this.selectedTags.filter(tag => tag !== tagText);
        this.updateTagsDisplay();
    }
    
    updateTagsDisplay() {
        const container = document.getElementById('selectedTags');
        container.innerHTML = this.selectedTags.map(tag => `
            <div class="selected-tag">
                ${tag}
                <span class="remove-tag" onclick="gallery.removeTag('${tag}')">&times;</span>
            </div>
        `).join('');
    }
    
    populateArtistSuggestions() {
        const uniqueArtists = [...new Set(this.artworks.map(artwork => artwork.artist))];
        const datalist = document.getElementById('artistSuggestions');
        if (datalist) {
            datalist.innerHTML = uniqueArtists.map(artist => `<option value="${artist}">`).join('');
        }
    }
    
    previewArtwork() {
        const formData = this.getFormData();
        if (!this.validateForm(formData)) return;
        
        // Create a temporary artwork object for preview
        const previewArtwork = {
            ...formData,
            id: 'preview',
            dateAdded: new Date(),
            likes: 0,
            interests: 0,
            status: 'preview'
        };
        
        this.openModal(previewArtwork);
    }
    
    saveAsDraft() {
        const formData = this.getFormData();
        
        const draftArtwork = {
            id: Date.now(),
            ...formData,
            currency: 'USD',
            dateAdded: new Date(),
            likes: 0,
            interests: 0,
            status: 'draft'
        };
        
        this.artworks.unshift(draftArtwork);
        this.saveArtworks();
        
        document.getElementById('uploadArtworkForm').reset();
        this.selectedTags = [];
        this.updateTagsDisplay();
        
        this.showNotification('Artwork saved as draft!', 'success');
    }
    
    getFormData() {
        const width = document.getElementById('artworkWidth').value;
        const height = document.getElementById('artworkHeight').value;
        const dimensions = width && height ? `${width}x${height} inches` : document.getElementById('artworkDimensions')?.value || '';
        
        return {
            title: document.getElementById('artworkTitle').value,
            artist: document.getElementById('artworkArtist').value,
            category: document.getElementById('artworkCategory').value,
            theme: document.getElementById('artworkTheme').value,
            price: parseFloat(document.getElementById('artworkPrice').value),
            medium: document.getElementById('artworkMedium').value,
            dimensions: dimensions,
            description: document.getElementById('artworkDescription').value,
            imageUrl: document.getElementById('artworkImage').value,
            isNew: document.getElementById('isNewArtwork').checked,
            isFeatured: document.getElementById('isFeatured')?.checked || false,
            isLimitedEdition: document.getElementById('isLimitedEdition')?.checked || false,
            tags: this.selectedTags
        };
    }
    
    validateForm(formData) {
        const errors = [];
        
        if (!formData.title) errors.push('Title is required');
        if (!formData.artist) errors.push('Artist is required');
        if (!formData.category) errors.push('Category is required');
        if (!formData.theme) errors.push('Theme is required');
        if (!formData.price || formData.price <= 0) errors.push('Valid price is required');
        if (!formData.medium) errors.push('Medium is required');
        if (!formData.description || formData.description.length < 50) errors.push('Description must be at least 50 characters');
        if (!formData.imageUrl) errors.push('Image URL is required');
        
        if (errors.length > 0) {
            this.showNotification(errors.join(', '), 'error');
            return false;
        }
        
        return true;
    }
    
    handleArtworkUpload() {
        if (!this.currentUser || this.currentUser.type !== 'admin') {
            this.showNotification('Only admins can upload artworks', 'error');
            return;
        }
        
        const formData = this.getFormData();
        if (!this.validateForm(formData)) return;
        
        const newArtwork = {
            id: Date.now(),
            ...formData,
            currency: 'USD',
            dateAdded: new Date(),
            likes: 0,
            interests: 0,
            status: 'available'
        };
        
        this.artworks.unshift(newArtwork);
        this.saveArtworks();
        this.applyFilters();
        
        // Clear form
        document.getElementById('uploadArtworkForm').reset();
        this.selectedTags = [];
        this.updateTagsDisplay();
        document.getElementById('imagePreview').innerHTML = `
            <div class="preview-placeholder">
                <span>📷</span>
                <p>Enter image URL to see preview</p>
            </div>
        `;
        
        this.showNotification('Artwork uploaded successfully!', 'success');
    }
    
    // Enhanced Manage Features
    filterArtworksList() {
        const searchTerm = document.getElementById('searchArtworks').value.toLowerCase();
        const statusFilter = document.getElementById('statusFilter').value;
        const categoryFilter = document.getElementById('categoryManageFilter').value;
        const sortBy = document.getElementById('sortManageBy').value;
        
        let filtered = this.artworks.filter(artwork => {
            const matchesSearch = !searchTerm || 
                artwork.title.toLowerCase().includes(searchTerm) ||
                artwork.artist.toLowerCase().includes(searchTerm) ||
                artwork.category.toLowerCase().includes(searchTerm);
            
            const matchesStatus = statusFilter === 'all' || artwork.status === statusFilter;
            const matchesCategory = categoryFilter === 'all' || artwork.category === categoryFilter;
            
            return matchesSearch && matchesStatus && matchesCategory;
        });
        
        // Sort results
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest': return new Date(b.dateAdded) - new Date(a.dateAdded);
                case 'oldest': return new Date(a.dateAdded) - new Date(b.dateAdded);
                case 'price-high': return b.price - a.price;
                case 'price-low': return a.price - b.price;
                case 'title': return a.title.localeCompare(b.title);
                case 'artist': return a.artist.localeCompare(b.artist);
                case 'popular': return (b.likes + b.interests) - (a.likes + a.interests);
                default: return 0;
            }
        });
        
        this.filteredManageArtworks = filtered;
        this.currentManagePage = 1;
        this.loadArtworksList();
        this.updatePagination();
    }
    
    loadArtworksList() {
        const tbody = document.getElementById('artworksTableBody');
        const startIndex = (this.currentManagePage - 1) * this.manageItemsPerPage;
        const endIndex = startIndex + this.manageItemsPerPage;
        const artworksToShow = (this.filteredManageArtworks || this.artworks).slice(startIndex, endIndex);
        
        tbody.innerHTML = '';
        
        artworksToShow.forEach(artwork => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <input type="checkbox" class="artwork-checkbox" value="${artwork.id}" 
                           onchange="gallery.toggleArtworkSelection(${artwork.id}, this.checked)">
                </td>
                <td>
                    <img src="${artwork.imageUrl}" alt="${artwork.title}" class="artwork-thumbnail-table">
                </td>
                <td>
                    <strong>${artwork.title}</strong>
                    ${artwork.isNew ? '<span class="new-badge">NEW</span>' : ''}
                </td>
                <td>${artwork.artist}</td>
                <td>${artwork.category}</td>
                <td>$${artwork.price.toLocaleString()}</td>
                <td>
                    <span class="status-badge status-${artwork.status}">${artwork.status}</span>
                </td>
                <td>${artwork.likes || 0}</td>
                <td>${artwork.interests || 0}</td>
                <td>${new Date(artwork.dateAdded).toLocaleDateString()}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-view" onclick="gallery.viewArtwork(${artwork.id})" title="View">👁️</button>
                        <button class="btn-icon btn-edit" onclick="gallery.editArtwork(${artwork.id})" title="Edit">✏️</button>
                        <button class="btn-icon btn-delete" onclick="gallery.deleteArtwork(${artwork.id})" title="Delete">🗑️</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        this.updatePaginationInfo();
    }
    
    toggleArtworkSelection(artworkId, selected) {
        if (selected) {
            this.selectedArtworks.push(artworkId);
        } else {
            this.selectedArtworks = this.selectedArtworks.filter(id => id !== artworkId);
        }
        
        this.updateBulkControls();
    }
    
    toggleSelectAll(selectAll) {
        const checkboxes = document.querySelectorAll('.artwork-checkbox');
        this.selectedArtworks = [];
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = selectAll;
            if (selectAll) {
                this.selectedArtworks.push(parseInt(checkbox.value));
            }
        });
        
        this.updateBulkControls();
    }
    
    updateBulkControls() {
        const count = this.selectedArtworks.length;
        const selectedCountEl = document.getElementById('selectedCount');
        const bulkButtons = document.querySelectorAll('#bulkDelete, #bulkStatusChange, #bulkExport, #bulkStatusSelect');
        
        selectedCountEl.textContent = `${count} selected`;
        
        bulkButtons.forEach(btn => {
            btn.disabled = count === 0;
        });
    }
    
    bulkDeleteArtworks() {
        if (this.selectedArtworks.length === 0) return;
        
        if (confirm(`Are you sure you want to delete ${this.selectedArtworks.length} artworks?`)) {
            this.artworks = this.artworks.filter(artwork => !this.selectedArtworks.includes(artwork.id));
            this.saveArtworks();
            this.selectedArtworks = [];
            this.filterArtworksList();
            this.applyFilters(); // Update main gallery
            this.showNotification(`${this.selectedArtworks.length} artworks deleted successfully`, 'success');
        }
    }
    
    bulkChangeStatus() {
        const newStatus = document.getElementById('bulkStatusSelect').value;
        if (!newStatus || this.selectedArtworks.length === 0) return;
        
        this.selectedArtworks.forEach(artworkId => {
            const artwork = this.artworks.find(a => a.id === artworkId);
            if (artwork) {
                artwork.status = newStatus;
            }
        });
        
        this.saveArtworks();
        this.selectedArtworks = [];
        this.filterArtworksList();
        this.showNotification(`Status updated for ${this.selectedArtworks.length} artworks`, 'success');
    }
    
    bulkExportArtworks() {
        const selectedArtworks = this.artworks.filter(artwork => this.selectedArtworks.includes(artwork.id));
        const exportData = {
            exportDate: new Date().toISOString(),
            artworks: selectedArtworks
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `artworks-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification(`${selectedArtworks.length} artworks exported successfully`, 'success');
    }
    
    changePage(direction) {
        const totalPages = Math.ceil((this.filteredManageArtworks || this.artworks).length / this.manageItemsPerPage);
        
        this.currentManagePage += direction;
        
        if (this.currentManagePage < 1) this.currentManagePage = 1;
        if (this.currentManagePage > totalPages) this.currentManagePage = totalPages;
        
        this.loadArtworksList();
        this.updatePagination();
    }
    
    updatePagination() {
        const totalItems = (this.filteredManageArtworks || this.artworks).length;
        const totalPages = Math.ceil(totalItems / this.manageItemsPerPage);
        
        document.getElementById('prevPage').disabled = this.currentManagePage <= 1;
        document.getElementById('nextPage').disabled = this.currentManagePage >= totalPages;
        
        // Generate page numbers
        const pageNumbers = document.getElementById('pageNumbers');
        let pagesHTML = '';
        
        for (let i = 1; i <= Math.min(totalPages, 5); i++) {
            const pageNum = this.currentManagePage <= 3 ? i : 
                           this.currentManagePage >= totalPages - 2 ? totalPages - 5 + i :
                           this.currentManagePage - 3 + i;
                           
            if (pageNum > 0 && pageNum <= totalPages) {
                pagesHTML += `<button class="page-number ${pageNum === this.currentManagePage ? 'active' : ''}" 
                                     onclick="gallery.goToPage(${pageNum})">${pageNum}</button>`;
            }
        }
        
        pageNumbers.innerHTML = pagesHTML;
    }
    
    updatePaginationInfo() {
        const totalItems = (this.filteredManageArtworks || this.artworks).length;
        const startIndex = (this.currentManagePage - 1) * this.manageItemsPerPage + 1;
        const endIndex = Math.min(this.currentManagePage * this.manageItemsPerPage, totalItems);
        
        document.getElementById('paginationInfo').textContent = 
            `Showing ${startIndex}-${endIndex} of ${totalItems} artworks`;
    }
    
    goToPage(pageNum) {
        this.currentManagePage = pageNum;
        this.loadArtworksList();
        this.updatePagination();
    }
    
    viewArtwork(artworkId) {
        const artwork = this.artworks.find(a => a.id === artworkId);
        if (artwork) {
            this.openModal(artwork);
        }
    }
    
    editArtwork(artworkId) {
        const artwork = this.artworks.find(a => a.id === artworkId);
        if (artwork) {
            // Switch to upload tab and populate form with artwork data
            this.switchAdminTab('upload');
            this.populateFormWithArtwork(artwork);
        }
    }
    
    populateFormWithArtwork(artwork) {
        document.getElementById('artworkTitle').value = artwork.title;
        document.getElementById('artworkArtist').value = artwork.artist;
        document.getElementById('artworkCategory').value = artwork.category;
        document.getElementById('artworkTheme').value = artwork.theme;
        document.getElementById('artworkPrice').value = artwork.price;
        document.getElementById('artworkMedium').value = artwork.medium;
        document.getElementById('artworkDescription').value = artwork.description;
        document.getElementById('artworkImage').value = artwork.imageUrl;
        document.getElementById('isNewArtwork').checked = artwork.isNew;
        
        // Parse dimensions
        const dimensionMatch = artwork.dimensions.match(/(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)/);
        if (dimensionMatch) {
            document.getElementById('artworkWidth').value = dimensionMatch[1];
            document.getElementById('artworkHeight').value = dimensionMatch[2];
        }
        
        // Set tags
        this.selectedTags = artwork.tags || [];
        this.updateTagsDisplay();
        
        // Update image preview
        this.updateImagePreview(artwork.imageUrl);
        
        // Store editing artwork ID for update instead of create
        this.editingArtworkId = artwork.id;
        
        this.showNotification(`Editing: ${artwork.title}`, 'info');
    }
    
    updateArtworkStatus(artworkId, newStatus) {
        const artwork = this.artworks.find(a => a.id === artworkId);
        if (artwork) {
            artwork.status = newStatus;
            this.saveArtworks();
            this.showNotification(`Artwork status updated to ${newStatus}`, 'success');
        }
    }
    
    deleteArtwork(artworkId) {
        if (confirm('Are you sure you want to delete this artwork?')) {
            this.artworks = this.artworks.filter(a => a.id !== artworkId);
            this.saveArtworks();
            this.applyFilters();
            this.loadArtworksList();
            this.showNotification('Artwork deleted successfully', 'success');
        }
    }
    
    // Enhanced Analytics Features
    loadAnalytics() {
        const range = document.getElementById('analyticsRange').value;
        const filteredArtworks = this.filterArtworksByDateRange(range);
        
        this.updateStatCards(filteredArtworks);
        this.updateCharts(filteredArtworks);
        this.updateAnalyticsDetails(filteredArtworks);
        this.generateBusinessInsights(filteredArtworks);
    }
    
    filterArtworksByDateRange(range) {
        if (range === 'all') return this.artworks;
        
        const now = new Date();
        const daysAgo = parseInt(range);
        const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
        
        return this.artworks.filter(artwork => new Date(artwork.dateAdded) >= cutoffDate);
    }
    
    updateStatCards(artworks) {
        const totalArtworks = artworks.length;
        const totalLikes = Object.values(this.likes).reduce((sum, likes) => sum + likes, 0);
        const totalInterests = Object.values(this.interests).reduce((sum, interests) => sum + interests, 0);
        const totalValue = artworks.reduce((sum, artwork) => sum + artwork.price, 0);
        const averagePrice = totalValue / totalArtworks || 0;
        const soldArtworks = artworks.filter(a => a.status === 'sold').length;
        const availableArtworks = artworks.filter(a => a.status === 'available').length;
        const revenue = artworks.filter(a => a.status === 'sold').reduce((sum, a) => sum + a.price, 0);
        
        document.getElementById('totalArtworks').textContent = totalArtworks;
        document.getElementById('totalValue').textContent = `$${totalValue.toLocaleString()}`;
        document.getElementById('totalLikes').textContent = totalLikes;
        document.getElementById('totalInterests').textContent = totalInterests;
        document.getElementById('soldArtworks').textContent = soldArtworks;
        document.getElementById('availableArtworks').textContent = availableArtworks;
        
        // Update change indicators
        document.getElementById('artworksChange').textContent = `+${Math.floor(Math.random() * 5) + 1} this month`;
        document.getElementById('valueChange').textContent = `Average: $${averagePrice.toLocaleString()}`;
        document.getElementById('likesChange').textContent = `Avg: ${(totalLikes / totalArtworks || 0).toFixed(1)} per artwork`;
        document.getElementById('interestsChange').textContent = `Conversion: ${((totalInterests / totalLikes) * 100 || 0).toFixed(1)}%`;
        document.getElementById('soldChange').textContent = `Revenue: $${revenue.toLocaleString()}`;
        document.getElementById('availableChange').textContent = 'Ready for sale';
    }
    
    updateCharts(artworks) {
        this.updateCategoryChart(artworks);
        this.updatePriceChart(artworks);
    }
    
    updateCategoryChart(artworks) {
        const categoryData = {};
        artworks.forEach(artwork => {
            categoryData[artwork.category] = (categoryData[artwork.category] || 0) + 1;
        });
        
        const chartBars = document.getElementById('categoryBars');
        const maxCount = Math.max(...Object.values(categoryData));
        
        chartBars.innerHTML = Object.entries(categoryData)
            .sort(([,a], [,b]) => b - a)
            .map(([category, count]) => {
                const percentage = (count / maxCount) * 100;
                return `
                    <div class="chart-bar">
                        <div class="chart-bar-label">${category}</div>
                        <div class="chart-bar-visual" style="width: ${percentage}%"></div>
                        <div class="chart-bar-value">${count}</div>
                    </div>
                `;
            }).join('');
    }
    
    updatePriceChart(artworks) {
        const priceRanges = {
            '$0 - $1,000': artworks.filter(a => a.price < 1000).length,
            '$1,000 - $2,500': artworks.filter(a => a.price >= 1000 && a.price < 2500).length,
            '$2,500 - $5,000': artworks.filter(a => a.price >= 2500 && a.price < 5000).length,
            '$5,000+': artworks.filter(a => a.price >= 5000).length
        };
        
        const priceRangesEl = document.getElementById('priceRanges');
        priceRangesEl.innerHTML = Object.entries(priceRanges).map(([range, count]) => `
            <div class="price-range-item">
                <span>${range}</span>
                <span><strong>${count}</strong> artworks</span>
            </div>
        `).join('');
    }
    
    updateAnalyticsDetails(artworks) {
        this.updateTopPerforming(artworks);
        this.updateRecentActivity(artworks);
        this.updateArtistStats(artworks);
    }
    
    updateTopPerforming(artworks) {
        const topPerforming = [...artworks]
            .sort((a, b) => ((this.likes[b.id] || 0) + (this.interests[b.id] || 0)) - 
                           ((this.likes[a.id] || 0) + (this.interests[a.id] || 0)))
            .slice(0, 5);
        
        const container = document.getElementById('topPerforming');
        container.innerHTML = topPerforming.map(artwork => {
            const likes = this.likes[artwork.id] || 0;
            const interests = this.interests[artwork.id] || 0;
            const total = likes + interests;
            
            return `
                <div class="performance-item">
                    <h4>${artwork.title}</h4>
                    <p>by ${artwork.artist}</p>
                    <p><strong>${total}</strong> total engagements (${likes} likes, ${interests} interests)</p>
                    <p>Price: $${artwork.price.toLocaleString()} | Status: ${artwork.status}</p>
                </div>
            `;
        }).join('');
    }
    
    updateRecentActivity(artworks) {
        const recentActivity = [...artworks]
            .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
            .slice(0, 10);
        
        const container = document.getElementById('recentActivity');
        container.innerHTML = recentActivity.map(artwork => `
            <div class="activity-item">
                <p><strong>${artwork.title}</strong> by ${artwork.artist}</p>
                <p>Added: ${new Date(artwork.dateAdded).toLocaleDateString()}</p>
                <p>Status: ${artwork.status} | Price: $${artwork.price.toLocaleString()}</p>
            </div>
        `).join('');
    }
    
    updateArtistStats(artworks) {
        const artistData = {};
        
        artworks.forEach(artwork => {
            if (!artistData[artwork.artist]) {
                artistData[artwork.artist] = {
                    count: 0,
                    totalValue: 0,
                    totalLikes: 0,
                    totalInterests: 0,
                    sold: 0
                };
            }
            
            artistData[artwork.artist].count++;
            artistData[artwork.artist].totalValue += artwork.price;
            artistData[artwork.artist].totalLikes += this.likes[artwork.id] || 0;
            artistData[artwork.artist].totalInterests += this.interests[artwork.id] || 0;
            if (artwork.status === 'sold') artistData[artwork.artist].sold++;
        });
        
        const container = document.getElementById('artistStats');
        container.innerHTML = Object.entries(artistData)
            .sort(([,a], [,b]) => b.totalValue - a.totalValue)
            .slice(0, 5)
            .map(([artist, data]) => `
                <div class="artist-item">
                    <h4>${artist}</h4>
                    <p><strong>${data.count}</strong> artworks | <strong>$${data.totalValue.toLocaleString()}</strong> total value</p>
                    <p>${data.totalLikes} likes, ${data.totalInterests} interests</p>
                    <p>${data.sold} sold, ${data.count - data.sold} available</p>
                </div>
            `).join('');
    }
    
    generateBusinessInsights(artworks) {
        const insights = [];
        
        // Popular category insight
        const categoryData = {};
        artworks.forEach(artwork => {
            categoryData[artwork.category] = (categoryData[artwork.category] || 0) + 1;
        });
        const topCategory = Object.entries(categoryData).sort(([,a], [,b]) => b - a)[0];
        if (topCategory) {
            insights.push({
                title: 'Most Popular Category',
                text: `${topCategory[0]} is your most popular category with ${topCategory[1]} artworks (${((topCategory[1] / artworks.length) * 100).toFixed(1)}% of collection).`
            });
        }
        
        // Price analysis insight
        const averagePrice = artworks.reduce((sum, a) => sum + a.price, 0) / artworks.length;
        const highPriceCount = artworks.filter(a => a.price > averagePrice * 1.5).length;
        insights.push({
            title: 'Pricing Analysis',
            text: `Average artwork price is $${averagePrice.toFixed(0)}. ${highPriceCount} artworks are priced significantly above average, representing premium pieces.`
        });
        
        // Engagement insight
        const totalLikes = Object.values(this.likes).reduce((sum, likes) => sum + likes, 0);
        const totalInterests = Object.values(this.interests).reduce((sum, interests) => sum + interests, 0);
        const engagementRate = ((totalLikes + totalInterests) / artworks.length).toFixed(1);
        insights.push({
            title: 'Visitor Engagement',
            text: `Average engagement rate is ${engagementRate} interactions per artwork. ${totalInterests > totalLikes ? 'Strong purchase intent with more interests than likes.' : 'High appreciation with more likes than purchase interests.'}`
        });
        
        // Recent performance insight
        const recentArtworks = artworks.filter(a => {
            const daysSinceAdded = (Date.now() - new Date(a.dateAdded).getTime()) / (1000 * 60 * 60 * 24);
            return daysSinceAdded <= 30;
        });
        if (recentArtworks.length > 0) {
            insights.push({
                title: 'Recent Performance',
                text: `${recentArtworks.length} artworks added in the last 30 days. New additions are ${recentArtworks.filter(a => (this.likes[a.id] || 0) > 0).length > recentArtworks.length / 2 ? 'performing well' : 'building momentum'} with visitor engagement.`
            });
        }
        
        const container = document.getElementById('businessInsights');
        container.innerHTML = insights.map(insight => `
            <div class="insight-item">
                <h4>${insight.title}</h4>
                <p>${insight.text}</p>
            </div>
        `).join('');
    }
    
    exportAnalyticsReport() {
        const range = document.getElementById('analyticsRange').value;
        const artworks = this.filterArtworksByDateRange(range);
        
        const report = {
            generatedAt: new Date().toISOString(),
            dateRange: range,
            summary: {
                totalArtworks: artworks.length,
                totalValue: artworks.reduce((sum, a) => sum + a.price, 0),
                totalLikes: Object.values(this.likes).reduce((sum, likes) => sum + likes, 0),
                totalInterests: Object.values(this.interests).reduce((sum, interests) => sum + interests, 0),
                soldCount: artworks.filter(a => a.status === 'sold').length,
                availableCount: artworks.filter(a => a.status === 'available').length
            },
            artworks: artworks.map(artwork => ({
                ...artwork,
                likes: this.likes[artwork.id] || 0,
                interests: this.interests[artwork.id] || 0
            }))
        };
        
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-report-${range}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Analytics report exported successfully', 'success');
    }
    
    saveArtworks() {
        localStorage.setItem('artGalleryArtworks', JSON.stringify(this.artworks));
    }
    
    loadSavedArtworks() {
        const savedArtworks = localStorage.getItem('artGalleryArtworks');
        if (savedArtworks) {
            const parsed = JSON.parse(savedArtworks);
            // Convert date strings back to Date objects
            parsed.forEach(artwork => {
                artwork.dateAdded = new Date(artwork.dateAdded);
            });
            return parsed;
        }
        return null;
    }
    
    // Interest System
    toggleInterest(artworkId) {
        if (!this.currentUser) {
            this.showNotification('Please login to show interest', 'error');
            return;
        }
        
        const currentInterests = this.interests[artworkId] || 0;
        
        if (currentInterests > 0) {
            // Remove interest
            this.interests[artworkId] = 0;
        } else {
            // Add interest
            this.interests[artworkId] = 1;
        }
        
        this.saveInterests();
        this.updateInterestDisplay(artworkId);
    }
    
    updateInterestDisplay(artworkId) {
        const artItem = document.querySelector(`[data-art-id="${artworkId}"]`);
        if (artItem) {
            const interestBtn = artItem.querySelector('.interest-btn');
            const interestCount = interestBtn.querySelector('.interest-count');
            
            const interests = this.interests[artworkId] || 0;
            const isInterested = interests > 0;
            
            interestBtn.className = `interest-btn ${isInterested ? 'interested' : ''}`;
            interestCount.textContent = interests;
        }
    }
    
    // Utility methods
    showModal(modalId) {
        document.getElementById(modalId).classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    hideModal(modalId) {
        document.getElementById(modalId).classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    showLoading() {
        this.loading.classList.add('show');
    }
    
    hideLoading() {
        this.loading.classList.remove('show');
    }
}

// Initialize the art gallery when the DOM is loaded
let gallery; // Global reference for admin functions
document.addEventListener('DOMContentLoaded', () => {
    gallery = new ArtGallery();
});

// Additional compatibility fixes for interactive elements
document.addEventListener('DOMContentLoaded', function() {
    // Ensure all UI elements work properly
    const uiElements = document.querySelectorAll(`
        button, input, select, textarea, 
        .like-btn, .interest-btn, 
        .tag-suggestion, .modal, .admin-tabs, .form-group, .btn, .checkbox-label,
        .art-item, .nav-link, .header, .hero,
        .filter-select, .page-number, .btn-icon,
        .notification, .tab-btn, .bulk-buttons,
        .art-actions, .modal-actions, a, label
    `);
    
    uiElements.forEach(element => {
        element.style.userSelect = 'auto';
        element.style.webkitUserSelect = 'auto';
        element.style.mozUserSelect = 'auto';
        element.style.msUserSelect = 'auto';
        element.style.pointerEvents = 'auto';
        element.style.cursor = 'pointer';
    });
});
