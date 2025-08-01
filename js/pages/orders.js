// Enhanced Orders Page JavaScript - Modern UX Patterns
class OrdersPage {
    constructor() {
        
        this.currentFilters = {
            status: 'all',
            serviceType: 'all-services',
            timeRange: 'all-time'
        };
        this.currentSort = 'date-desc';
        this.orders = [];
        this.isLoading = false;
        this.page = 1;
        this.hasMore = true;
        
        // Map tracking properties
        this.map = null;
        this.animationInterval = null;
        this.truckMarker = null;
        this.completedRouteLine = null;
        this.previousLatLng = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadOrders();
        this.updateInsights();
        this.initializeAnimations();
        this.setupTrackingListeners();
    }

    bindEvents() {
        // Enhanced filter chips with better UX
        document.querySelectorAll('.orders-filter-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleFilterClick(chip);
            });
        });

        // Enhanced order actions with loading states
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleOrderAction(btn);
            });
        });

        // Enhanced order items with better touch feedback
        document.querySelectorAll('.order-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleOrderClick(item);
            });
        });

        // Enhanced load more with loading states
        const loadMoreBtn = document.querySelector('.orders-load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.loadMoreOrders();
            });
        }

        // Enhanced list actions
        document.querySelectorAll('.orders-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleListAction(btn);
            });
        });

        // Enhanced quick actions
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleQuickAction(btn);
            });
        });

        // Enhanced modal interactions
        const modalClose = document.querySelector('.order-modal-close');
        if (modalClose) {
            modalClose.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeOrderModal();
            });
        }

        // Enhanced insight cards with filter functionality
        document.querySelectorAll('.orders-insight-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleInsightClick(card);
            });
        });

        // Enhanced filter clear functionality
        const clearFiltersBtn = document.querySelector('.orders-filters-clear');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.clearAllFilters();
            });
        }

        // Enhanced sort options
        document.querySelectorAll('.sort-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSortOption(option);
            });
        });

        // Enhanced search functionality
        const searchBtn = document.querySelector('[data-action="search-orders"]');
        if (searchBtn) {
            searchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSearchModal();
            });
        }

        // Enhanced filter modal
        const filterBtn = document.querySelector('[data-action="filter-orders"]');
        if (filterBtn) {
            filterBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showFilterModal();
            });
        }

        // Close modals on overlay click
        document.querySelectorAll('.order-modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeAllModals();
                }
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    handleQuickAction(btn) {
        const action = btn.dataset.action;
        
        // Add loading state
        this.setButtonLoading(btn, true);

        setTimeout(() => {
            switch (action) {
                case 'new-order':
                    this.createNewOrder();
                    break;
                case 'track-all':
                    this.trackAllOrders();
                    break;
                case 'export-all':
                    this.exportAllOrders();
                    break;
                case 'support':
                    this.contactSupport();
                    break;
            }
            this.setButtonLoading(btn, false);
        }, 500);
    }

    createNewOrder() {
        // Navigate to new order page or show modal
        this.showToast('سيتم توجيهك إلى صفحة الطلب الجديد', 'info');
        setTimeout(() => {
            // In a real app, this would navigate to the new order page
            console.log('Navigating to new order page...');
        }, 1000);
    }

    trackAllOrders() {
        this.showToast('جاري تحضير خريطة تتبع جميع الطلبات...', 'info');
        setTimeout(() => {
            this.showToast('تم فتح خريطة التتبع', 'success');
        }, 1500);
    }

    exportAllOrders() {
        this.showToast('جاري تصدير جميع الطلبات...', 'info');
        setTimeout(() => {
            this.showToast('تم تصدير جميع الطلبات بنجاح', 'success');
        }, 2000);
    }

    contactSupport() {
        this.showToast('جاري الاتصال بالدعم الفني...', 'info');
        setTimeout(() => {
            this.showToast('تم فتح نافذة الدردشة مع الدعم الفني', 'success');
        }, 1000);
    }

    setButtonLoading(btn, loading) {
        if (loading) {
            btn.classList.add('loading');
            btn.disabled = true;
            
            // Add spinner to quick action buttons
            if (btn.classList.contains('quick-action-btn')) {
                const icon = btn.querySelector('.quick-action-icon i');
                if (icon) {
                    icon.className = 'fas fa-spinner fa-spin';
                }
            }
        } else {
            btn.classList.remove('loading');
            btn.disabled = false;
            
            // Restore original icon
            if (btn.classList.contains('quick-action-btn')) {
                const icon = btn.querySelector('.quick-action-icon i');
                if (icon) {
                    // Restore original icon based on action
                    const action = btn.dataset.action;
                    const iconMap = {
                        'new-order': 'fas fa-plus',
                        'track-all': 'fas fa-map-marker-alt',
                        'export-all': 'fas fa-download',
                        'support': 'fas fa-headset'
                    };
                    icon.className = iconMap[action] || 'fas fa-question';
                }
            }
        }
    }

    handleFilterClick(chip) {
        const filterType = chip.closest('.orders-filter-group').querySelector('.orders-filter-label').textContent;
        const filterValue = chip.dataset.filter;

        // Remove active class from all chips in the same group
        chip.closest('.orders-filter-chips').querySelectorAll('.orders-filter-chip').forEach(c => {
            c.classList.remove('active');
        });

        // Add active class to clicked chip with animation
        chip.classList.add('active');
        this.animateFilterSelection(chip);

        // Update current filters
        if (filterType.includes('حالة')) {
            this.currentFilters.status = filterValue;
        } else if (filterType.includes('نوع')) {
            this.currentFilters.serviceType = filterValue;
        } else if (filterType.includes('الفترة')) {
            this.currentFilters.timeRange = filterValue;
        }

        // Apply filters with smooth animation
        this.applyFiltersWithAnimation();
        
        // Update filter counts
        this.updateFilterCounts();
    }

    updateFilterCounts() {
        // Update the count display for each filter chip based on current filters
        const orderItems = document.querySelectorAll('.order-item');
        
        // Count by status
        const statusCounts = { all: 0, new: 0, pending: 0, processing: 0, completed: 0 };
        const serviceCounts = { 'all-services': 0, shipping: 0, customs: 0, packaging: 0, warehouse: 0 };
        
        orderItems.forEach(item => {
            const status = item.dataset.status;
            const serviceType = item.dataset.serviceType;
            
            statusCounts.all++;
            statusCounts[status]++;
            serviceCounts['all-services']++;
            serviceCounts[serviceType]++;
        });
        
        // Update status filter counts
        document.querySelectorAll('[data-filter]').forEach(chip => {
            const filter = chip.dataset.filter;
            const countElement = chip.querySelector('.filter-chip-count');
            
            if (countElement) {
                if (statusCounts[filter] !== undefined) {
                    countElement.textContent = statusCounts[filter];
                } else if (serviceCounts[filter] !== undefined) {
                    countElement.textContent = serviceCounts[filter];
                }
            }
        });
    }

    animateFilterSelection(chip) {
        chip.style.transform = 'scale(1.05)';
        setTimeout(() => {
            chip.style.transform = '';
        }, 200);
    }

    applyFiltersWithAnimation() {
        const orderItems = document.querySelectorAll('.order-item');
        let visibleCount = 0;
        
        orderItems.forEach((item, index) => {
            let shouldShow = this.shouldShowOrder(item);

            // Add staggered animation delay
            const delay = index * 50;

            if (shouldShow) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, delay);
                visibleCount++;
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });

        // Update order count with animation
        this.updateOrderCountWithAnimation(visibleCount);
        
        // Update summary with animation
        this.updateOrderSummary();
        
        // Show feedback for filter changes
        this.showFilterFeedback();
    }

    showFilterFeedback() {
        const activeFilters = [];
        
        if (this.currentFilters.status !== 'all') {
            activeFilters.push(this.getStatusText(this.currentFilters.status));
        }
        if (this.currentFilters.serviceType !== 'all-services') {
            activeFilters.push(this.getServiceTypeText(this.currentFilters.serviceType));
        }
        if (this.currentFilters.timeRange !== 'all-time') {
            activeFilters.push(this.getTimeRangeText(this.currentFilters.timeRange));
        }
        
        if (activeFilters.length > 0) {
            this.showToast(`تم تطبيق الفلاتر: ${activeFilters.join('، ')}`, 'info');
        }
    }

    getTimeRangeText(timeRange) {
        const timeMap = {
            'today': 'اليوم',
            'week': 'هذا الأسبوع',
            'month': 'هذا الشهر',
            'all-time': 'كل الفترات'
        };
        return timeMap[timeRange] || timeRange;
    }

    shouldShowOrder(item) {
        const itemStatus = item.dataset.status;
        const itemServiceType = item.dataset.serviceType;
        const itemAmount = parseInt(item.dataset.amount) || 0;

        // Status filter
        if (this.currentFilters.status !== 'all' && itemStatus !== this.currentFilters.status) {
            return false;
        }

        // Service type filter
        if (this.currentFilters.serviceType !== 'all-services' && itemServiceType !== this.currentFilters.serviceType) {
            return false;
        }

        // Time range filter (simplified implementation)
        if (this.currentFilters.timeRange !== 'all-time') {
            // This would be implemented with actual date filtering
            // For now, we'll just show all items
        }

        return true;
    }

    updateOrderCountWithAnimation(count) {
        const countElement = document.querySelector('.orders-list-count');
        if (countElement) {
            // Animate the count change
            const currentCount = parseInt(countElement.textContent) || 0;
            this.animateNumberChange(countElement, currentCount, count);
        }
    }

    updateOrderSummary() {
        const summaryElement = document.querySelector('.orders-list-summary');
        if (summaryElement) {
            // Calculate new summary based on visible orders
            const visibleOrders = document.querySelectorAll('.order-item[style*="display: block"], .order-item:not([style*="display: none"])');
            
            let newCount = 0, pendingCount = 0, processingCount = 0, completedCount = 0;
            
            visibleOrders.forEach(order => {
                newCount++;
                const status = order.dataset.status;
                if (status === 'pending') pendingCount++;
                else if (status === 'processing') processingCount++;
                else if (status === 'completed') completedCount++;
            });
            
            const summary = `• ${newCount} جديد • ${pendingCount} قيد المراجعة • ${processingCount} قيد المعالجة • ${completedCount} مكتمل`;
            summaryElement.textContent = summary;
        }
    }

    animateNumberChange(element, from, to) {
        const duration = 500;
        const start = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(from + (to - from) * this.easeOutQuart(progress));
            element.textContent = `${current} طلب`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    handleOrderAction(btn) {
        const action = btn.dataset.action;
        const orderId = btn.dataset.orderId;

        // Add loading state
        this.setButtonLoading(btn, true);

        setTimeout(() => {
        switch (action) {
            case 'view-order':
                this.viewOrderDetails(orderId);
                break;
            case 'track-order':
                this.trackOrder(orderId);
                break;
            case 'download-invoice':
                this.downloadInvoice(orderId);
                break;
            case 'contact-support':
                this.contactSupport();
                break;
            }
            this.setButtonLoading(btn, false);
        }, 500);
    }

    handleOrderClick(item) {
        const orderId = item.dataset.orderId;
        this.viewOrderDetails(orderId);
    }

    handleListAction(btn) {
        const action = btn.dataset.action;

        switch (action) {
            case 'sort-orders':
                this.showSortOptions();
                break;
            case 'export-orders':
                this.exportOrders();
                break;
        }
    }

    handleInsightClick(card) {
        const action = card.dataset.action;
        const status = card.dataset.status;

        if (action === 'filter-by-status') {
            this.filterByInsight(status);
        } else if (action === 'filter-by-revenue') {
            this.sortOrders('amount-desc');
        }
    }

    filterByInsight(status) {
        // Reset all filters first
        document.querySelectorAll('.orders-filter-chip').forEach(chip => {
            chip.classList.remove('active');
        });

        // Set appropriate filter based on insight type
        let filterChip;
        switch (status) {
            case 'all':
                filterChip = document.querySelector('[data-filter="all"]');
                break;
            case 'active':
                filterChip = document.querySelector('[data-filter="processing"]');
                break;
            case 'completed':
                filterChip = document.querySelector('[data-filter="completed"]');
                break;
        }

        if (filterChip) {
            filterChip.classList.add('active');
            this.currentFilters.status = filterChip.dataset.filter;
            this.applyFiltersWithAnimation();
        }
    }

    clearAllFilters() {
        // Reset all filter chips
        document.querySelectorAll('.orders-filter-chip').forEach(chip => {
            chip.classList.remove('active');
        });

        // Reset current filters
        this.currentFilters = {
            status: 'all',
            serviceType: 'all-services',
            timeRange: 'all-time'
        };

        // Show all orders
        this.applyFiltersWithAnimation();

        // Show success message
        this.showToast('تم مسح جميع الفلاتر', 'success');
    }

    showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add to page
        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    viewOrderDetails(orderId) {
        const order = this.getOrderById(orderId);
        if (!order) return;

        const modalBody = document.querySelector('#orderDetailsModal .order-modal-body');
        if (modalBody) {
            modalBody.innerHTML = this.generateEnhancedOrderDetailsHTML(order);
            this.showOrderModal('orderDetailsModal');
        }
    }

    getOrderById(orderId) {
        // Enhanced mock order data with more realistic information
        const mockOrders = {
            'C-8812': {
                id: 'C-8812',
                title: 'طلب تخليص جمركي - شحنة إلكترونيات',
                description: 'تخليص جمركي لشحنة إلكترونيات من الصين، وزن 50 كجم، قيمة الشحنة 15,000 ريال',
                status: 'new',
                amount: '1,250 ريال',
                progress: '0%',
                serviceType: 'customs',
                createdAt: 'منذ 5 دقائق',
                estimatedCompletion: '3-5 أيام عمل',
                priority: 'عادي',
                details: {
                    origin: 'الصين',
                    destination: 'الرياض، السعودية',
                    weight: '50 كجم',
                    dimensions: '80×60×40 سم',
                    items: ['هواتف ذكية', 'أجهزة لوحية', 'ملحقات إلكترونية'],
                    documents: ['فاتورة تجارية', 'قائمة تعبئة', 'شهادة منشأ'],
                    customsValue: '15,000 ريال',
                    insurance: 'مشمول',
                    specialRequirements: 'تخزين في درجة حرارة محكومة'
                },
                tracking: {
                    currentLocation: 'ميناء جدة الإسلامي',
                    nextUpdate: 'خلال ساعتين',
                    estimatedDelivery: '15 مارس 2024'
                }
            },
            'P-5432': {
                id: 'P-5432',
                title: 'طلب خدمة تغليف - أثاث منزلي',
                description: 'تغليف أثاث منزلي للشحن، 3 قطع أثاث كبيرة، أبعاد 2×1.5×0.8 متر',
                status: 'pending',
                amount: '850 ريال',
                progress: '25%',
                serviceType: 'packaging',
                createdAt: 'منذ ساعتين',
                estimatedCompletion: '1-2 أيام عمل',
                priority: 'عادي',
                details: {
                    origin: 'الرياض، السعودية',
                    destination: 'جدة، السعودية',
                    weight: '150 كجم',
                    dimensions: '200×150×80 سم',
                    items: ['طاولة طعام', 'كراسي', 'خزانة ملابس'],
                    documents: ['طلب تغليف', 'صور الأثاث', 'تفاصيل الشحن'],
                    packagingType: 'تغليف احترافي',
                    insurance: 'مشمول',
                    specialRequirements: 'تغليف ضد الكسر'
                },
                tracking: {
                    currentLocation: 'مركز التغليف - الرياض',
                    nextUpdate: 'خلال 4 ساعات',
                    estimatedDelivery: '12 مارس 2024'
                }
            },
            'SH-1099': {
                id: 'SH-1099',
                title: 'طلب شحن داخلي - الرياض إلى جدة',
                description: 'شحن داخلي من الرياض إلى جدة، وزن 100 كجم، خدمة توصيل سريع',
                status: 'processing',
                amount: '450 ريال',
                progress: '60%',
                serviceType: 'shipping',
                createdAt: 'منذ يوم واحد',
                estimatedCompletion: '2-3 أيام عمل',
                priority: 'عادي',
                details: {
                    origin: 'الرياض، السعودية',
                    destination: 'جدة، السعودية',
                    weight: '100 كجم',
                    dimensions: '120×80×60 سم',
                    items: ['بضائع تجارية', 'ملابس', 'أحذية'],
                    documents: ['فاتورة شحن', 'قائمة محتويات'],
                    shippingType: 'شحن سريع',
                    insurance: 'مشمول',
                    specialRequirements: 'توصيل في الصباح'
                },
                tracking: {
                    currentLocation: 'مركز التوزيع - جدة',
                    nextUpdate: 'خلال ساعة',
                    estimatedDelivery: '14 مارس 2024'
                }
            }
        };

        return mockOrders[orderId];
    }

    generateEnhancedOrderDetailsHTML(order) {
        return `
            <div class="order-details-enhanced">
                <div class="order-details-header">
                    <div class="order-details-id">
                        <h4>${order.id}</h4>
                        <span class="order-details-status ${order.status}">
                            <i class="fas fa-${this.getStatusIcon(order.status)}"></i>
                            ${this.getStatusText(order.status)}
                        </span>
                    </div>
                    <div class="order-details-meta">
                        <span class="order-details-amount">${order.amount}</span>
                        <span class="order-details-progress">${order.progress} مكتمل</span>
                    </div>
                </div>
                
                <div class="order-details-content">
                    <h5>${order.title}</h5>
                    <p>${order.description}</p>
                    
                    <div class="order-details-info">
                        <div class="detail-row">
                            <span class="detail-label">نوع الخدمة:</span>
                            <span class="detail-value">${this.getServiceTypeText(order.serviceType)}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">تاريخ الطلب:</span>
                            <span class="detail-value">${order.createdAt}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">الوزن:</span>
                            <span class="detail-value">${order.details.weight}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">الأبعاد:</span>
                            <span class="detail-value">${order.details.dimensions}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">من:</span>
                            <span class="detail-value">${order.details.origin}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">إلى:</span>
                            <span class="detail-value">${order.details.destination}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">الأولوية:</span>
                            <span class="detail-value">${order.priority}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">الوقت المتوقع للإنجاز:</span>
                            <span class="detail-value">${order.estimatedCompletion}</span>
                        </div>
                    </div>
                    
                    <div class="order-details-items">
                        <h6>المحتويات:</h6>
                        <ul>
                            ${order.details.items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="order-details-documents">
                        <h6>المستندات المطلوبة:</h6>
                        <ul>
                            ${order.details.documents.map(doc => `<li>${doc}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="order-tracking-info">
                        <h6>معلومات التتبع:</h6>
                        <div class="tracking-details">
                            <div class="tracking-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>الموقع الحالي: ${order.tracking.currentLocation}</span>
                            </div>
                            <div class="tracking-item">
                                <i class="fas fa-clock"></i>
                                <span>التحديث القادم: ${order.tracking.nextUpdate}</span>
                            </div>
                            <div class="tracking-item">
                                <i class="fas fa-calendar-alt"></i>
                                <span>التوصيل المتوقع: ${order.tracking.estimatedDelivery}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="order-details-actions">
                    <button class="btn btn-primary" onclick="OrdersPage.trackOrder('${order.id}')">
                        <i class="fas fa-map-marker-alt"></i>
                        تتبع الطلب
                    </button>
                    <button class="btn btn-secondary" onclick="OrdersPage.downloadInvoice('${order.id}')">
                        <i class="fas fa-file-invoice"></i>
                        تحميل الفاتورة
                    </button>
                </div>
            </div>
        `;
    }

    getStatusIcon(status) {
        const iconMap = {
            'new': 'circle',
            'pending': 'clock',
            'processing': 'truck',
            'completed': 'check-circle'
        };
        return iconMap[status] || 'circle';
    }

    getStatusText(status) {
        const statusMap = {
            'new': 'جديد',
            'pending': 'قيد المراجعة',
            'processing': 'قيد المعالجة',
            'completed': 'مكتمل'
        };
        return statusMap[status] || status;
    }

    getServiceTypeText(serviceType) {
        const serviceMap = {
            'customs': 'تخليص جمركي',
            'packaging': 'تغليف',
            'shipping': 'شحن',
            'warehouse': 'تخزين'
        };
        return serviceMap[serviceType] || serviceType;
    }

    showOrderModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeOrderModal() {
        const modals = document.querySelectorAll('.order-modal-overlay');
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
        }

    closeAllModals() {
        this.closeOrderModal();
    }

    trackOrder(orderId) {
        // Try to get tracking data for map functionality
        const trackingData = this.getOrderTrackingData(orderId);
        
        if (trackingData) {
            // Show interactive map tracking
            this.initAndShowMap(trackingData);
            this.setButtonLoading(document.querySelector(`[data-action="track-order"][data-order-id="${orderId}"]`), false);
        } else {
            // Fallback to traditional tracking display
        const order = this.getOrderById(orderId);
            if (!order) {
                this.showToast('لم يتم العثور على بيانات الطلب', 'error');
                return;
            }

        const modalBody = document.querySelector('#orderTrackingModal .order-modal-body');
        if (modalBody) {
            modalBody.innerHTML = this.generateTrackingHTML(order);
            this.showOrderModal('orderTrackingModal');
            }
            this.setButtonLoading(document.querySelector(`[data-action="track-order"][data-order-id="${orderId}"]`), false);
        }
    }

    generateTrackingHTML(order) {
        return `
            <div class="tracking-enhanced">
                <div class="tracking-header">
                    <h4>تتبع الطلب ${order.id}</h4>
                    <div class="tracking-status ${order.status}">
                        <i class="fas fa-${this.getStatusIcon(order.status)}"></i>
                        ${this.getStatusText(order.status)}
                    </div>
                </div>
                
                <div class="tracking-timeline">
                    <div class="timeline-item completed">
                        <div class="timeline-icon">
                            <i class="fas fa-check"></i>
                        </div>
                        <div class="timeline-content">
                            <h6>تم استلام الطلب</h6>
                            <p>${order.createdAt}</p>
                        </div>
                    </div>
                    
                    <div class="timeline-item ${order.status !== 'new' ? 'completed' : ''}">
                        <div class="timeline-icon">
                            <i class="fas fa-clipboard-check"></i>
                        </div>
                        <div class="timeline-content">
                            <h6>قيد المراجعة</h6>
                            <p>${order.status !== 'new' ? 'تمت المراجعة' : 'قيد المراجعة'}</p>
                        </div>
                    </div>
                    
                    <div class="timeline-item ${order.status === 'processing' || order.status === 'completed' ? 'completed' : ''}">
                        <div class="timeline-icon">
                            <i class="fas fa-cogs"></i>
                        </div>
                        <div class="timeline-content">
                            <h6>قيد المعالجة</h6>
                            <p>${order.status === 'processing' || order.status === 'completed' ? 'جاري المعالجة' : 'في الانتظار'}</p>
                        </div>
                    </div>
                    
                    <div class="timeline-item ${order.status === 'completed' ? 'completed' : ''}">
                        <div class="timeline-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="timeline-content">
                            <h6>مكتمل</h6>
                            <p>${order.status === 'completed' ? 'تم الإنجاز' : 'في الانتظار'}</p>
                        </div>
                    </div>
                </div>
                
                <div class="tracking-details">
                    <div class="tracking-info">
                        <div class="info-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <div>
                                <span class="info-label">الموقع الحالي</span>
                                <span class="info-value">${order.tracking.currentLocation}</span>
                            </div>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-clock"></i>
                            <div>
                                <span class="info-label">التحديث القادم</span>
                                <span class="info-value">${order.tracking.nextUpdate}</span>
                            </div>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-calendar-alt"></i>
                            <div>
                                <span class="info-label">التوصيل المتوقع</span>
                                <span class="info-value">${order.tracking.estimatedDelivery}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    downloadInvoice(orderId) {
        // Simulate invoice download with loading state
        this.showToast('جاري تحضير الفاتورة...', 'info');
        
        setTimeout(() => {
            this.showToast('تم تحميل الفاتورة بنجاح', 'success');
        }, 2000);
    }

    showSortOptions() {
        this.showOrderModal('sortOptionsModal');
    }

    handleSortOption(option) {
        const sortType = option.dataset.sort;
        
        // Remove active class from all options
        document.querySelectorAll('.sort-option').forEach(opt => {
            opt.classList.remove('active');
        });
        
        // Add active class to selected option
        option.classList.add('active');
        
        // Apply sorting
        this.sortOrders(sortType);
        
        // Close modal
        this.closeOrderModal();
        
        // Show feedback
        this.showToast('تم ترتيب الطلبات بنجاح', 'success');
    }

    sortOrders(sortType) {
        const orderItems = Array.from(document.querySelectorAll('.order-item'));
        
        orderItems.sort((a, b) => {
            switch (sortType) {
                case 'date-desc':
                    return this.getOrderTime(b) - this.getOrderTime(a);
                case 'date-asc':
                    return this.getOrderTime(a) - this.getOrderTime(b);
                case 'amount-desc':
                    return this.getOrderAmount(b) - this.getOrderAmount(a);
                case 'amount-asc':
                    return this.getOrderAmount(a) - this.getOrderAmount(b);
                case 'status':
                    return this.getOrderStatusPriority(a) - this.getOrderStatusPriority(b);
                default:
                    return 0;
            }
        });

        // Reorder DOM elements with animation
        const ordersList = document.getElementById('ordersList');
        if (ordersList) {
            orderItems.forEach((item, index) => {
                setTimeout(() => {
                ordersList.appendChild(item);
                }, index * 50);
            });
        }
    }

    getOrderTime(orderElement) {
        const timeText = orderElement.querySelector('.order-time').textContent;
        // Convert time text to timestamp (simplified)
        if (timeText.includes('دقائق')) return Date.now() - 5 * 60 * 1000;
        if (timeText.includes('ساعتين')) return Date.now() - 2 * 60 * 60 * 1000;
        if (timeText.includes('يوم')) return Date.now() - 24 * 60 * 60 * 1000;
        if (timeText.includes('أسبوع')) return Date.now() - 7 * 24 * 60 * 60 * 1000;
        return Date.now();
    }

    getOrderAmount(orderElement) {
        const amountText = orderElement.querySelector('.order-amount').textContent;
        return parseInt(amountText.replace(/[^\d]/g, '')) || 0;
    }

    getOrderStatusPriority(orderElement) {
        const status = orderElement.dataset.status;
        const priorityMap = {
            'new': 4,
            'pending': 3,
            'processing': 2,
            'completed': 1
        };
        return priorityMap[status] || 0;
    }

    exportOrders() {
        this.showToast('جاري تصدير الطلبات...', 'info');
        
        setTimeout(() => {
            this.showToast('تم تصدير الطلبات بنجاح', 'success');
        }, 2000);
    }

    loadMoreOrders() {
        if (this.isLoading || !this.hasMore) return;

        this.isLoading = true;
        const loadMoreBtn = document.querySelector('.orders-load-more-btn');
        
        if (loadMoreBtn) {
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>جاري التحميل...</span>';
        }

        // Simulate API call
        setTimeout(() => {
            this.isLoading = false;
            
            if (loadMoreBtn) {
                loadMoreBtn.innerHTML = `
                    <i class="fas fa-chevron-down"></i>
                    <span>تحميل المزيد من الطلبات</span>
                    <span class="orders-load-more-count">(26 طلب إضافي)</span>
                `;
            }

            this.showToast('تم تحميل المزيد من الطلبات', 'success');
        }, 2000);
    }

    loadOrders() {
        // In a real app, this would fetch orders from an API
        console.log('Loading orders...');
    }

    updateInsights() {
        // Update insight cards with real data
        // In a real app, this would calculate from actual order data
        console.log('Updating insights...');
    }

    initializeAnimations() {
        // Add staggered animations to order items
        const orderItems = document.querySelectorAll('.order-item');
        orderItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });

        // Add animation to insight cards
        const insightCards = document.querySelectorAll('.orders-insight-card');
        insightCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;
        });

        // Add animation to quick action buttons
        const quickActionBtns = document.querySelectorAll('.quick-action-btn');
        quickActionBtns.forEach((btn, index) => {
            btn.style.animationDelay = `${index * 0.1}s`;
        });
    }

    showSearchModal() {
        // Implement search functionality
        this.showToast('سيتم إضافة ميزة البحث قريباً', 'info');
    }

    showFilterModal() {
        // Implement advanced filter modal
        this.showToast('سيتم إضافة فلاتر متقدمة قريباً', 'info');
    }

    // === TRACKING MAP FUNCTIONALITY ===
    
    setupTrackingListeners() {
        const mapModal = document.getElementById('trackingMapModal');
        const closeButton = mapModal?.querySelector('.chp-map-modal-close');

        // Close button listener
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.hideMap();
            });
        }
        
        // Click outside to close
        if (mapModal) {
            mapModal.addEventListener('click', (e) => {
                if (e.target === mapModal) {
                    this.hideMap();
                }
            });
        }

        // Enhanced map controls
        this.setupMapControls();
        
        // Setup keyboard navigation
        this.setupKeyboardNavigation();
    }

    setupMapControls() {
        // Setup simple recenter button like home page
        const recenterBtn = document.getElementById('recenterBtn');
        if (recenterBtn) {
            recenterBtn.addEventListener('click', () => {
                if (this.map && this.truckMarker) {
                    this.map.flyTo(this.truckMarker.getLatLng(), this.map.getZoom(), {
                        duration: 1
                    });
                }
            });
        }
    }



    getOrderTrackingData(orderId) {
        // Enhanced tracking data with waypoints and metrics
        const trackingData = {
            'SH-1099': {
                shipmentId: '#SH-1099',
                originLat: '24.7136',
                originLon: '46.6753',
                originName: 'الرياض، السعودية',
                destinationName: 'جدة، السعودية',
                currentStatus: 'قيد النقل',
                estimatedTime: '3 ساعات',
                totalDistance: 950,
                waypoints: [
                    { name: 'الرياض - نقطة الانطلاق', lat: 24.7136, lon: 46.6753, status: 'completed' },
                    { name: 'مركز توزيع الخرج', lat: 24.1555, lon: 47.3089, status: 'completed' },
                    { name: 'محطة وقود الدوادمي', lat: 24.5087, lon: 44.3928, status: 'current' },
                    { name: 'محطة تفتيش الطائف', lat: 21.4858, lon: 40.4152, status: 'pending' },
                    { name: 'جدة - الوجهة النهائية', lat: 21.4225, lon: 39.8262, status: 'pending' }
                ]
            },
            'SH-3344': {
                shipmentId: '#SH-3344',
                originLat: '24.7136',
                originLon: '46.6753',
                originName: 'الرياض، السعودية',
                destinationName: 'دبي، الإمارات',
                currentStatus: 'قيد النقل الدولي',
                estimatedTime: '6 ساعات',
                totalDistance: 875,
                waypoints: [
                    { name: 'الرياض - نقطة الانطلاق', lat: 24.7136, lon: 46.6753, status: 'completed' },
                    { name: 'الأحساء', lat: 25.4244, lon: 49.5847, status: 'completed' },
                    { name: 'الحدود السعودية الإماراتية', lat: 24.0, lon: 51.6, status: 'current' },
                    { name: 'أبوظبي', lat: 24.4539, lon: 54.3773, status: 'pending' },
                    { name: 'دبي - الوجهة النهائية', lat: 25.2048, lon: 55.2708, status: 'pending' }
                ]
            },
            'C-8812': {
                shipmentId: '#C-8812',
                originLat: '39.9042',
                originLon: '116.4074',
                originName: 'بكين، الصين',
                destinationName: 'الرياض، السعودية',
                currentStatus: 'في التخليص الجمركي',
                estimatedTime: '2 أيام',
                totalDistance: 7200,
                waypoints: [
                    { name: 'بكين، الصين - نقطة الانطلاق', lat: 39.9042, lon: 116.4074, status: 'completed' },
                    { name: 'ميناء شنغهاي', lat: 31.2304, lon: 121.4737, status: 'completed' },
                    { name: 'ميناء جدة الإسلامي', lat: 21.4595, lon: 39.1558, status: 'completed' },
                    { name: 'مركز التخليص الجمركي', lat: 21.4595, lon: 39.2558, status: 'current' },
                    { name: 'الرياض - الوجهة النهائية', lat: 24.7136, lon: 46.6753, status: 'pending' }
                ]
            },
            'P-5432': {
                shipmentId: '#P-5432',
                originLat: '24.7136',
                originLon: '46.6753',
                originName: 'مركز التغليف، الرياض',
                destinationName: 'العنوان المحدد',
                currentStatus: 'قيد التغليف',
                estimatedTime: '1 يوم',
                totalDistance: 45,
                waypoints: [
                    { name: 'مركز التغليف - الرياض', lat: 24.7136, lon: 46.6753, status: 'completed' },
                    { name: 'مراقبة الجودة', lat: 24.7200, lon: 46.6800, status: 'current' },
                    { name: 'التحضير للشحن', lat: 24.7250, lon: 46.6850, status: 'pending' },
                    { name: 'العنوان المحدد', lat: 24.7300, lon: 46.6900, status: 'pending' }
                ]
            }
        };

        return trackingData[orderId] || null;
    }

    initAndShowMap(data) {
        // This function requires the Leaflet library (L) to be loaded.
        if (typeof L === 'undefined') {
            console.error("Leaflet library is not loaded. Map cannot be initialized.");
            return;
        }
        
        const mapModal = document.getElementById('trackingMapModal');
        mapModal.classList.add('chp-active');
        
        // Update shipment info like home page
        document.getElementById('mapShipmentId').textContent = `تتبع الشحنة ${data.shipmentId}`;
        document.getElementById('mapShipmentOrigin').textContent = `قادمة من: ${data.originName}`;
        
        if (this.map) {
            this.map.remove();
            this.map = null;
        }
        
        const origin = [parseFloat(data.originLat), parseFloat(data.originLon)];
        const destination = [15.3694, 44.1910]; // Sana'a coordinates
        
        this.map = L.map('map-container').setView(origin, 6);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap contributors © CARTO',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(this.map);
        
        L.polyline([origin, destination], { color: 'rgba(128, 128, 128, 0.5)', weight: 5, dashArray: '10, 10' }).addTo(this.map);
        this.completedRouteLine = L.polyline([], { color: 'var(--primary-color)', weight: 5 }).addTo(this.map);
        
        L.marker(origin).addTo(this.map).bindPopup(`<b>نقطة الانطلاق</b><br>${data.originName}`);
        L.marker(destination).addTo(this.map).bindPopup("<b>الوجهة النهائية</b><br>صنعاء، اليمن");
        
        const truckIcon = L.divIcon({
            html: '<i class="fas fa-truck"></i>',
            className: 'live-truck-icon',
            iconSize: [28, 28],
            iconAnchor: [14, 14]
        });
        
        this.truckMarker = L.marker(origin, {icon: truckIcon}).addTo(this.map);
        this.previousLatLng = origin;
        
        const routeBounds = L.latLngBounds(origin, destination);
        this.map.flyToBounds(routeBounds, { padding: [50, 50], duration: 1.5 });
        
        this.startTrackingAnimation(origin, destination, data);
    }



    startTrackingAnimation(origin, destination, data) {
        let step = 0;
        const totalSteps = 600; 
        const tripDurationSeconds = 30;
        const etaElement = document.getElementById('mapShipmentETA');
        const statusElement = document.getElementById('mapShipmentStatus');
        const progressBar = document.getElementById('trackingProgressBar');
        
        this.completedRouteLine.setLatLngs([]);
        progressBar.style.width = '0%';
        statusElement.style.color = 'var(--success)';
        
        this.animationInterval = setInterval(() => {
            step++;
            const progress = 0.5 - 0.5 * Math.cos(Math.PI * (step / totalSteps));
            const remainingSeconds = Math.round(tripDurationSeconds * (1 - progress));
            const mins = Math.floor(remainingSeconds / 60);
            const secs = remainingSeconds % 60;
            
            etaElement.textContent = `الوقت المقدر: ${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
            
            if (progress < 0.1) statusElement.textContent = 'غادرت للتو';
            else if (progress < 0.95) statusElement.textContent = 'في الطريق';
            else statusElement.textContent = 'على وشك الوصول';
            
            const lat = origin[0] + (destination[0] - origin[0]) * progress;
            const lng = origin[1] + (destination[1] - origin[1]) * progress;
            const newPos = [lat, lng];
            this.truckMarker.setLatLng(newPos);
            this.completedRouteLine.addLatLng(newPos);
            progressBar.style.width = `${progress * 100}%`;
            
            const angle = this.calculateAngle(this.previousLatLng, newPos);
            const markerElement = this.truckMarker.getElement();
            if (markerElement) {
                markerElement.style.transform = `${markerElement.style.transform.split(' rotateZ')[0]} rotateZ(${angle + 90}deg)`;
            }
            this.previousLatLng = newPos;
            
            if (step >= totalSteps) {
                clearInterval(this.animationInterval);
                this.animationInterval = null;
                statusElement.textContent = 'تم التوصيل بنجاح!';
                statusElement.style.color = '#1dd1a1';
                etaElement.textContent = '';
                this.truckMarker.setLatLng(destination);
                this.truckMarker.bindPopup("<b>الشحنة وصلت!</b>").openPopup();
            }
        }, (tripDurationSeconds * 1000) / totalSteps);
    }

    updateTrackingUI(data, progressPercentage, isCompleted = false) {
        // Update shipment info - simplified like home page
        const shipmentIdEl = document.getElementById('mapShipmentId');
        const originEl = document.getElementById('mapShipmentOrigin');
        
        if (shipmentIdEl) shipmentIdEl.textContent = `تتبع الشحنة ${data.shipmentId}`;
        if (originEl) originEl.textContent = `قادمة من: ${data.originName}`;
    }

    calculateRealisticSpeed(progress) {
        // Simulate realistic speed variations (highway vs city driving)
        const baseSpeed = 80;
        const speedVariation = Math.sin(progress * Math.PI * 4) * 15;
        return Math.max(20, Math.round(baseSpeed + speedVariation));
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }



    // Enhanced mobile gesture support


    hideMap() {
        const mapModal = document.getElementById('trackingMapModal');
        mapModal.classList.remove('chp-active');
        clearInterval(this.animationInterval);
        this.animationInterval = null;
        if (this.map) {
            setTimeout(() => {
                this.map.remove();
                this.map = null;
            }, 400);
        }
    }

    calculateAngle(p1, p2) {
        const lat1 = p1[0] * Math.PI / 180;
        const lon1 = p1[1] * Math.PI / 180;
        const lat2 = p2[0] * Math.PI / 180;
        const lon2 = p2[1] * Math.PI / 180;
        const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
        const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
        const bearing = Math.atan2(y, x) * 180 / Math.PI;
        return bearing;
    }
}

// Create controller wrapper for the router system
window.OrdersController = {
    instance: null,
    
    init: function() {
        if (!this.instance) {
            this.instance = new OrdersPage();
        }
    },
    
    destroy: function() {
        if (this.instance) {
            // Clean up map if it exists
            if (this.instance.map) {
                this.instance.map.remove();
                this.instance.map = null;
            }
            // Clear any intervals
            if (this.instance.animationInterval) {
                clearInterval(this.instance.animationInterval);
                this.instance.animationInterval = null;
            }
            this.instance = null;
        }
    }
};

// Initialize orders page when DOM is loaded (fallback)
document.addEventListener('DOMContentLoaded', () => {
    const ordersPageElement = document.getElementById('orders-page');
    
    if (ordersPageElement && !window.OrdersController.instance) {
        window.OrdersController.init();
    }
});

// Export for global access
window.OrdersPage = OrdersPage;