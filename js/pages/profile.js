/**
 * Profile Page Controller
 * Manages user profile with mobile-focused 2-column grid approach
 */
window.ProfileController = {
    /**
     * Initialize the profile page
     */
    init: function() {
        console.log('ProfileController: Initializing profile page');
        
        this.loadUserProfile();
        this.setupEventListeners();
        this.setupAvatarUpload();
        this.updateStats();
        
        console.log('ProfileController: Profile page initialized successfully');
    },

    /**
     * Load user profile data
     */
    loadUserProfile: function() {
        // Simulate loading user data
        const userData = {
            name: 'أحمد محمد علي',
            email: 'ahmed.mohamed@example.com',
            avatar: 'https://placehold.co/120x120/282460/FAAE43?text=أ',
            isVerified: true,
            stats: {
                orders: 24,
                rating: 4.8,
                favorites: 12,
                balance: 2450
            }
        };

        this.updateProfileDisplay(userData);
    },

    /**
     * Update profile display with user data
     */
    updateProfileDisplay: function(userData) {
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const profileAvatar = document.getElementById('profileAvatar');

        if (profileName) profileName.textContent = userData.name;
        if (profileEmail) profileEmail.textContent = userData.email;
        if (profileAvatar) profileAvatar.src = userData.avatar;

        // Update verification status
        const verificationElement = document.querySelector('.profile-verification');
        if (verificationElement) {
            if (userData.isVerified) {
                verificationElement.style.display = 'flex';
            } else {
                verificationElement.style.display = 'none';
            }
        }
    },

    /**
     * Update profile statistics
     */
    updateStats: function() {
        const statsData = {
            orders: 24,
            rating: 4.8,
            favorites: 12,
            balance: 2450
        };

        // Update stats cards
        const statCards = document.querySelectorAll('.profile-stat-card');
        statCards.forEach((card, index) => {
            const valueElement = card.querySelector('.profile-stat-value');
            if (valueElement) {
                const values = [statsData.orders, statsData.rating, statsData.favorites, statsData.balance];
                if (index === 1) { // Rating
                    valueElement.textContent = values[index];
                } else if (index === 3) { // Balance
                    valueElement.textContent = values[index] + ' ر.ي';
                } else {
                    valueElement.textContent = values[index];
                }
            }
        });
    },

    /**
     * Setup event listeners
     */
    setupEventListeners: function() {
        // Profile edit button
        const editProfileBtn = document.querySelector('[data-action="edit-profile"]');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', this.handleEditProfile.bind(this));
        }

        // Menu item navigation
        const menuItems = document.querySelectorAll('.profile-menu-item[data-action="navigate"]');
        menuItems.forEach(item => {
            item.addEventListener('click', this.handleMenuNavigation.bind(this));
        });

        // Logout button
        const logoutBtn = document.querySelector('.profile-logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', this.handleLogout.bind(this));
        }

        // Avatar click for upload
        const avatarContainer = document.querySelector('.profile-avatar');
        if (avatarContainer) {
            avatarContainer.addEventListener('click', this.handleAvatarClick.bind(this));
        }

        // Status toggle
        const statusIndicator = document.querySelector('.profile-status-indicator');
        if (statusIndicator) {
            statusIndicator.addEventListener('click', this.toggleProfileStatus.bind(this));
        }
    },

    /**
     * Setup avatar upload functionality
     */
    setupAvatarUpload: function() {
        // Create hidden file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        fileInput.id = 'avatarUpload';

        fileInput.addEventListener('change', this.handleAvatarUpload.bind(this));
        document.body.appendChild(fileInput);
    },

    /**
     * Handle avatar click
     */
    handleAvatarClick: function() {
        const fileInput = document.getElementById('avatarUpload');
        if (fileInput) {
            fileInput.click();
        }
    },

    /**
     * Handle avatar upload
     */
    handleAvatarUpload: function(event) {
        const file = event.target.files[0];
        if (file) {
            // Show loading state
            const avatar = document.getElementById('profileAvatar');
            if (avatar) {
                avatar.style.opacity = '0.5';
            }

            // Simulate upload process
            setTimeout(() => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (avatar) {
                        avatar.src = e.target.result;
                        avatar.style.opacity = '1';
                    }
                    Toast.show('تم تحديث الصورة', 'تم تحديث الصورة الشخصية بنجاح', 'success');
                };
                reader.readAsDataURL(file);
            }, 1000);
        }
    },

    /**
     * Handle edit profile
     */
    handleEditProfile: function() {
        Router.navigate('personal-info');
    },

    /**
     * Handle menu navigation
     */
    handleMenuNavigation: function(event) {
        const page = event.currentTarget.dataset.page;
        if (page) {
            Router.navigate(page);
        }
    },

    /**
     * Handle logout
     */
    handleLogout: function() {
        // Show confirmation modal
        Modal.open('logout-confirmation', {
            title: 'تسجيل الخروج',
            content: `
                <div class="logout-confirmation">
                    <div class="logout-icon">
                        <i class="fas fa-sign-out-alt"></i>
                    </div>
                    <h3>هل أنت متأكد من تسجيل الخروج؟</h3>
                    <p>سيتم إغلاق جلسة العمل الخاصة بك</p>
                    <div class="logout-actions">
                        <button class="btn btn-outline" data-action="cancel">إلغاء</button>
                        <button class="btn btn-danger" data-action="confirm">نعم، تسجيل الخروج</button>
                    </div>
                </div>
            `,
            onConfirm: () => {
                Auth.logout();
                Router.navigate('login');
                Toast.show('تم تسجيل الخروج', 'تم تسجيل الخروج بنجاح', 'success');
            }
        });
    },

    /**
     * Handle profile status toggle
     */
    toggleProfileStatus: function() {
        const statusIndicator = document.querySelector('.profile-status-indicator');
        const statusText = document.querySelector('.profile-status-text');
        
        if (statusIndicator && statusText) {
            const isOnline = statusIndicator.classList.contains('online');
            
            if (isOnline) {
                statusIndicator.classList.remove('online');
                statusIndicator.classList.add('offline');
                statusText.textContent = 'غير متصل';
            } else {
                statusIndicator.classList.remove('offline');
                statusIndicator.classList.add('online');
                statusText.textContent = 'متصل';
            }
        }
    },

    /**
     * Update profile data
     */
    updateProfileData: function(newData) {
        // Simulate API call
        console.log('ProfileController: Updating profile data', newData);
        
        // Update local display
        this.updateProfileDisplay(newData);
        
        // Show success message
        Toast.show('تم التحديث', 'تم تحديث البيانات الشخصية بنجاح', 'success');
    },

    /**
     * Get profile statistics
     */
    getProfileStats: function() {
        return {
            orders: 24,
            rating: 4.8,
            favorites: 12,
            balance: 2450
        };
    },

    /**
     * Export profile data
     */
    exportProfileData: function() {
        const profileData = {
            name: document.getElementById('profileName')?.textContent,
            email: document.getElementById('profileEmail')?.textContent,
            stats: this.getProfileStats()
        };

        // Create and download JSON file
        const dataStr = JSON.stringify(profileData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'profile-data.json';
        link.click();
        
        URL.revokeObjectURL(url);
        Toast.show('تم التصدير', 'تم تصدير بيانات الملف الشخصي', 'success');
    },

    /**
     * Handle menu item hover effects
     */
    setupMenuHoverEffects: function() {
        const menuItems = document.querySelectorAll('.profile-menu-item');
        menuItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-2px)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0)';
            });
        });
    },

    /**
     * Animate stats cards
     */
    animateStatsCards: function() {
        const statCards = document.querySelectorAll('.profile-stat-card');
        statCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    },

    /**
     * Cleanup when destroying the controller
     */
    destroy: function() {
        console.log('ProfileController: Destroying profile page');
        
        // Remove event listeners
        const editProfileBtn = document.querySelector('[data-action="edit-profile"]');
        if (editProfileBtn) {
            editProfileBtn.removeEventListener('click', this.handleEditProfile);
        }

        const menuItems = document.querySelectorAll('.profile-menu-item[data-action="navigate"]');
        menuItems.forEach(item => {
            item.removeEventListener('click', this.handleMenuNavigation);
        });

        const logoutBtn = document.querySelector('.profile-logout-btn');
        if (logoutBtn) {
            logoutBtn.removeEventListener('click', this.handleLogout);
        }

        const avatarContainer = document.querySelector('.profile-avatar');
        if (avatarContainer) {
            avatarContainer.removeEventListener('click', this.handleAvatarClick);
        }

        const statusIndicator = document.querySelector('.profile-status-indicator');
        if (statusIndicator) {
            statusIndicator.removeEventListener('click', this.toggleProfileStatus);
        }

        // Remove file input
        const fileInput = document.getElementById('avatarUpload');
        if (fileInput) {
            fileInput.remove();
        }

        console.log('ProfileController: Profile page destroyed successfully');
    }
}; 