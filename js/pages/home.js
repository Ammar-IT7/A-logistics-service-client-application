        /**
         * Client Home page controller
         */
        const ClientHomeController = {
            // Carousel properties
            carousel: null,
            slides: [],
            dotsContainer: null,
            currentIndex: 0,
            slideInterval: null,
            slideDuration: 5000, // 5 seconds per slide

            /**
             * Initialize the home page
             */
            init: function() {
                console.log('Client Home page initialized');
                
                this.carousel = document.getElementById('mainAdCarousel'); 
                if (this.carousel) {
                    this.slides = this.carousel.querySelectorAll('.chp-carousel-slide'); 
                    this.dotsContainer = document.getElementById('carouselDots'); 
                    this.setupCarousel();
                }
                
                this.setupEventListeners();
            },
            
            /**
             * Set up page-specific event listeners
             */
            setupEventListeners: function() {

                const prevButton = document.getElementById('prevSlide'); 
                const nextButton = document.getElementById('nextSlide'); 
                if (prevButton && nextButton) {
                    prevButton.addEventListener('click', () => this.changeSlide(-1));
                    nextButton.addEventListener('click', () => this.changeSlide(1));
                }
            },

            setupCarousel: function() {
                if (!this.slides || this.slides.length === 0) return;
                if (!this.dotsContainer) { // Ensure dotsContainer exists
                    console.warn('Carousel dots container not found.');
                    return;
                }
                this.dotsContainer.innerHTML = ''; // Clear existing dots

                this.slides.forEach((slide, index) => {
                    const dot = document.createElement('button');
                    dot.classList.add('chp-dot'); 
                    dot.setAttribute('aria-label', `اذهب إلى الشريحة ${index + 1}`); // Arabic label
                    dot.dataset.slideTo = index;
                    if (index === 0) dot.classList.add('chp-active'); 
                    dot.addEventListener('click', () => this.goToSlide(index));
                    this.dotsContainer.appendChild(dot);
                });

                this.showSlide(this.currentIndex);
                this.startSlideShow();

                this.carousel.addEventListener('mouseenter', () => this.stopSlideShow());
                this.carousel.addEventListener('mouseleave', () => this.startSlideShow());
                // Add focus/blur listeners for accessibility (pause on keyboard focus within carousel)
                this.carousel.addEventListener('focusin', () => this.stopSlideShow());
                this.carousel.addEventListener('focusout', () => this.startSlideShow());
            },

            showSlide: function(index) {
                if (!this.slides || this.slides.length === 0) return;
                this.slides.forEach((slide, i) => {
                    slide.classList.toggle('chp-active', i === index); 
                });
                
                if (this.dotsContainer) {
                    const dots = this.dotsContainer.querySelectorAll('.chp-dot'); 
                    dots.forEach((dot, i) => {
                        dot.classList.toggle('chp-active', i === index); 
                    });
                }
                this.currentIndex = index;
            },

            changeSlide: function(direction) {
                if (!this.slides || this.slides.length === 0) return;
                this.stopSlideShow(); 
                let newIndex = this.currentIndex + direction;
                if (newIndex < 0) {
                    newIndex = this.slides.length - 1;
                } else if (newIndex >= this.slides.length) {
                    newIndex = 0;
                }
                this.showSlide(newIndex);
                // Only restart slideshow if it wasn't manually stopped by focus/hover
                if (!this.carousel.matches(':hover') && !this.carousel.contains(document.activeElement)) {
                    this.startSlideShow();
                }
            },

            goToSlide: function(index) {
                if (!this.slides || this.slides.length === 0) return;
                this.stopSlideShow();
                this.showSlide(index);
                 if (!this.carousel.matches(':hover') && !this.carousel.contains(document.activeElement)) {
                    this.startSlideShow();
                }
            },

            startSlideShow: function() {
                this.stopSlideShow(); 
                if (this.slides.length > 1) { 
                    this.slideInterval = setInterval(() => {
                        this.changeSlide(1);
                    }, this.slideDuration);
                }
            },

            stopSlideShow: function() {
                clearInterval(this.slideInterval);
            },
        };
