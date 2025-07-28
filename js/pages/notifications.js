/**
 * Notifications Page Controller
 * Manages user notifications with mobile-focused 2-column grid approach
 */
window.NotificationsController = {
    /**
     * Initialize the notifications page
     */
    init: function() {
        console.log('NotificationsController: Initializing notifications page');
        
        this.loadNotifications();
        this.setupEventListeners();
        this.setupFiltering();
        this.updateNotificationCounts();
        
        console.log('NotificationsController: Notifications page initialized successfully');
    },

    /**
     * Load notifications data
     */
    loadNotifications: function() {
        // Simulate loading notifications
        const notifications = [
            {
                id: 1,
                type: 'orders',
                title: 'تم تحديث حالة طلبك',
                message: 'طلبك رقم #INT-4521 تم شحنه بنجاح من ميناء جدة',
                time: 'منذ 5 دقائق',
                isRead: false,
                actions: [
                    { text: 'عرض التفاصيل', action: 'view-order', data: { orderId: 'INT-4521' } },
                    { text: 'تحديد كمقروء', action: 'mark-read', data: { notificationId: 1 } }
                ]
            },
            {
                id: 2,
                type: 'offers',
                title: 'عرض جديد متاح',
                message: 'عرض خاص على خدمات التخزين من شركة المخازن الآمنة',
                time: 'منذ 15 دقيقة',
                isRead: false,
                actions: [
                    { text: 'عرض العرض', action: 'view-offer', data: { offerId: 'OFF-001' } },
                    { text: 'تحديد كمقروء', action: 'mark-read', data: { notificationId: 2 } }
                ]
            },
            {
                id: 3,
                type: 'system',
                title: 'تحديث التطبيق متاح',
                message: 'إصدار جديد من التطبيق متاح للتحميل مع ميزات محسنة',
                time: 'منذ ساعة',
                isRead: true,
                actions: [
                    { text: 'تحديث الآن', action: 'update-app' },
                    { text: 'إخفاء', action: 'dismiss', data: { notificationId: 3 } }
                ]
            }
        ];

        this.renderNotifications(notifications);
    },

    /**
     * Render notifications list
     */
    renderNotifications: function(notifications) {
        const container = document.getElementById('notificationsGrid');
        if (!container) return;

        // Clear existing content
        container.innerHTML = '';

        if (notifications.length === 0) {
            this.showEmptyState();
            return;
        }

        notifications.forEach(notification => {
            const notificationElement = this.createNotificationElement(notification);
            container.appendChild(notificationElement);
        });
    },

    /**
     * Create notification element
     */
    createNotificationElement: function(notification) {
        const element = document.createElement('div');
        element.className = `notifications-item ${notification.isRead ? '' : 'unread'}`;
        element.dataset.type = notification.type;
        element.dataset.id = notification.id;

        const iconClass = this.getNotificationIconClass(notification.type);
        
        element.innerHTML = `
            <div class="notifications-icon ${notification.type}">
                <i class="${iconClass}"></i>
            </div>
            <div class="notifications-content">
                <div class="notifications-header">
                    <h4 class="notifications-title">${notification.title}</h4>
                    <span class="notifications-time">${notification.time}</span>
                </div>
                <p class="notifications-message">${notification.message}</p>
                <div class="notifications-actions">
                    ${notification.actions.map(action => `
                        <button class="btn btn-sm ${action.action === 'mark-read' || action.action === 'dismiss' ? 'btn-outline' : 'btn-primary'}" 
                                data-action="${action.action}" 
                                ${action.data ? Object.entries(action.data).map(([key, value]) => `data-${key}="${value}"`).join(' ') : ''}>
                            ${action.text}
                        </button>
                    `).join('')}
                </div>
            </div>
            <div class="notifications-status">
                <span class="${notification.isRead ? 'notifications-read-indicator' : 'notifications-unread-indicator'}"></span>
            </div>
        `;

        return element;
    },

    /**
     * Get notification icon class based on type
     */
    getNotificationIconClass: function(type) {
        const icons = {
            orders: 'fas fa-shipping-fast',
            offers: 'fas fa-tags',
            system: 'fas fa-info-circle',
            payment: 'fas fa-credit-card',
            reminder: 'fas fa-clock',
            review: 'fas fa-star'
        };
        return icons[type] || 'fas fa-bell';
    },

    /**
     * Setup event listeners
     */
    setupEventListeners: function() {
        // Mark all as read button
        const markAllReadBtn = document.querySelector('[data-action="mark-all-read"]');
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', this.handleMarkAllRead.bind(this));
        }

        // Filter tabs
        const filterTabs = document.querySelectorAll('.notifications-filter-tab');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', this.handleFilterChange.bind(this));
        });

        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreNotifications');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', this.handleLoadMore.bind(this));
        }

        // Notification actions (delegated)
        document.addEventListener('click', this.handleNotificationAction.bind(this));
    },

    /**
     * Setup filtering functionality
     */
    setupFiltering: function() {
        this.currentFilter = 'all';
        this.filteredNotifications = [];
    },

    /**
     * Handle filter change
     */
    handleFilterChange: function(event) {
        const filter = event.currentTarget.dataset.filter;
        
        // Update active tab
        document.querySelectorAll('.notifications-filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        event.currentTarget.classList.add('active');

        // Apply filter
        this.applyFilter(filter);
    },

    /**
     * Apply filter to notifications
     */
    applyFilter: function(filter) {
        this.currentFilter = filter;
        
        const notifications = document.querySelectorAll('.notifications-item');
        let visibleCount = 0;

        notifications.forEach(notification => {
            const notificationType = notification.dataset.type;
            const shouldShow = filter === 'all' || notificationType === filter;
            
            if (shouldShow) {
                notification.style.display = 'block';
                visibleCount++;
            } else {
                notification.style.display = 'none';
            }
        });

        // Show/hide empty state
        if (visibleCount === 0) {
            this.showEmptyState();
        } else {
            this.hideEmptyState();
        }

        // Update filter counts
        this.updateFilterCounts();
    },

    /**
     * Handle notification action
     */
    handleNotificationAction: function(event) {
        const action = event.target.dataset.action;
        if (!action) return;

        const notificationId = event.target.dataset.notificationId;
        const orderId = event.target.dataset.orderId;
        const offerId = event.target.dataset.offerId;
        const shipmentId = event.target.dataset.shipmentId;

        switch (action) {
            case 'mark-read':
                this.markAsRead(notificationId);
                break;
            case 'dismiss':
                this.dismissNotification(notificationId);
                break;
            case 'view-order':
                this.viewOrder(orderId);
                break;
            case 'view-offer':
                this.viewOffer(offerId);
                break;
            case 'track-shipment':
                this.trackShipment(shipmentId);
                break;
            case 'rate-service':
                this.rateService(orderId);
                break;
            case 'update-app':
                this.updateApp();
                break;
            case 'view-receipt':
                this.viewReceipt(orderId);
                break;
        }
    },

    /**
     * Mark notification as read
     */
    markAsRead: function(notificationId) {
        const notification = document.querySelector(`[data-id="${notificationId}"]`);
        if (notification) {
            notification.classList.remove('unread');
            const indicator = notification.querySelector('.notifications-unread-indicator');
            if (indicator) {
                indicator.className = 'notifications-read-indicator';
            }
            
            // Update notification counts
            this.updateNotificationCounts();
            
            Toast.show('تم التحديث', 'تم تحديد الإشعار كمقروء', 'success');
        }
    },

    /**
     * Dismiss notification
     */
    dismissNotification: function(notificationId) {
        const notification = document.querySelector(`[data-id="${notificationId}"]`);
        if (notification) {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
                this.updateNotificationCounts();
                this.checkEmptyState();
            }, 300);
            
            Toast.show('تم الإخفاء', 'تم إخفاء الإشعار', 'info');
        }
    },

    /**
     * Mark all notifications as read
     */
    handleMarkAllRead: function() {
        const unreadNotifications = document.querySelectorAll('.notifications-item.unread');
        
        unreadNotifications.forEach(notification => {
            notification.classList.remove('unread');
            const indicator = notification.querySelector('.notifications-unread-indicator');
            if (indicator) {
                indicator.className = 'notifications-read-indicator';
            }
        });

        this.updateNotificationCounts();
        Toast.show('تم التحديث', 'تم تحديد جميع الإشعارات كمقروءة', 'success');
    },

    /**
     * Handle load more
     */
    handleLoadMore: function() {
        const loadMoreBtn = document.getElementById('loadMoreNotifications');
        if (loadMoreBtn) {
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>جاري التحميل...</span>';
            loadMoreBtn.disabled = true;
        }

        // Simulate loading more notifications
        setTimeout(() => {
            // Add more notifications here
            if (loadMoreBtn) {
                loadMoreBtn.innerHTML = '<i class="fas fa-chevron-down"></i><span>تحميل المزيد</span>';
                loadMoreBtn.disabled = false;
            }
            Toast.show('تم التحميل', 'تم تحميل المزيد من الإشعارات', 'success');
        }, 2000);
    },

    /**
     * Update notification counts
     */
    updateNotificationCounts: function() {
        const totalCount = document.querySelectorAll('.notifications-item').length;
        const unreadCount = document.querySelectorAll('.notifications-item.unread').length;
        
        // Update total count
        const totalTab = document.querySelector('.notifications-filter-tab[data-filter="all"] .notifications-tab-count');
        if (totalTab) {
            totalTab.textContent = totalCount;
        }

        // Update unread count in header if exists
        const headerNotificationCount = document.querySelector('.header-action[data-action="notifications"] .notification-count');
        if (headerNotificationCount) {
            if (unreadCount > 0) {
                headerNotificationCount.textContent = unreadCount;
                headerNotificationCount.style.display = 'block';
            } else {
                headerNotificationCount.style.display = 'none';
            }
        }
    },

    /**
     * Update filter counts
     */
    updateFilterCounts: function() {
        const filterTypes = ['orders', 'offers', 'system'];
        
        filterTypes.forEach(type => {
            const count = document.querySelectorAll(`.notifications-item[data-type="${type}"]`).length;
            const tab = document.querySelector(`.notifications-filter-tab[data-filter="${type}"] .notifications-tab-count`);
            if (tab) {
                tab.textContent = count;
            }
        });
    },

    /**
     * Show empty state
     */
    showEmptyState: function() {
        const emptyState = document.getElementById('emptyState');
        if (emptyState) {
            emptyState.style.display = 'block';
        }
    },

    /**
     * Hide empty state
     */
    hideEmptyState: function() {
        const emptyState = document.getElementById('emptyState');
        if (emptyState) {
            emptyState.style.display = 'none';
        }
    },

    /**
     * Check if should show empty state
     */
    checkEmptyState: function() {
        const visibleNotifications = document.querySelectorAll('.notifications-item[style*="block"]');
        if (visibleNotifications.length === 0) {
            this.showEmptyState();
        }
    },

    /**
     * Navigation actions
     */
    viewOrder: function(orderId) {
        Router.navigate('transaction-history');
        // Could also navigate to specific order details
    },

    viewOffer: function(offerId) {
        Router.navigate('offers-request');
    },

    trackShipment: function(shipmentId) {
        Router.navigate('client-home-page');
        // Could open tracking modal
    },

    rateService: function(orderId) {
        // Open rating modal
        Modal.open('service-rating', {
            orderId: orderId
        });
    },

    updateApp: function() {
        Toast.show('تحديث التطبيق', 'سيتم توجيهك إلى متجر التطبيقات', 'info');
        // Could open app store or trigger update
    },

    viewReceipt: function(orderId) {
        // Open receipt modal or download
        Toast.show('عرض الإيصال', 'جاري تحميل الإيصال...', 'info');
    },

    /**
     * Cleanup when destroying the controller
     */
    destroy: function() {
        console.log('NotificationsController: Destroying notifications page');
        
        // Remove event listeners
        const markAllReadBtn = document.querySelector('[data-action="mark-all-read"]');
        if (markAllReadBtn) {
            markAllReadBtn.removeEventListener('click', this.handleMarkAllRead);
        }

        const filterTabs = document.querySelectorAll('.notifications-filter-tab');
        filterTabs.forEach(tab => {
            tab.removeEventListener('click', this.handleFilterChange);
        });

        const loadMoreBtn = document.getElementById('loadMoreNotifications');
        if (loadMoreBtn) {
            loadMoreBtn.removeEventListener('click', this.handleLoadMore);
        }

        console.log('NotificationsController: Notifications page destroyed successfully');
    }
}; 