/**
 * Authentication module
 */
const Auth = {
    /**
     * Auth configuration
     */
    config: {
        templatesPath: 'templates/pages/',
        defaultPage: 'login'
    },

    /**
     * Initialize the authentication module
     */
    init: function() {
        // Initialize auth container
        this.authContainer = document.getElementById('app-container');
        
        // Load initial auth page
        // this.loadPage(this.config.defaultPage);
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Set up multi-step form handling
        this.setupMultiStepForm();
    },

    /**
     * Set up auth-related event listeners
     */
    setupEventListeners: function() {
        // Global click handler using event delegation
        document.addEventListener('click', function(e) {
            // Handle auth-specific actions
            //  const target = e.target.closest('[data-action]');
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
                        Toast.show('Info', 'تسجيل الدخول عبر الهاتف غير متاح حالياً', 'info');
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
                    case 'phone-login':
                        Toast.show('Info', 'تسجيل الدخول عبر الهاتف غير متاح حالياً', 'info');
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

    /**
     * Handle login form submission
     */
    handleLogin: function() {
        // Optionally reload the page to refresh the website
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
        if (scanner.classList.contains('scanning')) return; // Prevent multiple clicks

        scanner.classList.add('scanning');
        scanner.classList.remove('success', 'error');
        Toast.show('Info', 'جاري مسح بصمة الإصبع...', 'info');

        // Simulate scanning process
        setTimeout(() => {
            scanner.classList.remove('scanning');
            
            // Re-create the line to restart its animation
            const line = scanner.querySelector('.fingerprint-line');
            line.style.display = 'none';
            void line.offsetWidth; // Trigger reflow
            line.style.display = '';


            // Simulate success or failure
            const isSuccess = Math.random() > 0.3; // 70% chance of success

            if (isSuccess) {
                scanner.classList.add('success');
                Toast.show('Success', 'تم التحقق بنجاح!', 'success');

                // Proceed to login
                setTimeout(() => {
                    Auth.handleLogin();
                }, 1500);

            } else {
                scanner.classList.add('error');
                scanner.style.animation = 'shake 0.5s ease-in-out';
                Toast.show('Error', 'فشل التحقق، حاول مرة أخرى', 'danger');

                // Reset after animation
                scanner.addEventListener('animationend', () => {
                     scanner.style.animation = '';
                }, { once: true });
                
                 setTimeout(() => {
                    scanner.classList.remove('error');
                 }, 1500);
            }
        }, 2000); // 2 seconds scan time
    },

    /**
     * Log out the current user
     */
    logout: function() {
        // Clear authentication state
        State.update('isAuthenticated', false);
        
        // Hide app container, show auth container
        document.getElementById('app-container').style.display = 'none';
        document.getElementById('auth-container').style.display = '';
        
        // Load login page
        this.loadPage('login');
        
        // Show logout toast
        Toast.show('Info', 'تم تسجيل الخروج بنجاح', 'info');
    },
    
    // Add this to Auth.js
    setupMultiStepForm: function() {
        document.addEventListener('click', function(e) {
            if (e.target.dataset.action === 'next-step') {
                const currentStep = document.querySelector('.form-step.active');
                const nextStep = document.querySelector(`.form-step[data-step="${parseInt(currentStep.dataset.step) + 1}"]`);
                
                if (nextStep) {
                    currentStep.classList.remove('active');
                    nextStep.classList.add('active');
                    
                    // Update progress indicators
                    document.querySelectorAll('.progress-step').forEach(step => {
                        if (parseInt(step.dataset.step) <= parseInt(nextStep.dataset.step)) {
                            step.classList.add('active');
                        }
                    });
                }
            }
            
            if (e.target.dataset.action === 'prev-step') {
                const currentStep = document.querySelector('.form-step.active');
                const prevStep = document.querySelector(`.form-step[data-step="${parseInt(currentStep.dataset.step) - 1}"]`);
                
                if (prevStep) {
                    currentStep.classList.remove('active');
                    prevStep.classList.add('active');
                    
                    // Update progress indicators
                    document.querySelectorAll('.progress-step').forEach(step => {
                        if (parseInt(step.dataset.step) > parseInt(prevStep.dataset.step)) {
                            step.classList.remove('active');
                        }
                    });
                }
            }
        });
    },
};
