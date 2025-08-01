// More Page JavaScript
class MorePage {
    constructor() {
        this.pages = [];
        this.recentPages = [];
        
        // Drawer Properties
        this.drawer = null;
        this.paymentModal = null;
        this.currentTransactionType = 'deposit';
        this.selectedGateway = null;
        this.paymentGateways = [
            { id: 'kuraimi', name: 'الكريمي', icon: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/KuraimiBank.png' },
            { id: 'jeeb', name: 'جيب', icon: 'https://scontent.fmct5-1.fna.fbcdn.net/v/t39.30808-6/347589312_6530726350324142_5191902965427443108_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=JmsvG7hcXLYQ7kNvwGNAuhP&_nc_oc=AdmfaEstIcveDExeQpetIoe-zfDDUKp4seZF33c8J75z5lO0ajvYXYWjE1w4O6s4Ygs&_nc_zt=23&_nc_ht=scontent.fmct5-1.fna&_nc_gid=6NXCtwqDO6L8pU8T6JsmmA&oh=00_AfMKrxmvqMap_qoIUvlkuf4G_noiiXAxY_CmPRkQzdNTvw&oe=68619CA' },
            { id: 'jawali', name: 'جوالي', icon: 'https://yemeneco.org/wp-content/uploads/2024/04/jawali.png' },
            { id: 'bank', name: 'حساب بنكي', icon: 'https://cdn-icons-png.freepik.com/512/8634/8634075.png' },
            { id: 'mastercard', name: 'Mastercard', icon: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png' },
            { id: 'paypal', name: 'PayPal', icon: 'https://pngimg.com/uploads/paypal/paypal_PNG7.png' },
        ];
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupPageCards();
        this.setupAccountActions();
        this.updatePageStats();
        this.highlightRecentPages();
        
        // Drawer functionality
        this.setupDrawerEventListeners();
    }

    bindEvents() {
        // Handle page card clicks
        document.addEventListener('click', (e) => {
            const pageCard = e.target.closest('.more-page-card');
            if (pageCard) {
                this.handlePageCardClick(pageCard, e);
            }

            const accountBtn = e.target.closest('.more-account-btn');
            if (accountBtn) {
                this.handleAccountActionClick(accountBtn, e);
            }
        });

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const focusedElement = document.activeElement;
                if (focusedElement.classList.contains('more-page-card')) {
                    e.preventDefault();
                    this.handlePageCardClick(focusedElement, e);
                } else if (focusedElement.classList.contains('more-account-btn')) {
                    e.preventDefault();
                    this.handleAccountActionClick(focusedElement, e);
                }
            }
        });
    },

    setupPageCards() {
        const pageCards = document.querySelectorAll('.more-page-card');
        
        pageCards.forEach(card => {
            // Add loading state class
            card.classList.add('loading');
            
            // Add focus management
            card.setAttribute('tabindex', '0');
            
            // Add ARIA labels for accessibility
            const title = card.querySelector('.more-page-title')?.textContent;
            const description = card.querySelector('.more-page-description')?.textContent;
            if (title) {
                card.setAttribute('aria-label', `${title} - ${description || ''}`);
            }
        });

        // Remove loading state after animation
        setTimeout(() => {
            pageCards.forEach(card => {
                card.classList.remove('loading');
            });
        }, 2000);
    },

    setupAccountActions() {
        const accountBtns = document.querySelectorAll('.more-account-btn');
        
        accountBtns.forEach(btn => {
            btn.setAttribute('tabindex', '0');
            
            // Add ARIA labels
            const text = btn.querySelector('span')?.textContent;
            if (text) {
                btn.setAttribute('aria-label', text);
            }
        });
    },

    handlePageCardClick(card, event) {
        event.preventDefault();
        
        // Add click feedback
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);

        // Get the target page
        const targetPage = card.getAttribute('data-page');
        if (targetPage) {
            // Show loading state
            card.classList.add('loading');
            
            // Navigate to the page
            setTimeout(() => {
                Router.navigateToPage(targetPage);
            }, 300);
        }
    },

    handleAccountActionClick(btn, event) {
        event.preventDefault();
        
        // Add click feedback
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 150);

        const action = btn.getAttribute('data-action');
        const targetPage = btn.getAttribute('data-page');

        if (action === 'logout') {
            this.handleLogout();
        } else if (targetPage) {
            // Show loading state
            btn.style.opacity = '0.6';
            
            // Navigate to the page
            setTimeout(() => {
                Router.navigateToPage(targetPage);
            }, 300);
        }
    },

    handleLogout() {
        // Show confirmation dialog
        const confirmed = confirm('هل أنت متأكد من تسجيل الخروج؟');
        if (confirmed) {
            // Show loading state
            const logoutBtn = document.querySelector('.more-logout-btn');
            if (logoutBtn) {
                logoutBtn.style.opacity = '0.6';
                logoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>جاري تسجيل الخروج...</span>';
            }

            // Simulate logout process
            setTimeout(() => {
                // Clear user data
                localStorage.removeItem('user');
                localStorage.removeItem('authToken');
                
                // Navigate to login page
                Router.navigateToPage('login');
                
                // Show success message
                Toast.show('تم تسجيل الخروج بنجاح', 'success');
            }, 1000);
        }
    },

    // Method to update page statistics
    updatePageStats() {
        const totalPages = document.querySelectorAll('.more-page-card').length;
        const statsElement = document.querySelector('.more-section-subtitle');
        
        if (statsElement) {
            statsElement.textContent = `استكشف جميع الخدمات والوظائف المتاحة في التطبيق (${totalPages} صفحة)`;
        }
    },

    // Method to search/filter pages
    filterPages(searchTerm) {
        const pageCards = document.querySelectorAll('.more-page-card');
        const searchLower = searchTerm.toLowerCase();

        pageCards.forEach(card => {
            const title = card.querySelector('.more-page-title')?.textContent?.toLowerCase() || '';
            const description = card.querySelector('.more-page-description')?.textContent?.toLowerCase() || '';
            
            const matches = title.includes(searchLower) || description.includes(searchLower);
            
            if (matches) {
                card.style.display = 'flex';
                card.style.animation = 'fadeInUp 0.3s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    },

    // Method to highlight recently used pages
    highlightRecentPages() {
        const recentPages = JSON.parse(localStorage.getItem('recentPages') || '[]');
        
        recentPages.forEach(pageName => {
            const card = document.querySelector(`[data-page="${pageName}"]`);
            if (card) {
                card.style.borderColor = 'var(--primary-color)';
                card.style.backgroundColor = 'var(--primary-bg)';
                
                // Add a small indicator
                const indicator = document.createElement('div');
                indicator.className = 'recent-indicator';
                indicator.innerHTML = '<i class="fas fa-clock"></i>';
                indicator.style.cssText = `
                    position: absolute;
                    top: 8px;
                    right: 8px;
                     background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.7rem;
                `;
                
                card.style.position = 'relative';
                card.appendChild(indicator);
            }
        });
    },

    // Method to track page usage
    trackPageUsage(pageName) {
        const recentPages = JSON.parse(localStorage.getItem('recentPages') || '[]');
        
        // Remove if already exists
        const index = recentPages.indexOf(pageName);
        if (index > -1) {
            recentPages.splice(index, 1);
        }
        
        // Add to beginning
        recentPages.unshift(pageName);
        
        // Keep only last 5
        if (recentPages.length > 5) {
            recentPages.pop();
        }
        
        localStorage.setItem('recentPages', JSON.stringify(recentPages));
    }

    /**
     * Setup drawer event listeners
     */
    setupDrawerEventListeners() {
        // Menu button
        const menuButton = document.querySelector('.header-action[data-action="menu"]');
        if (menuButton) {
            menuButton.addEventListener('click', () => this.showDrawer());
        }

        // Drawer close button
        const drawerCloseBtn = document.querySelector('#moreDrawer .spd-drawer-close');
        if (drawerCloseBtn) {
            drawerCloseBtn.addEventListener('click', () => this.hideDrawer());
        }

        // Drawer overlay click to close
        const drawerOverlay = document.getElementById('moreDrawer');
        if (drawerOverlay) {
            drawerOverlay.addEventListener('click', (e) => {
                if (e.target === drawerOverlay) this.hideDrawer();
            });
        }

        // Payment buttons in drawer
        const depositBtn = document.querySelector('#moreDrawer .spd-btn-deposit');
        const withdrawBtn = document.querySelector('#moreDrawer .spd-btn-withdraw');
        if (depositBtn) {
            depositBtn.addEventListener('click', () => this.showPaymentModal('deposit'));
        }
        if (withdrawBtn) {
            withdrawBtn.addEventListener('click', () => this.showPaymentModal('withdraw'));
        }

        // Payment modal functionality
        const paymentModal = document.getElementById('morePaymentModal');
        if (paymentModal) {
            const closeBtn = paymentModal.querySelector('.sptm-close');
            const proceedBtn = paymentModal.querySelector('#morePaymentProceedBtn');
            const amountInput = paymentModal.querySelector('#morePaymentAmount');

            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.hidePaymentModal());
            }

            if (proceedBtn) {
                proceedBtn.addEventListener('click', () => this.processTransaction());
            }

            if (amountInput) {
                amountInput.addEventListener('input', () => this.validateTransaction());
            }

            paymentModal.addEventListener('click', (e) => {
                if (e.target === paymentModal) this.hidePaymentModal();
            });
        }

        // Navigation items in drawer
        const navItems = document.querySelectorAll('#moreDrawer .spd-nav-item[data-action="navigate"]');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = item.dataset.page;
                this.hideDrawer();
                // Use the router to navigate to the target page
                if (window.Router && window.Router.navigateTo) {
                    window.Router.navigateTo(targetPage);
                } else {
                    // Fallback navigation
                    window.location.hash = `#${targetPage}`;
                }
            });
        });

        // Logout functionality
        const logoutItem = document.querySelector('#moreDrawer .spd-nav-item[data-action="logout"]');
        if (logoutItem) {
            logoutItem.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideDrawer();
                // Handle logout logic
                if (window.Auth && window.Auth.logout) {
                    window.Auth.logout();
                } else {
                    // Fallback logout
                    window.location.href = '#login';
                }
            });
        }
    }

    /**
     * Show more page drawer
     */
    showDrawer() {
        const drawer = document.getElementById('moreDrawer');
        if (drawer) {
            drawer.style.display = 'block';
            setTimeout(() => drawer.classList.add('spd-active'), 10);
            const animatedItems = drawer.querySelectorAll('.spd-profile-header, .spd-balance-section, .spd-profile-nav');
            animatedItems.forEach((item, index) => {
                item.classList.remove('spd-item-animating');
                item.style.animationDelay = `${index * 100 + 50}ms`;
                setTimeout(() => item.classList.add('spd-item-animating'), 20);
            });
        }
    }

    /**
     * Hide more page drawer
     */
    hideDrawer() {
        const drawer = document.getElementById('moreDrawer');
        if (drawer) {
            drawer.classList.remove('spd-active');
            setTimeout(() => { drawer.style.display = 'none'; }, 400);
        }
    }

    /**
     * Show payment modal for more page
     */
    showPaymentModal(type) {
        this.paymentModal = document.getElementById('morePaymentModal');
        if (!this.paymentModal) return;
        this.currentTransactionType = type;
        this.paymentModal.querySelector('#morePaymentTitle').textContent = type === 'deposit' ? 'إيداع مبلغ' : 'سحب مبلغ';
        this.populateGateways();
        this.paymentModal.querySelector('#morePaymentAmount').value = '';
        this.selectedGateway = null;
        this.paymentModal.querySelectorAll('.sptm-step').forEach(step => step.classList.remove('active'));
        this.paymentModal.querySelector('#morePaymentStep1').classList.add('active');
        this.validateTransaction();
        this.paymentModal.classList.add('active');
    }

    /**
     * Hide payment modal
     */
    hidePaymentModal() {
        this.paymentModal?.classList.remove('active');
    }

    /**
     * Populate payment gateways
     */
    populateGateways() {
        const grid = this.paymentModal.querySelector('.sptm-gateways-grid');
        grid.innerHTML = '';
        this.paymentGateways.forEach(gw => {
            const div = document.createElement('div');
            div.className = 'sptm-gateway';
            div.dataset.id = gw.id;
            div.innerHTML = `<img src="${gw.icon}" alt="${gw.name} logo"><div class="sptm-gateway-name">${gw.name}</div>`;
            div.addEventListener('click', () => {
                this.paymentModal.querySelectorAll('.sptm-gateway').forEach(el => el.classList.remove('selected'));
                div.classList.add('selected');
                this.selectedGateway = gw.id;
                this.validateTransaction();
            });
            grid.appendChild(div);
        });
    }

    /**
     * Validate transaction
     */
    validateTransaction() {
        const amount = parseFloat(this.paymentModal.querySelector('#morePaymentAmount').value);
        this.paymentModal.querySelector('#morePaymentProceedBtn').disabled = !(amount > 0 && this.selectedGateway);
    }

    /**
     * Process transaction
     */
    processTransaction() {
        this.paymentModal.querySelector('#morePaymentStep1').classList.remove('active');
        this.paymentModal.querySelector('#morePaymentStep2').classList.add('active');
        setTimeout(() => {
            const amount = parseFloat(this.paymentModal.querySelector('#morePaymentAmount').value);
            this.updateBalance(amount, this.currentTransactionType);
            const successMessageEl = this.paymentModal.querySelector('#morePaymentSuccessMessage');
            const actionText = this.currentTransactionType === 'deposit' ? 'إيداع' : 'سحب';
            successMessageEl.textContent = `تم ${actionText} مبلغ ${amount.toFixed(2)} ر.ي بنجاح.`;
            this.paymentModal.querySelector('#morePaymentStep2').classList.remove('active');
            this.paymentModal.querySelector('#morePaymentStep3').classList.add('active');
            setTimeout(() => this.hidePaymentModal(), 2500);
        }, 2500);
    }

    /**
     * Update balance
     */
    updateBalance(amount, type) {
        const balanceEl = document.querySelector('#moreDrawer .spd-balance-amount span');
        if (!balanceEl) return;
        let currentBalance = parseFloat(balanceEl.textContent.replace(/,/g, ''));
        const newBalance = type === 'deposit' ? currentBalance + amount : currentBalance - amount;
        balanceEl.innerHTML = `${newBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <small>ر.ي</small>`;
        const balanceCard = document.querySelector('#moreDrawer .spd-balance-amount');
        balanceCard.classList.add('balance-pop');
        balanceCard.addEventListener('animationend', () => balanceCard.classList.remove('balance-pop'), { once: true });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MorePage;
} 