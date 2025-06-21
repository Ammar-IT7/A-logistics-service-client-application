        // Enhanced Carousel Implementation
        const Auth = {
            config: {
                templatesPath: 'templates/pages/',
                defaultPage: 'login'
            },

            init: function() {
                this.authContainer = document.getElementById('app-container');
                this.setupEventListeners();
                this.initFeaturesCarousel();
                this.setupMultiStepForm();
            },

            initFeaturesCarousel: function() {
                const carousel = document.getElementById('featuresCarousel');
                const dotsContainer = document.getElementById('carouselDots');
                if (!carousel || !dotsContainer) return;

                const slides = Array.from(carousel.children);
                let currentSlide = 0;
                let slideInterval;
                let isTransitioning = false;

                // Create dots with enhanced styling
                slides.forEach((_, i) => {
                    const dot = document.createElement('div');
                    dot.classList.add('carousel-dot');
                    if (i === 0) dot.classList.add('active');
                    dot.addEventListener('click', () => goToSlide(i));
                    dotsContainer.appendChild(dot);
                });
                const dots = Array.from(dotsContainer.children);

                // Initialize first slide as active
                if (slides[0]) slides[0].classList.add('is-active');

                function updateSlideStates() {
                    slides.forEach((slide, index) => {
                        slide.classList.toggle('is-active', index === currentSlide);
                    });
                    dots.forEach((dot, index) => {
                        dot.classList.toggle('active', index === currentSlide);
                    });
                }

                function goToSlide(index) {
                    if (isTransitioning || index === currentSlide) return;
                    
                    isTransitioning = true;
                    currentSlide = index;
                    
                    // Smooth transform animation
                    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
                    
                    updateSlideStates();
                    resetInterval();
                    
                    setTimeout(() => {
                        isTransitioning = false;
                    }, 600);
                }

                function nextSlide() {
                    const nextIndex = (currentSlide + 1) % slides.length;
                    goToSlide(nextIndex);
                }
                
                function startInterval() { 
                    slideInterval = setInterval(nextSlide, 5000); 
                }
                
                function resetInterval() { 
                    clearInterval(slideInterval); 
                    startInterval(); 
                }

                // Touch/swipe support
                let startX = 0;
                let currentX = 0;
                let isDragging = false;

                carousel.addEventListener('touchstart', (e) => {
                    startX = e.touches[0].clientX;
                    isDragging = true;
                    clearInterval(slideInterval);
                }, { passive: true });

                carousel.addEventListener('touchmove', (e) => {
                    if (!isDragging) return;
                    currentX = e.touches[0].clientX;
                }, { passive: true });

                carousel.addEventListener('touchend', () => {
                    if (!isDragging) return;
                    isDragging = false;
                    
                    const diffX = startX - currentX;
                    const threshold = 50;
                    
                    if (Math.abs(diffX) > threshold) {
                        if (diffX > 0 && currentSlide < slides.length - 1) {
                            goToSlide(currentSlide + 1);
                        } else if (diffX < 0 && currentSlide > 0) {
                            goToSlide(currentSlide - 1);
                        }
                    }
                    
                    startInterval();
                }, { passive: true });

                // Pause on hover
                carousel.addEventListener('mouseenter', () => clearInterval(slideInterval));
                carousel.addEventListener('mouseleave', startInterval);

                startInterval();
            },

            setupEventListeners: function() {
                document.addEventListener('click', function(e) {
                    const passwordToggle = e.target.closest('.auth-screen-password-toggle');
                    const action = e.target.dataset.action;
                    
                    if (action) {
                        switch (action) {
                            case 'show-login':
                                Auth.loadPage('login');
                                break;
                            case 'show-register':
                                Auth.loadPage('register');
                                break;
                            case 'login':
                                Auth.handleLogin();
                                break;
                            case 'skip-login':
                                Auth.handleLogin();
                                break;
                            case 'phone-login':
                                Auth.showToast('Info', 'تسجيل الدخول عبر الهاتف غير متاح حالياً', 'info');
                                break;
                            case 'fingerprint-login':
                                Auth.handleFingerprintLogin();
                                break;
                            case 'complete-registration':
                                Auth.handleRegister();
                                break;
                            case 'back':
                                Auth.loadPage('login');
                                break;
                        }
                    }
                    
                    if (passwordToggle) {
                        const container = passwordToggle.closest('.auth-screen-password-input-container');
                        const passwordInput = container.querySelector('input');
                        const icon = passwordToggle.querySelector('i');
                        
                        if (passwordInput.type === 'password') {
                            passwordInput.type = 'text';
                            icon.classList.remove('fa-eye');
                            icon.classList.add('fa-eye-slash');
                        } else {
                            passwordInput.type = 'password';
                            icon.classList.remove('fa-eye-slash');
                            icon.classList.add('fa-eye');
                        }
                    }
                });
            },

    /**
     * Load an authentication page
     * @param {string} pageId - ID of the page to load
     */
    loadPage: function(pageId) {
        // Show loader during page load
        Loader.show();
        
        // Fetch the page template
        fetch(this.config.templatesPath + pageId + '.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Page not found');
                }
                return response.text();
            })
            .then(html => {
                // Render the page
                this.authContainer.innerHTML = html;
                
                // Hide loader
                setTimeout(() => Loader.hide(), 300);
            })
            .catch(error => {
                console.error('Error loading auth page:', error);
                Toast.show('Error', 'Failed to load authentication page', 'danger');
                Loader.hide();
            });
    },
            handleLogin: function() {
                window.location.reload();
            },

    /**
     * Handle register form submission
     */
    handleRegister: function() {
        const name = document.getElementById('name').value;  // Changed from companyName
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;
        
        // Basic validation
        if (!name || !email || !phone || !password) {
            Toast.show('Error', 'الرجاء إدخال جميع البيانات المطلوبة', 'danger');
            return;
        }
        
        if (password !== confirmPassword) {
            Toast.show('Error', 'كلمة المرور غير متطابقة', 'danger');
            return;
        }
        
        if (!agreeTerms) {
            Toast.show('Error', 'يجب الموافقة على الشروط والأحكام للمتابعة', 'danger');
            return;
        }
        
        // Show loader
        Loader.show();
        
        // Simulate API call
        setTimeout(() => {
            // For demo purposes, always succeed and redirect to login
            Toast.show('Success', 'تم إنشاء الحساب بنجاح! يمكنك تسجيل الدخول الآن', 'success');
            this.loadPage('login');
            
            // Hide loader
            Loader.hide();
        }, 2000);
    },

        /**
     * Process successful login
     * @param {Object} user - User data
     */
    loginSuccess: function(user) {
        // Save user data to state
        State.update('user', user);
        State.update('isAuthenticated', true);
        
        // Hide auth container, show app container
        document.getElementById('login').style.display = 'none';
        document.getElementById('app-container').style.display = '';
        
        // Initialize the app
        Router.navigate(this.config.defaultPage);
        
        // Show welcome toast
        Toast.show('Success', 'مرحباً بك ' + user.name, 'success');
    },

        /**
     * Handle the fingerprint login simulation
     */


            handleFingerprintLogin: function() {
                const scanner = document.getElementById('fingerprint-scanner');
                if (scanner.classList.contains('scanning')) return;

                scanner.classList.add('scanning');
                scanner.classList.remove('success', 'error');
                this.showToast('Info', 'جاري مسح بصمة الإصبع...', 'info');

                setTimeout(() => {
                    scanner.classList.remove('scanning');
                    
                    const isSuccess = Math.random() > 0.3;

                    if (isSuccess) {
                        scanner.classList.add('success');
                        this.showToast('Success', 'تم التحقق بنجاح!', 'success');

                        setTimeout(() => {
                            this.handleLogin();
                        }, 1500);

                    } else {
                        scanner.classList.add('error');
                        this.showToast('Error', 'فشل التحقق، حاول مرة أخرى', 'danger');
                        
                        setTimeout(() => {
                            scanner.classList.remove('error');
                        }, 1500);
                    }
                }, 2000);
            },

            showToast: function(title, message, type) {
                const container = document.getElementById('toast-container');
                const toast = document.createElement('div');
                toast.classList.add('toast', type);
                toast.innerHTML = `
                    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'danger' ? 'exclamation-circle' : 'info-circle'}"></i>
                    <div>
                        <strong>${title}</strong><br>
                        ${message}
                    </div>
                `;
                container.appendChild(toast);

                setTimeout(() => {
                    toast.remove();
                }, 5000);
            },

            setupMultiStepForm: function() {
                document.addEventListener('click', function(e) {
                    if (e.target.dataset.action === 'next-step') {
                        const currentStep = document.querySelector('.form-step.active');
                        const nextStep = document.querySelector(`.form-step[data-step="${parseInt(currentStep?.dataset.step || 0) + 1}"]`);
                        
                        if (nextStep) {
                            currentStep?.classList.remove('active');
                            nextStep.classList.add('active');
                            
                            document.querySelectorAll('.progress-step').forEach(step => {
                                if (parseInt(step.dataset.step) <= parseInt(nextStep.dataset.step)) {
                                    step.classList.add('active');
                                }
                            });
                        }
                    }
                    
                    if (e.target.dataset.action === 'prev-step') {
                        const currentStep = document.querySelector('.form-step.active');
                        const prevStep = document.querySelector(`.form-step[data-step="${parseInt(currentStep?.dataset.step || 0) - 1}"]`);
                        
                        if (prevStep) {
                            currentStep?.classList.remove('active');
                            prevStep.classList.add('active');
                            
                            document.querySelectorAll('.progress-step').forEach(step => {
                                if (parseInt(step.dataset.step) > parseInt(prevStep.dataset.step)) {
                                    step.classList.remove('active');
                                }
                            });
                        }
                    }
                });
            }
        };
