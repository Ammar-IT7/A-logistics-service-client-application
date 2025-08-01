/**
 * Login Page Controller
 * Handles the login page functionality and authentication
 */
window.LoginController = {
    /**
     * Initialize the login page
     */
    init: function() {
        this.setupEventListeners();
        this.setupPasswordToggle();
        this.setupFormValidation();
        console.log('LoginController initialized');
    },

    /**
     * Set up event listeners for the login page
     */
    setupEventListeners: function() {
        // Login form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Social login buttons
        const socialButtons = document.querySelectorAll('[data-provider]');
        socialButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSocialLogin(button.dataset.provider);
            });
        });

        // Phone login
        const phoneLoginBtn = document.querySelector('[data-action="phone-login"]');
        if (phoneLoginBtn) {
            phoneLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handlePhoneLogin();
            });
        }

        // Fingerprint login
        const fingerprintBtn = document.querySelector('[data-action="fingerprint-login"]');
        if (fingerprintBtn) {
            fingerprintBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleFingerprintLogin();
            });
        }

        // Forgot password
        const forgotPasswordBtn = document.querySelector('[data-action="forgot-password"]');
        if (forgotPasswordBtn) {
            forgotPasswordBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleForgotPassword();
            });
        }

        // Show register page
        const showRegisterBtn = document.querySelector('[data-action="show-register"]');
        if (showRegisterBtn) {
            showRegisterBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showRegisterPage();
            });
        }
    },

    /**
     * Set up password toggle functionality
     */
    setupPasswordToggle: function() {
        const passwordInput = document.getElementById('password');
        const toggleBtn = document.querySelector('.auth-screen-password-toggle');
        
        if (passwordInput && toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                
                const icon = toggleBtn.querySelector('i');
                if (icon) {
                    icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
                }
            });
        }
    },

    /**
     * Set up form validation
     */
    setupFormValidation: function() {
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        
        if (usernameInput) {
            usernameInput.addEventListener('input', () => {
                this.validateField(usernameInput);
            });
        }
        
        if (passwordInput) {
            passwordInput.addEventListener('input', () => {
                this.validateField(passwordInput);
            });
        }
    },

    /**
     * Validate a form field
     */
    validateField: function(field) {
        const value = field.value.trim();
        const fieldName = field.id;
        const errorElement = document.getElementById(fieldName + '-error');
        
        // Remove existing error classes and clear error message
        field.classList.remove('error');
        if (errorElement) {
            errorElement.textContent = '';
        }
        
        // Validate based on field type
        if (fieldName === 'username') {
            if (!value) {
                field.classList.add('error');
                if (errorElement) {
                    errorElement.textContent = 'يرجى إدخال البريد الإلكتروني أو رقم الهاتف';
                }
                return false;
            }
            // Check if it's email or phone
            const isEmail = value.includes('@');
            const isPhone = /^\d+$/.test(value);
            
            if (!isEmail && !isPhone) {
                field.classList.add('error');
                if (errorElement) {
                    errorElement.textContent = 'يرجى إدخال بريد إلكتروني أو رقم هاتف صحيح';
                }
                return false;
            }
        } else if (fieldName === 'password') {
            if (!value) {
                field.classList.add('error');
                if (errorElement) {
                    errorElement.textContent = 'يرجى إدخال كلمة المرور';
                }
                return false;
            }
            if (value.length < 6) {
                field.classList.add('error');
                if (errorElement) {
                    errorElement.textContent = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
                }
                return false;
            }
        }
        
        return true;
    },

    /**
     * Handle login form submission
     */
    handleLogin: function() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
        // Validate inputs
        if (!this.validateField(document.getElementById('username')) || 
            !this.validateField(document.getElementById('password'))) {
            Toast.show('خطأ', 'يرجى إدخال بيانات صحيحة', 'danger');
            return;
        }
        
        // Show loader
        Loader.show();
        
        // Simulate API call
        setTimeout(() => {
            // For demo purposes, always succeed
            const user = {
                name: 'مستخدم تجريبي',
                email: username,
                phone: username,
                id: 'user_' + Date.now()
            };
            
            // Update authentication state
            State.update('isAuthenticated', true);
            State.update('user', user);
            
            // Hide loader
            Loader.hide();
            
            // Show success message
            Toast.show('نجح', 'تم تسجيل الدخول بنجاح', 'success');
            
            // Navigate to home page
            setTimeout(() => {
                if (window.Router && window.Router.navigate) {
                    window.Router.navigate('client-home-page');
                }
            }, 1000);
            
        }, 1500);
    },

    /**
     * Handle social login
     */
    handleSocialLogin: function(provider) {
        Toast.show('معلومات', `تسجيل الدخول عبر ${provider} قيد التطوير`, 'info');
    },

    /**
     * Handle phone login
     */
    handlePhoneLogin: function() {
        Toast.show('معلومات', 'تسجيل الدخول عبر الهاتف قيد التطوير', 'info');
    },

    /**
     * Handle fingerprint login
     */
    handleFingerprintLogin: function() {
        Toast.show('معلومات', 'تسجيل الدخول بالبصمة قيد التطوير', 'info');
    },

    /**
     * Handle forgot password
     */
    handleForgotPassword: function() {
        Toast.show('معلومات', 'استعادة كلمة المرور قيد التطوير', 'info');
    },

    /**
     * Show register page
     */
    showRegisterPage: function() {
        if (window.Router && window.Router.navigate) {
            window.Router.navigate('register');
        }
    },

    /**
     * Destroy the controller
     */
    destroy: function() {
        console.log('LoginController destroyed');
    }
}; 