/**
 * Favorites Page Controller
 * Manages user favorites with mobile-focused 2-column grid approach
 */
window.FavoritesController = {
    /**
     * Initialize the favorites page
     */
    init: function() {
        console.log('FavoritesController: Initializing favorites page');
        
        this.favorites = [];
        this.currentTab = 'all';
        this.editMode = false;
        this.selectedItems = new Set();
        
        this.loadFavorites();
        this.setupEventListeners();
        this.setupTabNavigation();
        this.updateStats();
        
        console.log('FavoritesController: Favorites page initialized successfully');
    },

    /**
     * Set up event listeners
     */
    setupEventListeners: function() {
        // Edit mode toggle
        const editBtn = document.querySelector('[data-action="edit-favorites"]');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                this.toggleEditMode();
            });
        }

        // Tab buttons
        document.querySelectorAll('.favorites-filter-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Favorite item clicks
        document.querySelectorAll('.favorites-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!this.editMode) {
                    this.handleItemClick(e.currentTarget);
                }
            });
        });

        // Remove favorite buttons
        document.querySelectorAll('[data-action="remove-favorite"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeFavorite(e.target.closest('[data-action="remove-favorite"]'));
            });
        });

        // Action buttons
        document.querySelectorAll('[data-action="view-details"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.viewDetails(e.target.closest('[data-action="view-details"]'));
            });
        });

        document.querySelectorAll('[data-action="contact"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.contactProvider(e.target.closest('[data-action="contact"]'));
            });
        });

        document.querySelectorAll('[data-action="claim-offer"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.claimOffer(e.target.closest('[data-action="claim-offer"]'));
            });
        });

        // Bulk actions
        const selectAllBtn = document.querySelector('[data-action="select-all"]');
        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', () => {
                this.selectAll();
            });
        }

        const removeSelectedBtn = document.querySelector('[data-action="remove-selected"]');
        if (removeSelectedBtn) {
            removeSelectedBtn.addEventListener('click', () => {
                this.removeSelected();
            });
        }

        // Empty state action
        const exploreBtn = document.querySelector('[data-action="navigate"][data-page="service-providers"]');
        if (exploreBtn) {
            exploreBtn.addEventListener('click', () => {
                Router.navigate('service-providers');
            });
        }
    },

    /**
     * Set up tab navigation
     */
    setupTabNavigation: function() {
        // Tab switching is handled in setupEventListeners
    },

    /**
     * Load favorites from storage
     */
    loadFavorites: function() {
        // Load from localStorage or use mock data
        const storedFavorites = localStorage.getItem('userFavorites');
        
        if (storedFavorites) {
            this.favorites = JSON.parse(storedFavorites);
        } else {
            // Mock data
            this.favorites = [
                {
                    id: 1,
                    type: 'provider',
                    name: 'شركة الشحن البحري المتقدمة',
                    description: 'خدمات شحن بحري احترافية من ميناء جدة إلى جميع موانئ اليمن',
                    rating: 4.8,
                    reviews: 127,
                    location: 'صنعاء، اليمن',
                    price: 'من 1500 ريال',
                    priceUnit: '/طن',
                    tags: ['شحن بحري', 'تخليص جمركي', 'تتبع GPS'],
                    badges: ['verified', 'featured'],
                    image: 'templates/pages/images/shipping.jpg',
                    addedDate: '2025-01-15'
                },
                {
                    id: 2,
                    type: 'provider',
                    name: 'مستودعات اليمن الآمنة',
                    description: 'مستودعات حديثة ومؤمنة مع نظام إدارة ذكي للمخزون',
                    rating: 4.2,
                    reviews: 89,
                    location: 'عدن، اليمن',
                    price: 'من 800 ريال',
                    priceUnit: '/متر²',
                    tags: ['تخزين', 'مبرد', 'مراقبة'],
                    badges: ['new'],
                    image: 'templates/pages/images/warehouse.jpg',
                    addedDate: '2025-01-10'
                },
                {
                    id: 3,
                    type: 'service',
                    name: 'خدمة التخليص الجمركي السريع',
                    description: 'خدمات تخليص جمركي سريعة ومضمونة مع خبرة 15+ سنة',
                    rating: 4.9,
                    reviews: 203,
                    location: 'الحديدة، اليمن',
                    price: 'من 500 ريال',
                    priceUnit: '/شحنة',
                    tags: ['تخليص جمركي', 'سريع', 'مضمون'],
                    badges: ['verified'],
                    image: 'templates/pages/images/customs.jpg',
                    addedDate: '2025-01-08'
                },
                {
                    id: 4,
                    type: 'offer',
                    name: 'عرض الشحن الجوي - خصم 20%',
                    description: 'خصم 20% على جميع خدمات الشحن الجوي للوجهات الأوروبية',
                    rating: 4.5,
                    reviews: 156,
                    location: 'صنعاء، اليمن',
                    price: 'من 2000 ريال',
                    priceUnit: '/كجم',
                    tags: ['شحن جوي', 'خصم 20%', 'أوروبا'],
                    badges: ['offer'],
                    image: 'templates/pages/images/shipping.jpg',
                    addedDate: '2025-01-05',
                    offerExpiry: '2025-01-31'
                }
            ];
            
            // Save to localStorage
            localStorage.setItem('userFavorites', JSON.stringify(this.favorites));
        }

        this.renderFavorites();
    },

    /**
     * Render favorites based on current tab
     */
    renderFavorites: function() {
        const favoritesGrid = document.getElementById('favoritesGrid');
        const emptyState = document.getElementById('favoritesEmpty');
        
        if (!favoritesGrid) return;

        // Filter favorites based on current tab
        const filteredFavorites = this.getFilteredFavorites();

        if (filteredFavorites.length === 0) {
            favoritesGrid.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        favoritesGrid.style.display = 'grid';
        if (emptyState) emptyState.style.display = 'none';

        // Clear existing items
        favoritesGrid.innerHTML = '';

        // Render filtered favorites
        filteredFavorites.forEach(favorite => {
            const favoriteElement = this.createFavoriteElement(favorite);
            favoritesGrid.appendChild(favoriteElement);
        });

        // Re-attach event listeners
        this.attachFavoriteEventListeners();
    },

    /**
     * Get filtered favorites based on current tab
     */
    getFilteredFavorites: function() {
        if (this.currentTab === 'all') {
            return this.favorites;
        }
        return this.favorites.filter(favorite => favorite.type === this.currentTab);
    },

    /**
     * Create favorite element
     */
    createFavoriteElement: function(favorite) {
        const element = document.createElement('div');
        element.className = 'favorites-item';
        element.dataset.type = favorite.type;
        element.dataset.id = favorite.id;

        const badges = favorite.badges.map(badge => {
            const badgeClass = badge === 'verified' ? 'verified' : 
                             badge === 'featured' ? 'featured' : 
                             badge === 'new' ? 'new' : 
                             badge === 'offer' ? 'offer' : '';
            return `<span class="favorites-badge ${badgeClass}">${badge}</span>`;
        }).join('');

        const tags = favorite.tags.map(tag => `<span class="favorites-tag">${tag}</span>`).join('');

        const actionButton = favorite.type === 'offer' ? 
            `<button class="btn btn-primary btn-sm" data-action="claim-offer" data-id="${favorite.id}">
                <i class="fas fa-gift"></i>
                استخدم العرض
            </button>` :
            `<button class="btn btn-primary btn-sm" data-action="contact" data-id="${favorite.id}">
                <i class="fas fa-phone"></i>
                تواصل
            </button>`;

        element.innerHTML = `
            <div class="favorites-image">
                <img src="${favorite.image}" alt="${favorite.name}">
                <div class="favorites-badges">
                    ${badges}
                </div>
                <button class="favorites-remove-btn" data-action="remove-favorite" data-id="${favorite.id}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="favorites-content">
                <div class="favorites-header">
                    <h3 class="favorites-title">${favorite.name}</h3>
                    <div class="favorites-rating">
                        <span class="favorites-stars">${'★'.repeat(Math.floor(favorite.rating))}${'☆'.repeat(5 - Math.floor(favorite.rating))}</span>
                        <span class="favorites-rating-text">${favorite.rating} (${favorite.reviews} تقييم)</span>
                    </div>
                </div>
                <p class="favorites-description">${favorite.description}</p>
                <div class="favorites-tags">
                    ${tags}
                </div>
                <div class="favorites-meta">
                    <div class="favorites-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${favorite.location}</span>
                    </div>
                    <div class="favorites-price">
                        <span class="favorites-price-amount">${favorite.price}</span>
                        <span class="favorites-price-unit">${favorite.priceUnit}</span>
                    </div>
                </div>
                <div class="favorites-actions">
                    <button class="btn btn-outline btn-sm" data-action="view-details" data-id="${favorite.id}">
                        <i class="fas fa-eye"></i>
                        عرض التفاصيل
                    </button>
                    ${actionButton}
                </div>
            </div>
        `;

        return element;
    },

    /**
     * Attach event listeners to favorite elements
     */
    attachFavoriteEventListeners: function() {
        // Favorite item clicks
        document.querySelectorAll('.favorites-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!this.editMode) {
                    this.handleItemClick(e.currentTarget);
                }
            });
        });

        // Remove favorite buttons
        document.querySelectorAll('[data-action="remove-favorite"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeFavorite(e.target.closest('[data-action="remove-favorite"]'));
            });
        });

        // Action buttons
        document.querySelectorAll('[data-action="view-details"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.viewDetails(e.target.closest('[data-action="view-details"]'));
            });
        });

        document.querySelectorAll('[data-action="contact"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.contactProvider(e.target.closest('[data-action="contact"]'));
            });
        });

        document.querySelectorAll('[data-action="claim-offer"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.claimOffer(e.target.closest('[data-action="claim-offer"]'));
            });
        });
    },

    /**
     * Handle item click
     */
    handleItemClick: function(element) {
        const itemId = element.dataset.id;
        const itemType = element.dataset.type;
        
        // Navigate to appropriate details page
        switch (itemType) {
            case 'provider':
                Router.navigate('service-provider-details', { id: itemId });
                break;
            case 'service':
                Router.navigate('service-details', { id: itemId });
                break;
            case 'offer':
                Router.navigate('offer-details', { id: itemId });
                break;
        }
    },

    /**
     * Remove favorite
     */
    removeFavorite: function(button) {
        const itemId = parseInt(button.dataset.id);
        
        Modal.open('confirm-remove-favorite', {
            title: 'إزالة من المفضلة',
            content: `
                <div class="confirm-remove-favorite">
                    <div class="remove-confirmation-icon">
                        <i class="fas fa-heart-broken"></i>
                    </div>
                    <h3>هل أنت متأكد من إزالة هذا العنصر من المفضلة؟</h3>
                    <p>لا يمكن التراجع عن هذا الإجراء</p>
                    <div class="modal-actions">
                        <button class="btn btn-outline" data-action="cancel">إلغاء</button>
                        <button class="btn btn-danger" data-action="confirm-remove">إزالة</button>
                    </div>
                </div>
            `,
            onConfirm: () => {
                this.favorites = this.favorites.filter(fav => fav.id !== itemId);
                localStorage.setItem('userFavorites', JSON.stringify(this.favorites));
                this.renderFavorites();
                this.updateStats();
                Toast.show('تم الإزالة', 'تم إزالة العنصر من المفضلة', 'success');
            }
        });
    },

    /**
     * View details
     */
    viewDetails: function(button) {
        const itemId = button.dataset.id;
        this.handleItemClick(button.closest('.favorites-item'));
    },

    /**
     * Contact provider
     */
    contactProvider: function(button) {
        const itemId = button.dataset.id;
        Router.navigate('chat-support');
    },

    /**
     * Claim offer
     */
    claimOffer: function(button) {
        const itemId = button.dataset.id;
        
        Modal.open('claim-offer', {
            title: 'استخدام العرض',
            content: `
                <div class="claim-offer">
                    <div class="offer-icon">
                        <i class="fas fa-gift"></i>
                    </div>
                    <h3>خصم 20% على الشحن الجوي</h3>
                    <p>صالح حتى: 31 يناير 2025</p>
                    <div class="offer-details">
                        <div class="offer-feature">
                            <i class="fas fa-check"></i>
                            <span>خصم 20% على جميع الشحنات الجوية</span>
                        </div>
                        <div class="offer-feature">
                            <i class="fas fa-check"></i>
                            <span>صالح للوجهات الأوروبية</span>
                        </div>
                        <div class="offer-feature">
                            <i class="fas fa-check"></i>
                            <span>لا توجد شروط إضافية</span>
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-outline" data-action="cancel">إلغاء</button>
                        <button class="btn btn-primary" data-action="confirm-claim">استخدام العرض</button>
                    </div>
                </div>
            `,
            onConfirm: () => {
                Toast.show('تم استخدام العرض', 'سيتم تطبيق الخصم على طلبك القادم', 'success');
            }
        });
    },

    /**
     * Switch tab
     */
    switchTab: function(tab) {
        this.currentTab = tab;
        
        // Update tab buttons
        document.querySelectorAll('.favorites-filter-tab').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeTab = document.querySelector(`[data-tab="${tab}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
        
        // Re-render favorites
        this.renderFavorites();
    },

    /**
     * Toggle edit mode
     */
    toggleEditMode: function() {
        this.editMode = !this.editMode;
        const editBtn = document.querySelector('[data-action="edit-favorites"]');
        const bulkActions = document.getElementById('bulkActions');
        
        if (this.editMode) {
            editBtn.innerHTML = '<i class="fas fa-check"></i>';
            if (bulkActions) bulkActions.style.display = 'block';
            document.querySelectorAll('.favorites-item').forEach(item => {
                item.classList.add('edit-mode');
            });
        } else {
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            if (bulkActions) bulkActions.style.display = 'none';
            document.querySelectorAll('.favorites-item').forEach(item => {
                item.classList.remove('edit-mode');
            });
            this.selectedItems.clear();
            this.updateSelectedCount();
        }
    },

    /**
     * Select all items
     */
    selectAll: function() {
        const selectAllBtn = document.querySelector('[data-action="select-all"]');
        const isSelectAll = selectAllBtn.textContent.includes('تحديد الكل');
        
        if (isSelectAll) {
            // Select all
            this.selectedItems.clear();
            document.querySelectorAll('.favorites-item').forEach(item => {
                this.selectedItems.add(parseInt(item.dataset.id));
                item.classList.add('selected');
            });
            selectAllBtn.textContent = 'إلغاء التحديد';
        } else {
            // Deselect all
            this.selectedItems.clear();
            document.querySelectorAll('.favorites-item').forEach(item => {
                item.classList.remove('selected');
            });
            selectAllBtn.textContent = 'تحديد الكل';
        }
        
        this.updateSelectedCount();
    },

    /**
     * Remove selected items
     */
    removeSelected: function() {
        if (this.selectedItems.size === 0) {
            Toast.show('لا توجد عناصر محددة', 'يرجى تحديد العناصر المراد إزالتها', 'warning');
            return;
        }
        
        Modal.open('confirm-remove-selected', {
            title: 'إزالة العناصر المحددة',
            content: `
                <div class="confirm-remove-selected">
                    <div class="remove-multiple-icon">
                        <i class="fas fa-trash-alt"></i>
                    </div>
                    <h3>هل أنت متأكد من إزالة ${this.selectedItems.size} عنصر من المفضلة؟</h3>
                    <p>لا يمكن التراجع عن هذا الإجراء</p>
                    <div class="modal-actions">
                        <button class="btn btn-outline" data-action="cancel">إلغاء</button>
                        <button class="btn btn-danger" data-action="confirm-remove">إزالة</button>
                    </div>
                </div>
            `,
            onConfirm: () => {
                this.favorites = this.favorites.filter(fav => !this.selectedItems.has(fav.id));
                localStorage.setItem('userFavorites', JSON.stringify(this.favorites));
                this.selectedItems.clear();
                this.toggleEditMode();
                this.renderFavorites();
                this.updateStats();
                Toast.show('تم الإزالة', `تم إزالة ${this.selectedItems.size} عنصر من المفضلة`, 'success');
            }
        });
    },

    /**
     * Update selected count
     */
    updateSelectedCount: function() {
        const selectedCount = document.getElementById('selectedCount');
        if (selectedCount) {
            selectedCount.textContent = this.selectedItems.size;
        }
    },

    /**
     * Update statistics
     */
    updateStats: function() {
        const totalFavorites = document.getElementById('totalFavorites');
        const serviceProviders = document.getElementById('serviceProviders');
        const services = document.getElementById('services');
        
        if (totalFavorites) {
            totalFavorites.textContent = this.favorites.length;
        }
        
        if (serviceProviders) {
            const providersCount = this.favorites.filter(fav => fav.type === 'provider').length;
            serviceProviders.textContent = providersCount;
        }
        
        if (services) {
            const servicesCount = this.favorites.filter(fav => fav.type === 'service').length;
            services.textContent = servicesCount;
        }
        
        // Update tab counts
        document.querySelectorAll('.favorites-filter-tab').forEach(btn => {
            const tab = btn.dataset.tab;
            const count = tab === 'all' ? this.favorites.length : 
                         this.favorites.filter(fav => fav.type === tab).length;
            const countSpan = btn.querySelector('span');
            if (countSpan) {
                countSpan.textContent = count;
            }
        });
    },

    /**
     * Destroy controller
     */
    destroy: function() {
        console.log('FavoritesController: Destroying favorites page');
        this.selectedItems.clear();
    }
}; 