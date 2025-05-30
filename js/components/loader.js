/**
 * Loader component
 */
const Loader = {
    /**
     * Initialize the loader component
     */
    init: function() {
        this.loader = document.querySelector('.loader');
    },
    
    /**
     * Show the loader
     */
    show: function() {
        if (this.loader) {
            this.loader.classList.add('active');
        }
    },
    
    /**
     * Hide the loader
     */
    hide: function() {
        if (this.loader) {
            this.loader.classList.remove('active');
        }
    }
};