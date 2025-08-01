/**
 * Client Home page controller
 */
window.ClientHomePageController = {
    // --- PROPERTIES ---
    carousel: null,
    slides: [],
    dotsContainer: null,
    progressBar: null,
    currentIndex: 0,
    slideInterval: null,
    slideDuration: 5000,
    isUserLoggedIn: false,
    isDevMode: true,
    map: null,
    animationInterval: null,
    truckMarker: null,
    completedRouteLine: null,
    previousLatLng: null,
    SANA_COORDS: [15.3694, 44.1910],

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

    /**
     * Initializes the controller and all page components.
     * CORRECTED: Initializes all element properties BEFORE setting up listeners.
     */
    init: function() {
        // --- Initialize Element Properties First ---
        this.carousel = document.getElementById('mainAdCarousel');
        this.paymentModal = document.getElementById('paymentModal');
        this.slideDuration = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--slide-duration')) * 1000 || 5000;
        
        // --- Now Setup Features ---
        if (this.carousel) {
            this.slides = this.carousel.querySelectorAll('.chp-carousel-slide');
            this.dotsContainer = document.getElementById('carouselDots');
            this.progressBar = document.getElementById('carouselProgressBar');
            this.setupCarousel();
        }
        this.setupAllEventListeners();
        this.setupStatsGridTabs();
        this.setupFiltering();
        this.setupTrackingListeners();
    },

    setupAllEventListeners: function() {
        // --- Carousel Listeners ---
        // --- Carousel Listeners ---
        document.getElementById('prevSlide')?.addEventListener('click', () => this.changeSlide(-1));
        document.getElementById('nextSlide')?.addEventListener('click', () => this.changeSlide(1));
        this.carousel?.parentElement.addEventListener('mouseenter', () => this.stopSlideShow());
        this.carousel?.parentElement.addEventListener('mouseleave', () => this.startSlideShow());
        
        const carouselWrapper = this.carousel?.parentElement;
        if (carouselWrapper) {
            carouselWrapper.addEventListener('mouseenter', () => this.stopSlideShow());
            carouselWrapper.addEventListener('mouseleave', () => this.startSlideShow());
            carouselWrapper.addEventListener('focusin', () => this.stopSlideShow());
            carouselWrapper.addEventListener('focusout', () => this.startSlideShow());
        }

        // --- Service Request Logic is now handled globally by App.initServiceRequestHandler() ---

        // --- Profile Drawer Listeners ---
        const profileButton = document.querySelector('[data-action="profile"]');
        const profileDrawer = document.getElementById('clientProfileDrawer');
        if (profileButton && profileDrawer) {
            profileDrawer.querySelector('.cpd-drawer-close').addEventListener('click', () => this.hideProfileDrawer());
            profileButton.addEventListener('click', () => this.showProfileDrawer());
            profileDrawer.addEventListener('click', (e) => {
                if (e.target === profileDrawer) this.hideProfileDrawer();
            });
            
            // Add navigation listeners for drawer menu items
            const menuItems = profileDrawer.querySelectorAll('.cpd-nav-item[data-action="navigate"]');
            menuItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetPage = item.dataset.page;
                    this.hideProfileDrawer();
                    // Use the router to navigate to the target page
                    if (window.Router && window.Router.navigateTo) {
                        window.Router.navigateTo(targetPage);
                    } else {
                        // Fallback navigation
                        window.location.hash = `#${targetPage}`;
                    }
                });
            });
            
            // Add logout listener
            const logoutItem = profileDrawer.querySelector('.cpd-nav-item[data-action="logout"]');
            if (logoutItem) {
                logoutItem.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.hideProfileDrawer();
                    // Handle logout logic
                    if (window.Auth && window.Auth.logout) {
                        window.Auth.logout();
                    } else {
                        // Fallback logout
                        window.location.href = '#login';
                    }
                });
            }
        }

         // --- Payment Modal Listeners (for Deposit/Withdraw) ---
        // These are now guaranteed to be found.
        document.querySelector('.cpd-btn-deposit')?.addEventListener('click', () => this.showPaymentModal('deposit'));
        document.querySelector('.cpd-btn-withdraw')?.addEventListener('click', () => this.showPaymentModal('withdraw'));
        
        if (this.paymentModal) {
            this.paymentModal.querySelector('.ptm-close').addEventListener('click', () => this.hidePaymentModal());
            this.paymentModal.addEventListener('click', (e) => {
                if (e.target === this.paymentModal) this.hidePaymentModal();
            });
            this.paymentModal.querySelector('#ptmAmount').addEventListener('input', () => this.validateTransaction());
            this.paymentModal.querySelector('#ptmProceedBtn').addEventListener('click', () => this.processTransaction()); // This will now work.
        }
    },

    /**
     * Helper function to convert kebab-case strings to camelCase.
     * e.g., 'service-type' becomes 'serviceType'
     */
    toCamelCase: function(str) {
        return str.replace(/-([a-z])/g, g => g[1].toUpperCase());
    },

    /**
     * Sets up the filtering logic for all filter bars on the page.
     */
    setupFiltering: function() {
        const filterBars = document.querySelectorAll('.chp-filter-bar');

        filterBars.forEach(bar => {
            bar.addEventListener('click', (e) => {
                const chip = e.target.closest('.chp-filter-chip');
                if (!chip) return;

                const filterValue = chip.dataset.filter;
                bar.querySelector('.chp-filter-chip.active')?.classList.remove('active');
                chip.classList.add('active');
                
                const section = bar.closest('.chp-section-container');
                if (!section) return;

                if (section.dataset.sectionId === 'reports') {
                    const title = document.getElementById('reports-title');
                    if (title) {
                        if (filterValue === 'monthly') title.textContent = 'ملخص الإنفاق الشهري';
                        if (filterValue === 'quarterly') title.textContent = 'ملخص الإنفاق ربع السنوي';
                        if (filterValue === 'yearly') title.textContent = 'ملخص الإنفاق السنوي';
                    }
                    return;
                }

                const listContainer = section.querySelector('[data-filter-key]');
                if (!listContainer) return;
                
                const items = listContainer.querySelectorAll('.chp-filterable-item');
                const filterKey = this.toCamelCase(listContainer.dataset.filterKey);

                let visibleItemCount = 0;
                items.forEach(item => {
                    const itemCategory = item.dataset[filterKey];
                    if (filterValue === 'all' || itemCategory === filterValue) {
                        item.classList.remove('hidden');
                        visibleItemCount++;
                    } else {
                        item.classList.add('hidden');
                    }
                });

                // NEW: Handle empty state message
                const emptyStateEl = listContainer.querySelector('.chp-empty-state');
                if (emptyStateEl) {
                    emptyStateEl.style.display = (visibleItemCount === 0) ? 'block' : 'none';
                }
            });
        });
    },

    /**
     * Sets up interactive tabs for the statistics grid with smooth transitions.
     */
    setupStatsGridTabs: function() {
        const statsGrid = document.querySelector('.chp-stats-grid');
        const statCards = statsGrid?.querySelectorAll('.chp-stat-card');
        const contentSections = document.querySelectorAll('.chp-dynamic-content-wrapper > .chp-section-container');
    
        if (!statsGrid || !statCards || !contentSections.length) return;
    
        const showSection = (targetId) => {
            statCards.forEach(c => c.classList.remove('chp-highlight'));
            const targetCard = document.querySelector(`.chp-stat-card[data-section-target="${targetId}"]`);
            targetCard?.classList.add('chp-highlight');

            const currentActive = document.querySelector('.chp-active-section');
            const targetSection = document.querySelector(`.chp-section-container[data-section-id="${targetId}"]`);

            if (currentActive === targetSection) return;

            if (currentActive) {
                currentActive.classList.remove('chp-active-section');
            }
            
            // Use timeout to allow CSS fade-out transition to complete before setting display:none
            setTimeout(() => {
                contentSections.forEach(s => { s.style.display = 'none'; });

                if (targetSection) {
                    targetSection.style.display = 'block';
                    // A tiny delay to ensure display:block is rendered before adding the class for the fade-in animation
                    setTimeout(() => {
                        targetSection.classList.add('chp-active-section');
                    }, 10);
                }
            }, 150); // A delay shorter than the CSS transition
        };
    
        statCards.forEach(card => {
            card.addEventListener('click', () => {
                showSection(card.dataset.sectionTarget);
            });
        });
    
        // Initial setup
        const initialHighlightedCard = statsGrid.querySelector('.chp-stat-card.chp-highlight');
        const initialTarget = initialHighlightedCard?.dataset.sectionTarget || statCards[0]?.dataset.sectionTarget;
        if(initialTarget) {
            const initialSection = document.querySelector(`.chp-section-container[data-section-id="${initialTarget}"]`);
            if(initialSection) {
                initialSection.style.display = 'block';
                initialSection.classList.add('chp-active-section');
            }
        }
    },

    // Service request methods are now handled globally by App object
    setupCarousel: function() { 
        if (!this.slides || this.slides.length === 0) return; 
        this.dotsContainer.innerHTML = ''; 
        this.slides.forEach((_, index) => { 
            const dot = document.createElement('button'); 
            dot.classList.add('chp-dot'); 
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`); 
            dot.addEventListener('click', () => this.goToSlide(index)); 
            this.dotsContainer.appendChild(dot); 
        }); 
        this.showSlide(this.currentIndex); 
        this.startSlideShow(); 
    },
    showSlide: function(index) { 
        if (!this.slides || this.slides.length === 0) return; 
        this.carousel.style.transform = `translateX(${index * 100}%)`; 
        this.slides.forEach((slide, i) => { 
            slide.classList.toggle('chp-active', i === index); 
        }); 
        const dots = this.dotsContainer.querySelectorAll('.chp-dot'); 
        dots.forEach((dot, i) => { 
            dot.classList.toggle('chp-active', i === index); 
        }); 
        this.currentIndex = index; 
        if (this.progressBar) { 
            this.progressBar.classList.remove('is-animating'); 
            void this.progressBar.offsetWidth; 
            this.progressBar.classList.add('is-animating'); 
        } 
    },
    changeSlide: function(direction) { 
        this.stopSlideShow(); 
        let newIndex = this.currentIndex - direction; 
        if (newIndex < 0) { 
            newIndex = this.slides.length - 1; 
        } else if (newIndex >= this.slides.length) { 
            newIndex = 0; 
        } 
        this.showSlide(newIndex); 
        this.startSlideShow(); 
    },
    goToSlide: function(index) { 
        this.stopSlideShow(); 
        this.showSlide(index); 
        this.startSlideShow(); 
    },
    startSlideShow: function() { 
        const carouselWrapper = this.carousel?.parentElement; 
        if (carouselWrapper && (carouselWrapper.matches(':hover') || carouselWrapper.matches(':focus-within'))) { 
            return; 
        } 
        this.stopSlideShow(); 
        if (this.slides.length > 1) { 
            this.slideInterval = setInterval(() => { this.changeSlide(1); }, this.slideDuration); 
        } 
        if (this.progressBar) this.progressBar.style.animationPlayState = 'running'; 
    },
    stopSlideShow: function() { 
        clearInterval(this.slideInterval); 
        if (this.progressBar) this.progressBar.style.animationPlayState = 'paused'; 
    },
    setupTrackingListeners: function() {
        const trackingList = document.getElementById('shipmentTrackingList');
        const mapModal = document.getElementById('trackingMapModal');
        const closeButton = mapModal?.querySelector('.chp-map-modal-close');
        const recenterButton = document.getElementById('recenterBtn');

        trackingList?.addEventListener('click', (e) => {
            const card = e.target.closest('.chp-tracking-card');
            if (card) {
                if(this.animationInterval) this.hideMap();
                setTimeout(() => {
                    this.initAndShowMap(card.dataset);
                }, this.map ? 500 : 0);
            }
        });

        closeButton?.addEventListener('click', () => this.hideMap());
        recenterButton?.addEventListener('click', () => {
            if (this.map && this.truckMarker) {
                this.map.flyTo(this.truckMarker.getLatLng(), this.map.getZoom(), {
                    duration: 1
                });
            }
        });
    },
    initAndShowMap: function(data) {
        // This function requires the Leaflet library (L) to be loaded.
        if (typeof L === 'undefined') {
            console.error("Leaflet library is not loaded. Map cannot be initialized.");
            return;
        }
        const mapModal = document.getElementById('trackingMapModal');
        mapModal.classList.add('chp-active');
        document.getElementById('mapShipmentId').textContent = `تتبع الشحنة ${data.shipmentId}`;
        document.getElementById('mapShipmentOrigin').textContent = `قادمة من: ${data.originName}`;
        if (this.map) {
            this.map.remove();
            this.map = null;
        }
        const origin = [parseFloat(data.originLat), parseFloat(data.originLon)];
        const destination = this.SANA_COORDS;
        this.map = L.map('map-container').setView(origin, 6);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap contributors © CARTO',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(this.map);
        L.polyline([origin, destination], { color: 'rgba(128, 128, 128, 0.5)', weight: 5, dashArray: '10, 10' }).addTo(this.map);
        this.completedRouteLine = L.polyline([], { color: 'var(--primary-color)', weight: 5 }).addTo(this.map);
        L.marker(origin).addTo(this.map).bindPopup(`<b>نقطة الانطلاق</b><br>${data.originName}`);
        L.marker(destination).addTo(this.map).bindPopup("<b>الوجهة النهائية</b><br>صنعاء، اليمن");
        const truckIcon = L.divIcon({
            html: '<i class="fas fa-truck"></i>',
            className: 'live-truck-icon',
            iconSize: [28, 28],
            iconAnchor: [14, 14]
        });
        this.truckMarker = L.marker(origin, {icon: truckIcon}).addTo(this.map);
        this.previousLatLng = origin;
        const routeBounds = L.latLngBounds(origin, destination);
        this.map.flyToBounds(routeBounds, { padding: [50, 50], duration: 1.5 });
        this.startTrackingAnimation(origin, destination);
    },
    startTrackingAnimation: function(origin, destination) {
        let step = 0;
        const totalSteps = 600; 
        const tripDurationSeconds = 30;
        const etaElement = document.getElementById('mapShipmentETA');
        const statusElement = document.getElementById('mapShipmentStatus');
        const progressBar = document.getElementById('trackingProgressBar');
        this.completedRouteLine.setLatLngs([]);
        progressBar.style.width = '0%';
        statusElement.style.color = 'var(--success)';
        this.animationInterval = setInterval(() => {
            step++;
            const progress = 0.5 - 0.5 * Math.cos(Math.PI * (step / totalSteps));
            const remainingSeconds = Math.round(tripDurationSeconds * (1 - progress));
            const mins = Math.floor(remainingSeconds / 60);
            const secs = remainingSeconds % 60;
            etaElement.textContent = `الوقت المقدر: ${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
            if (progress < 0.1) statusElement.textContent = 'غادرت للتو';
            else if (progress < 0.95) statusElement.textContent = 'في الطريق';
            else statusElement.textContent = 'على وشك الوصول';
            const lat = origin[0] + (destination[0] - origin[0]) * progress;
            const lng = origin[1] + (destination[1] - origin[1]) * progress;
            const newPos = [lat, lng];
            this.truckMarker.setLatLng(newPos);
            this.completedRouteLine.addLatLng(newPos);
            progressBar.style.width = `${progress * 100}%`;
            const angle = this.calculateAngle(this.previousLatLng, newPos);
            const markerElement = this.truckMarker.getElement();
            if (markerElement) {
                markerElement.style.transform = `${markerElement.style.transform.split(' rotateZ')[0]} rotateZ(${angle + 90}deg)`;
            }
            this.previousLatLng = newPos;
            if (step >= totalSteps) {
                clearInterval(this.animationInterval);
                this.animationInterval = null;
                statusElement.textContent = 'تم التوصيل بنجاح!';
                statusElement.style.color = '#1dd1a1';
                etaElement.textContent = '';
                this.truckMarker.setLatLng(destination);
                this.truckMarker.bindPopup("<b>الشحنة وصلت!</b>").openPopup();
            }
        }, (tripDurationSeconds * 1000) / totalSteps);
    },
    hideMap: function() {
        const mapModal = document.getElementById('trackingMapModal');
        mapModal.classList.remove('chp-active');
        clearInterval(this.animationInterval);
        this.animationInterval = null;
        if (this.map) {
            setTimeout(() => {
                this.map.remove();
                this.map = null;
            }, 400);
        }
    },
    calculateAngle: function(p1, p2) {
        const lat1 = p1[0] * Math.PI / 180;
        const lon1 = p1[1] * Math.PI / 180;
        const lat2 = p2[0] * Math.PI / 180;
        const lon2 = p2[1] * Math.PI / 180;
        const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
        const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
        const bearing = Math.atan2(y, x) * 180 / Math.PI;
        return bearing;
    },

    showProfileDrawer: function() {
        const drawer = document.getElementById('clientProfileDrawer');
        if (drawer) {
            drawer.style.display = 'block';
            setTimeout(() => drawer.classList.add('cpd-active'), 10);
            const animatedItems = drawer.querySelectorAll('.cpd-profile-header, .cpd-balance-section, .cpd-profile-nav');
            animatedItems.forEach((item, index) => {
                item.classList.remove('cpd-item-animating');
                item.style.animationDelay = `${index * 100 + 50}ms`;
                setTimeout(() => item.classList.add('cpd-item-animating'), 20);
            });
        }
    },

    hideProfileDrawer: function() {
        const drawer = document.getElementById('clientProfileDrawer');
        if (drawer) {
            drawer.classList.remove('cpd-active');
            setTimeout(() => { drawer.style.display = 'none'; }, 400);
        }
    },

    showPaymentModal: function(type) {
        if (!this.paymentModal) return;
        this.currentTransactionType = type;
        this.paymentModal.querySelector('#ptmTitle').textContent = type === 'deposit' ? 'إيداع مبلغ' : 'سحب مبلغ';
        this.populateGateways();
        this.paymentModal.querySelector('#ptmAmount').value = '';
        this.selectedGateway = null;
        this.paymentModal.querySelectorAll('.ptm-step').forEach(step => step.classList.remove('active'));
        this.paymentModal.querySelector('#ptmStep1').classList.add('active');
        this.validateTransaction();
        this.paymentModal.classList.add('active');
    },

    hidePaymentModal: function() {
        this.paymentModal?.classList.remove('active');
    },

    populateGateways: function() {
        const grid = this.paymentModal.querySelector('.ptm-gateways-grid');
        grid.innerHTML = '';
        this.paymentGateways.forEach(gw => {
            const div = document.createElement('div');
            div.className = 'ptm-gateway';
            div.dataset.id = gw.id;
            div.innerHTML = `<img src="${gw.icon}" alt="${gw.name} logo"><div class="ptm-gateway-name">${gw.name}</div>`;
            div.addEventListener('click', () => {
                this.paymentModal.querySelectorAll('.ptm-gateway').forEach(el => el.classList.remove('selected'));
                div.classList.add('selected');
                this.selectedGateway = gw.id;
                this.validateTransaction();
            });
            grid.appendChild(div);
        });
    },

    validateTransaction: function() {
        const amount = parseFloat(this.paymentModal.querySelector('#ptmAmount').value);
        this.paymentModal.querySelector('#ptmProceedBtn').disabled = !(amount > 0 && this.selectedGateway);
    },

    processTransaction: function() {
        this.paymentModal.querySelector('#ptmStep1').classList.remove('active');
        this.paymentModal.querySelector('#ptmStep2').classList.add('active');
        setTimeout(() => {
            const amount = parseFloat(this.paymentModal.querySelector('#ptmAmount').value);
            this.updateBalance(amount, this.currentTransactionType);
            const successMessageEl = this.paymentModal.querySelector('#ptmSuccessMessage');
            const actionText = this.currentTransactionType === 'deposit' ? 'إيداع' : 'سحب';
            successMessageEl.textContent = `تم ${actionText} مبلغ ${amount.toFixed(2)} ر.ي بنجاح.`;
            this.paymentModal.querySelector('#ptmStep2').classList.remove('active');
            this.paymentModal.querySelector('#ptmStep3').classList.add('active');
            setTimeout(() => this.hidePaymentModal(), 2500);
        }, 2500);
    },

    updateBalance: function(amount, type) {
        const balanceEl = document.querySelector('.cpd-balance-amount span');
        if (!balanceEl) return;
        let currentBalance = parseFloat(balanceEl.textContent.replace(/,/g, ''));
        const newBalance = type === 'deposit' ? currentBalance + amount : currentBalance - amount;
        balanceEl.innerHTML = `${newBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <small>ر.ي</small>`;
        const balanceCard = document.querySelector('.cpd-balance-amount');
        balanceCard.classList.add('balance-pop');
        balanceCard.addEventListener('animationend', () => balanceCard.classList.remove('balance-pop'), { once: true });
    },

};