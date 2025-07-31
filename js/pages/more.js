// More Page JavaScript
const MorePage = {
    init() {
        this.bindEvents();
        this.setupPageCards();
        this.setupAccountActions();
    },

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
                    background: var(--primary-color);
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
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MorePage;
} 