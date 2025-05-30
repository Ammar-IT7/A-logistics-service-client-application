/**
 * State management for the application
 */
const State = {
    /**
     * Application state data
     */
    data: {
        currentPage: "null",
        user: {
            name: 'User Name',
            email: 'user@example.com',
            notifications: true,
            darkMode: false,
            language: 'English'
        },
        notifications: [
            { id: 1, title: 'New message received', subtitle: 'From John Doe - 2 hours ago', isNew: true },
            { id: 2, title: 'Payment successful', subtitle: 'Your order #12345 has been processed - 5 hours ago', isNew: false }
        ]
    },
    
    /**
     * Initialize the state
     */
    init: function() {
        // Try to load state from localStorage
        const savedState = localStorage.getItem('appState');
        if (savedState) {
            try {
                const parsedState = JSON.parse(savedState);
                this.data = { ...this.data, ...parsedState };
            } catch (e) {
                console.error('Failed to parse saved state:', e);
            }
        }
    },
    
    /**
     * Get a value from the state
     * @param {string} key - Key to get from state
     * @returns {*} - The value from state
     */
    get: function(key) {
        if (key.includes('.')) {
            const keys = key.split('.');
            let value = this.data;
            
            for (const k of keys) {
                if (value === undefined) return undefined;
                value = value[k];
            }
            
            return value;
        }
        
        return this.data[key];
    },
    
    /**
     * Update a value in the state
     * @param {string} key - Key to update
     * @param {*} value - New value
     */
    update: function(key, value) {
        if (key.includes('.')) {
            const keys = key.split('.');
            let obj = this.data;
            
            for (let i = 0; i < keys.length - 1; i++) {
                const k = keys[i];
                if (!obj[k]) obj[k] = {};
                obj = obj[k];
            }
            
            obj[keys[keys.length - 1]] = value;
        } else {
            this.data[key] = value;
        }
        
        // Save to localStorage
        this.saveState();
        
        // Trigger state change event
        this.notifyStateChange(key, value);
    },
    
    /**
     * Save the current state to localStorage
     */
    saveState: function() {
        try {
            localStorage.setItem('appState', JSON.stringify(this.data));
        } catch (e) {
            console.error('Failed to save state:', e);
        }
    },
    
    /**
     * Notify subscribers of state changes
     * @param {string} key - Key that was updated
     * @param {*} value - New value
     */
    notifyStateChange: function(key, value) {
        const event = new CustomEvent('stateChange', {
            detail: { key, value }
        });
        
        document.dispatchEvent(event);
    }
};