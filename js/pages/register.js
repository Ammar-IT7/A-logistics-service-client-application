/**
 * Register Page Controller
 * Handles the registration page functionality
 */
window.RegisterController = {
    /**
     * Initialize the register page
     */
    init: function() {
        this.setupEventListeners();
        this.setupPasswordToggle();
        this.setupFormValidation();
        console.log('RegisterController initialized');
    },

    /**
     * Set up event listeners for the register page
     */
    setupEventListeners: function() {
        // Register form submission
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // Social register buttons
        const socialButtons = document.querySelectorAll('[data-provider]');
        socialButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSocialRegister(button.dataset.provider);
            });
        });

        // Show login page
        const showLoginBtn = document.querySelector('[data-action="show-login"]');
        if (showLoginBtn) {
            showLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginPage();
            });
        }
    },

    /**
     * Set up password toggle functionality
     */
    setupPasswordToggle: function() {
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const toggleBtns = document.querySelectorAll('.auth-screen-password-toggle');
        
        toggleBtns.forEach((toggleBtn, index) => {
            toggleBtn.addEventListener('click', () => {
                const input = index === 0 ? passwordInput : confirmPasswordInput;
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                
                const icon = toggleBtn.querySelector('i');
                if (icon) {
                    icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
                }
            });
        });
    },

    /**
     * Set up form validation
     */
    setupFormValidation: function() {
        const inputs = ['name', 'email', 'phone', 'password', 'confirmPassword'];
        
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => {
                    this.validateField(input);
                });
            }
        });
    },

    /**
     * Validate a form field
     */
    validateField: function(field) {
        const value = field.value.trim();
        const fieldName = field.id;
        
        // Remove existing error classes
        field.classList.remove('error');
        
        // Validate based on field type
        switch (fieldName) {
            case 'name':
                if (!value) {
                    field.classList.add('error');
                    return false;
                }
                if (value.length < 2) {
                    field.classList.add('error');
                    return false;
                }
                break;
                
            case 'email':
                if (!value) {
                    field.classList.add('error');
                    return false;
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    field.classList.add('error');
                    return false;
                }
                break;
                
            case 'phone':
                if (!value) {
                    field.classList.add('error');
                    return false;
                }
                const phoneRegex = /^\d{10,}$/;
                if (!phoneRegex.test(value)) {
                    field.classList.add('error');
                    return false;
                }
                break;
                
            case 'password':
                if (!value) {
                    field.classList.add('error');
                    return false;
                }
                if (value.length < 6) {
                    field.classList.add('error');
                    return false;
                }
                break;
                
            case 'confirmPassword':
                const password = document.getElementById('password').value;
                if (!value) {
                    field.classList.add('error');
                    return false;
                }
                if (value !== password) {
                    field.classList.add('error');
                    return false;
                }
                break;
        }
        
        return true;
    },

    /**
     * Handle register form submission
     */
    handleRegister: function() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();
        const agreeTerms = document.getElementById('agreeTerms').checked;
        
        // Validate all fields
        const fields = ['name', 'email', 'phone', 'password', 'confirmPassword'];
        let isValid = true;
        
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && !this.validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            Toast.show('خطأ', 'يرجى إدخال بيانات صحيحة', 'danger');
            return;
        }
        
        if (!agreeTerms) {
            Toast.show('خطأ', 'يجب الموافقة على الشروط والأحكام', 'danger');
            return;
        }
        
        // Show loader
        Loader.show();
        
        // Simulate API call
        setTimeout(() => {
            // For demo purposes, always succeed
            const user = {
                name: name,
                email: email,
                phone: phone,
                id: 'user_' + Date.now()
            };
            
            // Update authentication state
            State.update('isAuthenticated', true);
            State.update('user', user);
            
            // Hide loader
            Loader.hide();
            
            // Show success message
            Toast.show('نجح', 'تم إنشاء الحساب بنجاح', 'success');
            
            // Navigate to home page
            setTimeout(() => {
                if (window.Router && window.Router.navigate) {
                    window.Router.navigate('client-home-page');
                }
            }, 1000);
            
        }, 1500);
    },

    /**
     * Handle social registration
     */
    handleSocialRegister: function(provider) {
        Toast.show('معلومات', `التسجيل عبر ${provider} قيد التطوير`, 'info');
    },

    /**
     * Show login page
     */
    showLoginPage: function() {
        if (window.Router && window.Router.navigate) {
            window.Router.navigate('login');
        }
    },

    /**
     * Destroy the controller
     */
    destroy: function() {
        console.log('RegisterController destroyed');
    }
}; 