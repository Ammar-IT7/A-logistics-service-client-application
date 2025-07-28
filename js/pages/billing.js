/**
 * Billing Page Controller
 * Enhanced for Mobile-First 2-Column Grid Design
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
        this.setupMobileOptimizations();
    },

    /**
     * Bind event listeners
     */
    bindEvents: function() {
        // Bill actions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.billing-bill-item')) {
                this.showBillDetails(e.target.closest('.billing-bill-item'));
            }
        });

        // Pay bill
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-action="pay-bill"]')) {
                this.payBill(e.target.closest('[data-action="pay-bill"]').dataset.id);
            }
        });

        // View bill
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-action="view-bill"]')) {
                this.viewBill(e.target.closest('[data-action="view-bill"]').dataset.id);
            }
        });

        // Download receipt
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-action="download-receipt"]')) {
                this.downloadReceipt(e.target.closest('[data-action="download-receipt"]').dataset.id);
            }
        });

        // Filter bills
        document.addEventListener('click', (e) => {
            if (e.target.closest('.billing-filter-tab')) {
                this.filterBills(e.target.closest('.billing-filter-tab').dataset.filter);
            }
        });

        // Quick actions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.billing-quick-action-card')) {
                this.handleQuickAction(e.target.closest('.billing-quick-action-card'));
            }
        });

        // Pay overdue bills
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-action="pay-overdue-bills"]')) {
                this.payOverdueBills();
            }
        });
    },

    /**
     * Load billing data
     */
    loadBillingData: function() {
        // Mock billing data
        const billingData = {
            summary: {
                pending: 3,
                overdue: 1,
                total: 2450.00
            },
            bills: [
                {
                    id: '1',
                    title: 'فاتورة خدمة التخزين',
                    amount: 320.00,
                    dueDate: '15 يناير 2024',
                    status: 'overdue',
                    description: 'فاتورة شهري لمستودع الرياض - يناير 2024',
                    daysOverdue: 5
                },
                {
                    id: '2',
                    title: 'فاتورة خدمة الشحن',
                    amount: 180.00,
                    dueDate: '20 يناير 2024',
                    status: 'pending',
                    description: 'فاتورة شحن طلب #12345 - الرياض إلى جدة'
                },
                {
                    id: '3',
                    title: 'فاتورة التخليص الجمركي',
                    amount: 450.00,
                    dueDate: '25 يناير 2024',
                    status: 'pending',
                    description: 'رسوم جمركية - شحنة #78901'
                },
                {
                    id: '4',
                    title: 'فاتورة خدمة التغليف',
                    amount: 150.00,
                    dueDate: '10 يناير 2024',
                    status: 'paid',
                    description: 'خدمات التغليف والتعبئة - طلب #12340'
                }
            ]
        };

        this.updateBillingDisplay(billingData);
    },

    /**
     * Update billing display with data
     */
    updateBillingDisplay: function(data) {
        this.updateSummary(data.summary);
        this.updateBillsList(data.bills);
    },

    /**
     * Update summary section
     */
    updateSummary: function(summary) {
        const summaryValues = document.querySelectorAll('.billing-summary-value');
        
        if (summaryValues.length >= 3) {
            summaryValues[0].textContent = summary.pending;
            summaryValues[1].textContent = summary.overdue;
            summaryValues[2].textContent = `${summary.total.toLocaleString('ar-SA')} ريال`;
        }
    },

    /**
     * Update bills list
     */
    updateBillsList: function(bills) {
        const billsContainer = document.querySelector('.billing-bills-container');
        if (!billsContainer) return;

        // Clear existing bills
        billsContainer.innerHTML = '';

        bills.forEach(bill => {
            const billElement = this.createBillElement(bill);
            billsContainer.appendChild(billElement);
        });
    },

    /**
     * Create bill element
     */
    createBillElement: function(bill) {
        const billDiv = document.createElement('div');
        billDiv.className = `billing-bill-item ${bill.status}`;
        billDiv.setAttribute('data-type', bill.status);
        
        const iconClass = this.getBillIcon(bill.status);
        const statusText = this.getStatusText(bill.status, bill.daysOverdue);
        
        billDiv.innerHTML = `
            <div class="billing-bill-icon">
                <i class="${iconClass}"></i>
            </div>
            <div class="billing-bill-details">
                <div class="billing-bill-header">
                    <h3 class="billing-bill-title">${bill.title}</h3>
                    <span class="billing-bill-amount">${bill.amount.toLocaleString('ar-SA')} ريال</span>
                </div>
                <div class="billing-bill-meta">
                    <span class="billing-bill-date">تاريخ الاستحقاق: ${bill.dueDate}</span>
                    <span class="billing-bill-status ${bill.status}">${statusText}</span>
                </div>
                <div class="billing-bill-description">
                    ${bill.description}
                </div>
                <div class="billing-bill-actions">
                    ${bill.status === 'paid' ? `
                        <button class="btn btn-outline btn-sm" data-action="view-bill" data-id="${bill.id}">
                            <i class="fas fa-eye"></i>
                            عرض التفاصيل
                        </button>
                        <button class="btn btn-outline btn-sm" data-action="download-receipt" data-id="${bill.id}">
                            <i class="fas fa-download"></i>
                            تحميل الإيصال
                        </button>
                    ` : `
                        <button class="btn btn-primary btn-sm" data-action="pay-bill" data-id="${bill.id}">
                            <i class="fas fa-credit-card"></i>
                            دفع الآن
                        </button>
                        <button class="btn btn-outline btn-sm" data-action="view-bill" data-id="${bill.id}">
                            <i class="fas fa-eye"></i>
                            عرض التفاصيل
                        </button>
                    `}
                </div>
            </div>
        `;
        
        return billDiv;
    },

    /**
     * Get bill icon class
     */
    getBillIcon: function(status) {
        const icons = {
            overdue: 'fas fa-exclamation-triangle',
            pending: 'fas fa-clock',
            paid: 'fas fa-check-circle',
            failed: 'fas fa-times-circle'
        };
        return icons[status] || 'fas fa-file-invoice';
    },

    /**
     * Get status text
     */
    getStatusText: function(status, daysOverdue) {
        const statusTexts = {
            overdue: `متأخر ${daysOverdue} أيام`,
            pending: 'معلق',
            paid: 'مدفوع',
            failed: 'فشل'
        };
        return statusTexts[status] || status;
    },

    /**
     * Setup invoices
     */
    setupInvoices: function() {
        // Implementation for setting up invoices
        console.log('Setting up invoices...');
    },

    /**
     * Initialize payment methods
     */
    initializePaymentMethods: function() {
        // Implementation for initializing payment methods
        console.log('Initializing payment methods...');
    },

    /**
     * Setup mobile optimizations
     */
    setupMobileOptimizations: function() {
        // Touch feedback for mobile
        const touchElements = document.querySelectorAll('.billing-bill-item, .billing-quick-action-card, .billing-summary-card');
        
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
            .billing-bill-item,
            .billing-quick-action-card,
            .billing-summary-card {
                transition: transform 0.2s ease-out;
            }
        `;
        document.head.appendChild(style);
    },

    /**
     * Show bill details
     */
    showBillDetails: function(billItem) {
        const billId = billItem.querySelector('[data-action="pay-bill"], [data-action="view-bill"]')?.dataset.id;
        const billTitle = billItem.querySelector('.billing-bill-title').textContent;
        
        console.log('Showing bill details:', billId, billTitle);
        
        // Show bill details modal
        this.showModal({
            title: billTitle,
            content: `تفاصيل الفاتورة رقم: ${billId}`,
            type: 'bill-details'
        });
    },

    /**
     * Pay bill
     */
    payBill: function(billId) {
        console.log('Paying bill:', billId);
        
        // Show payment modal
        this.showModal({
            title: 'دفع الفاتورة',
            content: `نموذج دفع الفاتورة رقم: ${billId}`,
            type: 'pay-bill'
        });
        
        // Add haptic feedback on mobile
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    },

    /**
     * View bill
     */
    viewBill: function(billId) {
        console.log('Viewing bill:', billId);
        
        // Show bill details
        this.showModal({
            title: 'تفاصيل الفاتورة',
            content: `تفاصيل الفاتورة رقم: ${billId}`,
            type: 'view-bill'
        });
    },

    /**
     * Download receipt
     */
    downloadReceipt: function(billId) {
        console.log('Downloading receipt:', billId);
        
        // Simulate download
        this.showToast('جاري التحميل...', 'info');
        
        setTimeout(() => {
            this.showToast('تم تحميل الإيصال بنجاح', 'success');
        }, 2000);
    },

    /**
     * Filter bills
     */
    filterBills: function(filter) {
        console.log('Filtering bills by:', filter);
        
        // Remove active class from all tabs
        document.querySelectorAll('.billing-filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Add active class to clicked tab
        event.target.closest('.billing-filter-tab').classList.add('active');
        
        // Filter bills based on status
        const bills = document.querySelectorAll('.billing-bill-item');
        
        bills.forEach(bill => {
            const billType = bill.getAttribute('data-type');
            
            if (filter === 'all' || billType === filter) {
                bill.style.display = 'flex';
            } else {
                bill.style.display = 'none';
            }
        });
    },

    /**
     * Handle quick action
     */
    handleQuickAction: function(actionCard) {
        const action = actionCard.getAttribute('data-action');
        console.log('Handling quick action:', action);
        
        switch (action) {
            case 'pay-all-bills':
                this.payAllBills();
                break;
            case 'download-all-receipts':
                this.downloadAllReceipts();
                break;
            case 'export-bills':
                this.exportBills();
                break;
            default:
                this.showToast(`تنفيذ الإجراء: ${action}`, 'info');
        }
        
        // Add haptic feedback on mobile
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    },

    /**
     * Pay all bills
     */
    payAllBills: function() {
        console.log('Paying all bills');
        this.showModal({
            title: 'دفع جميع الفواتير',
            content: 'نموذج دفع جميع الفواتير المعلقة',
            type: 'pay-all-bills'
        });
    },

    /**
     * Download all receipts
     */
    downloadAllReceipts: function() {
        console.log('Downloading all receipts');
        this.showToast('جاري تحميل جميع الإيصالات...', 'info');
        
        setTimeout(() => {
            this.showToast('تم تحميل جميع الإيصالات بنجاح', 'success');
        }, 3000);
    },

    /**
     * Export bills
     */
    exportBills: function() {
        console.log('Exporting bills');
        this.showToast('جاري تصدير الفواتير...', 'info');
        
        setTimeout(() => {
            this.showToast('تم تصدير الفواتير بنجاح', 'success');
        }, 2000);
    },

    /**
     * Pay overdue bills
     */
    payOverdueBills: function() {
        console.log('Paying overdue bills');
        this.showModal({
            title: 'دفع الفواتير المتأخرة',
            content: 'نموذج دفع الفواتير المتأخرة',
            type: 'pay-overdue-bills'
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
     * Refresh billing data
     */
    refreshData: function() {
        console.log('Refreshing billing data...');
        this.loadBillingData();
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
        console.log('Cleaning up billing controller');
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('billing-page')) {
        BillingController.init();
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (BillingController.handleVisibilityChange) {
        BillingController.handleVisibilityChange();
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (BillingController.cleanup) {
        BillingController.cleanup();
    }
}); 