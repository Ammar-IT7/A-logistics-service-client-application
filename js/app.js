/**
 * Main App Controller
 */
const App = {
    /**
     * App configuration
     */
    config: {
        templatesPath: 'templates/pages/',
        defaultPage: 'home'
    },

    /**
     * Initialize the application
     */
    init: function() {
        // Check authentication
        if (!State.get('isAuthenticated')) {
            // Not authenticated, redirect to auth
            document.getElementById('app-container').style.display = 'none';
            document.getElementById('auth-container').style.display = '';
            return;
        }
        
        // Initialize router
        Router.init();
        
        // Initialize UI components
        Modal.init();
        Toast.init();
        Loader.init();
        Forms.init();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Navigate to default page
        Router.navigate(this.config.defaultPage);
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