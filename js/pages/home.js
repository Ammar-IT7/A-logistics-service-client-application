/**
 * Client Home page controller
 * Version: 5.0 (Arabic Dev Mode)
 * Description: Manages the carousel, subscription modal, and includes a 
 * Developer Mode in Arabic for testing user flows.
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
    // This would be determined by a real authentication system (e.g., checking a token).
    isUserLoggedIn: false, 

    // --- DEVELOPER MODE FLAG ---
    // Set to `true` to enable the developer testing modal.
    // Set to `false` for the normal app behavior for end-users.
    isDevMode: true,

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
    },

    /**
     * Sets up all event listeners for the page, including the logic for developer mode.
     */
    setupAllEventListeners: function() {
        // --- Carousel Listeners (No changes needed) ---
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

        // --- Event listeners for all "Request Service" buttons ---
        const requestServiceButtons = document.querySelectorAll(
            '.chp-fab-request-service, [data-action="show-modal"][data-page="request-service"], [data-action="navigate"][data-page="clientServiceRequestForm"]'
        );

        requestServiceButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault(); // Always prevent the default link/button action

                // If Developer Mode is active, show the testing modal first.
                if (this.isDevMode) {
                    this.showDevTestModal();
                    return; // Stop here to let the developer choose the scenario
                }

                // If not in dev mode, proceed with normal user logic.
                if (!this.isUserLoggedIn) {
                    this.showLoginModal();
                } else {
                    this.navigateToRequestForm(button);
                }
            });
        });

        // --- Event listeners for the Subscription Modal (for guests) ---
        const subscriptionModal = document.getElementById('subscriptionModal');
        if (subscriptionModal) {
            subscriptionModal.querySelector('.chp-modal-close').addEventListener('click', () => this.hideLoginModal());
            subscriptionModal.addEventListener('click', (e) => { 
                if (e.target === subscriptionModal) this.hideLoginModal(); 
            });
        }
        
        // --- Event listeners for the Developer Testing Modal ---
        const devTestModal = document.getElementById('devTestModal');
        if (devTestModal) {
            devTestModal.querySelector('.chp-modal-close').addEventListener('click', () => this.hideDevTestModal());
            
            // Handle "Simulate Subscribed" click
            devTestModal.querySelector('[data-dev-action="subscribed"]').addEventListener('click', () => {
                this.hideDevTestModal();
                const originalButton = document.querySelector('.chp-fab-request-service [data-page]');
                this.navigateToRequestForm(originalButton);
            });

            // Handle "Simulate Guest" click
            devTestModal.querySelector('[data-dev-action="guest"]').addEventListener('click', () => {
                this.hideDevTestModal();
                this.showLoginModal();
            });
        }
    },

    /**
     * Handles the logic for navigating to the service request form page using Router.
     * @param {HTMLElement} button - The button that triggered the action.
     */
    navigateToRequestForm: function(button) {
        // Find the element with data-action and data-page if not directly on the button
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
};

