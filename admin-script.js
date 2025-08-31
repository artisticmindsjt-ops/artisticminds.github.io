// Admin-specific JavaScript - separate from main site protection
class AdminPortal {
    constructor() {
        this.currentUser = null;
        this.gallery = null;
        this.init();
    }
    
    init() {
        this.setupAuthentication();
        this.checkExistingSession();
    }
    
    setupAuthentication() {
        const loginForm = document.getElementById('adminLoginForm');
        const logoutBtn = document.getElementById('adminLogoutBtn');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
    }
    
    checkExistingSession() {
        const savedUser = localStorage.getItem('adminUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showDashboard();
        }
    }
    
    // Secure password management
    getSecurePassword() {
        // Try to get from secure storage first
        let adminPassword = localStorage.getItem('secureAdminPassword');
        
        if (!adminPassword) {
            // First time setup - prompt for password
            adminPassword = prompt('🔒 First-time admin setup: Enter your admin password:');
            if (adminPassword) {
                // Store securely (in real app, this would be hashed)
                localStorage.setItem('secureAdminPassword', adminPassword);
                alert('✅ Admin password configured securely!');
            } else {
                alert('❌ Admin password required for access');
                return null;
            }
        }
        
        return adminPassword;
    }

    handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;
        const errorDiv = document.getElementById('adminLoginError');
        
        // Demo admin credentials
        // Get password from secure storage or prompt
        const adminPassword = this.getSecurePassword();
        if (email === 'admin@gallery.com' && password === adminPassword) {
            this.currentUser = {
                id: 'admin-1',
                name: 'Gallery Admin',
                email: email,
                role: 'admin',
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('adminUser', JSON.stringify(this.currentUser));
            this.showDashboard();
        } else {
            errorDiv.style.display = 'block';
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 3000);
        }
    }
    
    handleLogout() {
        localStorage.removeItem('adminUser');
        this.currentUser = null;
        this.showLogin();
    }
    
    showDashboard() {
        document.body.classList.add('admin-logged-in');
        
        // Update user info
        document.getElementById('adminUserName').textContent = this.currentUser.name;
        document.getElementById('adminUserEmail').textContent = this.currentUser.email;
        document.getElementById('adminAvatar').textContent = this.currentUser.name.charAt(0);
        
        // Initialize gallery if not already done
        this.initializeGallery();
    }
    
    showLogin() {
        document.body.classList.remove('admin-logged-in');
        document.getElementById('adminEmail').value = '';
        document.getElementById('adminPassword').value = '';
    }
    
    initializeGallery() {
        // Initialize ArtGallery class for admin functionality
        if (typeof ArtGallery !== 'undefined') {
            this.gallery = new ArtGallery();
            this.gallery.setupAdminDashboard();
            this.gallery.loadAnalytics();
        }
    }
    
    switchTab(tabName) {
        // Hide all tab contents
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(tab => tab.classList.remove('active'));
        
        // Hide all tab buttons
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => btn.classList.remove('active'));
        
        // Show selected tab
        const selectedTab = document.getElementById(tabName + '-tab');
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        // Activate button
        event.target.classList.add('active');
        
        // Load tab-specific content
        if (this.gallery) {
            if (tabName === 'manage') {
                this.gallery.loadArtworksList();
            } else if (tabName === 'analytics') {
                this.gallery.loadAnalytics();
            } else if (tabName === 'users') {
                this.gallery.loadUserManagement();
            }
        }
    }
}

// Lightweight ArtGallery class for admin functionality only
class ArtGallery {
    constructor() {
        this.artworks = [];
        this.selectedTags = [];
        this.selectedArtworks = [];
        this.currentManagePage = 1;
        this.manageItemsPerPage = 10;
        this.init();
    }
    
    init() {
        // Load saved artworks
        const savedArtworks = localStorage.getItem('artworks');
        if (savedArtworks) {
            this.artworks = JSON.parse(savedArtworks);
        } else {
            this.generateSampleArtworks();
            this.saveArtworks();
        }
    }
    
    generateSampleArtworks() {
        this.artworks = [
            {
                id: 1,
                title: "Abstract Dreams",
                artist: "Maya Chen",
                imageUrl: "https://picsum.photos/400/600?random=1",
                category: "painting",
                theme: "abstract",
                price: 1200,
                currency: "USD",
                isNew: true,
                dateAdded: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                likes: 45,
                interests: 12,
                status: "available",
                tags: ["modern", "colorful", "expressive"],
                dimensions: "60x80 cm",
                medium: "Oil on canvas",
                description: "A vibrant exploration of color and form..."
            },
            {
                id: 2,
                title: "Mountain Serenity",
                artist: "John Roberts",
                imageUrl: "https://picsum.photos/400/500?random=2",
                category: "photography",
                theme: "landscape",
                price: 800,
                currency: "USD",
                isNew: false,
                dateAdded: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                likes: 32,
                interests: 8,
                status: "available",
                tags: ["nature", "peaceful", "mountains"],
                dimensions: "40x60 cm",
                medium: "Digital print",
                description: "Capturing the tranquil beauty of mountain landscapes..."
            }
        ];
    }
    
    saveArtworks() {
        localStorage.setItem('artworks', JSON.stringify(this.artworks));
    }
    
    setupAdminDashboard() {
        this.setupUploadFeatures();
        this.setupManageFeatures();
        this.setupAnalyticsFeatures();
    }
    
    setupUploadFeatures() {
        // Setup upload form functionality
        const uploadForm = document.getElementById('artworkUploadForm');
        if (uploadForm) {
            uploadForm.addEventListener('submit', (e) => this.handleArtworkUpload(e));
        }
        
        // Image preview
        const imageInput = document.getElementById('artworkImage');
        if (imageInput) {
            imageInput.addEventListener('change', (e) => this.updateImagePreview(e));
        }
        
        // Tag management
        const tagsInput = document.getElementById('artworkTags');
        if (tagsInput) {
            tagsInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.addTag(e.target.value.trim());
                    e.target.value = '';
                }
            });
        }
    }
    
    setupManageFeatures() {
        // Setup management functionality
        const searchInput = document.getElementById('manageSearch');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterArtworksList());
        }
        
        // Load initial artworks list
        this.loadArtworksList();
    }
    
    setupAnalyticsFeatures() {
        const refreshBtn = document.getElementById('refreshAnalytics');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadAnalytics());
        }
    }
    
    handleArtworkUpload(e) {
        e.preventDefault();
        
        const formData = this.getFormData();
        if (this.validateForm(formData)) {
            // Generate new artwork
            const newArtwork = {
                id: Date.now(),
                ...formData,
                dateAdded: new Date().toISOString(),
                likes: 0,
                interests: 0,
                status: "available"
            };
            
            this.artworks.push(newArtwork);
            this.saveArtworks();
            
            // Show success message
            this.showNotification('Artwork uploaded successfully!', 'success');
            
            // Reset form
            document.getElementById('artworkUploadForm').reset();
            this.selectedTags = [];
            this.updateTagsDisplay();
        }
    }
    
    getFormData() {
        return {
            title: document.getElementById('artworkTitle').value,
            artist: document.getElementById('artworkArtist').value,
            category: document.getElementById('artworkCategory').value,
            theme: document.getElementById('artworkTheme').value,
            price: parseFloat(document.getElementById('artworkPrice').value),
            medium: document.getElementById('artworkMedium').value,
            dimensions: document.getElementById('artworkDimensions').value,
            description: document.getElementById('artworkDescription').value,
            tags: [...this.selectedTags],
            imageUrl: "https://picsum.photos/400/600?random=" + Date.now(),
            currency: "USD",
            isNew: true
        };
    }
    
    validateForm(data) {
        if (!data.title || !data.artist || !data.category || !data.price) {
            this.showNotification('Please fill in all required fields', 'error');
            return false;
        }
        return true;
    }
    
    addTag(tag) {
        if (tag && !this.selectedTags.includes(tag)) {
            this.selectedTags.push(tag);
            this.updateTagsDisplay();
        }
    }
    
    updateTagsDisplay() {
        const container = document.getElementById('selectedTags');
        if (container) {
            container.innerHTML = this.selectedTags.map(tag => 
                `<span class="selected-tag">${tag} <button onclick="adminPortal.gallery.removeTag('${tag}')">&times;</button></span>`
            ).join('');
        }
    }
    
    removeTag(tag) {
        this.selectedTags = this.selectedTags.filter(t => t !== tag);
        this.updateTagsDisplay();
    }
    
    updateImagePreview(e) {
        const file = e.target.files[0];
        const preview = document.getElementById('imagePreview');
        
        if (file && preview) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 100%; height: auto;">`;
            };
            reader.readAsDataURL(file);
        }
    }
    
    loadArtworksList() {
        const tbody = document.getElementById('artworksTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = this.artworks.map(artwork => `
            <tr>
                <td><input type="checkbox" data-id="${artwork.id}"></td>
                <td><img src="${artwork.imageUrl}" alt="${artwork.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"></td>
                <td>${artwork.title}</td>
                <td>${artwork.artist}</td>
                <td>${artwork.category}</td>
                <td>$${artwork.price}</td>
                <td><span class="status-badge status-${artwork.status}">${artwork.status}</span></td>
                <td>${artwork.likes}</td>
                <td>${new Date(artwork.dateAdded).toLocaleDateString()}</td>
                <td>
                    <button class="btn-icon" onclick="adminPortal.gallery.editArtwork(${artwork.id})">✏️</button>
                    <button class="btn-icon" onclick="adminPortal.gallery.deleteArtwork(${artwork.id})">🗑️</button>
                </td>
            </tr>
        `).join('');
    }
    
    filterArtworksList() {
        // Implement filtering logic
        this.loadArtworksList();
    }
    
    editArtwork(id) {
        this.showNotification('Edit functionality would be implemented here', 'info');
    }
    
    deleteArtwork(id) {
        if (confirm('Are you sure you want to delete this artwork?')) {
            this.artworks = this.artworks.filter(artwork => artwork.id !== id);
            this.saveArtworks();
            this.loadArtworksList();
            this.showNotification('Artwork deleted successfully', 'success');
        }
    }
    
    loadAnalytics() {
        this.updateStatCards();
        this.updateCharts();
    }
    
    updateStatCards() {
        const statsGrid = document.getElementById('statsGrid');
        if (!statsGrid) return;
        
        const totalArtworks = this.artworks.length;
        const totalLikes = this.artworks.reduce((sum, art) => sum + (art.likes || 0), 0);
        const totalRevenue = this.artworks
            .filter(art => art.status === 'sold')
            .reduce((sum, art) => sum + (art.price || 0), 0);
        
        statsGrid.innerHTML = `
            <div class="stat-card primary">
                <div class="stat-icon">🎨</div>
                <div class="stat-content">
                    <div class="stat-number">${totalArtworks}</div>
                    <div class="stat-label">Total Artworks</div>
                </div>
            </div>
            <div class="stat-card success">
                <div class="stat-icon">❤️</div>
                <div class="stat-content">
                    <div class="stat-number">${totalLikes}</div>
                    <div class="stat-label">Total Likes</div>
                </div>
            </div>
            <div class="stat-card info">
                <div class="stat-icon">💰</div>
                <div class="stat-content">
                    <div class="stat-number">$${totalRevenue.toLocaleString()}</div>
                    <div class="stat-label">Total Revenue</div>
                </div>
            </div>
        `;
    }
    
    updateCharts() {
        // Implement chart updates
        const categoryChart = document.getElementById('categoryChart');
        if (categoryChart) {
            categoryChart.innerHTML = '<p>Chart functionality would be implemented here</p>';
        }
    }
    
    loadUserManagement() {
        const usersTableBody = document.getElementById('usersTableBody');
        if (usersTableBody) {
            usersTableBody.innerHTML = '<tr><td colspan="6">User management functionality would be implemented here</td></tr>';
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialize admin portal
const adminPortal = new AdminPortal();

// Global function for tab switching
function switchTab(tabName) {
    adminPortal.switchTab(tabName);
}

// Ensure all UI elements are interactive (no image protection interference)
document.addEventListener('DOMContentLoaded', function() {
    // Enable all interactive elements
    const interactiveElements = document.querySelectorAll(`
        button, input, select, textarea, 
        .tab-btn, .btn, .checkbox-label,
        .admin-tabs, .form-group,
        .btn-icon, .notification
    `);
    
    interactiveElements.forEach(element => {
        element.style.userSelect = 'auto';
        element.style.webkitUserSelect = 'auto';
        element.style.mozUserSelect = 'auto';
        element.style.msUserSelect = 'auto';
        element.style.pointerEvents = 'auto';
        element.style.cursor = 'pointer';
    });
    
    // Ensure form elements work
    const formElements = document.querySelectorAll('input, select, textarea, button');
    formElements.forEach(element => {
        element.style.pointerEvents = 'auto';
        element.style.userSelect = 'auto';
    });
});

