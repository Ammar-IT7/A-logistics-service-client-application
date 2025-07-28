/**
 * Search Page Controller
 */
window.SearchController = {
    /**
     * Search state
     */
    state: {
        currentQuery: '',
        filters: {
            serviceTypes: [],
            locationFrom: '',
            locationTo: '',
            priceRange: 5000,
            rating: null
        },
        results: [],
        currentPage: 1,
        hasMore: false,
        isLoading: false,
        viewMode: 'grid' // 'grid' or 'list'
    },

    /**
     * Initialize the search page
     */
    init: function() {
        this.bindEvents();
        this.loadSearchHistory();
        this.setupAdvancedSearch();
        this.loadPopularSearches();
        
        // Check if there's a search query in URL params
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        if (query) {
            this.performSearch(query);
        }
    },

    /**
     * Bind event listeners
     */
    bindEvents: function() {
        // Main search input
        const mainSearchInput = document.getElementById('mainSearchInput');
        if (mainSearchInput) {
            mainSearchInput.addEventListener('input', this.handleSearchInput.bind(this));
            mainSearchInput.addEventListener('keypress', this.handleSearchKeypress.bind(this));
        }

        // Search clear button
        const searchClearBtn = document.getElementById('searchClearBtn');
        if (searchClearBtn) {
            searchClearBtn.addEventListener('click', this.clearSearch.bind(this));
        }

        // Advanced search toggle
        const advancedSearchToggle = document.getElementById('advancedSearchToggle');
        if (advancedSearchToggle) {
            advancedSearchToggle.addEventListener('click', this.toggleAdvancedSearch.bind(this));
        }

        // Filter actions
        const clearFiltersBtn = document.getElementById('clearFiltersBtn');
        const applyFiltersBtn = document.getElementById('applyFiltersBtn');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', this.clearFilters.bind(this));
        }
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', this.applyFilters.bind(this));
        }

        // Price range slider
        const priceRange = document.getElementById('priceRange');
        if (priceRange) {
            priceRange.addEventListener('input', this.handlePriceRangeChange.bind(this));
        }

        // Sort select
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', this.handleSortChange.bind(this));
        }

        // View toggle
        const viewToggleBtn = document.getElementById('viewToggleBtn');
        if (viewToggleBtn) {
            viewToggleBtn.addEventListener('click', this.toggleViewMode.bind(this));
        }

        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', this.loadMoreResults.bind(this));
        }

        // Clear history button
        const clearHistoryBtn = document.getElementById('clearHistoryBtn');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', this.clearSearchHistory.bind(this));
        }

        // Popular tags
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('popular-tag')) {
                const searchTerm = e.target.dataset.search;
                this.performSearch(searchTerm);
            }
        });

        // History items
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('history-item')) {
                const searchTerm = e.target.dataset.search;
                this.performSearch(searchTerm);
            }
        });
    },

    /**
     * Handle search input changes
     */
    handleSearchInput: function(e) {
        const query = e.target.value.trim();
        const clearBtn = document.getElementById('searchClearBtn');
        
        if (clearBtn) {
            clearBtn.style.display = query ? 'flex' : 'none';
        }

        // Auto-search after delay
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            if (query.length >= 2) {
                this.performSearch(query);
            } else if (query.length === 0) {
                this.showSearchInterface();
            }
        }, 500);
    },

    /**
     * Handle search keypress
     */
    handleSearchKeypress: function(e) {
        if (e.key === 'Enter') {
            const query = e.target.value.trim();
            if (query) {
                this.performSearch(query);
            }
        }
    },

    /**
     * Clear search
     */
    clearSearch: function() {
        const mainSearchInput = document.getElementById('mainSearchInput');
        if (mainSearchInput) {
            mainSearchInput.value = '';
            mainSearchInput.focus();
        }
        
        const clearBtn = document.getElementById('searchClearBtn');
        if (clearBtn) {
            clearBtn.style.display = 'none';
        }

        this.showSearchInterface();
    },

    /**
     * Toggle advanced search panel
     */
    toggleAdvancedSearch: function() {
        const panel = document.getElementById('advancedSearchPanel');
        const toggle = document.getElementById('advancedSearchToggle');
        
        if (panel && toggle) {
            const isOpen = panel.classList.contains('active');
            
            if (isOpen) {
                panel.classList.remove('active');
                toggle.classList.remove('active');
            } else {
                panel.classList.add('active');
                toggle.classList.add('active');
            }
        }
    },

    /**
     * Setup advanced search functionality
     */
    setupAdvancedSearch: function() {
        // Service type checkboxes
        const serviceCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
        serviceCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', this.updateServiceTypeFilters.bind(this));
        });

        // Location inputs
        const locationFrom = document.getElementById('locationFrom');
        const locationTo = document.getElementById('locationTo');
        if (locationFrom) {
            locationFrom.addEventListener('input', this.updateLocationFilters.bind(this));
        }
        if (locationTo) {
            locationTo.addEventListener('input', this.updateLocationFilters.bind(this));
        }

        // Rating radio buttons
        const ratingRadios = document.querySelectorAll('input[name="rating"]');
        ratingRadios.forEach(radio => {
            radio.addEventListener('change', this.updateRatingFilter.bind(this));
        });
    },

    /**
     * Update service type filters
     */
    updateServiceTypeFilters: function() {
        const checkboxes = document.querySelectorAll('.filter-option input[type="checkbox"]:checked');
        this.state.filters.serviceTypes = Array.from(checkboxes).map(cb => cb.value);
    },

    /**
     * Update location filters
     */
    updateLocationFilters: function() {
        const locationFrom = document.getElementById('locationFrom');
        const locationTo = document.getElementById('locationTo');
        
        if (locationFrom) {
            this.state.filters.locationFrom = locationFrom.value.trim();
        }
        if (locationTo) {
            this.state.filters.locationTo = locationTo.value.trim();
        }
    },

    /**
     * Update rating filter
     */
    updateRatingFilter: function() {
        const selectedRating = document.querySelector('input[name="rating"]:checked');
        this.state.filters.rating = selectedRating ? parseInt(selectedRating.value) : null;
    },

    /**
     * Handle price range change
     */
    handlePriceRangeChange: function(e) {
        const value = e.target.value;
        this.state.filters.priceRange = parseInt(value);
        
        const priceValue = document.getElementById('priceValue');
        if (priceValue) {
            priceValue.textContent = `${value} ريال`;
        }
    },

    /**
     * Clear all filters
     */
    clearFilters: function() {
        // Reset checkboxes
        const checkboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);

        // Reset location inputs
        const locationFrom = document.getElementById('locationFrom');
        const locationTo = document.getElementById('locationTo');
        if (locationFrom) locationFrom.value = '';
        if (locationTo) locationTo.value = '';

        // Reset price range
        const priceRange = document.getElementById('priceRange');
        if (priceRange) {
            priceRange.value = 5000;
            this.state.filters.priceRange = 5000;
        }

        // Reset rating
        const ratingRadios = document.querySelectorAll('input[name="rating"]');
        ratingRadios.forEach(radio => radio.checked = false);

        // Reset state
        this.state.filters = {
            serviceTypes: [],
            locationFrom: '',
            locationTo: '',
            priceRange: 5000,
            rating: null
        };

        // Update price display
        const priceValue = document.getElementById('priceValue');
        if (priceValue) {
            priceValue.textContent = '5000 ريال';
        }
    },

    /**
     * Apply filters and search
     */
    applyFilters: function() {
        if (this.state.currentQuery) {
            this.performSearch(this.state.currentQuery);
        }
    },

    /**
     * Perform search
     */
    performSearch: function(query) {
        if (!query.trim()) return;

        this.state.currentQuery = query.trim();
        this.state.currentPage = 1;
        this.state.results = [];

        this.showLoading();
        this.saveToHistory(query);

        // Simulate API call
        setTimeout(() => {
            this.searchAPI(query, this.state.filters, this.state.currentPage)
                .then(results => {
                    this.state.results = results.items || [];
                    this.state.hasMore = results.hasMore || false;
                    this.renderResults();
                    this.hideLoading();
                })
                .catch(error => {
                    console.error('Search error:', error);
                    this.showNoResults();
                    this.hideLoading();
                });
        }, 1000);
    },

    /**
     * Mock search API
     */
    searchAPI: function(query, filters, page) {
        return new Promise((resolve) => {
            // Mock data based on query
            const mockResults = this.generateMockResults(query, filters, page);
            resolve(mockResults);
        });
    },

    /**
     * Generate mock search results
     */
    generateMockResults: function(query, filters, page) {
        const mockData = [
            {
                id: 1,
                name: 'شركة الشحن البحري المتقدمة',
                type: 'shipping',
                rating: 4.5,
                price: 2500,
                location: 'جدة',
                description: 'خدمات شحن بحري سريعة وآمنة',
                image: 'templates/pages/images/shipping.jpg',
                verified: true,
                topRated: true
            },
            {
                id: 2,
                name: 'مستودعات الأمان للتخزين',
                type: 'warehouse',
                rating: 4.2,
                price: 1800,
                location: 'الرياض',
                description: 'مستودعات آمنة ومؤمنة بالكامل',
                image: 'templates/pages/images/warehouse.jpg',
                verified: true,
                topRated: false
            },
            {
                id: 3,
                name: 'خدمات التخليص الجمركي السريع',
                type: 'customs',
                rating: 4.7,
                price: 3200,
                location: 'الدمام',
                description: 'تخليص جمركي سريع ومضمون',
                image: 'templates/pages/images/customs.jpg',
                verified: true,
                topRated: true
            }
        ];

        // Filter results based on query and filters
        let filteredResults = mockData.filter(item => {
            const matchesQuery = item.name.includes(query) || 
                               item.description.includes(query) ||
                               item.type.includes(query);
            
            const matchesServiceType = filters.serviceTypes.length === 0 || 
                                     filters.serviceTypes.includes(item.type);
            
            const matchesPrice = item.price <= filters.priceRange;
            
            const matchesRating = !filters.rating || item.rating >= filters.rating;

            return matchesQuery && matchesServiceType && matchesPrice && matchesRating;
        });

        return {
            items: filteredResults,
            hasMore: false,
            total: filteredResults.length
        };
    },

    /**
     * Render search results
     */
    renderResults: function() {
        const resultsContainer = document.getElementById('resultsContainer');
        const resultsCount = document.getElementById('resultsCount');
        const searchResults = document.getElementById('searchResults');
        const noResults = document.getElementById('noResults');

        if (!resultsContainer) return;

        if (this.state.results.length === 0) {
            this.showNoResults();
            return;
        }

        // Update results count
        if (resultsCount) {
            resultsCount.textContent = `${this.state.results.length} نتيجة`;
        }

        // Show results section
        if (searchResults) {
            searchResults.style.display = 'block';
        }
        if (noResults) {
            noResults.style.display = 'none';
        }

        // Render results
        const resultsHTML = this.state.results.map(result => this.renderResultItem(result)).join('');
        resultsContainer.innerHTML = resultsHTML;

        // Show/hide load more
        const loadMoreSection = document.getElementById('loadMoreSection');
        if (loadMoreSection) {
            loadMoreSection.style.display = this.state.hasMore ? 'block' : 'none';
        }
    },

    /**
     * Render individual result item
     */
    renderResultItem: function(item) {
        const stars = this.generateStars(item.rating);
        const badges = [];
        
        if (item.verified) badges.push('<span class="badge verified">موثق</span>');
        if (item.topRated) badges.push('<span class="badge top-rated">الأعلى تقييماً</span>');

        return `
            <div class="search-result-item" data-id="${item.id}">
                <div class="result-image">
                    <img src="${item.image}" alt="${item.name}">
                    ${badges.join('')}
                </div>
                <div class="result-content">
                    <h4 class="result-title">${item.name}</h4>
                    <p class="result-description">${item.description}</p>
                    <div class="result-meta">
                        <div class="result-rating">
                            ${stars}
                            <span class="rating-text">${item.rating}</span>
                        </div>
                        <div class="result-location">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${item.location}</span>
                        </div>
                        <div class="result-price">
                            <span class="price">${item.price} ريال</span>
                        </div>
                    </div>
                </div>
                <div class="result-actions">
                    <button class="btn btn-primary" onclick="SearchController.viewDetails(${item.id})">
                        عرض التفاصيل
                    </button>
                    <button class="btn btn-outline" onclick="SearchController.addToFavorites(${item.id})">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * Generate star rating HTML
     */
    generateStars: function(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let starsHTML = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }

        return starsHTML;
    },

    /**
     * Show no results state
     */
    showNoResults: function() {
        const searchResults = document.getElementById('searchResults');
        const noResults = document.getElementById('noResults');
        const searchInterface = document.querySelector('.search-interface');

        if (searchResults) searchResults.style.display = 'none';
        if (noResults) noResults.style.display = 'block';
        if (searchInterface) searchInterface.style.display = 'none';
    },

    /**
     * Show search interface
     */
    showSearchInterface: function() {
        const searchResults = document.getElementById('searchResults');
        const noResults = document.getElementById('noResults');
        const searchInterface = document.querySelector('.search-interface');

        if (searchResults) searchResults.style.display = 'none';
        if (noResults) noResults.style.display = 'none';
        if (searchInterface) searchInterface.style.display = 'block';
    },

    /**
     * Show loading state
     */
    showLoading: function() {
        const loading = document.getElementById('searchLoading');
        const searchInterface = document.querySelector('.search-interface');
        const searchResults = document.getElementById('searchResults');

        if (loading) loading.style.display = 'flex';
        if (searchInterface) searchInterface.style.display = 'none';
        if (searchResults) searchResults.style.display = 'none';
    },

    /**
     * Hide loading state
     */
    hideLoading: function() {
        const loading = document.getElementById('searchLoading');
        if (loading) loading.style.display = 'none';
    },

    /**
     * Handle sort change
     */
    handleSortChange: function(e) {
        const sortBy = e.target.value;
        this.sortResults(sortBy);
    },

    /**
     * Sort results
     */
    sortResults: function(sortBy) {
        switch (sortBy) {
            case 'price-low':
                this.state.results.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.state.results.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                this.state.results.sort((a, b) => b.rating - a.rating);
                break;
            case 'distance':
                // Mock distance sorting
                this.state.results.sort((a, b) => Math.random() - 0.5);
                break;
            default:
                // Relevance - keep original order
                break;
        }
        this.renderResults();
    },

    /**
     * Toggle view mode
     */
    toggleViewMode: function() {
        this.state.viewMode = this.state.viewMode === 'grid' ? 'list' : 'grid';
        const viewToggleBtn = document.getElementById('viewToggleBtn');
        const resultsContainer = document.getElementById('resultsContainer');
        
        if (viewToggleBtn) {
            const icon = viewToggleBtn.querySelector('i');
            if (icon) {
                icon.className = this.state.viewMode === 'grid' ? 'fas fa-th-large' : 'fas fa-list';
            }
        }
        
        if (resultsContainer) {
            resultsContainer.className = `results-container ${this.state.viewMode}-view`;
        }
    },

    /**
     * Load more results
     */
    loadMoreResults: function() {
        if (this.state.isLoading || !this.state.hasMore) return;

        this.state.currentPage++;
        this.state.isLoading = true;

        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>جاري التحميل...</span>';
            loadMoreBtn.disabled = true;
        }

        // Simulate API call
        setTimeout(() => {
            this.searchAPI(this.state.currentQuery, this.state.filters, this.state.currentPage)
                .then(results => {
                    this.state.results = [...this.state.results, ...(results.items || [])];
                    this.state.hasMore = results.hasMore || false;
                    this.renderResults();
                    this.state.isLoading = false;

                    if (loadMoreBtn) {
                        loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i><span>تحميل المزيد</span>';
                        loadMoreBtn.disabled = false;
                    }
                })
                .catch(error => {
                    console.error('Load more error:', error);
                    this.state.isLoading = false;
                    if (loadMoreBtn) {
                        loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i><span>تحميل المزيد</span>';
                        loadMoreBtn.disabled = false;
                    }
                });
        }, 1000);
    },

    /**
     * Save search to history
     */
    saveToHistory: function(query) {
        let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        
        // Remove if already exists
        history = history.filter(item => item !== query);
        
        // Add to beginning
        history.unshift(query);
        
        // Keep only last 10 searches
        history = history.slice(0, 10);
        
        localStorage.setItem('searchHistory', JSON.stringify(history));
        this.loadSearchHistory();
    },

    /**
     * Load search history
     */
    loadSearchHistory: function() {
        const historyItems = document.getElementById('historyItems');
        const searchHistory = document.getElementById('searchHistory');
        
        if (!historyItems) return;

        const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        
        if (history.length === 0) {
            if (searchHistory) {
                searchHistory.style.display = 'none';
            }
            return;
        }

        if (searchHistory) {
            searchHistory.style.display = 'block';
        }

        const historyHTML = history.map(item => `
            <div class="history-item" data-search="${item}">
                <i class="fas fa-history"></i>
                <span>${item}</span>
                <button class="remove-history-item" onclick="SearchController.removeHistoryItem('${item}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');

        historyItems.innerHTML = historyHTML;
    },

    /**
     * Remove history item
     */
    removeHistoryItem: function(item) {
        let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        history = history.filter(h => h !== item);
        localStorage.setItem('searchHistory', JSON.stringify(history));
        this.loadSearchHistory();
    },

    /**
     * Clear search history
     */
    clearSearchHistory: function() {
        localStorage.removeItem('searchHistory');
        this.loadSearchHistory();
    },

    /**
     * Load popular searches
     */
    loadPopularSearches: function() {
        // Popular searches are already in HTML
        // This method can be used to load from API if needed
    },

    /**
     * View item details
     */
    viewDetails: function(itemId) {
        // Navigate to service provider details page
        Router.navigate('service-providers');
    },

    /**
     * Add to favorites
     */
    addToFavorites: function(itemId) {
        // Add to favorites functionality
        Toast.show('تم الإضافة', 'تم إضافة العنصر إلى المفضلة', 'success');
    },

    /**
     * Destroy controller
     */
    destroy: function() {
        // Cleanup if needed
        clearTimeout(this.searchTimeout);
    }
}; 