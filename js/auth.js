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
        this.authContainer = document.getElementById('auth-container');
        
        // Load initial auth page
        this.loadPage(this.config.defaultPage);
        
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
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Validation
        if (!username || !password) {
            Toast.show('Error', 'الرجاء إدخال اسم المستخدم وكلمة المرور', 'danger');
            return;
        }
        
        // Show loader
        Loader.show();
        
        // Simulate API call
        setTimeout(() => {
            // For demo purposes, always succeed
            this.loginSuccess({
                name: 'مستخدم تجريبي',
                email: username,
                role: 'provider'
            });
            
            // Hide loader
            Loader.hide();
        }, 1500);
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
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('app-container').style.display = '';
        
        // Initialize the app
        App.init();
        
        // Show welcome toast
        Toast.show('Success', 'مرحباً بك ' + user.name, 'success');
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
