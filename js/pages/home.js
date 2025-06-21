/**
 * Client Home page controller
 * Version: 5.1 (With Shipment Tracking)
 * Description: Manages carousel, modals, developer mode, and shipment tracking simulation.
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

        map: null,
        animationInterval: null,
        truckMarker: null,
        completedRouteLine: null,
          // --- Static Data ---
        SANA_COORDS: [15.3694, 44.1910],

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
        this.setupTrackingListeners(); // NEW: Initialize tracking listeners
        this.setupTrackingListeners();
    },

    /**
     * Sets up all event listeners for the page.
     */
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
    
    /**
     * NEW: Sets up listeners for the shipment tracking cards.
     */
    setupTrackingListeners: function() {
        const trackingList = document.getElementById('shipmentTrackingList');
        if (trackingList) {
            trackingList.addEventListener('click', (event) => {
                const card = event.target.closest('.chp-tracking-card');
                if (card) {
                    const lat = card.dataset.latitude;
                    const lon = card.dataset.longitude;
                    if (lat && lon) {
                        // Construct the Google Maps URL
                        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
                        // Open the URL in a new tab
                        window.open(mapsUrl, '_blank');
                    }
                }
            });
        }
    },

    /**
     * Handles navigation to the service request form.
     */
    navigateToRequestForm: function(button) {
        const page = 'clientServiceRequestForm';
        Router.navigate(page);
    },

    // --- MODAL VISIBILITY FUNCTIONS ---
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

    // --- CAROUSEL FUNCTIONS ---
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
            const closeButton = mapModal.querySelector('.chp-map-modal-close');
            const recenterButton = document.getElementById('recenterBtn');

            trackingList?.addEventListener('click', (e) => {
                const card = e.target.closest('.chp-tracking-card');
                if (card) this.initAndShowMap(card.dataset);
            });

            closeButton?.addEventListener('click', () => this.hideMap());
            recenterButton?.addEventListener('click', () => {
                if (this.map && this.truckMarker) {
                    this.map.flyTo(this.truckMarker.getLatLng(), 10);
                }
            });
        },

        initAndShowMap: function(data) {
            const mapModal = document.getElementById('trackingMapModal');
            mapModal.classList.add('chp-active');
            
            // Update modal details
            document.getElementById('mapShipmentId').textContent = `تتبع الشحنة ${data.shipmentId}`;
            document.getElementById('mapShipmentOrigin').textContent = `قادمة من: ${data.originName}`;
            
            if (this.map) this.map.remove();

            const origin = [parseFloat(data.originLat), parseFloat(data.originLon)];
            const destination = this.SANA_COORDS;
            
            // Initialize the map with dark theme
            const mapContainer = document.getElementById('map-container');
            mapContainer.classList.add('map-dark-theme');
            this.map = L.map('map-container').setView(origin, 6);

            // Add dark map tiles from CartoDB
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 19
            }).addTo(this.map);

            // Draw background route
            L.polyline([origin, destination], { color: '#555', weight: 4, opacity: 0.7, className: 'route-path-background' }).addTo(this.map);
            this.completedRouteLine = L.polyline([], { color: 'var(--primary-color)', weight: 4, opacity: 1, className: 'route-path-completed' }).addTo(this.map);

            // Add markers
            L.marker(destination).addTo(this.map).bindPopup("<b>الوجهة النهائية</b><br>صنعاء، اليمن");

            // Create custom truck icon
            const truckIcon = L.divIcon({
                html: '<i class="fas fa-truck"></i>',
                className: 'live-truck-icon',
                iconSize: [28, 28],
                iconAnchor: [14, 14]
            });
            
            this.truckMarker = L.marker(origin, {icon: truckIcon}).addTo(this.map);

            // Animate view to fit the route
            const routeBounds = L.latLngBounds(origin, destination);
            this.map.flyToBounds(routeBounds, { padding: [50, 50], duration: 1.5 });

            this.startTrackingAnimation(origin, destination);
        },

        startTrackingAnimation: function(origin, destination) {
            let step = 0;
            const totalSteps = 500;
            const tripDurationSeconds = 30; // 30-second simulation

            const etaElement = document.getElementById('mapShipmentETA');
            const statusElement = document.getElementById('mapShipmentStatus');
            const progressBar = document.getElementById('trackingProgressBar');
            
            this.completedRouteLine.setLatLngs([]);

            this.animationInterval = setInterval(() => {
                step++;
                const progress = step / totalSteps;
                
                // Update ETA
                const remainingSeconds = Math.round(tripDurationSeconds * (1 - progress));
                const mins = Math.floor(remainingSeconds / 60);
                const secs = remainingSeconds % 60;
                etaElement.textContent = `الوقت المقدر للوصول: ${mins}د ${secs}ث`;

                // Update Status
                if (progress < 0.1) statusElement.textContent = 'غادرت للتو';
                else if (progress < 0.9) statusElement.textContent = 'في الطريق';
                else statusElement.textContent = 'على وشك الوصول';

                // Calculate new position and update truck and completed route
                const lat = origin[0] + (destination[0] - origin[0]) * progress;
                const lng = origin[1] + (destination[1] - origin[1]) * progress;
                const newPos = [lat, lng];
                this.truckMarker.setLatLng(newPos);
                this.completedRouteLine.addLatLng(newPos);

                // Update progress bar
                progressBar.style.width = `${progress * 100}%`;
                
                // Calculate rotation angle
                const p1 = this.map.project(this.truckMarker.getLatLng());
                const p2 = this.map.project(destination);
                const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI) + 90;
                this.truckMarker.getElement().style.transform = `${this.truckMarker.getElement().style.transform.split(' rotate')[0]} rotate(${angle}deg)`;

                if (step >= totalSteps) {
                    clearInterval(this.animationInterval);
                    statusElement.textContent = 'تم التوصيل بنجاح';
                    etaElement.textContent = ' ';
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
        }
    };
