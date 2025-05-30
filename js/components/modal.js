/**
 * Modal component
 */
const Modal = {
    activeModal: null,
    modalCache: {},
    
    /**
     * Initialize the modal component
     */
    init: function() {
        this.modalContainer = document.getElementById('modal-container');
    },
    
    /**
     * Open a modal
     * @param {string} modalId - ID of the modal to open
     */
    open: function(modalId) {
        // Don't open if already open
        if (this.activeModal === modalId) return;
        
        // Load the modal
        this.loadModal(modalId)
            .then(() => {
                // Set the active modal
                this.activeModal = modalId;
                
                // Show the modal
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.add('active');
                }
            })
            .catch(error => {
                console.error('Error loading modal:', error);
                Toast.show('Error', 'Failed to load modal', 'danger');
            });
    },
    
    /**
     * Close a modal
     * @param {string} modalId - ID of the modal to close (optional)
     */
    close: function(modalId) {
        // If no modalId provided, close the active modal
        const id = modalId || this.activeModal;
        
        if (!id) return;
        
        // Hide the modal
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.remove('active');
        }
        
        // Clear active modal
        if (this.activeModal === id) {
            this.activeModal = null;
        }
    },
    
    /**
     * Load a modal from cache or fetch from server
     * @param {string} modalId - ID of the modal to load
     * @returns {Promise} - Promise that resolves when the modal is loaded
     */
    loadModal: function(modalId) {
        return new Promise((resolve, reject) => {
            // Check if the modal exists
            if (document.getElementById(modalId)) {
                resolve();
                return;
            }
            
            // Check if the modal is cached
            if (this.modalCache[modalId]) {
                this.renderModal(modalId, this.modalCache[modalId]);
                resolve();
                return;
            }
            
            // Fetch the modal template
            fetch(`templates/modals/${modalId}.html`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Modal not found');
                    }
                    return response.text();
                })
                .then(html => {
                    // Cache the modal
                    this.modalCache[modalId] = html;
                    
                    // Render the modal
                    this.renderModal(modalId, html);
                    
                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    
    /**
     * Render a modal to the modal container
     * @param {string} modalId - ID of the modal
     * @param {string} html - HTML content of the modal
     */
    renderModal: function(modalId, html) {
        // Create modal element
        const modalElement = document.createElement('div');
        modalElement.id = modalId;
        modalElement.className = 'modal';
        
        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.innerHTML = html;
        
        // Append to modal
        modalElement.appendChild(modalContent);
        
        // Append to container
        this.modalContainer.appendChild(modalElement);
    },
    
    /**
     * Handle modal form submission
     * @param {string} modalId - ID of the modal
     */
    handleSubmit: function(modalId) {
        const modal = document.getElementById(modalId);
        
        if (!modal) return;
        
        // Get the input value (if exists)
        const input = modal.querySelector('#modalInput');
        const value = input ? input.value : null;
        
        // Handle different modal submissions
        if (modalId === 'editProfileModal') {
            const nameInput = modal.querySelector('#profileName');
            const emailInput = modal.querySelector('#profileEmail');
            
            if (nameInput && emailInput) {
                const name = nameInput.value.trim();
                const email = emailInput.value.trim();
                
                if (name && email) {
                    // Update the state
                    State.update('user.name', name);
                    State.update('user.email', email);
                    
                    // Show toast
                    Toast.show('Profile Updated', 'Your profile has been updated successfully', 'success');
                } else {
                    Toast.show('Missing Information', 'Please fill in all required fields', 'warning');
                    return;
                }
            }
        } else {
            // Default toast for other modals
            if (value) {
                Toast.show('Modal Submitted', `You entered: ${value}`, 'success');
            } else {
                Toast.show('Modal Submitted', 'No input provided', 'info');
            }
        }
        
        // Close the modal
        this.close(modalId);
    }
};