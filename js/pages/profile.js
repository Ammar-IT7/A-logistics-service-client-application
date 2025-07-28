/**
 * Profile Page JavaScript
 * Mobile-focused with enhanced UX
 */

class ProfilePage {
    constructor() {
        this.currentUser = null;
        this.isEditing = false;
        this.originalData = {};
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.setupMobileEnhancements();
        this.setupFormValidation();
        this.updateUI();
    }

    /**
     * Load user data from localStorage or API
     */
    loadUserData() {
        // Load from localStorage for demo
        const savedUser = localStorage.getItem('userProfile');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        } else {
            // Default user data
            this.currentUser = {
                firstName: 'عبد الله',
                lastName: 'محمد',
                email: 'abdullah@example.com',
                phone: '+967 777 123 456',
                birthDate: '1990-05-15',
                city: 'sanaa',
                district: 'شارع الزبيري',
                address: 'شارع الزبيري، بجوار مسجد النور، عمارة رقم 15، الطابق الثاني',
                clientType: 'individual',
                profession: 'مهندس',
                companyName: '',
                idNumber: '123456789',
                idType: 'national',
                memberSince: 'يناير 2024'
            };
        }
        
        this.originalData = { ...this.currentUser };
        this.populateForm();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Save button
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-action="save-profile"]')) {
                this.saveProfile();
            }
        });

        // Avatar change
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-action="change-avatar"]')) {
                this.changeAvatar();
            }
        });

        // Client type change
        document.addEventListener('change', (e) => {
            if (e.target.id === 'clientType') {
                this.handleClientTypeChange(e.target.value);
            }
        });

        // Quick actions navigation
        document.addEventListener('click', (e) => {
            const quickAction = e.target.closest('.profile-quick-action');
            if (quickAction) {
                const action = quickAction.getAttribute('data-action');
                const page = quickAction.getAttribute('data-page');
                if (action === 'navigate' && page) {
                    this.navigateToPage(page);
                }
            }
        });

        // Form input changes
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('profile-form-input')) {
                this.handleFormInput(e.target);
            }
        });

        // Form validation on blur
        document.addEventListener('blur', (e) => {
            if (e.target.classList.contains('profile-form-input')) {
                this.validateField(e.target);
            }
        }, true);
    }

    /**
     * Setup mobile enhancements
     */
    setupMobileEnhancements() {
        this.setupTouchFeedback();
        this.setupSwipeGestures();
        this.setupHapticFeedback();
    }

    /**
     * Setup touch feedback for interactive elements
     */
    setupTouchFeedback() {
        const interactiveElements = document.querySelectorAll('.profile-quick-action, .profile-avatar-edit');
        
        interactiveElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.style.transform = 'scale(0.98)';
            });
            
            element.addEventListener('touchend', () => {
                element.style.transform = '';
            });
        });
    }

    /**
     * Setup swipe gestures
     */
    setupSwipeGestures() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Horizontal swipe detection
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.handleSwipeLeft();
                } else {
                    this.handleSwipeRight();
                }
            }
        });
    }

    /**
     * Setup haptic feedback
     */
    setupHapticFeedback() {
        const quickActions = document.querySelectorAll('.profile-quick-action');
        quickActions.forEach(action => {
            action.addEventListener('click', () => {
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
            });
        });
    }

    /**
     * Handle swipe left gesture
     */
    handleSwipeLeft() {
        // Navigate back
        window.history.back();
    }

    /**
     * Handle swipe right gesture
     */
    handleSwipeRight() {
        // Save profile
        this.saveProfile();
    }

    /**
     * Navigate to page
     */
    navigateToPage(page) {
        if (window.Router && window.Router.navigate) {
            window.Router.navigate(page);
        } else {
            // Fallback navigation
            window.location.href = `#${page}`;
        }
    }

    /**
     * Setup form validation
     */
    setupFormValidation() {
        const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('blur', () => this.validateField(field));
            }
        });
    }

    /**
     * Validate form field
     */
    validateField(field) {
        const value = field.value.trim();
        const fieldId = field.id;
        
        // Remove existing validation classes
        field.classList.remove('error', 'success');
        
        // Validation rules
        let isValid = true;
        let errorMessage = '';
        
        switch (fieldId) {
            case 'firstName':
            case 'lastName':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'يجب أن يكون الاسم أكثر من حرفين';
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'البريد الإلكتروني غير صحيح';
                }
                break;
                
            case 'phone':
                const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
                if (!phoneRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'رقم الهاتف غير صحيح';
                }
                break;
        }
        
        if (isValid && value) {
            field.classList.add('success');
        } else if (!isValid) {
            field.classList.add('error');
            this.showFieldError(field, errorMessage);
        }
    }

    /**
     * Show field error message
     */
    showFieldError(field, message) {
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.color = 'var(--danger)';
        errorElement.style.fontSize = 'var(--font-size-sm)';
        errorElement.style.marginTop = '0.25rem';
        
        field.parentNode.appendChild(errorElement);
    }

    /**
     * Populate form with user data
     */
    populateForm() {
        const fields = {
            'firstName': this.currentUser.firstName,
            'lastName': this.currentUser.lastName,
            'email': this.currentUser.email,
            'phone': this.currentUser.phone,
            'birthDate': this.currentUser.birthDate,
            'city': this.currentUser.city,
            'district': this.currentUser.district,
            'address': this.currentUser.address,
            'clientType': this.currentUser.clientType,
            'profession': this.currentUser.profession,
            'companyName': this.currentUser.companyName,
            'idNumber': this.currentUser.idNumber,
            'idType': this.currentUser.idType
        };

        Object.keys(fields).forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = fields[fieldId];
                } else {
                    field.value = fields[fieldId];
                }
            }
        });

        // Update avatar
        const avatar = document.getElementById('profileAvatar');
        if (avatar) {
            avatar.src = this.currentUser.avatar || 'https://placehold.co/100x100/282460/FAAE43?text=أ';
        }

        // Update overview info
        this.updateOverviewInfo();
    }

    /**
     * Update overview information
     */
    updateOverviewInfo() {
        const nameElement = document.querySelector('.profile-overview-name');
        const emailElement = document.querySelector('.profile-overview-email');
        const statusElement = document.querySelector('.profile-overview-status');

        if (nameElement) {
            nameElement.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        }
        if (emailElement) {
            emailElement.textContent = this.currentUser.email;
        }
        if (statusElement) {
            statusElement.textContent = `عضو منذ ${this.currentUser.memberSince}`;
        }
    }

    /**
     * Handle client type change
     */
    handleClientTypeChange(clientType) {
        const companyInfo = document.getElementById('companyInfo');
        if (companyInfo) {
            if (clientType === 'company') {
                companyInfo.style.display = 'block';
            } else {
                companyInfo.style.display = 'none';
            }
        }
    }

    /**
     * Handle form input changes
     */
    handleFormInput(input) {
        const fieldId = input.id;
        const value = input.type === 'checkbox' ? input.checked : input.value;
        
        this.currentUser[fieldId] = value;
        
        // Update overview if name or email changed
        if (fieldId === 'firstName' || fieldId === 'lastName' || fieldId === 'email') {
            this.updateOverviewInfo();
        }
    }

    /**
     * Save profile data
     */
    saveProfile() {
        // Collect form data
        const formData = this.collectFormData();
        
        // Validate form
        if (!this.validateForm(formData)) {
            return;
        }

        // Show loading state
        this.showLoadingState();

        // Simulate API call
        setTimeout(() => {
            // Update current user data
            this.currentUser = { ...this.currentUser, ...formData };
            
            // Save to localStorage
            localStorage.setItem('userProfile', JSON.stringify(this.currentUser));
            
            // Update UI
            this.updateUI();
            
            // Hide loading state
            this.hideLoadingState();
            
            // Show success message
            this.showSuccessMessage('تم حفظ البيانات بنجاح');
            
        }, 1000);
    }

    /**
     * Collect form data
     */
    collectFormData() {
        const formData = {};
        const inputs = document.querySelectorAll('.profile-form-input');
        
        inputs.forEach(input => {
            const value = input.type === 'checkbox' ? input.checked : input.value;
            formData[input.id] = value;
        });

        return formData;
    }

    /**
     * Validate form
     */
    validateForm(formData) {
        let isValid = true;
        
        // Check required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
        requiredFields.forEach(field => {
            if (!formData[field] || formData[field].trim() === '') {
                isValid = false;
                this.showFieldError(document.getElementById(field), 'هذا الحقل مطلوب');
            }
        });

        return isValid;
    }

    /**
     * Show loading state
     */
    showLoadingState() {
        const saveButton = document.querySelector('[data-action="save-profile"]');
        if (saveButton) {
            saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            saveButton.disabled = true;
        }
    }

    /**
     * Hide loading state
     */
    hideLoadingState() {
        const saveButton = document.querySelector('[data-action="save-profile"]');
        if (saveButton) {
            saveButton.innerHTML = '<i class="fas fa-save"></i>';
            saveButton.disabled = false;
        }
    }

    /**
     * Show success message
     */
    showSuccessMessage(message) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'toast toast-success';
        toast.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    /**
     * Change avatar
     */
    changeAvatar() {
        // Create file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.currentUser.avatar = e.target.result;
                    const avatar = document.getElementById('profileAvatar');
                    if (avatar) {
                        avatar.src = e.target.result;
                    }
                    localStorage.setItem('userProfile', JSON.stringify(this.currentUser));
                };
                reader.readAsDataURL(file);
            }
        });
        
        fileInput.click();
    }

    /**
     * Update UI based on current state
     */
    updateUI() {
        // Update form fields
        this.populateForm();
        
        // Update client type visibility
        this.handleClientTypeChange(this.currentUser.clientType);
    }
}

// Initialize profile page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProfilePage();
}); 