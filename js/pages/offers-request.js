const ShipOffersController = {
        currentRequestId: null,
        currentOffers: [],
        selectedOffers: new Set(),
        maxCompareItems: 3,
        currentView: 'list',
        currentSort: 'recommended',
        
        init: function(requestId = null) {
            this.currentRequestId = requestId;
            this.loadOffers(); 
            this.sortOffers(this.currentSort, true); 
            this.updateUI(); 
            this.setupEventListeners();

            // Remove placeholder if offers loaded
            if (this.currentOffers.length > 0) {
                const placeholder = document.querySelector('.offers-list .offer-card[style*="text-align: center"]');
                if (placeholder) placeholder.remove();
            }
        },
        
        loadOffers: function() {
            this.currentOffers = [
                {
                    id: "1", providerId: "p1", providerName: "شركة اللوجستيات السريعة", providerType: "شحن جوي دولي",
                    providerRating: 4.8, providerReviews: 127, price: 250, currency: "USD", deliveryTime: "3-5 أيام عمل",
                    shippingMethod: "شحن جوي عبر طيران الإمارات", tracking: "تتبع مباشر عبر GPS", insurance: "تغطية شاملة مشمولة",
                    avatar: '<i class="fas fa-plane-departure"></i>', isVerified: true, badges: ['recommended', 'fast', 'verified'],
                    features: ['تتبع فوري', 'تأمين شامل', 'دعم 24/7', 'ضمان التسليم']
                },
                {
                    id: "2", providerId: "p2", providerName: "أوشن إكسبرس", providerType: "شحن بحري وجوي",
                    providerRating: 4.2, providerReviews: 89, price: 160, currency: "USD", deliveryTime: "5-8 أيام عمل",
                    shippingMethod: "شاحنات مختصة عبر الحدود", tracking: "GPS مع تحديثات كل 4 ساعات", insurance: "تأمين أساسي",
                    avatar: '<i class="fas fa-ship"></i>', isVerified: false, badges: ['budget', 'eco'],
                    features: ['أفضل سعر', 'مسار آمن', 'خبرة 15+ سنة']
                },
                {
                    id: "3", providerId: "p3", providerName: "نجمة الصحراء للشحن", providerType: "شحن بري سريع",
                    providerRating: 4.5, providerReviews: 203, price: 190, currency: "USD", deliveryTime: "4-6 أيام عمل",
                    shippingMethod: "أسطول شاحنات حديث", tracking: "تتبع عبر التطبيق", insurance: "تأمين حتى $5000",
                    avatar: '<i class="fas fa-truck-moving"></i>', isVerified: true, badges: ['verified', 'fast'],
                    features: ['توصيل للباب', 'تخليص جمركي', 'خدمة عملاء ممتازة']
                }
            ];
        },
        
        updateUI: function() {
            this.updateStats();
            this.updateComparisonBar();
            // updateOffersList is typically called by sortOffers or when data changes.
        },
        
        updateStats: function() {
            const statsValues = { total: 0, newToday: 0, bestPrice: 0, fastestDeliveryAvg: 'N/A' };
            if (this.currentOffers.length > 0) {
                statsValues.total = this.currentOffers.length;
                statsValues.newToday = this.currentOffers.filter(o => o.badges.includes('new')).length || 
                                      (this.currentOffers.length > 1 ? 1 : 0); // Mock
                statsValues.bestPrice = Math.min(...this.currentOffers.map(o => o.price));
                const deliveryDays = this.currentOffers.map(o => this.parseDeliveryDays(o.deliveryTime)).sort((a,b) => a-b);
                if (deliveryDays.length > 0 && deliveryDays[0] !== 999) {
                     statsValues.fastestDeliveryAvg = deliveryDays[0];
                }
            }
            
            const statsGrid = document.querySelector('.stats-grid');
            if (statsGrid) {
                this.updateElementText(statsGrid.querySelector('.stat-card:nth-child(1) .value'), statsValues.total);
                this.updateElementText(statsGrid.querySelector('.stat-card:nth-child(1) .trend'), `+${statsValues.newToday} جديد`);

                this.updateElementText(statsGrid.querySelector('.stat-card:nth-child(2) .value'), statsValues.newToday);
                // Assuming 2nd card is 'new today'

                this.updateElementText(statsGrid.querySelector('.stat-card:nth-child(3) .value'), `$${statsValues.bestPrice}`);
                // Assuming 3rd card is 'best price'

                this.updateElementText(statsGrid.querySelector('.stat-card:nth-child(4) .value'), statsValues.fastestDeliveryAvg);
                // Assuming 4th card is 'fastest delivery'
            }
        },
        
        updateOffersList: function() {
            const container = document.querySelector('.offers-list');
            if (!container) return;
            
            container.innerHTML = ''; 
            if (this.currentOffers.length === 0) {
                container.innerHTML = `<div class="offer-card" style="text-align: center; padding: var(--spacing-lg); color: var(--gray-color);">لا توجد عروض حالياً.</div>`;
                return;
            }
            this.currentOffers.forEach(offer => {
                const offerElement = this.createOfferCard(offer);
                container.appendChild(offerElement);
            });
            this.updateCheckboxes();
        },
        
        createOfferCard: function(offer) {
            const card = document.createElement('article'); // Use article for semantic meaning
            card.className = `offer-card ${this.getOfferTypeClass(offer)}`;
            card.setAttribute('data-offer-id', offer.id);
            card.setAttribute('aria-labelledby', `offer-title-${offer.id}`);

            // Determine offer type class for border
            if (offer.badges.includes('recommended')) card.classList.add('premium');
            else if (offer.badges.includes('budget')) card.classList.add('budget');

            card.innerHTML = `
                <div class="card-top-section">
                    <div class="badges-container">
                        ${offer.badges.map(badge => this.createBadgeHTML(badge)).join('')}
                    </div>
                    <div class="compare-checkbox-wrapper ship-offer-checkbox">
                        <label class="checkbox-label">
                            <input type="checkbox" class="ship-compare-checkbox" data-offer-id="${offer.id}" ${this.selectedOffers.has(offer.id) ? 'checked' : ''}>
                            <span class="custom-checkbox"></span>
                            <span class="ship-sr-only">قارن عرض ${offer.providerName}</span>
                        </label>
                    </div>
                </div>
                
                <section class="provider-section" aria-labelledby="provider-name-${offer.id}">
                    <div class="provider-info-main">
                        <div class="provider-avatar-wrapper ${offer.isVerified ? 'verified' : ''}">
                            <span class="ship-avatar-icon">${offer.avatar}</span>
                            ${offer.isVerified ? '<span class="verification-tick"><i class="fas fa-check-circle"></i></span>' : ''}
                        </div>
                        <div class="provider-details">
                            <h3 class="name" id="provider-name-${offer.id}">${offer.providerName}</h3>
                            <div class="rating">
                                <span class="stars">${this.createStarsHTML(offer.providerRating)}</span>
                                <span class="rating-text">${offer.providerRating} (${offer.providerReviews} تقييم)</span>
                            </div>
                            <div class="provider-tags">
                                <span class="tag">${offer.providerType}</span>
                                ${offer.isVerified ? '<span class="tag" style="background-color: var(--success); color: var(--text-on-primary);"><i class="fas fa-shield-alt"></i> موثق</span>' : ''}
                            </div>
                        </div>
                    </div>
                    <div class="price-details">
                        <div class="main-price ${offer.price <= 180 ? 'budget-price' : ''}">${offer.currency === 'USD' ? '$' : ''}${offer.price}</div>
                        <div class="price-per-unit">${offer.currency === 'USD' ? '$' : ''}${(offer.price / 50).toFixed(1)}/كيلو</div>
                        <div class="value-note ${this.getValueClass(offer.price)}">${this.getValueText(offer.price)}</div>
                        ${offer.price <= 180 ? `<div class="savings-info"><i class="fas fa-tags"></i> توفير $${250 - offer.price}</div>` : ''}
                    </div>
                </section>
                
                <section class="offer-highlights-grid" aria-label="تفاصيل العرض الرئيسية">
                    <div class="highlight-item">
                        <span class="icon"><i class="fas fa-shipping-fast"></i></span>
                        <div class="text-content"><span class="label">مدة التسليم</span><span class="value">${offer.deliveryTime}</span></div>
                    </div>
                    <div class="highlight-item">
                        <span class="icon"><i class="fas fa-route"></i></span>
                        <div class="text-content"><span class="label">طريقة الشحن</span><span class="value">${offer.shippingMethod}</span></div>
                    </div>
                    <div class="highlight-item">
                        <span class="icon"><i class="fas fa-map-marked-alt"></i></span>
                        <div class="text-content"><span class="label">التتبع</span><span class="value">${offer.tracking}</span></div>
                    </div>
                    <div class="highlight-item">
                        <span class="icon"><i class="fas fa-shield-alt"></i></span>
                        <div class="text-content"><span class="label">التأمين</span><span class="value">${offer.insurance}</span></div>
                    </div>
                </section>

                <section class="included-features-list" aria-label="الميزات المضمنة">
                    ${offer.features.map(feature => `<div class="feature-item"><i class="fas fa-check text-success"></i><span>${feature}</span></div>`).join('')}
                </section>

                <footer class="action-buttons">
                    <button class="btn btn-outline-primary ship-btn" data-action="view-provider-details" data-provider="${offer.providerId}"><i class="fas fa-eye"></i><span>عرض التفاصيل</span></button>
                    <button class="btn btn-secondary ship-btn" data-action="contact-provider" data-provider="${offer.providerId}"><i class="fas fa-comments"></i><span>تواصل</span></button>
                    <button class="btn btn-primary ship-btn" data-action="accept-offer" data-offer="${offer.id}"><i class="fas fa-check-circle"></i><span>قبول العرض</span></button>
                </footer>
            `;
            return card;
        },

        createBadgeHTML: function(badgeType) {
            const type = badgeType.toLowerCase();
            const badges = {
                recommended: { class: 'recommended', text: 'موصى به', icon: '<i class="fas fa-star"></i>' },
                fast: { class: 'fast', text: 'سريع', icon: '<i class="fas fa-bolt"></i>' },
                verified: { class: 'verified', text: 'موثق', icon: '<i class="fas fa-shield-alt"></i>' },
                budget: { class: 'budget', text: 'أقل سعر', icon: '<i class="fas fa-hand-holding-usd"></i>' },
                eco: { class: 'eco', text: 'صديق للبيئة', icon: '<i class="fas fa-leaf"></i>' },
                new: { class: 'fast', text: 'جديد', icon: '<i class="fas fa-certificate"></i>' } 
            };
            const badge = badges[type];
            return badge ? `<span class="badge ${badge.class}">${badge.icon} ${badge.text}</span>` : `<span class="badge" style="background-color: var(--gray-color);">${badgeType}</span>`;
        },

        createStarsHTML: function(rating) {
            let stars = '';
            const fullStars = Math.floor(rating);
            const halfStar = rating % 1 >= 0.5;
            const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

            for (let i = 0; i < fullStars; i++) {
                stars += `<i class="fas fa-star"></i>`;
            }
            if (halfStar) {
                stars += `<i class="fas fa-star-half-alt"></i>`;
            }
            for (let i = 0; i < emptyStars; i++) {
                stars += `<i class="far fa-star"></i>`; // Using far for empty star
            }
            return stars;
        },
        getOfferTypeClass: function(offer) { /* Used for card element class, not badge */ return '';},
        getValueClass: function(price) {
            if (price <= 180) return 'excellent';
            if (price <= 220) return 'good';
            return ''; // No class for average, text will handle it
        },
        getValueText: function(price) {
            if (price <= 180) return 'قيمة ممتازة';
            if (price <= 220) return 'قيمة جيدة';
            return 'قيمة معقولة';
        },

        updateComparisonBar: function() {
            const bar = document.getElementById('shipComparisonBar');
            const countEl = document.getElementById('shipCompareCount');
            const itemsContainer = document.getElementById('shipComparisonItems');
            
            if (!bar || !countEl || !itemsContainer) return;

            countEl.textContent = this.selectedOffers.size;
            
            if (this.selectedOffers.size > 0) {
                bar.style.display = 'block';
                itemsContainer.innerHTML = '';
                this.selectedOffers.forEach(offerId => {
                    const offer = this.getOfferById(offerId);
                    if (offer) {
                        const itemEl = document.createElement('div');
                        itemEl.className = 'selected-item-tag';
                        itemEl.innerHTML = `
                            <span>${offer.providerName.substring(0,12)}${offer.providerName.length > 12 ? '…' : ''}</span>
                            <button class="remove-btn" data-action="remove-from-comparison-direct" data-offer-id="${offerId}" aria-label="إزالة ${offer.providerName}">&times;</button>
                        `;
                        itemsContainer.appendChild(itemEl);
                    }
                });
            } else {
                bar.style.display = 'none';
            }
            this.updateCheckboxes();
        },
        
        toggleComparison: function(offerId) {
            const checkbox = document.querySelector(`.ship-compare-checkbox[data-offer-id="${offerId}"]`);
            if (this.selectedOffers.has(offerId)) {
                this.selectedOffers.delete(offerId);
                if(checkbox) checkbox.checked = false;
            } else {
                if (this.selectedOffers.size < this.maxCompareItems) {
                    this.selectedOffers.add(offerId);
                    if(checkbox) checkbox.checked = true;
                } else {
                    this.showNotification(`يمكنك مقارنة حتى ${this.maxCompareItems} عروض فقط`, 'warning');
                    if(checkbox) checkbox.checked = false;
                    return;
                }
            }
            this.updateComparisonBar();
        },
        removeFromComparison: function(offerId) { this.toggleComparison(offerId); /* Simplified */ },
        clearComparison: function() { this.selectedOffers.clear(); this.updateComparisonBar(); },

        openComparisonModal: function() {
            if (this.selectedOffers.size < 2) {
                this.showNotification('اختر عرضين على الأقل للمقارنة', 'warning'); return;
            }
            const modal = document.getElementById('shipComparisonModal');
            const tableElement = modal.querySelector('.ship-comparison-table');
            if (!modal || !tableElement) return;
            this.renderComparisonTable(tableElement);
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        },
        closeModal: function() {
            const modal = document.getElementById('shipComparisonModal');
            if (modal) modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        },
        
        renderComparisonTable: function(tableElement) {
            tableElement.innerHTML = '';
            const offersToCompare = Array.from(this.selectedOffers).map(id => this.getOfferById(id)).filter(o => o);
            if (offersToCompare.length === 0) return;

            const features = [
                { key: 'providerName', label: 'مقدم الخدمة' },
                { key: 'price', label: 'السعر', format: (val, offer) => `${offer.currency === 'USD' ? '$' : ''}${val}` },
                { key: 'providerRating', label: 'التقييم', format: val => `${val} ★` },
                { key: 'deliveryTime', label: 'مدة التسليم' },
                { key: 'shippingMethod', label: 'طريقة الشحن' }
            ];

            // let headerHTML = '<thead><tr><th class="feature-label-col">الميزة</th>';
            // offersToCompare.forEach(offer => { headerHTML += `<th>${offer.providerName}</th>`; });
            // headerHTML += '</tr></thead>';
            // tableElement.insertAdjacentHTML('beforeend', headerHTML);

            let bodyHTML = '<tbody>';
            features.forEach(feature => {
                bodyHTML += '<tr><td class="feature-label-col">' + feature.label + '</td>';
                offersToCompare.forEach(offer => {
                    let value = offer[feature.key];
                    if (feature.format) value = feature.format(value, offer);
                    let cellClass = 'value-cell';
                    if (feature.key === 'price' && offer.price === Math.min(...offersToCompare.map(o => o.price))) {
                        cellClass += ' best-value-cell';
                    }
                    bodyHTML += `<td class="${cellClass}">${value || '-'}</td>`;
                });
                bodyHTML += '</tr>';
            });
            bodyHTML += '</tbody>';
            tableElement.insertAdjacentHTML('beforeend', bodyHTML);
        },

        acceptOffer: function(offerId) {
            const offer = this.getOfferById(offerId);
            if (offer) this.showNotification(`تم قبول عرض ${offer.providerName}!`, 'success');
        },
        viewProviderDetails: function(providerId) {
            const offer = this.currentOffers.find(o => o.providerId === providerId);
            if (offer) this.showNotification(`عرض تفاصيل: ${offer.providerName}`, 'info');
        },
        contactProvider: function(providerId) {
            const offer = this.currentOffers.find(o => o.providerId === providerId);
            if (offer) this.showNotification(`جاري التواصل مع: ${offer.providerName}`, 'info');
        },
        
        setupEventListeners: function() {
            document.body.addEventListener('click', (e) => {
                const targetButton = e.target.closest('[data-action]');
                if (targetButton) {
                    this.handleAction(targetButton.getAttribute('data-action'), targetButton, e);
                }
            });
            document.body.addEventListener('change', (e) => {
                if (e.target.matches('.ship-compare-checkbox')) {
                    this.toggleComparison(e.target.getAttribute('data-offer-id'));
                } else if (e.target.matches('.ship-sort-select')) {
                    this.sortOffers(e.target.value);
                } else if (e.target.matches('.ship-view-btn')) {
                     this.setView(e.target.getAttribute('data-view'), e.target);
                }
            });
        },
        
        handleAction: function(action, targetElement, event) {
            const offerId = targetElement.getAttribute('data-offer-id') || targetElement.getAttribute('data-offer');
            const providerId = targetElement.getAttribute('data-provider');
            switch(action) {
                case 'accept-offer': this.acceptOffer(offerId); break;
                case 'compare-selected': this.openComparisonModal(); break;
                case 'clear-comparison': this.clearComparison(); break;
                case 'close-modal': this.closeModal(); break;
                case 'view-provider-details': this.viewProviderDetails(providerId); break;
                case 'contact-provider': this.contactProvider(providerId); break;
                case 'load-more-offers': this.showNotification("تحميل المزيد (لم يتم التنفيذ)", "info"); break;
                case 'remove-from-comparison-direct': this.removeFromComparison(offerId); break;
                case 'open-filters': this.showNotification("فتح فلاتر (لم يتم التنفيذ)", "info"); break;
            }
        },
        
        setView: function(view, clickedButton) {
            this.currentView = view;
            document.querySelectorAll('.ship-view-btn').forEach(btn => btn.classList.remove('ship-active'));
            if(clickedButton) clickedButton.classList.add('ship-active');
            
            const offersListEl = document.querySelector('.offers-list');
            if(offersListEl) {
                offersListEl.className = 'offers-list ship-offers-list'; // Reset
                if (view === 'grid') {
                    // offersListEl.classList.add('grid-view-active'); // Add specific class for grid
                    this.showNotification("عرض الشبكة لم يتم تنفيذه بعد.", "info");
                } else if (view === 'table') {
                    this.showNotification("عرض الجدول لم يتم تنفيذه بعد.", "info");
                }
            }
        },
        updateCheckboxes: function() {
            document.querySelectorAll('.ship-compare-checkbox').forEach(checkbox => {
                checkbox.checked = this.selectedOffers.has(checkbox.getAttribute('data-offer-id'));
            });
        },
        getOfferById: function(id) { return this.currentOffers.find(offer => String(offer.id) === String(id)); },
        updateElementText: function(elementOrSelector, text) {
            const element = typeof elementOrSelector === 'string' ? document.querySelector(elementOrSelector) : elementOrSelector;
            if (element) element.textContent = text;
        },
        showNotification: function(message, type = 'info') {
            const existing = document.querySelector('.app-notification');
            if(existing) existing.remove();
            const notification = document.createElement('div');
            notification.className = `app-notification type-${type}`;
            notification.textContent = message;
            // Style .app-notification and .type-* in CSS for positioning and colors
            // Example: fixed bottom, colors based on type
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        },
        sortOffers: function(criteria, initialLoad = false) {
            this.currentSort = criteria;
            this.currentOffers.sort((a, b) => {
                switch(criteria) {
                    case 'price-low': return a.price - b.price;
                    case 'price-high': return b.price - a.price;
                    case 'rating': return b.providerRating - a.providerRating;
                    case 'delivery-time': return this.parseDeliveryDays(a.deliveryTime) - this.parseDeliveryDays(b.deliveryTime);
                    default: return 0; 
                }
            });
            if (!initialLoad) { this.updateOffersList(); }
        },
        parseDeliveryDays: function(deliveryText) {
            if (!deliveryText) return 999;
            const match = deliveryText.match(/(\d+)\s*-\s*(\d+)/);
            if (match) return (parseInt(match[1]) + parseInt(match[2])) / 2;
            const singleDayMatch = deliveryText.match(/(\d+)/);
            if (singleDayMatch) return parseInt(singleDayMatch[1]);
            return 999;
        }
    };

    document.addEventListener('DOMContentLoaded', () => {
        ShipOffersController.init('REQ-2025001');
        console.log("ShipOffersController initialized with request ID: REQ-2025001");
    });