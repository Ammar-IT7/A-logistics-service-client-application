/**
 * Toast notification component
 */
const Toast = {
    /**
     * Initialize the toast component
     */
    init: function() {
        this.container = document.querySelector('.toast-container');
        
        // Create container if it doesn't exist
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    },
    
    /**
     * Show a toast notification
     * @param {string} title - Title of the toast
     * @param {string} message - Message to display
     * @param {string} type - Type of toast (success, info, warning, danger)
     * @param {number} duration - Duration in milliseconds
     */
    show: function(title, message, type = 'info', duration = 3000) {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // Toast content
        toast.innerHTML = `
            <div class="toast-header">
                <div class="toast-title">${title}</div>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">✕</button>
            </div>
            <div class="toast-body">${message}</div>
        `;
        
        // Add to container
        this.container.appendChild(toast);
        
        // Activate with slight delay to trigger animation
        setTimeout(() => {
            toast.classList.add('active');
        }, 10);
        
        // Remove after duration
        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, duration);
    }
};