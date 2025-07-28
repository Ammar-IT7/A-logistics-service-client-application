/**
 * Wallet Page Controller
 * Enhanced for Mobile-First 2-Column Grid Design
 * Manages wallet balance, transactions, and payment methods
 */
window.WalletController = {
    /**
     * Initialize the wallet page
     */
    init: function() {
        console.log('WalletController: Initializing wallet page with 2-column grid layout');
        
        this.loadWalletData();
        this.setupEventListeners();
        this.setupBalanceVisibility();
        this.updateStatistics();
        this.setupMobileOptimizations();
        
        console.log('WalletController: Wallet page initialized successfully');
    },

    /**
     * Load wallet data
     */
    loadWalletData: function() {
        // Simulate loading wallet data
        const walletData = {
            balance: 2450.00,
            currency: 'ر.ي',
            transactions: [
                {
                    id: 'TXN-001',
                    type: 'payment',
                    title: 'دفع طلب #INT-4521',
                    amount: -1250.00,
                    date: '15 يناير 2025 - 10:30 ص',
                    status: 'completed'
                },
                {
                    id: 'TXN-002',
                    type: 'deposit',
                    title: 'إضافة رصيد',
                    amount: 500.00,
                    date: '14 يناير 2025 - 15:45 م',
                    status: 'completed'
                },
                {
                    id: 'TXN-003',
                    type: 'refund',
                    title: 'استرداد طلب #INT-7890',
                    amount: 2100.00,
                    date: '12 يناير 2025 - 09:15 ص',
                    status: 'completed'
                },
                {
                    id: 'TXN-004',
                    type: 'fee',
                    title: 'رسوم خدمة',
                    amount: -25.00,
                    date: '10 يناير 2025 - 14:20 م',
                    status: 'completed'
                }
            ],
            paymentMethods: [
                {
                    id: 'pm-001',
                    type: 'card',
                    name: 'Visa •••• 1234',
                    brand: 'visa',
                    isPrimary: true
                },
                {
                    id: 'pm-002',
                    type: 'bank',
                    name: 'البنك الأهلي',
                    isVerified: true
                }
            ],
            stats: {
                totalDeposits: 15200,
                totalPayments: 12750,
                totalTransactions: 24
            }
        };

        this.updateWalletDisplay(walletData);
    },

    /**
     * Update wallet display with data
     */
    updateWalletDisplay: function(data) {
        this.updateBalance(data.balance, data.currency);
        this.updateTransactions(data.transactions);
        this.updatePaymentMethods(data.paymentMethods);
        this.updateStatistics(data.stats);
    },

    /**
     * Update balance display
     */
    updateBalance: function(balance, currency) {
        const balanceElement = document.querySelector('.wallet-amount-value');
        const currencyElement = document.querySelector('.wallet-currency');
        
        if (balanceElement) {
            balanceElement.textContent = balance.toLocaleString('ar-SA', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
        
        if (currencyElement) {
            currencyElement.textContent = currency;
        }
    },

    /**
     * Update transactions list in 2-column grid
     */
    updateTransactions: function(transactions) {
        const transactionsList = document.getElementById('recentTransactionsList');
        if (!transactionsList) return;

        // Clear existing transactions
        transactionsList.innerHTML = '';

        transactions.forEach(transaction => {
            const transactionElement = this.createTransactionElement(transaction);
            transactionsList.appendChild(transactionElement);
        });
    },

    /**
     * Create transaction element optimized for 2-column grid
     */
    createTransactionElement: function(transaction) {
        const transactionDiv = document.createElement('div');
        transactionDiv.className = `wallet-transaction-item ${transaction.type}`;
        
        const iconClass = this.getTransactionIcon(transaction.type);
        const amountClass = transaction.amount > 0 ? 'positive' : 'negative';
        const amountSign = transaction.amount > 0 ? '+' : '';
        
        transactionDiv.innerHTML = `
            <div class="wallet-transaction-icon">
                <i class="${iconClass}"></i>
            </div>
            <div class="wallet-transaction-content">
                <div class="wallet-transaction-header">
                    <h4 class="wallet-transaction-title">${transaction.title}</h4>
                    <span class="wallet-transaction-amount ${amountClass}">${amountSign}${transaction.amount.toLocaleString('ar-SA', {minimumFractionDigits: 2})} ر.ي</span>
                </div>
                <div class="wallet-transaction-details">
                    <span class="wallet-transaction-date">${transaction.date}</span>
                    <span class="wallet-transaction-status ${transaction.status}">مكتمل</span>
                </div>
            </div>
            <div class="wallet-transaction-action">
                <button class="btn btn-sm btn-outline" data-action="view-transaction" data-transaction-id="${transaction.id}">
                    التفاصيل
                </button>
            </div>
        `;
        
        return transactionDiv;
    },

    /**
     * Get transaction icon class
     */
    getTransactionIcon: function(type) {
        const icons = {
            payment: 'fas fa-credit-card',
            deposit: 'fas fa-plus-circle',
            refund: 'fas fa-undo',
            fee: 'fas fa-percentage',
            withdrawal: 'fas fa-minus-circle'
        };
        return icons[type] || 'fas fa-exchange-alt';
    },

    /**
     * Update payment methods in 2-column grid
     */
    updatePaymentMethods: function(paymentMethods) {
        const paymentMethodsList = document.querySelector('.wallet-payment-methods-list');
        if (!paymentMethodsList) return;

        // Clear existing payment methods
        paymentMethodsList.innerHTML = '';

        paymentMethods.forEach(method => {
            const methodElement = this.createPaymentMethodElement(method);
            paymentMethodsList.appendChild(methodElement);
        });
    },

    /**
     * Create payment method element optimized for 2-column grid
     */
    createPaymentMethodElement: function(method) {
        const methodDiv = document.createElement('div');
        methodDiv.className = `wallet-payment-method-item ${method.isPrimary ? 'primary' : ''}`;
        
        const iconClass = this.getPaymentMethodIcon(method.type, method.brand);
        
        methodDiv.innerHTML = `
            <div class="wallet-payment-method-icon">
                <i class="${iconClass}"></i>
            </div>
            <div class="wallet-payment-method-content">
                <h4 class="wallet-payment-method-name">${method.name}</h4>
                <span class="wallet-payment-method-type">${this.getPaymentMethodType(method.type)}</span>
            </div>
            <div class="wallet-payment-method-status">
                ${method.isPrimary ? '<span class="wallet-primary-badge">افتراضية</span>' : ''}
                ${method.isVerified ? '<span class="wallet-verified-badge">موثق</span>' : ''}
            </div>
        `;
        
        return methodDiv;
    },

    /**
     * Get payment method icon class
     */
    getPaymentMethodIcon: function(type, brand) {
        if (type === 'card') {
            const brandIcons = {
                visa: 'fab fa-cc-visa',
                mastercard: 'fab fa-cc-mastercard',
                amex: 'fab fa-cc-amex'
            };
            return brandIcons[brand] || 'fas fa-credit-card';
        } else if (type === 'bank') {
            return 'fas fa-university';
        }
        return 'fas fa-credit-card';
    },

    /**
     * Get payment method type text
     */
    getPaymentMethodType: function(type) {
        const types = {
            card: 'بطاقة ائتمان',
            bank: 'حساب بنكي',
            wallet: 'محفظة رقمية'
        };
        return types[type] || 'طريقة دفع';
    },

    /**
     * Update statistics in 2-column grid
     */
    updateStatistics: function(stats) {
        const statElements = document.querySelectorAll('.wallet-stat-value');
        
        if (statElements.length >= 3) {
            statElements[0].textContent = stats.totalDeposits.toLocaleString('ar-SA');
            statElements[1].textContent = stats.totalPayments.toLocaleString('ar-SA');
            statElements[2].textContent = stats.totalTransactions.toLocaleString('ar-SA');
        }
    },

    /**
     * Setup event listeners
     */
    setupEventListeners: function() {
        // Balance visibility toggle
        document.addEventListener('click', (e) => {
            if (e.target.closest('.wallet-balance-toggle')) {
                this.toggleBalanceVisibility();
            }
        });

        // Quick action items
        document.addEventListener('click', (e) => {
            if (e.target.closest('.wallet-quick-action-item')) {
                this.handleQuickAction(e.target.closest('.wallet-quick-action-item'));
            }
        });

        // Transaction actions
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-action="view-transaction"]')) {
                this.viewTransaction(e.target.closest('[data-action="view-transaction"]'));
            }
        });

        // Payment method actions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.wallet-payment-method-item')) {
                this.handlePaymentMethodClick(e.target.closest('.wallet-payment-method-item'));
            }
        });

        // Add funds button
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-action="add-funds"]')) {
                this.addFunds();
            }
        });

        // Withdraw funds button
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-action="withdraw-funds"]')) {
                this.withdrawFunds();
            }
        });
    },

    /**
     * Setup balance visibility
     */
    setupBalanceVisibility: function() {
        const balanceAmount = document.querySelector('.wallet-balance-amount');
        const balanceToggle = document.querySelector('.wallet-balance-toggle');
        
        if (balanceAmount && balanceToggle) {
            // Check if balance should be hidden by default
            const isHidden = localStorage.getItem('wallet_balance_hidden') === 'true';
            if (isHidden) {
                this.hideBalance();
            }
        }
    },

    /**
     * Toggle balance visibility
     */
    toggleBalanceVisibility: function() {
        const balanceAmount = document.querySelector('.wallet-balance-amount');
        const balanceToggle = document.querySelector('.wallet-balance-toggle');
        
        if (balanceAmount && balanceToggle) {
            if (balanceAmount.classList.contains('hidden')) {
                this.showBalance();
            } else {
                this.hideBalance();
            }
        }
    },

    /**
     * Hide balance
     */
    hideBalance: function() {
        const balanceAmount = document.querySelector('.wallet-balance-amount');
        const balanceToggle = document.querySelector('.wallet-balance-toggle');
        
        if (balanceAmount && balanceToggle) {
            balanceAmount.classList.add('hidden');
            balanceToggle.classList.add('hidden');
            localStorage.setItem('wallet_balance_hidden', 'true');
        }
    },

    /**
     * Show balance
     */
    showBalance: function() {
        const balanceAmount = document.querySelector('.wallet-balance-amount');
        const balanceToggle = document.querySelector('.wallet-balance-toggle');
        
        if (balanceAmount && balanceToggle) {
            balanceAmount.classList.remove('hidden');
            balanceToggle.classList.remove('hidden');
            localStorage.setItem('wallet_balance_hidden', 'false');
        }
    },

    /**
     * Setup mobile optimizations
     */
    setupMobileOptimizations: function() {
        // Touch feedback for mobile
        const touchElements = document.querySelectorAll('.wallet-quick-action-item, .wallet-transaction-item, .wallet-payment-method-item, .wallet-stat-card');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.style.transform = 'scale(0.98)';
            });
            
            element.addEventListener('touchend', () => {
                element.style.transform = 'scale(1)';
            });
        });

        // Optimize for mobile performance
        if (window.innerWidth <= 768) {
            this.optimizeForMobile();
        }
    },

    /**
     * Optimize for mobile performance
     */
    optimizeForMobile: function() {
        // Reduce animation complexity on mobile
        const style = document.createElement('style');
        style.textContent = `
            .wallet-quick-action-item,
            .wallet-transaction-item,
            .wallet-payment-method-item,
            .wallet-stat-card {
                transition: transform 0.2s ease-out;
            }
        `;
        document.head.appendChild(style);
    },

    /**
     * Handle quick action click
     */
    handleQuickAction: function(actionItem) {
        const action = actionItem.getAttribute('data-action');
        const page = actionItem.getAttribute('data-page');
        
        if (page) {
            // Navigate to page
            this.navigateToPage(page);
        } else if (action) {
            // Handle specific action
            this.handleAction(action);
        }
        
        // Add haptic feedback on mobile
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    },

    /**
     * Navigate to page
     */
    navigateToPage: function(page) {
        console.log('Navigating to:', page);
        // Implement navigation logic here
        // For now, just show a toast
        this.showToast(`انتقال إلى ${page}`, 'info');
    },

    /**
     * Handle action
     */
    handleAction: function(action) {
        console.log('Handling action:', action);
        // Implement action logic here
        this.showToast(`تنفيذ الإجراء: ${action}`, 'info');
    },

    /**
     * View transaction details
     */
    viewTransaction: function(button) {
        const transactionId = button.getAttribute('data-transaction-id');
        console.log('Viewing transaction:', transactionId);
        
        // Show transaction details modal
        this.showModal({
            title: 'تفاصيل المعاملة',
            content: `تفاصيل المعاملة رقم: ${transactionId}`,
            type: 'transaction'
        });
    },

    /**
     * Handle payment method click
     */
    handlePaymentMethodClick: function(methodItem) {
        const methodName = methodItem.querySelector('.wallet-payment-method-name').textContent;
        console.log('Payment method clicked:', methodName);
        
        // Show payment method details
        this.showModal({
            title: methodName,
            content: 'تفاصيل طريقة الدفع',
            type: 'payment-method'
        });
    },

    /**
     * Add funds
     */
    addFunds: function() {
        console.log('Adding funds');
        
        // Show add funds modal
        this.showModal({
            title: 'إضافة رصيد',
            content: 'نموذج إضافة رصيد',
            type: 'add-funds'
        });
    },

    /**
     * Withdraw funds
     */
    withdrawFunds: function() {
        console.log('Withdrawing funds');
        
        // Show withdraw funds modal
        this.showModal({
            title: 'سحب رصيد',
            content: 'نموذج سحب رصيد',
            type: 'withdraw-funds'
        });
    },

    /**
     * Show modal
     */
    showModal: function(data) {
        // Implementation for showing modal
        console.log('Showing modal:', data);
        
        // You can implement your modal system here
        // For now, we'll just show a toast
        this.showToast(data.title, 'info');
    },

    /**
     * Show toast notification
     */
    showToast: function(message, type = 'info') {
        // Implementation for showing toast
        console.log('Toast:', message, type);
        
        // You can implement your toast system here
        // For now, we'll use alert as fallback
        alert(message);
    },

    /**
     * Refresh wallet data
     */
    refreshData: function() {
        console.log('Refreshing wallet data...');
        this.loadWalletData();
    },

    /**
     * Update page content
     */
    updateContent: function() {
        // Update any dynamic content
        this.refreshData();
    },

    /**
     * Handle page visibility change
     */
    handleVisibilityChange: function() {
        if (!document.hidden) {
            this.updateContent();
        }
    },

    /**
     * Cleanup on page unload
     */
    cleanup: function() {
        // Remove event listeners and cleanup
        console.log('Cleaning up wallet controller');
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('wallet-page')) {
        WalletController.init();
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (WalletController.handleVisibilityChange) {
        WalletController.handleVisibilityChange();
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (WalletController.cleanup) {
        WalletController.cleanup();
    }
}); 