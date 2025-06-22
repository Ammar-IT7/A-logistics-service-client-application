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
    slideDuration: parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--slide-duration')) * 1000 || 5000,
    
    // --- CORE LOGIC FLAGS ---
    isUserLoggedIn: false, 

    // --- DEVELOPER MODE FLAG ---
    isDevMode: true,

    // --- MAP & ANIMATION PROPERTIES ---
    map: null,
    animationInterval: null,
    truckMarker: null,
    completedRouteLine: null,
    previousLatLng: null,

    // --- STATIC DATA ---
    SANA_COORDS: [15.3694, 44.1910], // Destination: Sana'a, Yemen


    /**
     * Initializes the controller and all page components.
     */
    init: function() {
        this.carousel = document.getElementById('mainAdCarousel');
        if (this.carousel) {
            this.slides = this.carousel.querySelectorAll('.chp-carousel-slide');
            this.dotsContainer = document.getElementById('carouselDots');
            this.progressBar = document.getElementById('carouselProgressBar');
            this.setupCarousel();
        }
        this.setupAllEventListeners();
        this.setupStatsGridTabs(); 
        this.setupFiltering(); // MODIFIED: Initialize the new filtering feature
        this.setupTrackingListeners();
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


    // --- ALL OTHER FUNCTIONS (setupAllEventListeners, navigateToRequestForm, modals, carousel, map logic) remain the same ---
    // ... (rest of the JS code from the previous response)
    setupAllEventListeners: function() {
        // --- Carousel Listeners ---
        const prevButton = document.getElementById('prevSlide');
        const nextButton = document.getElementById('nextSlide');
        if (prevButton && nextButton) {
            prevButton.addEventListener('click', () => this.changeSlide(-1));
            nextButton.addEventListener('click', () => this.changeSlide(1));
        }
        const carouselWrapper = this.carousel?.parentElement;
        if (carouselWrapper) {
            carouselWrapper.addEventListener('mouseenter', () => this.stopSlideShow());
            carouselWrapper.addEventListener('mouseleave', () => this.startSlideShow());
            carouselWrapper.addEventListener('focusin', () => this.stopSlideShow());
            carouselWrapper.addEventListener('focusout', () => this.startSlideShow());
        }

        // --- Request Service Buttons Listeners ---
        const requestServiceButtons = document.querySelectorAll(
            '.chp-fab-request-service, [data-action="show-modal"][data-page="request-service"], [data-action="navigate"][data-page="clientServiceRequestForm"]'
        );
        requestServiceButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.isDevMode) {
                    this.showDevTestModal();
                    return;
                }
                if (!this.isUserLoggedIn) {
                    this.showLoginModal();
                } else {
                    this.navigateToRequestForm(button);
                }
            });
        });

        // --- Subscription Modal Listeners ---
        const subscriptionModal = document.getElementById('subscriptionModal');
        if (subscriptionModal) {
            subscriptionModal.querySelector('.chp-modal-close').addEventListener('click', () => this.hideLoginModal());
            subscriptionModal.addEventListener('click', (e) => { 
                if (e.target === subscriptionModal) this.hideLoginModal(); 
            });
        }
        
        // --- Developer Testing Modal Listeners ---
        const devTestModal = document.getElementById('devTestModal');
        if (devTestModal) {
            devTestModal.querySelector('.chp-modal-close').addEventListener('click', () => this.hideDevTestModal());
            devTestModal.querySelector('[data-dev-action="subscribed"]').addEventListener('click', () => {
                this.hideDevTestModal();
                const originalButton = document.querySelector('.chp-fab-request-service [data-page]');
                this.navigateToRequestForm(originalButton);
            });
            devTestModal.querySelector('[data-dev-action="guest"]').addEventListener('click', () => {
                this.hideDevTestModal();
                this.showLoginModal();
            });
        }
    },
    navigateToRequestForm: function(button) {
        const page = 'clientServiceRequestForm';
        // Assuming you have a Router object
        // Router.navigate(page);
        console.log(`Navigating to: ${page}`);
    },
    showLoginModal: function() {
        const modal = document.getElementById('subscriptionModal');
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('chp-active'), 10);
        }
    },
    hideLoginModal: function() {
        const modal = document.getElementById('subscriptionModal');
        if (modal) {
            modal.classList.remove('chp-active');
            setTimeout(() => { modal.style.display = 'none'; }, 300);
        }
    },
    showDevTestModal: function() {
        const modal = document.getElementById('devTestModal');
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('chp-active'), 10);
        }
    },
    hideDevTestModal: function() {
        const modal = document.getElementById('devTestModal');
        if (modal) {
            modal.classList.remove('chp-active');
            setTimeout(() => { modal.style.display = 'none'; }, 300);
        }
    },
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
    }
};