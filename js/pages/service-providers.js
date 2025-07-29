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
            
            // Payment Modal Properties
            paymentModal: null,
            currentTransactionType: 'deposit',
            selectedGateway: null,
            paymentGateways: [
                { id: 'kuraimi', name: 'الكريمي', icon: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/KuraimiBank.png' },
                { id: 'jeeb', name: 'جيب', icon: 'https://scontent.fmct5-1.fna.fbcdn.net/v/t39.30808-6/347589312_6530726350324142_5191902965427443108_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=JmsvG7hcXLYQ7kNvwGNAuhP&_nc_oc=AdmfaEstIcveDExeQpetIoe-zfDDUKp4seZF33c8J75z5lO0ajvYXYWjE1w4O6s4Ygs&_nc_zt=23&_nc_ht=scontent.fmct5-1.fna&_nc_gid=6NXCtwqDO6L8pU8T6JsmmA&oh=00_AfMKrxmvqMap_qoIUvlkuf4G_noiiXAxY_CmPRkQzdNTvw&oe=68619C1A' },
                { id: 'jawali', name: 'جوالي', icon: 'https://yemeneco.org/wp-content/uploads/2024/04/jawali.png' },
                { id: 'bank', name: 'حساب بنكي', icon: 'https://cdn-icons-png.freepik.com/512/8634/8634075.png' },
                { id: 'mastercard', name: 'Mastercard', icon: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png' },
                { id: 'paypal', name: 'PayPal', icon: 'https://pngimg.com/uploads/paypal/paypal_PNG7.png' },
            ],

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
                                name: 'شاحنة نقل كبيرة', 
                                address: 'شارع تعز، صنعاء', 
                                image: 'https://toptrans.elementar.ge/wp-content/uploads/2024/07/0ee481_866fc8e7da804a19b687138c95b52f60mv2.webp', 
                                isFavorite: true, 
                                isNew: true, 
                                rating: 4.8,
                                tags: ['بري', 'حمولة 20 طن', 'تتبع GPS'],
                                description: 'شاحنة نقل كبيرة متاحة للنقل البري بحمولة تصل إلى 20 طن.'
                            },
                            { 
                                id: 2, 
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
                                id: 3, 
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

                // Drawer functionality
                this.setupDrawerEventListeners();
            },

            /**
             * Setup drawer event listeners
             */
            setupDrawerEventListeners: function() {
                // Hamburger menu button
                const menuButton = document.querySelector('.sv-header__menu');
                if (menuButton) {
                    menuButton.addEventListener('click', () => this.showDrawer());
                }

                // Drawer close button
                const drawerCloseBtn = document.querySelector('.spd-drawer-close');
                if (drawerCloseBtn) {
                    drawerCloseBtn.addEventListener('click', () => this.hideDrawer());
                }

                // Drawer overlay click to close
                const drawerOverlay = document.getElementById('serviceProvidersDrawer');
                if (drawerOverlay) {
                    drawerOverlay.addEventListener('click', (e) => {
                        if (e.target === drawerOverlay) this.hideDrawer();
                    });
                }

                // Payment buttons in drawer
                const depositBtn = document.querySelector('.spd-btn-deposit');
                const withdrawBtn = document.querySelector('.spd-btn-withdraw');
                if (depositBtn) {
                    depositBtn.addEventListener('click', () => this.showPaymentModal('deposit'));
                }
                if (withdrawBtn) {
                    withdrawBtn.addEventListener('click', () => this.showPaymentModal('withdraw'));
                }

                // Payment modal functionality
                const paymentModal = document.getElementById('spPaymentModal');
                if (paymentModal) {
                    const closeBtn = paymentModal.querySelector('.sptm-close');
                    const proceedBtn = paymentModal.querySelector('#sptmProceedBtn');
                    const amountInput = paymentModal.querySelector('#sptmAmount');

                    if (closeBtn) {
                        closeBtn.addEventListener('click', () => this.hidePaymentModal());
                    }

                    if (proceedBtn) {
                        proceedBtn.addEventListener('click', () => this.processTransaction());
                    }

                    if (amountInput) {
                        amountInput.addEventListener('input', () => this.validateTransaction());
                    }

                    paymentModal.addEventListener('click', (e) => {
                        if (e.target === paymentModal) this.hidePaymentModal();
                    });
                }

                // Navigation items in drawer
                const navItems = document.querySelectorAll('.spd-nav-item[data-action="navigate"]');
                navItems.forEach(item => {
                    item.addEventListener('click', (e) => {
                        e.preventDefault();
                        const targetPage = item.dataset.page;
                        this.hideDrawer();
                        // Use the router to navigate to the target page
                        if (window.Router && window.Router.navigateTo) {
                            window.Router.navigateTo(targetPage);
                        } else {
                            // Fallback navigation
                            window.location.hash = `#${targetPage}`;
                        }
                    });
                });

                // Logout functionality
                const logoutItem = document.querySelector('.spd-nav-item[data-action="logout"]');
                if (logoutItem) {
                    logoutItem.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.hideDrawer();
                        // Handle logout logic
                        if (window.Auth && window.Auth.logout) {
                            window.Auth.logout();
                        } else {
                            // Fallback logout
                            window.location.href = '#login';
                        }
                    });
                }
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
                
                const pageMap = {
                    'customs': 'customs-details',
                    'shipping': 'vehicle-details',
                    'warehouses': 'warehouse-details'
                };
                const page = pageMap[service.categoryId] || service.categoryId;
                const navigationAttrs = `data-action="navigate" data-page="${page}"`;

                return `
                    <div class="sv-card" data-service-id="${service.id}" ${navigationAttrs}>
                        <div class="sv-card__image-container" ${navigationAttrs}>
                            <img src="${service.image}" alt="${service.name}" class="sv-card__image" loading="lazy" ${navigationAttrs}>
                            <button class="sv-card__favorite-btn ${service.isFavorite ? 'favorited' : ''}" 
                                    data-service-id="${service.id}" aria-label="Toggle Favorite">
                                <i class="fas fa-heart"></i>
                            </button>
                            ${service.isNew ? '<div class="sv-card__new-badge">جديد</div>' : ''}
                        </div>
                        <div class="sv-card__content" ${navigationAttrs}>
                            <h3 class="sv-card__title" ${navigationAttrs}>${service.name}</h3>
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
            },

            /**
             * Show service providers drawer
             */
            showDrawer: function() {
                const drawer = document.getElementById('serviceProvidersDrawer');
                if (drawer) {
                    drawer.style.display = 'block';
                    setTimeout(() => drawer.classList.add('spd-active'), 10);
                    const animatedItems = drawer.querySelectorAll('.spd-profile-header, .spd-balance-section, .spd-profile-nav');
                    animatedItems.forEach((item, index) => {
                        item.classList.remove('spd-item-animating');
                        item.style.animationDelay = `${index * 100 + 50}ms`;
                        setTimeout(() => item.classList.add('spd-item-animating'), 20);
                    });
                }
            },

            /**
             * Hide service providers drawer
             */
            hideDrawer: function() {
                const drawer = document.getElementById('serviceProvidersDrawer');
                if (drawer) {
                    drawer.classList.remove('spd-active');
                    setTimeout(() => { drawer.style.display = 'none'; }, 400);
                }
            },

            /**
             * Show payment modal for service providers
             */
            showPaymentModal: function(type) {
                this.paymentModal = document.getElementById('spPaymentModal');
                if (!this.paymentModal) return;
                this.currentTransactionType = type;
                this.paymentModal.querySelector('#sptmTitle').textContent = type === 'deposit' ? 'إيداع مبلغ' : 'سحب مبلغ';
                this.populateGateways();
                this.paymentModal.querySelector('#sptmAmount').value = '';
                this.selectedGateway = null;
                this.paymentModal.querySelectorAll('.sptm-step').forEach(step => step.classList.remove('active'));
                this.paymentModal.querySelector('#sptmStep1').classList.add('active');
                this.validateTransaction();
                this.paymentModal.classList.add('active');
            },

            /**
             * Hide payment modal
             */
            hidePaymentModal: function() {
                this.paymentModal?.classList.remove('active');
            },

            /**
             * Populate payment gateways
             */
            populateGateways: function() {
                const grid = this.paymentModal.querySelector('.sptm-gateways-grid');
                grid.innerHTML = '';
                this.paymentGateways.forEach(gw => {
                    const div = document.createElement('div');
                    div.className = 'sptm-gateway';
                    div.dataset.id = gw.id;
                    div.innerHTML = `<img src="${gw.icon}" alt="${gw.name} logo"><div class="sptm-gateway-name">${gw.name}</div>`;
                    div.addEventListener('click', () => {
                        this.paymentModal.querySelectorAll('.sptm-gateway').forEach(el => el.classList.remove('selected'));
                        div.classList.add('selected');
                        this.selectedGateway = gw.id;
                        this.validateTransaction();
                    });
                    grid.appendChild(div);
                });
            },

            /**
             * Validate transaction
             */
            validateTransaction: function() {
                const amount = parseFloat(this.paymentModal.querySelector('#sptmAmount').value);
                this.paymentModal.querySelector('#sptmProceedBtn').disabled = !(amount > 0 && this.selectedGateway);
            },

            /**
             * Process transaction
             */
            processTransaction: function() {
                this.paymentModal.querySelector('#sptmStep1').classList.remove('active');
                this.paymentModal.querySelector('#sptmStep2').classList.add('active');
                setTimeout(() => {
                    const amount = parseFloat(this.paymentModal.querySelector('#sptmAmount').value);
                    this.updateBalance(amount, this.currentTransactionType);
                    const successMessageEl = this.paymentModal.querySelector('#sptmSuccessMessage');
                    const actionText = this.currentTransactionType === 'deposit' ? 'إيداع' : 'سحب';
                    successMessageEl.textContent = `تم ${actionText} مبلغ ${amount.toFixed(2)} ر.ي بنجاح.`;
                    this.paymentModal.querySelector('#sptmStep2').classList.remove('active');
                    this.paymentModal.querySelector('#sptmStep3').classList.add('active');
                    setTimeout(() => this.hidePaymentModal(), 2500);
                }, 2500);
            },

            /**
             * Update balance
             */
            updateBalance: function(amount, type) {
                const balanceEl = document.querySelector('.spd-balance-amount span');
                if (!balanceEl) return;
                let currentBalance = parseFloat(balanceEl.textContent.replace(/,/g, ''));
                const newBalance = type === 'deposit' ? currentBalance + amount : currentBalance - amount;
                balanceEl.innerHTML = `${newBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <small>ر.ي</small>`;
                const balanceCard = document.querySelector('.spd-balance-amount');
                balanceCard.classList.add('balance-pop');
                balanceCard.addEventListener('animationend', () => balanceCard.classList.remove('balance-pop'), { once: true });
            }
        };