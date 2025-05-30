/**
 * Settings page controller
 */
const SettingsController = {
    /**
     * Initialize the settings page
     */
    init: function() {
        console.log('Settings page initialized');
        
        // Update UI with latest settings
        this.updateSettingsUI();
        
        // Additional initialization...
        this.setupEventListeners();
    },
    
    /**
     * Update settings UI elements based on state
     */
    updateSettingsUI: function() {
        const settingsPage = document.getElementById('settings');
        if (!settingsPage) return;
        
        const user = State.get('user');
        
        // Update form elements
        const notificationsCheckbox = settingsPage.querySelector('#notifications');
        const darkModeCheckbox = settingsPage.querySelector('#darkMode');
        const languageSelect = settingsPage.querySelector('select');
        
        if (notificationsCheckbox) notificationsCheckbox.checked = user.notifications;
        if (darkModeCheckbox) darkModeCheckbox.checked = user.darkMode;
        
        if (languageSelect) {
            Array.from(languageSelect.options).forEach(option => {
                if (option.value === user.language) {
                    option.selected = true;
                }
            });
        }
    },
    
    /**
     * Set up page-specific event listeners
     */
    setupEventListeners: function() {
        // Example of using event delegation for page-specific events
        const settingsPage = document.getElementById('settings');
        if (settingsPage) {
            // Handle language selection change
            const languageSelect = settingsPage.querySelector('select');
            if (languageSelect) {
                languageSelect.addEventListener('change', function(e) {
                    State.update('user.language', e.target.value);
                    Toast.show('Language', `Language set to ${e.target.value}`, 'info');
                });
            }
            
            // Handle logout
            const logoutButton = settingsPage.querySelector('.btn-accent');
            if (logoutButton) {
                logoutButton.addEventListener('click', function() {
                    Toast.show('Logged Out', 'You have been logged out', 'info');
                    // In a real app, would clear state and redirect to login
                });
            }
        }
    }
};