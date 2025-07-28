/**
 * Transaction History Page Controller
 */
window.TransactionHistoryController = {
    /**
     * Initialize the transaction history page
     */
    init: function() {
        console.log('TransactionHistoryController: Initializing...');
        this.currentFilter = 'all';
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.loadTransactions();
        this.setupEventListeners();
        this.updateStats();
        this.renderTransactions();
    },

    /**
     * Load transactions from storage/API
     */
    loadTransactions: function() {
        // Load from localStorage or API
        const savedTransactions = localStorage.getItem('transactions');
        if (savedTransactions) {
            this.transactions = JSON.parse(savedTransactions);
        } else {
            // Default transactions
            this.transactions = [
                {
                    id: 1,
                    type: 'income',
                    title: 'إيداع من البنك',
                    amount: 500,
                    description: 'إيداع من حساب بنك الرياض',
                    date: new Date(),
                    status: 'completed',
                    category: 'deposit',
                    reference: 'BANK-001'
                },
                {
                    id: 2,
                    type: 'expense',
                    title: 'دفع خدمة الشحن',
                    amount: -180,
                    description: 'دفع لشركة الشحن السريع - طلب #12345',
                    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
                    status: 'completed',
                    category: 'shipping',
                    reference: 'SHIP-12345'
                },
                {
                    id: 3,
                    type: 'income',
                    title: 'استرداد مالي',
                    amount: 75,
                    description: 'استرداد رسوم إضافية - طلب #12340',
                    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                    status: 'completed',
                    category: 'refund',
                    reference: 'REF-12340'
                },
                {
                    id: 4,
                    type: 'expense',
                    title: 'دفع خدمة التخزين',
                    amount: -320,
                    description: 'دفع شهري لمستودع الرياض - يناير 2024',
                    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                    status: 'pending',
                    category: 'storage',
                    reference: 'STOR-001'
                },
                {
                    id: 5,
                    type: 'income',
                    title: 'إيداع من المحفظة',
                    amount: 1200,
                    description: 'تحويل من Apple Pay',
                    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    status: 'completed',
                    category: 'wallet',
                    reference: 'WALLET-001'
                },
                {
                    id: 6,
                    type: 'expense',
                    title: 'رسوم التخليص الجمركي',
                    amount: -450,
                    description: 'رسوم جمركية - شحنة #78901',
                    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    status: 'completed',
                    category: 'customs',
                    reference: 'CUST-78901'
                }
            ];
            this.saveTransactions();
        }
    },

    /**
     * Save transactions to storage
     */
    saveTransactions: function() {
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
    },

    /**
     * Set up event listeners
     */
    setupEventListeners: function() {
        // Filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.setActiveFilter(e.target.dataset.filter);
            });
        });

        // Transaction actions
        document.addEventListener('click', (e) => {
            const action = e.target.closest('[data-action]');
            if (!action) return;

            const actionType = action.dataset.action;
            const transactionId = action.dataset.id;

            switch (actionType) {
                case 'view-transaction':
                    this.viewTransaction(transactionId);
                    break;
                case 'load-more-transactions':
                    this.loadMoreTransactions();
                    break;
                case 'reset-filters':
                    this.resetFilters();
                    break;
            }
        });

        // Filter modal
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="open-modal"][data-modal="filter-transactions"]')) {
                this.openFilterModal();
            }
        });
    },

    /**
     * Set active filter
     */
    setActiveFilter: function(filter) {
        this.currentFilter = filter;
        this.currentPage = 1;

        // Update active tab
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

        // Filter and render transactions
        this.renderTransactions();
        this.updateEmptyState();
    },

    /**
     * Filter transactions based on current filter
     */
    getFilteredTransactions: function() {
        let filtered = this.transactions;

        switch (this.currentFilter) {
            case 'income':
                filtered = filtered.filter(t => t.type === 'income');
                break;
            case 'expense':
                filtered = filtered.filter(t => t.type === 'expense');
                break;
            case 'pending':
                filtered = filtered.filter(t => t.status === 'pending');
                break;
            case 'all':
            default:
                // Show all transactions
                break;
        }

        // Sort by date (newest first)
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

        return filtered;
    },

    /**
     * Render transactions
     */
    renderTransactions: function() {
        const container = document.querySelector('.transactions-container');
        if (!container) return;

        const filteredTransactions = this.getFilteredTransactions();
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const transactionsToShow = filteredTransactions.slice(startIndex, endIndex);

        // Clear container
        container.innerHTML = '';

        // Render transactions
        transactionsToShow.forEach(transaction => {
            const transactionElement = this.createTransactionElement(transaction);
            container.appendChild(transactionElement);
        });

        // Update load more button
        this.updateLoadMoreButton(filteredTransactions.length, endIndex);
    },

    /**
     * Create transaction element
     */
    createTransactionElement: function(transaction) {
        const element = document.createElement('div');
        element.className = `transaction-item ${transaction.type}`;
        element.dataset.type = transaction.type;
        element.dataset.id = transaction.id;

        const date = this.formatDate(transaction.date);
        const amount = transaction.amount > 0 ? `+${transaction.amount}` : transaction.amount;
        const amountClass = transaction.amount > 0 ? 'positive' : 'negative';

        element.innerHTML = `
            <div class="transaction-icon">
                <i class="fas fa-arrow-${transaction.type === 'income' ? 'up' : 'down'}"></i>
            </div>
            <div class="transaction-details">
                <div class="transaction-header">
                    <h3 class="transaction-title">${transaction.title}</h3>
                    <span class="transaction-amount ${amountClass}">${amount} ريال</span>
                </div>
                <div class="transaction-meta">
                    <span class="transaction-date">${date}</span>
                    <span class="transaction-status ${transaction.status}">${this.getStatusText(transaction.status)}</span>
                </div>
                <div class="transaction-description">
                    ${transaction.description}
                </div>
            </div>
            <button class="transaction-action" data-action="view-transaction" data-id="${transaction.id}">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;

        return element;
    },

    /**
     * Format date for display
     */
    formatDate: function(date) {
        const now = new Date();
        const transactionDate = new Date(date);
        const diffTime = Math.abs(now - transactionDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            return 'اليوم، ' + transactionDate.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 2) {
            return 'أمس، ' + transactionDate.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays <= 7) {
            return `منذ ${diffDays - 1} أيام، ` + transactionDate.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
        } else {
            return transactionDate.toLocaleDateString('ar-SA', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    },

    /**
     * Get status text in Arabic
     */
    getStatusText: function(status) {
        const statusMap = {
            'completed': 'مكتمل',
            'pending': 'قيد الانتظار',
            'failed': 'فشل',
            'cancelled': 'ملغي'
        };
        return statusMap[status] || status;
    },

    /**
     * Update statistics
     */
    updateStats: function() {
        const incomeTotal = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenseTotal = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        // Update income stat
        const incomeStat = document.querySelector('.stat-card .stat-value');
        if (incomeStat) {
            incomeStat.textContent = `+${incomeTotal.toLocaleString()} ريال`;
        }

        // Update expense stat
        const expenseStat = document.querySelectorAll('.stat-card .stat-value')[1];
        if (expenseStat) {
            expenseStat.textContent = `-${expenseTotal.toLocaleString()} ريال`;
        }
    },

    /**
     * View transaction details
     */
    viewTransaction: function(transactionId) {
        const transaction = this.transactions.find(t => t.id == transactionId);
        if (transaction) {
            Modal.open('transaction-details', { transaction });
        }
    },

    /**
     * Load more transactions
     */
    loadMoreTransactions: function() {
        this.currentPage++;
        this.renderTransactions();
    },

    /**
     * Update load more button visibility
     */
    updateLoadMoreButton: function(totalCount, currentCount) {
        const loadMoreBtn = document.querySelector('[data-action="load-more-transactions"]');
        if (loadMoreBtn) {
            if (currentCount >= totalCount) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'block';
            }
        }
    },

    /**
     * Update empty state visibility
     */
    updateEmptyState: function() {
        const emptyState = document.querySelector('.empty-state');
        const transactionsContainer = document.querySelector('.transactions-container');
        const filteredTransactions = this.getFilteredTransactions();

        if (filteredTransactions.length === 0) {
            emptyState.classList.remove('hidden');
            transactionsContainer.style.display = 'none';
        } else {
            emptyState.classList.add('hidden');
            transactionsContainer.style.display = 'block';
        }
    },

    /**
     * Reset filters
     */
    resetFilters: function() {
        this.setActiveFilter('all');
    },

    /**
     * Open filter modal
     */
    openFilterModal: function() {
        Modal.open('filter-transactions', {
            currentFilter: this.currentFilter,
            onApply: (filters) => {
                this.applyAdvancedFilters(filters);
            }
        });
    },

    /**
     * Apply advanced filters
     */
    applyAdvancedFilters: function(filters) {
        // Implementation for advanced filtering
        console.log('Applying advanced filters:', filters);
        this.renderTransactions();
    },

    /**
     * Add new transaction
     */
    addTransaction: function(transactionData) {
        const newTransaction = {
            id: Date.now(),
            ...transactionData,
            date: new Date()
        };

        this.transactions.unshift(newTransaction);
        this.saveTransactions();
        this.updateStats();
        this.renderTransactions();
    },

    /**
     * Export transactions
     */
    exportTransactions: function(format = 'csv') {
        const filteredTransactions = this.getFilteredTransactions();
        
        if (format === 'csv') {
            this.exportToCSV(filteredTransactions);
        } else if (format === 'pdf') {
            this.exportToPDF(filteredTransactions);
        }
    },

    /**
     * Export to CSV
     */
    exportToCSV: function(transactions) {
        const headers = ['التاريخ', 'النوع', 'العنوان', 'المبلغ', 'الوصف', 'الحالة'];
        const csvContent = [
            headers.join(','),
            ...transactions.map(t => [
                this.formatDate(t.date),
                t.type === 'income' ? 'إيداع' : 'دفع',
                t.title,
                t.amount,
                t.description,
                this.getStatusText(t.status)
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    },

    /**
     * Export to PDF (placeholder)
     */
    exportToPDF: function(transactions) {
        // Implementation would require a PDF library
        Toast.show('قريباً', 'سيتم إضافة تصدير PDF قريباً', 'info');
    },

    /**
     * Clean up when leaving the page
     */
    destroy: function() {
        console.log('TransactionHistoryController: Destroying...');
        // Remove event listeners if needed
    }
}; 