/**
 * Billing Page Controller
 */
window.BillingController = {
    /**
     * Initialize the billing page
     */
    init: function() {
        this.bindEvents();
        this.loadBillingData();
        this.setupInvoices();
        this.initializePaymentMethods();
    },

    /**
     * Bind event listeners
     */
    bindEvents: function() {
        // Invoice actions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.invoice-item')) {
                this.showInvoiceDetails(e.target.closest('.invoice-item'));
            }
        });

        // Download invoice
        document.addEventListener('click', (e) => {
            if (e.target.closest('.download-invoice')) {
                this.downloadInvoice(e.target.closest('.download-invoice').dataset.invoiceId);
            }
        });

        // Pay invoice
        document.addEventListener('click', (e) => {
            if (e.target.closest('.pay-invoice')) {
                this.payInvoice(e.target.closest('.pay-invoice').dataset.invoiceId);
            }
        });

        // Filter invoices
        const filterSelect = document.getElementById('invoiceFilter');
        if (filterSelect) {
            filterSelect.addEventListener('change', this.filterInvoices.bind(this));
        }

        // Search invoices
        const searchInput = document.getElementById('invoiceSearch');
        if (searchInput) {
            searchInput.addEventListener('input', this.searchInvoices.bind(this));
        }

        // Add payment method
        const addPaymentBtn = document.getElementById('addPaymentMethod');
        if (addPaymentBtn) {
            addPaymentBtn.addEventListener('click', this.showAddPaymentMethod.bind(this));
        }
    },

    /**
     * Load billing data
     */
    loadBillingData: function() {
        // Mock billing data
        const billingData = {
            currentBalance: 1250.00,
            pendingAmount: 450.00,
            invoices: [
                {
                    id: 'INV-001',
                    date: '2024-01-15',
                    dueDate: '2024-02-15',
                    amount: 850.00,
                    status: 'paid',
                    description: 'خدمات شحن بحري - يناير 2024',
                    items: [
                        { name: 'شحن حاوية 20 قدم', quantity: 1, price: 500.00 },
                        { name: 'تخليص جمركي', quantity: 1, price: 200.00 },
                        { name: 'خدمات إضافية', quantity: 1, price: 150.00 }
                    ]
                },
                {
                    id: 'INV-002',
                    date: '2024-02-01',
                    dueDate: '2024-03-01',
                    amount: 450.00,
                    status: 'pending',
                    description: 'خدمات تخزين - فبراير 2024',
                    items: [
                        { name: 'تخزين مستودع', quantity: 30, price: 15.00 }
                    ]
                },
                {
                    id: 'INV-003',
                    date: '2024-01-20',
                    dueDate: '2024-02-20',
                    amount: 320.00,
                    status: 'overdue',
                    description: 'خدمات شحن جوي - يناير 2024',
                    items: [
                        { name: 'شحن جوي سريع', quantity: 1, price: 320.00 }
                    ]
                }
            ]
        };

        this.renderBillingData(billingData);
    },

    /**
     * Render billing data
     */
    renderBillingData: function(data) {
        this.renderBalance(data);
        this.renderInvoices(data.invoices);
    },

    /**
     * Render balance information
     */
    renderBalance: function(data) {
        const balanceContainer = document.getElementById('balanceInfo');
        if (!balanceContainer) return;

        balanceContainer.innerHTML = `
            <div class="balance-card">
                <div class="balance-header">
                    <h3>الرصيد الحالي</h3>
                    <i class="fas fa-wallet"></i>
                </div>
                <div class="balance-amount">
                    <span class="amount">${data.currentBalance.toFixed(2)}</span>
                    <span class="currency">ريال</span>
                </div>
                <div class="balance-actions">
                    <button class="btn btn-primary" onclick="BillingController.addFunds()">
                        <i class="fas fa-plus"></i>
                        إضافة رصيد
                    </button>
                    <button class="btn btn-outline" onclick="BillingController.withdrawFunds()">
                        <i class="fas fa-minus"></i>
                        سحب رصيد
                    </button>
                </div>
            </div>
            <div class="pending-card">
                <div class="pending-header">
                    <h3>المدفوعات المعلقة</h3>
                    <i class="fas fa-clock"></i>
                </div>
                <div class="pending-amount">
                    <span class="amount">${data.pendingAmount.toFixed(2)}</span>
                    <span class="currency">ريال</span>
                </div>
                <div class="pending-actions">
                    <button class="btn btn-primary" onclick="BillingController.payPending()">
                        <i class="fas fa-credit-card"></i>
                        دفع المعلقات
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * Render invoices
     */
    renderInvoices: function(invoices) {
        const invoicesContainer = document.getElementById('invoicesList');
        if (!invoicesContainer) return;

        const invoicesHTML = invoices.map(invoice => `
            <div class="invoice-item" data-invoice-id="${invoice.id}">
                <div class="invoice-header">
                    <div class="invoice-info">
                        <h4>${invoice.description}</h4>
                        <p class="invoice-id">${invoice.id}</p>
                        <p class="invoice-date">تاريخ الإصدار: ${this.formatDate(invoice.date)}</p>
                    </div>
                    <div class="invoice-amount">
                        <span class="amount">${invoice.amount.toFixed(2)} ريال</span>
                        <span class="status-badge ${invoice.status}">${this.getStatusText(invoice.status)}</span>
                    </div>
                </div>
                <div class="invoice-details">
                    <div class="invoice-meta">
                        <span><i class="fas fa-calendar"></i> تاريخ الاستحقاق: ${this.formatDate(invoice.dueDate)}</span>
                        <span><i class="fas fa-list"></i> ${invoice.items.length} عنصر</span>
                    </div>
                    <div class="invoice-actions">
                        <button class="btn btn-outline download-invoice" data-invoice-id="${invoice.id}">
                            <i class="fas fa-download"></i>
                            تحميل
                        </button>
                        ${invoice.status === 'pending' || invoice.status === 'overdue' ? `
                            <button class="btn btn-primary pay-invoice" data-invoice-id="${invoice.id}">
                                <i class="fas fa-credit-card"></i>
                                دفع
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');

        invoicesContainer.innerHTML = invoicesHTML;
    },

    /**
     * Format date
     */
    formatDate: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-SA');
    },

    /**
     * Get status text
     */
    getStatusText: function(status) {
        const statusMap = {
            'paid': 'مدفوع',
            'pending': 'معلق',
            'overdue': 'متأخر'
        };
        return statusMap[status] || status;
    },

    /**
     * Show invoice details
     */
    showInvoiceDetails: function(invoiceElement) {
        const invoiceId = invoiceElement.dataset.invoiceId;
        
        // Mock invoice details
        const invoiceDetails = {
            id: invoiceId,
            date: '2024-01-15',
            dueDate: '2024-02-15',
            amount: 850.00,
            status: 'paid',
            description: 'خدمات شحن بحري - يناير 2024',
            items: [
                { name: 'شحن حاوية 20 قدم', quantity: 1, price: 500.00, total: 500.00 },
                { name: 'تخليص جمركي', quantity: 1, price: 200.00, total: 200.00 },
                { name: 'خدمات إضافية', quantity: 1, price: 150.00, total: 150.00 }
            ],
            subtotal: 850.00,
            tax: 0.00,
            total: 850.00
        };

        Modal.open('invoice-details-modal', {
            title: `فاتورة ${invoiceId}`,
            content: this.generateInvoiceDetailsHTML(invoiceDetails)
        });
    },

    /**
     * Generate invoice details HTML
     */
    generateInvoiceDetailsHTML: function(invoice) {
        const itemsHTML = invoice.items.map(item => `
            <div class="invoice-item-row">
                <div class="item-name">${item.name}</div>
                <div class="item-quantity">${item.quantity}</div>
                <div class="item-price">${item.price.toFixed(2)} ريال</div>
                <div class="item-total">${item.total.toFixed(2)} ريال</div>
            </div>
        `).join('');

        return `
            <div class="invoice-details-modal">
                <div class="invoice-header-info">
                    <div class="invoice-meta">
                        <p><strong>رقم الفاتورة:</strong> ${invoice.id}</p>
                        <p><strong>تاريخ الإصدار:</strong> ${this.formatDate(invoice.date)}</p>
                        <p><strong>تاريخ الاستحقاق:</strong> ${this.formatDate(invoice.dueDate)}</p>
                        <p><strong>الحالة:</strong> <span class="status-badge ${invoice.status}">${this.getStatusText(invoice.status)}</span></p>
                    </div>
                </div>
                <div class="invoice-items">
                    <div class="invoice-items-header">
                        <div class="item-name">الوصف</div>
                        <div class="item-quantity">الكمية</div>
                        <div class="item-price">السعر</div>
                        <div class="item-total">الإجمالي</div>
                    </div>
                    ${itemsHTML}
                </div>
                <div class="invoice-summary">
                    <div class="summary-row">
                        <span>المجموع الفرعي:</span>
                        <span>${invoice.subtotal.toFixed(2)} ريال</span>
                    </div>
                    <div class="summary-row">
                        <span>الضريبة:</span>
                        <span>${invoice.tax.toFixed(2)} ريال</span>
                    </div>
                    <div class="summary-row total">
                        <span>الإجمالي:</span>
                        <span>${invoice.total.toFixed(2)} ريال</span>
                    </div>
                </div>
                <div class="invoice-actions">
                    <button class="btn btn-outline" onclick="BillingController.downloadInvoice('${invoice.id}')">
                        <i class="fas fa-download"></i>
                        تحميل PDF
                    </button>
                    <button class="btn btn-outline" onclick="BillingController.printInvoice('${invoice.id}')">
                        <i class="fas fa-print"></i>
                        طباعة
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * Download invoice
     */
    downloadInvoice: function(invoiceId) {
        Modal.close('invoice-details-modal');
        Toast.show('جاري التحميل', `جاري تحميل الفاتورة ${invoiceId}`, 'info');
        
        // Simulate download
        setTimeout(() => {
            Toast.show('تم التحميل', `تم تحميل الفاتورة ${invoiceId} بنجاح`, 'success');
        }, 2000);
    },

    /**
     * Print invoice
     */
    printInvoice: function(invoiceId) {
        Modal.close('invoice-details-modal');
        Toast.show('جاري الطباعة', `جاري إعداد الفاتورة ${invoiceId} للطباعة`, 'info');
        
        // Simulate print
        setTimeout(() => {
            window.print();
            Toast.show('تم الطباعة', `تم إرسال الفاتورة ${invoiceId} للطباعة`, 'success');
        }, 1000);
    },

    /**
     * Pay invoice
     */
    payInvoice: function(invoiceId) {
        Modal.open('payment-modal', {
            title: 'دفع الفاتورة',
            content: `
                <div class="payment-form">
                    <div class="payment-amount">
                        <h3>مبلغ الدفع: 450.00 ريال</h3>
                    </div>
                    <div class="payment-methods">
                        <h4>اختر طريقة الدفع:</h4>
                        <div class="payment-options">
                            <label class="payment-option">
                                <input type="radio" name="paymentMethod" value="card" checked>
                                <span class="checkmark"></span>
                                <i class="fas fa-credit-card"></i>
                                <span>بطاقة ائتمان</span>
                            </label>
                            <label class="payment-option">
                                <input type="radio" name="paymentMethod" value="bank">
                                <span class="checkmark"></span>
                                <i class="fas fa-university"></i>
                                <span>تحويل بنكي</span>
                            </label>
                            <label class="payment-option">
                                <input type="radio" name="paymentMethod" value="wallet">
                                <span class="checkmark"></span>
                                <i class="fas fa-wallet"></i>
                                <span>المحفظة الإلكترونية</span>
                            </label>
                        </div>
                    </div>
                    <div class="payment-actions">
                        <button class="btn btn-outline" onclick="Modal.close('payment-modal')">إلغاء</button>
                        <button class="btn btn-primary" onclick="BillingController.processPayment('${invoiceId}')">
                            <i class="fas fa-credit-card"></i>
                            دفع الآن
                        </button>
                    </div>
                </div>
            `
        });
    },

    /**
     * Process payment
     */
    processPayment: function(invoiceId) {
        Modal.close('payment-modal');
        Toast.show('جاري المعالجة', 'جاري معالجة الدفع...', 'info');
        
        // Simulate payment processing
        setTimeout(() => {
            Toast.show('تم الدفع', `تم دفع الفاتورة ${invoiceId} بنجاح`, 'success');
            this.loadBillingData(); // Refresh data
        }, 3000);
    },

    /**
     * Filter invoices
     */
    filterInvoices: function(e) {
        const filter = e.target.value;
        const invoices = document.querySelectorAll('.invoice-item');
        
        invoices.forEach(invoice => {
            const status = invoice.querySelector('.status-badge').classList[1];
            if (filter === 'all' || status === filter) {
                invoice.style.display = 'block';
            } else {
                invoice.style.display = 'none';
            }
        });
    },

    /**
     * Search invoices
     */
    searchInvoices: function(e) {
        const query = e.target.value.toLowerCase();
        const invoices = document.querySelectorAll('.invoice-item');
        
        invoices.forEach(invoice => {
            const text = invoice.textContent.toLowerCase();
            if (text.includes(query)) {
                invoice.style.display = 'block';
            } else {
                invoice.style.display = 'none';
            }
        });
    },

    /**
     * Add funds
     */
    addFunds: function() {
        Router.navigate('wallet');
    },

    /**
     * Withdraw funds
     */
    withdrawFunds: function() {
        Router.navigate('wallet');
    },

    /**
     * Pay pending
     */
    payPending: function() {
        Toast.show('دفع المعلقات', 'سيتم توجيهك إلى صفحة الدفع', 'info');
        setTimeout(() => {
            Router.navigate('payment-methods');
        }, 1000);
    },

    /**
     * Show add payment method
     */
    showAddPaymentMethod: function() {
        Router.navigate('payment-methods');
    },

    /**
     * Setup invoices
     */
    setupInvoices: function() {
        // Additional setup if needed
    },

    /**
     * Initialize payment methods
     */
    initializePaymentMethods: function() {
        // Additional setup if needed
    },

    /**
     * Destroy controller
     */
    destroy: function() {
        // Cleanup if needed
    }
}; 