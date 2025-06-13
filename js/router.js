const Router = {
    currentPage: null,

    init: function() {
        this.pageContainer = document.getElementById('page-container');
        if (!this.pageContainer) {
            console.error("Router Critical Error: Page container 'page-container' not found.");
        }
    },

    navigate: function(pageId) {
        if (this.currentPage === pageId) {
            console.log(`Router: Already on page ${pageId}. Navigation skipped.`);
            return;
        }

        if (!this.pageContainer) {
            console.error("Router Error: pageContainer is not initialized. Cannot navigate.");
            Toast.show('خطأ في التنقل', 'حاول تحديث الصفحة', 'danger');
            return;
        }

        const previousPageId = this.currentPage;
        Loader.show();

        // Enhanced controller destruction with better error handling
        if (previousPageId) {
            this.destroyController(previousPageId);
        }
        
        this.pageContainer.innerHTML = '';
        console.log("Router: Page container cleared.");

        this.loadPage(pageId)
            .then(html => {
                this.renderPage(pageId, html);
                this.setActivePage(pageId);
                this.updateNavigation(pageId);
                this.currentPage = pageId;
                State.update('currentPage', pageId);

                // Enhanced controller initialization
                this.initializeController(pageId);
                
                Loader.hide();
            })
            .catch(error => {
                console.error('Router: Error loading page:', pageId, error);
                Toast.show('صفحة غير متوفرة', 'تعذر تحميل الصفحة المطلوبة.', 'danger');
                Loader.hide();
                this.currentPage = null;
            });
    },

    /**
     * Enhanced controller destruction with better error handling
     */
    destroyController: function(pageId) {
        const controllerName = this.getControllerName(pageId);
        console.log(`Router: Attempting to destroy ${controllerName}`);
        
        // Check if controller exists in window
        if (!window[controllerName]) {
            console.warn(`Router: Controller ${controllerName} not found in window object`);
            console.log('Available controllers:', Object.keys(window).filter(key => key.includes('Controller')));
            return;
        }

        const controller = window[controllerName];
        
        if (typeof controller.destroy === 'function') {
            try {
                console.log(`Router: Destroying ${controllerName}`);
                controller.destroy();
                console.log(`Router: Successfully destroyed ${controllerName}`);
            } catch (error) {
                console.error(`Router: Error destroying ${controllerName}:`, error);
            }
        } else {
            console.warn(`Router: ${controllerName} exists but does not have a destroy method.`);
            console.log(`Router: ${controllerName} methods:`, Object.keys(controller).filter(key => typeof controller[key] === 'function'));
        }
    },

    /**
     * Enhanced controller initialization with better error handling
     */
    initializeController: function(pageId) {
        const controllerName = this.getControllerName(pageId);
        console.log(`Router: Attempting to initialize ${controllerName}`);
        
        // Add a small delay to ensure DOM is ready
        setTimeout(() => {
            if (!window[controllerName]) {
                console.warn(`Router: Controller ${controllerName} not found in window object`);
                console.log('Available controllers:', Object.keys(window).filter(key => key.includes('Controller')));
                return;
            }

            const controller = window[controllerName];
            
            if (typeof controller.init === 'function') {
                try {
                    console.log(`Router: Initializing ${controllerName}`);
                    controller.init();
                    console.log(`Router: Successfully initialized ${controllerName}`);
                } catch (error) {
                    console.error(`Router: Error initializing ${controllerName}:`, error);
                }
            } else {
                console.warn(`Router: ${controllerName} exists but does not have an init method.`);
                console.log(`Router: ${controllerName} methods:`, Object.keys(controller).filter(key => typeof controller[key] === 'function'));
            }
        }, 50);
    },

    /**
     * Generate controller name from page ID
     */
    getControllerName: function(pageId) {
        const parts = pageId.split('-');
        const capitalizedParts = parts.map(part => part.charAt(0).toUpperCase() + part.slice(1));
        return capitalizedParts.join('') + 'Controller';
    },

    // ... rest of your existing router methods remain the same
    loadPage: function(pageId) {
        console.log(`Router: Fetching page - templates/pages/${pageId}.html`);
        return new Promise((resolve, reject) => {
            fetch(`templates/pages/${pageId}.html`)
                .then(response => {
                    if (!response.ok) {
                        if (response.status === 404) {
                            throw new Error(`Page not found: templates/pages/${pageId}.html (404)`);
                        }
                        throw new Error(`Failed to fetch templates/pages/${pageId}.html. Status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(html => resolve(html))
                .catch(error => reject(error));
        });
    },

    renderPage: function(pageId, html) {
        const pageElement = document.createElement('div');
        pageElement.id = pageId;
        pageElement.className = 'page';
        pageElement.innerHTML = html;
        this.pageContainer.appendChild(pageElement);
        console.log(`Router: Rendered page ${pageId}`);
    },

    setActivePage: function(pageId) {
        const activePage = document.getElementById(pageId);
        if (activePage) {
            activePage.classList.add('active');
            console.log(`Router: Activated page ${pageId}`);
        } else {
            console.warn(`Router: Could not find page element to activate: ${pageId}`);
        }
    },

    updateNavigation: function(pageId) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        const activeNav = document.querySelector(`.nav-item[data-page="${pageId}"]`);
        if (activeNav) {
            activeNav.classList.add('active');
        }
    }
};