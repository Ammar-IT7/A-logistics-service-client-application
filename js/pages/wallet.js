/**
 * Wallet Page Controller
 * Manages wallet balance, transactions, and payment methods
 */
window.WalletController = {
    /**
     * Initialize the wallet page
     */
    init: function() {
        console.log('WalletController: Initializing wallet page');
        
        this.loadWalletData();
        this.setupEventListeners();
        this.setupBalanceVisibility();
        this.updateStatistics();
        
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
        const balanceElement = document.getElementById('balanceAmount');
        if (balanceElement) {
            const amountValue = balanceElement.querySelector('.amount-value');
            const currencyElement = balanceElement.querySelector('.currency');
            
            if (amountValue) {
                amountValue.textContent = balance.toLocaleString('ar-SA', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            }
            
            if (currencyElement) {
                currencyElement.textContent = currency;
            }
        }
    },

    /**
     * Update transactions list
     */
    updateTransactions: function(transactions) {
        const container = document.getElementById('recentTransactionsList');
        if (!container) return;

        // Clear existing content
        container.innerHTML = '';

        transactions.forEach(transaction => {
            const transactionElement = this.createTransactionElement(transaction);
            container.appendChild(transactionElement);
        });
    },

    /**
     * Create transaction element
     */
    createTransactionElement: function(transaction) {
        const element = document.createElement('div');
        element.className = `transaction-item ${transaction.type}`;
        element.dataset.id = transaction.id;

        const iconClass = this.getTransactionIconClass(transaction.type);
        const amountClass = transaction.amount > 0 ? 'positive' : 'negative';
        const amountText = transaction.amount > 0 ? `+${transaction.amount}` : transaction.amount;

        element.innerHTML = `
            <div class="transaction-icon">
                <i class="${iconClass}"></i>
            </div>
            <div class="transaction-content">
                <div class="transaction-header">
                    <h4 class="transaction-title">${transaction.title}</h4>
                    <span class="transaction-amount ${amountClass}">${amountText.toLocaleString('ar-SA', {minimumFractionDigits: 2})} ر.ي</span>
                </div>
                <div class="transaction-details">
                    <span class="transaction-date">${transaction.date}</span>
                    <span class="transaction-status ${transaction.status}">مكتمل</span>
                </div>
            </div>
            <div class="transaction-action">
                <button class="btn btn-sm btn-outline" data-action="view-transaction" data-transaction-id="${transaction.id}">
                    التفاصيل
                </button>
            </div>
        `;

        return element;
    },

    /**
     * Get transaction icon class based on type
     */
    getTransactionIconClass: function(type) {
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
     * Update payment methods list
     */
    updatePaymentMethods: function(paymentMethods) {
        const container = document.querySelector('.payment-methods-list');
        if (!container) return;

        // Clear existing content
        container.innerHTML = '';

        paymentMethods.forEach(method => {
            const methodElement = this.createPaymentMethodElement(method);
            container.appendChild(methodElement);
        });
    },

    /**
     * Create payment method element
     */
    createPaymentMethodElement: function(method) {
        const element = document.createElement('div');
        element.className = `payment-method-item ${method.isPrimary ? 'primary' : ''}`;
        element.dataset.id = method.id;

        const iconClass = method.type === 'card' ? `fab fa-cc-${method.brand}` : 'fas fa-university';
        const statusBadge = method.isPrimary ? 
            '<span class="primary-badge">افتراضية</span>' : 
            '<span class="verified-badge">موثق</span>';

        element.innerHTML = `
            <div class="payment-method-icon">
                <i class="${iconClass}"></i>
            </div>
            <div class="payment-method-content">
                <h4>${method.name}</h4>
                <span class="payment-method-type">${method.type === 'card' ? 'بطاقة ائتمان' : 'حساب بنكي'}</span>
            </div>
            <div class="payment-method-status">
                ${statusBadge}
            </div>
        `;

        return element;
    },

    /**
     * Update statistics
     */
    updateStatistics: function(stats) {
        const statCards = document.querySelectorAll('.stats-grid .stat-card');
        
        if (statCards.length >= 3) {
            // Update deposits
            const depositsValue = statCards[0].querySelector('.stat-value');
            if (depositsValue) {
                depositsValue.textContent = stats.totalDeposits.toLocaleString('ar-SA');
            }

            // Update payments
            const paymentsValue = statCards[1].querySelector('.stat-value');
            if (paymentsValue) {
                paymentsValue.textContent = stats.totalPayments.toLocaleString('ar-SA');
            }

            // Update transactions count
            const transactionsValue = statCards[2].querySelector('.stat-value');
            if (transactionsValue) {
                transactionsValue.textContent = stats.totalTransactions;
            }
        }
    },

    /**
     * Setup event listeners
     */
    setupEventListeners: function() {
        // Balance toggle
        const balanceToggle = document.querySelector('[data-action="toggle-balance-visibility"]');
        if (balanceToggle) {
            balanceToggle.addEventListener('click', this.handleBalanceToggle.bind(this));
        }

        // Add funds button
        const addFundsBtn = document.querySelector('[data-action="add-funds"]');
        if (addFundsBtn) {
            addFundsBtn.addEventListener('click', this.handleAddFunds.bind(this));
        }

        // Withdraw funds button
        const withdrawFundsBtn = document.querySelector('[data-action="withdraw-funds"]');
        if (withdrawFundsBtn) {
            withdrawFundsBtn.addEventListener('click', this.handleWithdrawFunds.bind(this));
        }

        // Quick action items
        const quickActionItems = document.querySelectorAll('.quick-action-item[data-action="navigate"]');
        quickActionItems.forEach(item => {
            item.addEventListener('click', this.handleQuickAction.bind(this));
        });

        // Transaction actions (delegated)
        document.addEventListener('click', this.handleTransactionAction.bind(this));
    },

    /**
     * Setup balance visibility toggle
     */
    setupBalanceVisibility: function() {
        this.balanceVisible = true;
    },

    /**
     * Handle balance visibility toggle
     */
    handleBalanceToggle: function() {
        const balanceElement = document.getElementById('balanceAmount');
        const toggleBtn = document.querySelector('[data-action="toggle-balance-visibility"]');
        
        if (balanceElement && toggleBtn) {
            this.balanceVisible = !this.balanceVisible;
            
            if (this.balanceVisible) {
                balanceElement.style.filter = 'none';
                toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
            } else {
                balanceElement.style.filter = 'blur(4px)';
                toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
            }
        }
    },

    /**
     * Handle add funds
     */
    handleAddFunds: function() {
        Modal.open('add-funds', {
            title: 'إضافة رصيد',
            content: this.getAddFundsForm(),
            onConfirm: (data) => {
                this.processAddFunds(data);
            }
        });
    },

    /**
     * Handle withdraw funds
     */
    handleWithdrawFunds: function() {
        Modal.open('withdraw-funds', {
            title: 'سحب رصيد',
            content: this.getWithdrawFundsForm(),
            onConfirm: (data) => {
                this.processWithdrawFunds(data);
            }
        });
    },

    /**
     * Handle quick action navigation
     */
    handleQuickAction: function(event) {
        const page = event.currentTarget.dataset.page;
        if (page) {
            Router.navigate(page);
        }
    },

    /**
     * Handle transaction action
     */
    handleTransactionAction: function(event) {
        const action = event.target.dataset.action;
        if (!action) return;

        const transactionId = event.target.dataset.transactionId;

        if (action === 'view-transaction') {
            this.viewTransaction(transactionId);
        }
    },

    /**
     * Get add funds form HTML
     */
    getAddFundsForm: function() {
        return `
            <div class="form-group">
                <label class="form-label">المبلغ</label>
                <input type="number" id="addFundsAmount" class="form-control" placeholder="أدخل المبلغ" min="10" step="0.01">
            </div>
            <div class="form-group">
                <label class="form-label">طريقة الدفع</label>
                <select id="addFundsMethod" class="form-control">
                    <option value="card">بطاقة ائتمان</option>
                    <option value="bank">تحويل بنكي</option>
                </select>
            </div>
        `;
    },

    /**
     * Get withdraw funds form HTML
     */
    getWithdrawFundsForm: function() {
        return `
            <div class="form-group">
                <label class="form-label">المبلغ</label>
                <input type="number" id="withdrawAmount" class="form-control" placeholder="أدخل المبلغ" min="10" step="0.01">
            </div>
            <div class="form-group">
                <label class="form-label">الحساب البنكي</label>
                <select id="withdrawAccount" class="form-control">
                    <option value="bank-001">البنك الأهلي - 1234567890</option>
                </select>
            </div>
        `;
    },

    /**
     * Process add funds
     */
    processAddFunds: function(data) {
        const amount = parseFloat(data.amount);
        const method = data.method;

        if (amount < 10) {
            Toast.show('خطأ', 'الحد الأدنى للإيداع هو 10 ريال', 'error');
            return;
        }

        // Show loading
        Loader.show();

        // Simulate API call
        setTimeout(() => {
            Loader.hide();
            
            // Update balance
            const currentBalance = this.getCurrentBalance();
            const newBalance = currentBalance + amount;
            this.updateBalance(newBalance, 'ر.ي');

            // Add transaction
            this.addTransaction({
                type: 'deposit',
                title: 'إضافة رصيد',
                amount: amount,
                date: new Date().toLocaleString('ar-SA'),
                status: 'completed'
            });

            Toast.show('تم الإيداع', `تم إضافة ${amount} ريال إلى رصيدك بنجاح`, 'success');
        }, 2000);
    },

    /**
     * Process withdraw funds
     */
    processWithdrawFunds: function(data) {
        const amount = parseFloat(data.amount);
        const currentBalance = this.getCurrentBalance();

        if (amount > currentBalance) {
            Toast.show('خطأ', 'رصيدك غير كافي', 'error');
            return;
        }

        if (amount < 10) {
            Toast.show('خطأ', 'الحد الأدنى للسحب هو 10 ريال', 'error');
            return;
        }

        // Show loading
        Loader.show();

        // Simulate API call
        setTimeout(() => {
            Loader.hide();
            
            // Update balance
            const newBalance = currentBalance - amount;
            this.updateBalance(newBalance, 'ر.ي');

            // Add transaction
            this.addTransaction({
                type: 'withdrawal',
                title: 'سحب رصيد',
                amount: -amount,
                date: new Date().toLocaleString('ar-SA'),
                status: 'completed'
            });

            Toast.show('تم السحب', `تم سحب ${amount} ريال من رصيدك بنجاح`, 'success');
        }, 2000);
    },

    /**
     * Get current balance
     */
    getCurrentBalance: function() {
        const balanceElement = document.getElementById('balanceAmount');
        if (balanceElement) {
            const amountText = balanceElement.querySelector('.amount-value')?.textContent;
            return parseFloat(amountText?.replace(/,/g, '') || '0');
        }
        return 0;
    },

    /**
     * Add new transaction
     */
    addTransaction: function(transaction) {
        const container = document.getElementById('recentTransactionsList');
        if (container) {
            const transactionElement = this.createTransactionElement(transaction);
            container.insertBefore(transactionElement, container.firstChild);
        }
    },

    /**
     * View transaction details
     */
    viewTransaction: function(transactionId) {
        // Open transaction details modal
        Modal.open('transaction-details', {
            transactionId: transactionId
        });
    },

    /**
     * Export transaction history
     */
    exportTransactionHistory: function() {
        const transactions = Array.from(document.querySelectorAll('.transaction-item')).map(item => ({
            id: item.dataset.id,
            title: item.querySelector('.transaction-title')?.textContent,
            amount: item.querySelector('.transaction-amount')?.textContent,
            date: item.querySelector('.transaction-date')?.textContent
        }));

        const dataStr = JSON.stringify(transactions, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'transaction-history.json';
        link.click();
        
        URL.revokeObjectURL(url);
        Toast.show('تم التصدير', 'تم تصدير سجل المعاملات', 'success');
    },

    /**
     * Cleanup when destroying the controller
     */
    destroy: function() {
        console.log('WalletController: Destroying wallet page');
        
        // Remove event listeners
        const balanceToggle = document.querySelector('[data-action="toggle-balance-visibility"]');
        if (balanceToggle) {
            balanceToggle.removeEventListener('click', this.handleBalanceToggle);
        }

        const addFundsBtn = document.querySelector('[data-action="add-funds"]');
        if (addFundsBtn) {
            addFundsBtn.removeEventListener('click', this.handleAddFunds);
        }

        const withdrawFundsBtn = document.querySelector('[data-action="withdraw-funds"]');
        if (withdrawFundsBtn) {
            withdrawFundsBtn.removeEventListener('click', this.handleWithdrawFunds);
        }

        const quickActionItems = document.querySelectorAll('.quick-action-item[data-action="navigate"]');
        quickActionItems.forEach(item => {
            item.removeEventListener('click', this.handleQuickAction);
        });

        console.log('WalletController: Wallet page destroyed successfully');
    }
}; 