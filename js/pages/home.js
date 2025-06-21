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

        /**
         * Sets up listeners for the shipment tracking cards and modal controls.
         */
        setupTrackingListeners: function() {
            const trackingList = document.getElementById('shipmentTrackingList');
            const mapModal = document.getElementById('trackingMapModal');
            const closeButton = mapModal?.querySelector('.chp-map-modal-close');
            const recenterButton = document.getElementById('recenterBtn');

            trackingList?.addEventListener('click', (e) => {
                const card = e.target.closest('.chp-tracking-card');
                if (card) {
                    // Stop any ongoing simulation before starting a new one
                    if(this.animationInterval) this.hideMap();
                    
                    // Use a short timeout to allow the previous map to fully close
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

        /**
         * Initializes the Leaflet map, displays the modal, and starts the simulation.
         * @param {DOMStringMap} data - The dataset from the clicked tracking card.
         */
        initAndShowMap: function(data) {
            const mapModal = document.getElementById('trackingMapModal');
            mapModal.classList.add('chp-active');
            
            // Update modal details from card data
            document.getElementById('mapShipmentId').textContent = `تتبع الشحنة ${data.shipmentId}`;
            document.getElementById('mapShipmentOrigin').textContent = `قادمة من: ${data.originName}`;
            
            // If a map instance exists, remove it before creating a new one.
            if (this.map) {
                this.map.remove();
                this.map = null;
            }

            const origin = [parseFloat(data.originLat), parseFloat(data.originLon)];
            const destination = this.SANA_COORDS;
            
            // Initialize the map with a dark theme tile layer
            this.map = L.map('map-container').setView(origin, 6);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 19
            }).addTo(this.map);

            // Draw background route (the full path)
            L.polyline([origin, destination], { color: 'rgba(128, 128, 128, 0.5)', weight: 5, dashArray: '10, 10' }).addTo(this.map);
            
            // Draw completed route (will be updated live)
            this.completedRouteLine = L.polyline([], { color: 'var(--primary-color)', weight: 5 }).addTo(this.map);

            // Add markers for origin and destination
            L.marker(origin).addTo(this.map).bindPopup(`<b>نقطة الانطلاق</b><br>${data.originName}`);
            L.marker(destination).addTo(this.map).bindPopup("<b>الوجهة النهائية</b><br>صنعاء، اليمن");

            // Create custom animated truck icon
            const truckIcon = L.divIcon({
                html: '<i class="fas fa-truck"></i>',
                className: 'live-truck-icon',
                iconSize: [28, 28],
                iconAnchor: [14, 14]
            });
            
            this.truckMarker = L.marker(origin, {icon: truckIcon}).addTo(this.map);
            this.previousLatLng = origin;

            // Animate view to fit the entire route
            const routeBounds = L.latLngBounds(origin, destination);
            this.map.flyToBounds(routeBounds, { padding: [50, 50], duration: 1.5 });

            this.startTrackingAnimation(origin, destination);
        },
        
        /**
         * Starts the interval timer to animate the truck marker across the map.
         * @param {number[]} origin - The [lat, lon] array for the starting point.
         * @param {number[]} destination - The [lat, lon] array for the end point.
         */
        startTrackingAnimation: function(origin, destination) {
            let step = 0;
            const totalSteps = 600; // More steps for smoother animation
            const tripDurationSeconds = 30; // 30-second simulation

            const etaElement = document.getElementById('mapShipmentETA');
            const statusElement = document.getElementById('mapShipmentStatus');
            const progressBar = document.getElementById('trackingProgressBar');
            
            // Reset UI elements for the new simulation
            this.completedRouteLine.setLatLngs([]);
            progressBar.style.width = '0%';
            statusElement.style.color = 'var(--success)';

            this.animationInterval = setInterval(() => {
                step++;
                // Use an ease-in-out function for more natural acceleration/deceleration
                const progress = 0.5 - 0.5 * Math.cos(Math.PI * (step / totalSteps));
                
                // --- Update UI Text ---
                const remainingSeconds = Math.round(tripDurationSeconds * (1 - progress));
                const mins = Math.floor(remainingSeconds / 60);
                const secs = remainingSeconds % 60;
                etaElement.textContent = `الوقت المقدر: ${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;

                if (progress < 0.1) statusElement.textContent = 'غادرت للتو';
                else if (progress < 0.95) statusElement.textContent = 'في الطريق';
                else statusElement.textContent = 'على وشك الوصول';

                // --- Update Map Elements ---
                const lat = origin[0] + (destination[0] - origin[0]) * progress;
                const lng = origin[1] + (destination[1] - origin[1]) * progress;
                const newPos = [lat, lng];
                
                this.truckMarker.setLatLng(newPos);
                this.completedRouteLine.addLatLng(newPos);
                progressBar.style.width = `${progress * 100}%`;

                // --- Calculate Rotation (IMPROVED) ---
                // Calculate angle between the previous point and the new point for accurate rotation
                const angle = this.calculateAngle(this.previousLatLng, newPos);
                const markerElement = this.truckMarker.getElement();
                if (markerElement) {
                    // Add 90 degrees offset because the icon faces up by default
                    markerElement.style.transform = `${markerElement.style.transform.split(' rotateZ')[0]} rotateZ(${angle + 90}deg)`;
                }
                this.previousLatLng = newPos;

                // --- End Condition ---
                if (step >= totalSteps) {
                    clearInterval(this.animationInterval);
                    this.animationInterval = null;
                    statusElement.textContent = 'تم التوصيل بنجاح!';
                    statusElement.style.color = '#1dd1a1'; // Brighter green for success
                    etaElement.textContent = '';
                    this.truckMarker.setLatLng(destination); // Snap to final destination
                    this.truckMarker.bindPopup("<b>الشحنة وصلت!</b>").openPopup();
                }
            }, (tripDurationSeconds * 1000) / totalSteps);
        },

        /**
         * Hides the map modal and cleans up the map instance and animation timer.
         */
        hideMap: function() {
            const mapModal = document.getElementById('trackingMapModal');
            mapModal.classList.remove('chp-active');

            clearInterval(this.animationInterval);
            this.animationInterval = null;

            if (this.map) {
                // Use a timeout to allow the modal's fade-out animation to complete before removing the map object
                setTimeout(() => {
                    this.map.remove();
                    this.map = null;
                }, 400);
            }
        },
        
        /**
         * Calculates the bearing angle between two geographical points.
         * @param {number[]} p1 - Origin [lat, lon]
         * @param {number[]} p2 - Destination [lat, lon]
         * @returns {number} - Angle in degrees.
         */
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