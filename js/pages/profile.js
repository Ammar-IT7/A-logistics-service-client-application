/**
 * Profile page controller
 */
const ProfileController = {
    /**
     * Initialize the profile page
     */
    init: function() {
        console.log('Profile page initialized');
        
        // Update UI with latest user data
        this.updateProfileData();
        
        // Set up event listeners
        this.setupEventListeners();
    },
    
    /**
     * Update the profile UI with data from state
     */
    updateProfileData: function() {
        const profilePage = document.getElementById('profile');
        if (!profilePage) return;
        
        const user = State.get('user');
        
        // Update profile elements
        const nameElement = profilePage.querySelector('.profile-name');
        const emailElement = profilePage.querySelector('.profile-email');
        
        if (nameElement) nameElement.textContent = user.name;
        if (emailElement) emailElement.textContent = user.email;
    },
    
    /**
     * Set up page-specific event listeners
     */
    setupEventListeners: function() {
        // Example of using event delegation for page-specific events
        const profilePage = document.getElementById('profile');
        if (profilePage) {
            profilePage.addEventListener('click', function(e) {
                // Handle special button clicks, etc.
            });
        }
    }
};