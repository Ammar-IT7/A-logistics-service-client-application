/**
 * Main App Controller
 */
const App = {
    /**
     * App configuration
     */
    config: {
        templatesPath: 'templates/pages/',
        defaultPage: 'client-home-page'
    },

    /**
     * Initialize the application
     */
    init: function() {
        // Check authentication
        // if (!State.get('isAuthenticated')) {
        //     // Not authenticated, redirect to auth
        //     document.getElementById('app-container').style.display = 'none';
        //     document.getElementById('auth-container').style.display = '';
        //     return;
        // }
        
        // Initialize router
        Router.init();
        
        // Initialize UI components
        Modal.init();
        Toast.init();
        Loader.init();
        Forms.init();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize global service request handler
        this.initServiceRequestHandler();
        
        // Navigate to default page
        Router.navigate(this.config.defaultPage);
    },

    /**
     * Initialize global service request functionality
     */
    initServiceRequestHandler: function() {
        // Global service request button handler
        const serviceRequestBtn = document.querySelector('.nav-service-request-btn');
        if (serviceRequestBtn) {
            serviceRequestBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleServiceRequest();
            });
        }

        // Global service request buttons handler (for any page)
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-action="request-service"], .chp-fab-request-service, [data-action="show-modal"][data-page="request-service"], [data-action="navigate"][data-page="clientServiceRequestForm"]');
            if (target) {
                e.preventDefault();
                this.handleServiceRequest();
            }
        });
    },

    /**
     * Global service request handler
     */
    handleServiceRequest: function() {

    
            this.showDevTestModal();
    },

    /**
     * Show developer test modal
     */
    showDevTestModal: function() {
        const modal = document.getElementById('devTestModal');
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('chp-active'), 10);
            
            // Set up dev test modal listeners
            const closeBtn = modal.querySelector('.chp-modal-close');
            const subscribedBtn = modal.querySelector('[data-dev-action="subscribed"]');
            const guestBtn = modal.querySelector('[data-dev-action="guest"]');
            
            if (closeBtn) {
                closeBtn.onclick = () => this.hideDevTestModal();
            }
            
            if (subscribedBtn) {
                subscribedBtn.onclick = () => {
                    this.hideDevTestModal();
                    this.navigateToRequestForm();
                };
            }
            
            if (guestBtn) {
                guestBtn.onclick = () => {
                    this.hideDevTestModal();
                    this.showLoginModal();
                };
            }
            
            // Close on overlay click
            modal.onclick = (e) => {
                if (e.target === modal) this.hideDevTestModal();
            };
        }
    },

    /**
     * Hide developer test modal
     */
    hideDevTestModal: function() {
        const modal = document.getElementById('devTestModal');
        if (modal) {
            modal.classList.remove('chp-active');
            setTimeout(() => { modal.style.display = 'none'; }, 300);
        }
    },

    /**
     * Show login modal
     */
    showLoginModal: function() {
        const modal = document.getElementById('subscriptionModal');
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('chp-active'), 10);
            
            // Set up login modal listeners
            const closeBtn = modal.querySelector('.chp-modal-close');
            const actionBtn = modal.querySelector('.chp-modal-action-btn');
            
            if (closeBtn) {
                closeBtn.onclick = () => this.hideLoginModal();
            }
            
            if (actionBtn) {
                actionBtn.onclick = () => {
                    this.hideLoginModal();
                    // Navigate to login page using Router
                    if (window.Router && window.Router.navigate) {
                        window.Router.navigate('login');
                    } else {
                        // Fallback: try to load login page directly
                        if (window.Auth && window.Auth.loadPage) {
                            window.Auth.loadPage('login');
                        }
                    }
                };
            }
            
            // Close on overlay click
            modal.onclick = (e) => {
                if (e.target === modal) this.hideLoginModal();
            };
        }
    },

    /**
     * Hide login modal
     */
    hideLoginModal: function() {
        const modal = document.getElementById('subscriptionModal');
        if (modal) {
            modal.classList.remove('chp-active');
            setTimeout(() => { modal.style.display = 'none'; }, 300);
        }
    },

    /**
     * Navigate to service request form
     */
    navigateToRequestForm: function() {
        const page = 'clientServiceRequestForm';
        if (window.Router && window.Router.navigate) {
            window.Router.navigate(page);
        } else {
            // Fallback navigation
            window.location.hash = `#${page}`;
        }
        console.log(`Navigating to service request form: ${page}`);
    },

    /**
     * Set up global event listeners
     */
    setupEventListeners: function() {
        // Global click handler using event delegation
        document.addEventListener('click', function(e) {
            // Handle data-action attributes
            const action = e.target.dataset.action;
            if (action) {
                switch (action) {
                    case 'navigate':
                        Router.navigate(e.target.dataset.page);
                        break;
                    case 'open-modal':
                        Modal.open(e.target.dataset.modal);
                        break;
                    case 'close-modal':
                        Modal.close(e.target.dataset.modal);
                        break;
                    case 'submit-modal':
                        Modal.handleSubmit(e.target.dataset.modal);
                        break;
                    case 'show-toast':
                        Toast.show(
                            e.target.dataset.title, 
                            e.target.dataset.message, 
                            e.target.dataset.type,
                            e.target.dataset.duration
                        );
                        break;
                    case 'submit-form':
                        Forms.handleSubmit(e.target.dataset.form);
                        break;
                    case 'logout':
                        Auth.logout();
                        break;
                }
            }
            
            // Close modals when clicking outside
            if (e.target.classList.contains('modal')) {
                Modal.close();
            }
        });

        // Handle bottom navigation
        document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                Router.navigate(this.dataset.page);
            });
        });

        // Initialize page-specific controllers when pages load
        document.addEventListener('pageLoaded', function(e) {
            const pageId = e.detail.pageId;
            
            // Initialize MorePage when more page is loaded
            if (pageId === 'more' && typeof MorePage !== 'undefined') {
                MorePage.init();
            }
        });
    }
};

// Designer notes for each page
const designerNotes = {
    login: "صفحة تسجيل الدخول. يمكن للمستخدم إدخال بيانات تسجيل الدخول أو الانتقال لإنشاء حساب جديد.",
    register: "صفحة إنشاء حساب جديد لمزودي الخدمة. تتضمن حقول إدخال البيانات الأساسية ونوع الخدمة.",
};

// Listen for page changes to update designer notes
document.addEventListener('stateChange', function(e) {
    if (e.detail.key === 'currentPage') {
        const notes = designerNotes[e.detail.value] || "لا توجد ملاحظات لهذه الصفحة.";
        const notesContent = document.getElementById('designer-notes-content');
        if (notesContent) {
            notesContent.innerHTML = `<p>${notes}</p>`;
        }
    }
});