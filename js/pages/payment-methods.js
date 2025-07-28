/**
 * Payment Methods Page Controller
 */
window.PaymentMethodsController = {
    /**
     * Initialize the payment methods page
     */
    init: function() {
        console.log('PaymentMethodsController: Initializing...');
        this.loadPaymentMethods();
        this.setupEventListeners();
        this.updateUI();
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
        document.querySelectorAll('.quick-action-card').forEach(card => {
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

        // Update default badge visibility
        this.updateDefaultBadges();
    },

    /**
     * Create a payment method card element
     */
    createPaymentMethodCard: function(method) {
        const card = document.createElement('div');
        card.className = `payment-method-card ${method.isDefault ? 'default' : ''}`;
        card.dataset.methodId = method.id;

        card.innerHTML = `
            <div class="payment-method-info">
                <div class="payment-method-icon">
                    <i class="${method.icon}"></i>
                </div>
                <div class="payment-method-details">
                    <h3 class="payment-method-name">${method.name}</h3>
                    <p class="payment-method-number">${method.number}</p>
                    ${method.expiry ? `<span class="payment-method-expiry">تنتهي في ${method.expiry}</span>` : ''}
                    ${method.bank ? `<span class="payment-method-bank">${method.bank}</span>` : ''}
                    ${method.status ? `<span class="payment-method-status">${method.status}</span>` : ''}
                </div>
                ${method.isDefault ? '<div class="payment-method-status"><span class="default-badge">افتراضية</span></div>' : ''}
            </div>
            <div class="payment-method-actions">
                ${!method.isDefault ? `<button class="action-btn" data-action="set-default" data-id="${method.id}"><i class="fas fa-star"></i></button>` : ''}
                <button class="action-btn" data-action="edit-payment-method" data-id="${method.id}"><i class="fas fa-edit"></i></button>
                <button class="action-btn" data-action="remove-payment-method" data-id="${method.id}"><i class="fas fa-trash"></i></button>
            </div>
        `;

        return card;
    },

    /**
     * Update default badges visibility
     */
    updateDefaultBadges: function() {
        const defaultCards = document.querySelectorAll('.payment-method-card.default');
        defaultCards.forEach(card => {
            const actions = card.querySelector('.payment-method-actions');
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