/**
         * =========================================================================
         * Ultra-Modern Service Providers Controller
         * Features: Smooth animations, Real-time search, Enhanced UX
         * =========================================================================
         */

        window.ServiceProvidersController = {
            // DOM Elements
            categoryTabsContainer: null,
            filterTogglesContainer: null,
            serviceListContainer: null,
            searchInput: null,
            clearSearchBtn: null,
            resultsCount: null,
            viewToggle: null,

            // State
            currentCategory: 'all',
            currentFilter: 'all',
            currentSearchTerm: '',
            currentView: 'grid', // 'grid' or 'list'
            isLoading: false,
            
            // Enhanced Data
                        serviceCategories: [
                            { id: 'shipping', title: 'شحن', icon: 'fa-ship', count: 2 },
                            { id: 'warehouses', title: 'تخزين', icon: 'fa-warehouse', count: 1 },
                            { id: 'customs', title: 'تخليص جمركي', icon: 'fa-clipboard-list', count: 1 },
                            { id: 'packaging', title: 'تغليف', icon: 'fa-box', count: 1 },
                            { id: 'last-mile', title: 'توصيل', icon: 'fa-truck', count: 0 },
                        ],

                        services: [
                            { 
                                id: 1, 
                                categoryId: 'shipping', 
                                name: 'شركة الشحن السريع', 
                                address: 'شارع تعز، صنعاء', 
                                image: 'https://www.macgregor.com/globalassets/picturepark/imported-assets/79976.jpg', 
                                isFavorite: true, 
                                isNew: true, 
                                rating: 4.8,
                                tags: ['موثوق', 'الأعلى تقييماً'],
                                description: 'خدمات شحن سريعة وموثوقة'
                            },
                            { 
                                id: 2, 
                                categoryId: 'shipping', 
                                name: 'البحرية للشحن الدولي', 
                                address: 'شارع الزبيري، صنعاء', 
                                image: 'https://images.unsplash.com/photo-1614909858311-37d404332a9c?q=80&w=400&auto=format&fit=crop', // Kept original as there's only one shipping image in slider
                                isFavorite: false, 
                                isNew: false, 
                                rating: 4.5,
                                tags: ['شحن بحري'],
                                description: 'شحن بحري دولي متخصص'
                            },
                            { 
                                id: 3, 
                                categoryId: 'warehouses', 
                                name: 'مستودعات الأمان', 
                                address: 'المنطقة الصناعية', 
                                image: 'https://www.extensiv.com/hubfs/Warehouse%20Workers-1.jpg', 
                                isFavorite: false, 
                                isNew: true, 
                                rating: 4.6,
                                tags: ['تخزين مبرد'],
                                description: 'تخزين آمن ومتطور'
                            },
                            { 
                                id: 4, 
                                categoryId: 'customs', 
                                name: 'المخلص الجمركي المعتمد', 
                                address: 'مكتب المطار', 
                                image: 'https://ultimatebunker.com/wp-content/uploads/2024/03/Custom-Shipping-Containers--1024x673.jpg', 
                                isFavorite: true, 
                                isNew: false, 
                                rating: 4.9,
                                tags: ['موثوق', 'شحن جوي'],
                                description: 'تخليص جمركي سريع ومعتمد'
                            },
                            { 
                                id: 5, 
                                categoryId: 'packaging', 
                                name: 'خبراء التغليف', 
                                address: 'حدة، صنعاء', 
                                image: 'https://images.unsplash.com/photo-1599303272633-5241e35f9929?q=80&w=400&auto=format&fit=crop', // Kept original as no packaging image in slider
                                isFavorite: false, 
                                isNew: false, 
                                rating: 4.3,
                                tags: ['احترافي'],
                                description: 'تغليف احترافي ومبتكر'
                            }
                        ],        /**
             * Enhanced initialization with animation
             */
            init: function() {
                console.log('🚀 Ultra-Modern Service Providers initialized');

                this.cacheElements();
                this.setupEventListeners();
                this.setupSearchEnhancements();
                this.renderCategories();
                this.setInitialState();
                this.renderServices();
                this.animateInitialLoad();
            },

            /**
             * Cache all DOM elements
             */
            cacheElements: function() {
                this.categoryTabsContainer = document.getElementById('serviceCategoryTabs');
                this.filterTogglesContainer = document.querySelector('.sv-filter-toggles');
                this.serviceListContainer = document.getElementById('serviceListContainer');
                this.searchInput = document.getElementById('serviceSearchInput');
                this.clearSearchBtn = document.getElementById('clearSearch');
                this.resultsCount = document.getElementById('resultsCount');
                this.viewToggle = document.getElementById('viewToggle');
            },

            /**
             * Enhanced event listeners with animations
             */
            setupEventListeners: function() {
                // Category tabs with smooth transitions
                this.categoryTabsContainer.addEventListener('click', (e) => {
                    const tab = e.target.closest('.sv-category-tab');
                    if (tab && !this.isLoading) {
                        this.currentCategory = tab.dataset.categoryId;
                        this.updateActiveTab(tab);
                        this.renderServices();
                        this.trackAnalytics('category_selected', this.currentCategory);
                    }
                });

                // Filter toggles with enhanced feedback
                this.filterTogglesContainer.addEventListener('click', (e) => {
                    const filterBtn = e.target.closest('.sv-filter-toggle');
                    if (filterBtn && !this.isLoading) {
                        this.currentFilter = filterBtn.dataset.filter;
                        this.updateActiveFilter(filterBtn);
                        this.renderServices();
                        this.trackAnalytics('filter_applied', this.currentFilter);
                    }
                });

                // Enhanced search with real-time feedback
                let searchTimeout;
                this.searchInput.addEventListener('input', (e) => {
                    const value = e.target.value;
                    this.toggleClearButton(value);
                    
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(() => {
                        this.currentSearchTerm = value.toLowerCase();
                        this.renderServices();
                        this.trackAnalytics('search_performed', this.currentSearchTerm);
                    }, 300);
                });

                // Clear search functionality
                this.clearSearchBtn.addEventListener('click', () => {
                    this.searchInput.value = '';
                    this.currentSearchTerm = '';
                    this.toggleClearButton('');
                    this.renderServices();
                });

                // View toggle functionality
                this.viewToggle.addEventListener('click', () => {
                    this.currentView = this.currentView === 'grid' ? 'list' : 'grid';
                    this.updateViewToggle();
                    this.renderServices();
                });

                // Floating action buttons
                document.addEventListener('click', (e) => {
                    if (e.target.closest('.sv-fab--filter')) {
                        this.showAdvancedFilters();
                    }
                    if (e.target.closest('.sv-fab--sort')) {
                        this.showSortOptions();
                    }
                });
            },

            /**
             * Enhanced search functionality
             */
            setupSearchEnhancements: function() {
                // Add search suggestions (placeholder for future enhancement)
                this.searchInput.addEventListener('focus', () => {
                    this.searchInput.parentElement.classList.add('focused');
                });

                this.searchInput.addEventListener('blur', () => {
                    this.searchInput.parentElement.classList.remove('focused');
                });
            },

            /**
             * Toggle clear search button visibility
             */
            toggleClearButton: function(value) {
                if (value.length > 0) {
                    this.clearSearchBtn.classList.add('show');
                } else {
                    this.clearSearchBtn.classList.remove('show');
                }
            },

            /**
             * Animate initial page load
             */
            animateInitialLoad: function() {
                const elements = document.querySelectorAll('.sv-header, .sv-controls-sticky-container');
                elements.forEach((el, index) => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(-20px)';
                    setTimeout(() => {
                        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            },

            /**
             * Set initial active states
             */
            setInitialState: function() {
                this.filterTogglesContainer.querySelector('[data-filter="all"]').classList.add('active');
            },

            /**
             * Enhanced category rendering with counts
             */
            renderCategories: function() {
                let tabsHtml = `
                    <button class="sv-category-tab active" data-category-id="all">
                        <i class="fas fa-th-large"></i> 
                        <span>الكل</span>
                        <small>(${this.services.length})</small>
                    </button>`;
                
                this.serviceCategories.forEach(category => {
                    const count = this.services.filter(s => s.categoryId === category.id).length;
                    tabsHtml += `
                        <button class="sv-category-tab" data-category-id="${category.id}">
                            <i class="fas ${category.icon}"></i> 
                            <span>${category.title}</span>
                            <small>(${count})</small>
                        </button>`;
                });
                
                this.categoryTabsContainer.innerHTML = tabsHtml;
            },

            /**
             * Enhanced service rendering with animations
             */
            renderServices: function() {
                if (this.isLoading) return;
                
                this.isLoading = true;
                this.showLoadingSkeleton();

                setTimeout(() => {
                    let filteredServices = this.getFilteredServices();
                    this.updateResultsCount(filteredServices.length);

                    if (filteredServices.length === 0) {
                        this.showEmptyState();
                    } else {
                        this.renderServiceCards(filteredServices);
                    }
                    
                    this.isLoading = false;
                    this.animateServiceCards();
                }, 300);
            },

            /**
             * Get filtered services based on current state
             */
            getFilteredServices: function() {
                let filtered = [...this.services];

                // Filter by category
                if (this.currentCategory !== 'all') {
                    filtered = filtered.filter(s => s.categoryId === this.currentCategory);
                }

                // Filter by search term
                if (this.currentSearchTerm) {
                    filtered = filtered.filter(s => 
                        s.name.toLowerCase().includes(this.currentSearchTerm) ||
                        s.address.toLowerCase().includes(this.currentSearchTerm) ||
                        s.description.toLowerCase().includes(this.currentSearchTerm)
                    );
                }

                // Apply main filter
                switch(this.currentFilter) {
                    case 'new':
                        filtered = filtered.filter(s => s.isNew);
                        break;
                    case 'favorite':
                        filtered = filtered.filter(s => s.isFavorite);
                        break;
                    case 'closest':
                        filtered.sort(() => Math.random() - 0.5);
                        break;
                }

                return filtered;
            },

            /**
             * Render service cards with enhanced layout
             */
            renderServiceCards: function(services) {
                const cardsHtml = services.map(service => this.createEnhancedServiceCard(service)).join('');
                this.serviceListContainer.innerHTML = cardsHtml;
                this.attachCardEventListeners();
            },

            /**
             * Create enhanced service card HTML
             */
            createEnhancedServiceCard: function(service) {
                const tagsHTML = service.tags.map(tag => {
                    let tagClass = '';
                    if (tag.toLowerCase().includes('verified')) tagClass = 'verified';
                    if (tag.toLowerCase().includes('top rated')) tagClass = 'top-rated';
                    return `<span class="sv-card__tag ${tagClass}">${tag}</span>`;
                }).join('');

                const stars = '★'.repeat(Math.floor(service.rating)) + '☆'.repeat(5 - Math.floor(service.rating));

                return `
                    <div class="sv-card" data-service-id="${service.id}">
                        <div class="sv-card__image-container">
                            <img src="${service.image}" alt="${service.name}" class="sv-card__image" loading="lazy">
                            <button class="sv-card__favorite-btn ${service.isFavorite ? 'favorited' : ''}" 
                                    data-service-id="${service.id}" aria-label="Toggle Favorite">
                                <i class="fas fa-heart"></i>
                            </button>
                            ${service.isNew ? '<div class="sv-card__new-badge">جديد</div>' : ''}
                        </div>
                        <div class="sv-card__content">
                            <h3 class="sv-card__title">${service.name}</h3>
                            <p class="sv-card__description">${service.description}</p>
                            <div class="sv-card__rating">
                                <span class="stars">${stars}</span>
                                <span class="rating-text">${service.rating}</span>
                            </div>
                            <p class="sv-card__address">
                                <i class="fas fa-map-marker-alt"></i> ${service.address}
                            </p>
                            <div class="sv-card__tags">
                                ${tagsHTML}
                            </div>
                        </div>
                    </div>`;
            },

            /**
             * Attach event listeners to service cards
             */
            attachCardEventListeners: function() {
                // Favorite button listeners
                this.serviceListContainer.querySelectorAll('.sv-card__favorite-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.toggleFavorite(e.currentTarget);
                    });
                });

                // Card click listeners
                this.serviceListContainer.querySelectorAll('.sv-card').forEach(card => {
                    card.addEventListener('click', (e) => {
                        if (!e.target.closest('.sv-card__favorite-btn')) {
                            this.openServiceDetails(card.dataset.serviceId);
                        }
                    });
                });
            },

            /**
             * Toggle favorite with animation
             */
            toggleFavorite: function(btn) {
                const serviceId = parseInt(btn.dataset.serviceId);
                const service = this.services.find(s => s.id === serviceId);
                
                if (service) {
                    service.isFavorite = !service.isFavorite;
                    btn.classList.toggle('favorited');
                    
                    // Analytics tracking
                    this.trackAnalytics('favorite_toggled', {
                        serviceId: serviceId,
                        isFavorite: service.isFavorite
                    });
                }
            },

            /**
             * Animate service cards on render
             */
            animateServiceCards: function() {
                const cards = this.serviceListContainer.querySelectorAll('.sv-card');
                cards.forEach((card, index) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            },

            /**
             * Update results count display
             */
            updateResultsCount: function(count) {
                const text = count === 0 ? 'لا توجد نتائج' : 
                            count === 1 ? 'نتيجة واحدة' : 
                            `${count} نتيجة`;
                this.resultsCount.textContent = text;
            },

            /**
             * Enhanced loading skeleton
             */
            showLoadingSkeleton: function() {
                const skeletonCount = 6;
                const skeletonHTML = Array(skeletonCount).fill().map(() => `
                    <div class="sv-card skeleton">
                        <div class="sv-card__image-container skeleton-image"></div>
                        <div class="sv-card__content">
                            <div class="skeleton-line skeleton-title"></div>
                            <div class="skeleton-line skeleton-text"></div>
                            <div class="skeleton-line skeleton-tags"></div>
                        </div>
                    </div>
                `).join('');
                
                this.serviceListContainer.innerHTML = skeletonHTML;
            },

            /**
             * Enhanced empty state
             */
            showEmptyState: function() {
                const suggestions = this.getSearchSuggestions();
                this.serviceListContainer.innerHTML = `
                    <div class="sv-empty-state">
                        <i class="fas fa-search-minus sv-empty-state__icon"></i>
                        <h3 class="sv-empty-state__title">لا توجد نتائج مطابقة</h3>
                        <p>حاول تغيير فئة الخدمة أو تعديل الفلاتر.</p>
                        ${suggestions.length > 0 ? `
                            <div class="sv-empty-state__suggestions">
                                <p>اقتراحات:</p>
                                ${suggestions.map(s => `<button class="sv-suggestion" onclick="ServiceProvidersController.applySuggestion('${s}')">${s}</button>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                `;
            },

            /**
             * Get search suggestions for empty state
             */
            getSearchSuggestions: function() {
                if (this.currentSearchTerm) {
                    return this.services
                        .filter(s => s.name.toLowerCase().includes(this.currentSearchTerm.substring(0, 2)))
                        .slice(0, 3)
                        .map(s => s.name);
                }
                return [];
            },

            /**
             * Update active tab with enhanced animation
             */
            updateActiveTab: function(activeTab) {
                const currentActive = this.categoryTabsContainer.querySelector('.active');
                if (currentActive) {
                    currentActive.classList.remove('active');
                }
                activeTab.classList.add('active');
            },

            /**
             * Update active filter with enhanced animation
             */
            updateActiveFilter: function(activeFilter) {
                const currentActive = this.filterTogglesContainer.querySelector('.active');
                if (currentActive) {
                    currentActive.classList.remove('active');
                }
                activeFilter.classList.add('active');
            },

            /**
             * Update view toggle button
             */
            updateViewToggle: function() {
                const icon = this.currentView === 'grid' ? 'fa-list' : 'fa-th-large';
                this.viewToggle.innerHTML = `<i class="fas ${icon}"></i>`;
                
                // Apply view class to container
                this.serviceListContainer.className = `sv-list-container sv-list-container--${this.currentView}`;
            },

            /**
             * Open service details (placeholder for future enhancement)
             */
            openServiceDetails: function(serviceId) {
                console.log('Opening service details for:', serviceId);
                // Future: Navigate to service details page or open modal
            },

            /**
             * Show advanced filters modal (placeholder)
             */
            showAdvancedFilters: function() {
                console.log('Show advanced filters');
                // Future: Open advanced filters modal
            },

            /**
             * Show sort options (placeholder)
             */
            showSortOptions: function() {
                console.log('Show sort options');
                // Future: Open sort options modal
            },

            /**
             * Apply search suggestion
             */
            applySuggestion: function(suggestion) {
                this.searchInput.value = suggestion;
                this.currentSearchTerm = suggestion.toLowerCase();
                this.toggleClearButton(suggestion);
                this.renderServices();
            },

            /**
             * Track analytics events (placeholder)
             */
            trackAnalytics: function(event, data) {
                console.log('Analytics:', event, data);
                // Future: Integrate with analytics service
            }
        };