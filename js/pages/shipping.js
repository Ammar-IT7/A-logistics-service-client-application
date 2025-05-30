/**
 * Shipping page controller
 */
const ShippingController = {
    /**
     * Initialize the shipping page
     */
    init: function() {
        console.log('Shipping page initialized 1');
        this.setupTabNavigation();
    },

    /**
     * Set up tab navigation functionality
     */
    setupTabNavigation: function() {
        console.log('Shipping page initialized 2');
        // Get all tab buttons and content areas
        const tabButtons = document.querySelectorAll('.ship-tab-button');
        const tabContents = document.querySelectorAll('.ship-tab-content');

        // Add click event to each button
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Shipping page initialized 3');
                // Get which tab to show from data attribute
                const tabToShow = button.dataset.tab;
                
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Find the corresponding content by ID and add active class
                const contentToShow = document.getElementById(`${tabToShow}-tab`);
                if (contentToShow) {
                    contentToShow.classList.add('active');
                } else {
                    console.error(`Tab content with ID ${tabToShow}-tab not found`);
                }
            });
        });
    }
};

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    ShippingController.init();
});