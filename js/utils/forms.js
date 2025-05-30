/**
 * Forms handler
 */
const Forms = {
    /**
     * Initialize the forms handler
     */
    init: function() {
        // Set up event listeners for form elements
        document.addEventListener('change', e => {
            // Handle settings toggles
            if (e.target.id === 'notifications') {
                State.update('user.notifications', e.target.checked);
                Toast.show('Notifications', e.target.checked ? 'Notifications enabled' : 'Notifications disabled', 'info');
            }
            
            if (e.target.id === 'darkMode') {
                State.update('user.darkMode', e.target.checked);
                Toast.show('Dark Mode', e.target.checked ? 'Dark mode enabled' : 'Dark mode disabled', 'info');
                
                // Apply dark mode (implement this for your UI)
                if (e.target.checked) {
                    document.documentElement.classList.add('dark-mode');
                } else {
                    document.documentElement.classList.remove('dark-mode');
                }
            }
        });
    },
    
    /**
     * Handle form submission
     * @param {string} formId - ID of the form to submit
     */
    handleSubmit: function(formId) {
        const form = document.getElementById(formId);
        
        if (!form) return;
        
        // Handle different forms
        if (formId === 'exampleForm') {
            const nameInput = form.querySelector('#name');
            const emailInput = form.querySelector('#email');
            const messageInput = form.querySelector('#message');
            
            // Validate form
            if (nameInput && nameInput.value.trim() === '') {
                Toast.show('Validation Error', 'Please enter your name', 'warning');
                return;
            }
            
            if (emailInput && emailInput.value.trim() === '') {
                Toast.show('Validation Error', 'Please enter your email', 'warning');
                return;
            }
            
            // Show success message
            Toast.show('Form Submitted', 'Thank you for your submission!', 'success');
            
            // Reset form
            form.reset();
        }
    }
};