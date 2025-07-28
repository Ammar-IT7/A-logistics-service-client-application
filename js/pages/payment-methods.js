/**
 * Payment Methods Page Controller
 * Mobile-focused with enhanced UX
 */
window.PaymentMethodsController = {
    /**
     * Initialize the payment methods page
     */
    init: function() {
        console.log('PaymentMethodsController: Initializing...');
        this.loadPaymentMethods();
        this.setupEventListeners();
        this.setupMobileEnhancements();
        this.updateUI();
    },

    /**
     * Set up mobile-specific enhancements
     */
    setupMobileEnhancements: function() {
        // Touch-friendly card interactions
        document.querySelectorAll('.payment-methods-card').forEach(card => {
            card.addEventListener('touchstart', (e) => {
                e.target.style.transform = 'scale(0.98)';
            });
            
            card.addEventListener('touchend', (e) => {
                e.target.style.transform = '';
            });
        });

        // Quick action card interactions
        document.querySelectorAll('.payment-methods-quick-action-card').forEach(card => {
            card.addEventListener('touchstart', (e) => {
                e.target.style.transform = 'scale(0.95)';
            });
            
            card.addEventListener('touchend', (e) => {
                e.target.style.transform = '';
            });
        });

        // Swipe gestures for payment cards
        this.setupSwipeGestures();
    },

    /**
     * Set up swipe gestures for mobile
     */
    setupSwipeGestures: function() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        document.querySelectorAll('.payment-methods-card').forEach(card => {
            card.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            });

            card.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                endY = e.changedTouches[0].clientY;
                
                const diffX = startX - endX;
                const diffY = startY - endY;
                
                // Horizontal swipe with minimal vertical movement
                if (Math.abs(diffX) > 50 && Math.abs(diffY) < 30) {
                    if (diffX > 0) {
                        // Swipe left - show quick actions
                        this.showQuickActions(card);
                    } else {
                        // Swipe right - set as default
                        const methodId = card.dataset.methodId;
                        if (methodId) {
                            this.setDefaultPaymentMethod(methodId);
                        }
                    }
                }
            });
        });
    },

    /**
     * Show quick actions for a payment card
     */
    showQuickActions: function(card) {
        const methodId = card.dataset.methodId;
        if (!methodId) return;

        // Create quick actions overlay
        const overlay = document.createElement('div');
        overlay.className = 'payment-methods-quick-actions-overlay';
        overlay.innerHTML = `
            <div class="payment-methods-quick-actions-menu">
                <button class="payment-methods-quick-action" data-action="set-default" data-id="${methodId}">
                    <i class="fas fa-star"></i>
                    <span>تعيين كافتراضي</span>
                </button>
                <button class="payment-methods-quick-action" data-action="edit-payment-method" data-id="${methodId}">
                    <i class="fas fa-edit"></i>
                    <span>تعديل</span>
                </button>
                <button class="payment-methods-quick-action" data-action="remove-payment-method" data-id="${methodId}">
                    <i class="fas fa-trash"></i>
                    <span>حذف</span>
                </button>
            </div>
        `;

        document.body.appendChild(overlay);

        // Remove overlay on click outside
        overlay.addEventListener('click', () => {
            overlay.remove();
        });

        // Handle quick action clicks
        overlay.querySelectorAll('.payment-methods-quick-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.dataset.action;
                const id = btn.dataset.id;
                
                switch (action) {
                    case 'set-default':
                        this.setDefaultPaymentMethod(id);
                        break;
                    case 'edit-payment-method':
                        this.editPaymentMethod(id);
                        break;
                    case 'remove-payment-method':
                        this.removePaymentMethod(id);
                        break;
                }
                
                overlay.remove();
            });
        });
    },

    /**
     * Load payment methods from storage/API
     */
    loadPaymentMethods: function() {
        // Load from localStorage or API
        const savedMethods = localStorage.getItem('paymentMethods');
        if (savedMethods) {
            this.paymentMethods = JSON.parse(savedMethods);
        } else {
            // Default payment methods
            this.paymentMethods = [
                {
                    id: 1,
                    type: 'card',
                    name: 'بطاقة فيزا',
                    number: '**** **** **** 1234',
                    expiry: '12/25',
                    isDefault: true,
                    icon: 'fab fa-cc-visa'
                },
                {
                    id: 2,
                    type: 'card',
                    name: 'بطاقة ماستركارد',
                    number: '**** **** **** 5678',
                    expiry: '08/24',
                    isDefault: false,
                    icon: 'fab fa-cc-mastercard'
                },
                {
                    id: 3,
                    type: 'bank',
                    name: 'حساب بنكي',
                    number: '**** 1234',
                    bank: 'بنك الرياض',
                    isDefault: false,
                    icon: 'fas fa-university'
                },
                {
                    id: 4,
                    type: 'wallet',
                    name: 'Apple Pay',
                    number: 'محفظة رقمية',
                    status: 'متصل',
                    isDefault: false,
                    icon: 'fab fa-apple-pay'
                }
            ];
            this.savePaymentMethods();
        }
    },

    /**
     * Save payment methods to storage
     */
    savePaymentMethods: function() {
        localStorage.setItem('paymentMethods', JSON.stringify(this.paymentMethods));
    },

    /**
     * Set up event listeners
     */
    setupEventListeners: function() {
        // Payment method actions
        document.addEventListener('click', (e) => {
            const action = e.target.closest('[data-action]');
            if (!action) return;

            const actionType = action.dataset.action;
            const methodId = action.dataset.id;

            switch (actionType) {
                case 'set-default':
                    this.setDefaultPaymentMethod(methodId);
                    break;
                case 'edit-payment-method':
                    this.editPaymentMethod(methodId);
                    break;
                case 'remove-payment-method':
                    this.removePaymentMethod(methodId);
                    break;
                case 'open-modal':
                    this.openAddPaymentModal(action.dataset.modal);
                    break;
            }
        });

        // Quick action cards
        document.querySelectorAll('.payment-methods-quick-action-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const modalType = card.dataset.modal;
                this.openAddPaymentModal(modalType);
            });
        });
    },

    /**
     * Set a payment method as default
     */
    setDefaultPaymentMethod: function(methodId) {
        // Remove default from all methods
        this.paymentMethods.forEach(method => {
            method.isDefault = false;
        });

        // Set the selected method as default
        const method = this.paymentMethods.find(m => m.id == methodId);
        if (method) {
            method.isDefault = true;
            this.savePaymentMethods();
            this.updateUI();
            Toast.show('تم التحديث', 'تم تعيين طريقة الدفع كافتراضية', 'success');
        }
    },

    /**
     * Edit a payment method
     */
    editPaymentMethod: function(methodId) {
        const method = this.paymentMethods.find(m => m.id == methodId);
        if (method) {
            // Open edit modal with method data
            Modal.open('edit-payment-method', { method });
        }
    },

    /**
     * Remove a payment method
     */
    removePaymentMethod: function(methodId) {
        const method = this.paymentMethods.find(m => m.id == methodId);
        if (method && method.isDefault) {
            Toast.show('خطأ', 'لا يمكن حذف طريقة الدفع الافتراضية', 'error');
            return;
        }

        // Show confirmation dialog
        Modal.open('confirm-delete', {
            title: 'حذف طريقة الدفع',
            message: `هل أنت متأكد من حذف ${method.name}؟`,
            onConfirm: () => {
                this.paymentMethods = this.paymentMethods.filter(m => m.id != methodId);
                this.savePaymentMethods();
                this.updateUI();
                Toast.show('تم الحذف', 'تم حذف طريقة الدفع بنجاح', 'success');
            }
        });
    },

    /**
     * Open add payment method modal
     */
    openAddPaymentModal: function(modalType) {
        switch (modalType) {
            case 'add-card':
                Modal.open('add-credit-card');
                break;
            case 'add-bank':
                Modal.open('add-bank-account');
                break;
            case 'add-wallet':
                Modal.open('add-digital-wallet');
                break;
            case 'add-crypto':
                Modal.open('add-crypto-wallet');
                break;
            default:
                Modal.open('add-payment-method');
        }
    },

    /**
     * Add new payment method
     */
    addPaymentMethod: function(methodData) {
        const newMethod = {
            id: Date.now(),
            ...methodData,
            isDefault: this.paymentMethods.length === 0
        };

        this.paymentMethods.push(newMethod);
        this.savePaymentMethods();
        this.updateUI();
        Toast.show('تم الإضافة', 'تم إضافة طريقة الدفع بنجاح', 'success');
    },

    /**
     * Update the UI to reflect current state
     */
    updateUI: function() {
        const container = document.querySelector('.payment-methods-container');
        if (!container) return;

        // Clear existing cards
        container.innerHTML = '';

        // Render payment methods
        this.paymentMethods.forEach(method => {
            const card = this.createPaymentMethodCard(method);
            container.appendChild(card);
        });

        // Update overview count
        this.updateOverviewCount();

        // Update default badge visibility
        this.updateDefaultBadges();
    },

    /**
     * Update overview count
     */
    updateOverviewCount: function() {
        const countElement = document.querySelector('.payment-methods-overview-count');
        if (countElement) {
            countElement.textContent = `${this.paymentMethods.length} طرق دفع`;
        }
    },

    /**
     * Create a payment method card element
     */
    createPaymentMethodCard: function(method) {
        const card = document.createElement('div');
        card.className = `payment-methods-card ${method.isDefault ? 'payment-methods-card-default' : ''}`;
        card.dataset.methodId = method.id;

        card.innerHTML = `
            <div class="payment-methods-card-info">
                <div class="payment-methods-card-icon">
                    <i class="${method.icon}"></i>
                </div>
                <div class="payment-methods-card-details">
                    <h3 class="payment-methods-card-name">${method.name}</h3>
                    <p class="payment-methods-card-number">${method.number}</p>
                    ${method.expiry ? `<span class="payment-methods-card-expiry">تنتهي في ${method.expiry}</span>` : ''}
                    ${method.bank ? `<span class="payment-methods-card-bank">${method.bank}</span>` : ''}
                    ${method.status ? `<span class="payment-methods-card-status">${method.status}</span>` : ''}
                </div>
                ${method.isDefault ? '<div class="payment-methods-card-status"><span class="payment-methods-default-badge">افتراضية</span></div>' : ''}
            </div>
            <div class="payment-methods-card-actions">
                ${!method.isDefault ? `<button class="payment-methods-action-btn" data-action="set-default" data-id="${method.id}"><i class="fas fa-star"></i></button>` : ''}
                <button class="payment-methods-action-btn" data-action="edit-payment-method" data-id="${method.id}"><i class="fas fa-edit"></i></button>
                <button class="payment-methods-action-btn" data-action="remove-payment-method" data-id="${method.id}"><i class="fas fa-trash"></i></button>
            </div>
        `;

        return card;
    },

    /**
     * Update default badges visibility
     */
    updateDefaultBadges: function() {
        const defaultCards = document.querySelectorAll('.payment-methods-card-default');
        defaultCards.forEach(card => {
            const actions = card.querySelector('.payment-methods-card-actions');
            const setDefaultBtn = actions.querySelector('[data-action="set-default"]');
            if (setDefaultBtn) {
                setDefaultBtn.remove();
            }
        });
    },

    /**
     * Get payment methods for other components
     */
    getPaymentMethods: function() {
        return this.paymentMethods;
    },

    /**
     * Get default payment method
     */
    getDefaultPaymentMethod: function() {
        return this.paymentMethods.find(method => method.isDefault);
    },

    /**
     * Validate payment method data
     */
    validatePaymentMethod: function(methodData) {
        const errors = [];

        if (!methodData.name || methodData.name.trim().length < 2) {
            errors.push('اسم طريقة الدفع مطلوب');
        }

        if (methodData.type === 'card') {
            if (!methodData.number || methodData.number.length < 13) {
                errors.push('رقم البطاقة غير صحيح');
            }
            if (!methodData.expiry) {
                errors.push('تاريخ انتهاء الصلاحية مطلوب');
            }
        }

        if (methodData.type === 'bank') {
            if (!methodData.number || methodData.number.length < 4) {
                errors.push('رقم الحساب البنكي مطلوب');
            }
            if (!methodData.bank) {
                errors.push('اسم البنك مطلوب');
            }
        }

        return errors;
    },

    /**
     * Clean up when leaving the page
     */
    destroy: function() {
        console.log('PaymentMethodsController: Destroying...');
        // Remove event listeners if needed
    }
}; 