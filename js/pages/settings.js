/**
 * Settings Page Controller
 * Manages user settings, preferences, and account configurations
 * Mobile-focused with enhanced UX
 */
window.SettingsController = {
    /**
     * Initialize the settings page
     */
    init: function() {
        console.log('SettingsController: Initializing settings page');
        
        this.loadUserSettings();
        this.setupEventListeners();
        this.setupSwitchToggles();
        this.setupNavigationActions();
        this.setupMobileEnhancements();
        
        console.log('SettingsController: Settings page initialized successfully');
    },

    /**
     * Set up mobile-specific enhancements
     */
    setupMobileEnhancements: function() {
        // Touch-friendly settings items
        document.querySelectorAll('.settings-item').forEach(item => {
            item.addEventListener('touchstart', (e) => {
                e.target.style.transform = 'scale(0.98)';
            });
            
            item.addEventListener('touchend', (e) => {
                e.target.style.transform = '';
            });
        });

        // Swipe gestures for settings sections
        this.setupSwipeGestures();

        // Haptic feedback for switches
        this.setupHapticFeedback();
    },

    /**
     * Set up swipe gestures for mobile
     */
    setupSwipeGestures: function() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        document.querySelectorAll('.settings-section').forEach(section => {
            section.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            });

            section.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                endY = e.changedTouches[0].clientY;
                
                const diffX = startX - endX;
                const diffY = startY - endY;
                
                // Horizontal swipe with minimal vertical movement
                if (Math.abs(diffX) > 50 && Math.abs(diffY) < 30) {
                    if (diffX > 0) {
                        // Swipe left - could be used for quick actions
                        this.handleSwipeLeft(section);
                    } else {
                        // Swipe right - could be used for navigation
                        this.handleSwipeRight(section);
                    }
                }
            });
        });
    },

    /**
     * Handle swipe left gesture
     */
    handleSwipeLeft: function(section) {
        // Could be used to show quick actions or expand section
        console.log('Swipe left detected on settings section');
    },

    /**
     * Handle swipe right gesture
     */
    handleSwipeRight: function(section) {
        // Could be used for navigation back
        console.log('Swipe right detected on settings section');
    },

    /**
     * Set up haptic feedback for switches
     */
    setupHapticFeedback: function() {
        document.querySelectorAll('.settings-switch input').forEach(switchInput => {
            switchInput.addEventListener('change', () => {
                // Trigger haptic feedback if available
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
            });
        });
    },

    /**
     * Load user settings from storage
     */
    loadUserSettings: function() {
        // Load settings from localStorage or default values
        const settings = {
            appNotifications: true,
            shippingNotifications: true,
            paymentNotifications: true,
            offersNotifications: false,
            twoFactorAuth: false,
            darkMode: false,
            autoUpdate: true
        };

        // Apply loaded settings to UI
        Object.keys(settings).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.checked = settings[key];
            }
        });
    },

    /**
     * Set up event listeners for settings interactions
     */
    setupEventListeners: function() {
        // Settings item clicks
        document.querySelectorAll('.settings-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                if (action) {
                    this.handleSettingsAction(action, e.currentTarget);
                }
            });
        });

        // Switch toggles
        document.querySelectorAll('.settings-switch input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.handleSettingChange(e.target.id, e.target.checked);
            });
        });
    },

    /**
     * Set up switch toggle animations
     */
    setupSwitchToggles: function() {
        document.querySelectorAll('.settings-switch').forEach(switchElement => {
            const input = switchElement.querySelector('input[type="checkbox"]');
            const slider = switchElement.querySelector('.settings-switch-slider');
            
            if (input && slider) {
                input.addEventListener('change', () => {
                    if (input.checked) {
                        slider.style.transform = 'translateX(20px)';
                    } else {
                        slider.style.transform = 'translateX(0)';
                    }
                });
            }
        });
    },

    /**
     * Set up navigation actions
     */
    setupNavigationActions: function() {
        // Profile navigation
        const profileItem = document.querySelector('[data-action="navigate"][data-page="profile"]');
        if (profileItem) {
            profileItem.addEventListener('click', () => {
                Router.navigate('profile');
            });
        }

        // Help & Support navigation
        const helpItem = document.querySelector('[data-action="navigate"][data-page="help-support"]');
        if (helpItem) {
            helpItem.addEventListener('click', () => {
                Router.navigate('help-support');
            });
        }

        // Chat Support navigation
        const chatItem = document.querySelector('[data-action="navigate"][data-page="chat-support"]');
        if (chatItem) {
            chatItem.addEventListener('click', () => {
                Router.navigate('chat-support');
            });
        }
    },

    /**
     * Handle settings actions
     */
    handleSettingsAction: function(action, element) {
        switch (action) {
            case 'change-password':
                this.showChangePasswordModal();
                break;
            case 'privacy-settings':
                this.showPrivacySettings();
                break;
            case 'language-settings':
                this.showLanguageSettings();
                break;
            case 'currency-settings':
                this.showCurrencySettings();
                break;
            case 'about-app':
                this.showAboutApp();
                break;
            case 'terms-privacy':
                this.showTermsPrivacy();
                break;
            case 'logout':
                this.handleLogout();
                break;
            case 'delete-account':
                this.showDeleteAccountConfirmation();
                break;
            default:
                console.log('Settings action not implemented:', action);
        }
    },

    /**
     * Handle setting changes
     */
    handleSettingChange: function(settingId, value) {
        console.log('Setting changed:', settingId, value);
        
        // Save setting to localStorage
        localStorage.setItem(`setting_${settingId}`, value);
        
        // Apply setting changes
        switch (settingId) {
            case 'darkMode':
                this.toggleDarkMode(value);
                break;
            case 'appNotifications':
                this.toggleAppNotifications(value);
                break;
            case 'twoFactorAuth':
                this.toggleTwoFactorAuth(value);
                break;
            case 'autoUpdate':
                this.toggleAutoUpdate(value);
                break;
        }

        // Show confirmation
        Toast.show('تم حفظ الإعدادات', 'تم تحديث الإعدادات بنجاح', 'success');
    },

    /**
     * Toggle dark mode
     */
    toggleDarkMode: function(enabled) {
        if (enabled) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    },

    /**
     * Toggle app notifications
     */
    toggleAppNotifications: function(enabled) {
        if (enabled) {
            this.requestNotificationPermission();
        }
    },

    /**
     * Toggle two-factor authentication
     */
    toggleTwoFactorAuth: function(enabled) {
        if (enabled) {
            this.setupTwoFactorAuth();
        } else {
            this.disableTwoFactorAuth();
        }
    },

    /**
     * Toggle auto update
     */
    toggleAutoUpdate: function(enabled) {
        // Implementation for auto update setting
        console.log('Auto update:', enabled);
    },

    /**
     * Request notification permission
     */
    requestNotificationPermission: function() {
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    Toast.show('تم تفعيل الإشعارات', 'ستصلك الإشعارات الآن', 'success');
                } else {
                    Toast.show('تم رفض الإشعارات', 'يمكنك تفعيلها لاحقاً من إعدادات المتصفح', 'warning');
                }
            });
        }
    },

    /**
     * Setup two-factor authentication
     */
    setupTwoFactorAuth: function() {
        Modal.open('two-factor-setup', {
            title: 'إعداد المصادقة الثنائية',
            content: `
                <div class="two-factor-setup">
                    <p>لإعداد المصادقة الثنائية، يرجى إدخال رقم هاتفك:</p>
                    <div class="form-group">
                        <input type="tel" id="phoneNumber" class="form-control" placeholder="رقم الهاتف">
                    </div>
                    <button class="btn btn-primary" data-action="send-verification">إرسال رمز التحقق</button>
                </div>
            `
        });
    },

    /**
     * Disable two-factor authentication
     */
    disableTwoFactorAuth: function() {
        Modal.open('confirm-disable-2fa', {
            title: 'إلغاء المصادقة الثنائية',
            content: `
                <div class="confirm-disable-2fa">
                    <p>هل أنت متأكد من إلغاء المصادقة الثنائية؟ هذا سيجعل حسابك أقل أماناً.</p>
                    <div class="modal-actions">
                        <button class="btn btn-outline" data-action="cancel">إلغاء</button>
                        <button class="btn btn-danger" data-action="confirm-disable">تأكيد الإلغاء</button>
                    </div>
                </div>
            `
        });
    },

    /**
     * Show change password modal
     */
    showChangePasswordModal: function() {
        Modal.open('change-password', {
            title: 'تغيير كلمة المرور',
            content: `
                <div class="change-password-form">
                    <div class="form-group">
                        <label>كلمة المرور الحالية</label>
                        <input type="password" id="currentPassword" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>كلمة المرور الجديدة</label>
                        <input type="password" id="newPassword" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>تأكيد كلمة المرور الجديدة</label>
                        <input type="password" id="confirmPassword" class="form-control">
                    </div>
                    <button class="btn btn-primary" data-action="change-password-submit">تغيير كلمة المرور</button>
                </div>
            `
        });
    },

    /**
     * Show privacy settings
     */
    showPrivacySettings: function() {
        Modal.open('privacy-settings', {
            title: 'إعدادات الخصوصية',
            content: `
                <div class="privacy-settings">
                    <div class="privacy-option">
                        <label class="settings-switch">
                            <input type="checkbox" id="shareData" checked>
                            <span class="settings-switch-slider"></span>
                        </label>
                        <span>مشاركة البيانات للتحسين</span>
                    </div>
                    <div class="privacy-option">
                        <label class="settings-switch">
                            <input type="checkbox" id="analytics" checked>
                            <span class="settings-switch-slider"></span>
                        </label>
                        <span>تحليلات الاستخدام</span>
                    </div>
                    <div class="privacy-option">
                        <label class="settings-switch">
                            <input type="checkbox" id="marketing" checked>
                            <span class="settings-switch-slider"></span>
                        </label>
                        <span>الإعلانات المخصصة</span>
                    </div>
                </div>
            `
        });
    },

    /**
     * Show language settings
     */
    showLanguageSettings: function() {
        Modal.open('language-settings', {
            title: 'إعدادات اللغة',
            content: `
                <div class="language-settings">
                    <div class="language-option">
                        <input type="radio" name="language" value="ar" checked>
                        <label>العربية</label>
                    </div>
                    <div class="language-option">
                        <input type="radio" name="language" value="en">
                        <label>English</label>
                    </div>
                    <button class="btn btn-primary" data-action="change-language">تغيير اللغة</button>
                </div>
            `
        });
    },

    /**
     * Show currency settings
     */
    showCurrencySettings: function() {
        Modal.open('currency-settings', {
            title: 'إعدادات العملة',
            content: `
                <div class="currency-settings">
                    <div class="currency-option">
                        <input type="radio" name="currency" value="YER" checked>
                        <label>ريال يمني (YER)</label>
                    </div>
                    <div class="currency-option">
                        <input type="radio" name="currency" value="USD">
                        <label>دولار أمريكي (USD)</label>
                    </div>
                    <div class="currency-option">
                        <input type="radio" name="currency" value="SAR">
                        <label>ريال سعودي (SAR)</label>
                    </div>
                    <button class="btn btn-primary" data-action="change-currency">تغيير العملة</button>
                </div>
            `
        });
    },

    /**
     * Show about app information
     */
    showAboutApp: function() {
        Modal.open('about-app', {
            title: 'حول التطبيق',
            content: `
                <div class="about-app">
                    <div class="app-info">
                        <h3>تطبيق الخدمات اللوجستية</h3>
                        <p>الإصدار: 1.0.0</p>
                        <p>تاريخ الإصدار: يناير 2025</p>
                    </div>
                    <div class="app-features">
                        <h4>المميزات:</h4>
                        <ul>
                            <li>خدمات شحن دولي</li>
                            <li>تخليص جمركي</li>
                            <li>خدمات تخزين</li>
                            <li>تتبع الشحنات</li>
                        </ul>
                    </div>
                </div>
            `
        });
    },

    /**
     * Show terms and privacy
     */
    showTermsPrivacy: function() {
        Modal.open('terms-privacy', {
            title: 'الشروط والخصوصية',
            content: `
                <div class="terms-privacy">
                    <div class="terms-section">
                        <h4>شروط الاستخدام</h4>
                        <p>باستخدام هذا التطبيق، فإنك توافق على شروط الاستخدام...</p>
                    </div>
                    <div class="privacy-section">
                        <h4>سياسة الخصوصية</h4>
                        <p>نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية...</p>
                    </div>
                </div>
            `
        });
    },

    /**
     * Handle logout
     */
    handleLogout: function() {
        Modal.open('confirm-logout', {
            title: 'تسجيل الخروج',
            content: `
                <div class="confirm-logout">
                    <p>هل أنت متأكد من تسجيل الخروج؟</p>
                    <div class="modal-actions">
                        <button class="btn btn-outline" data-action="cancel">إلغاء</button>
                        <button class="btn btn-primary" data-action="confirm-logout">تأكيد الخروج</button>
                    </div>
                </div>
            `
        });
    },

    /**
     * Show delete account confirmation
     */
    showDeleteAccountConfirmation: function() {
        Modal.open('delete-account', {
            title: 'حذف الحساب',
            content: `
                <div class="delete-account-warning">
                    <div class="warning-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h4>تحذير!</h4>
                    <p>حذف الحساب إجراء نهائي لا يمكن التراجع عنه. سيتم حذف جميع بياناتك نهائياً.</p>
                    <div class="form-group">
                        <label>اكتب "حذف" للتأكيد</label>
                        <input type="text" id="deleteConfirmation" class="form-control" placeholder="حذف">
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-outline" data-action="cancel">إلغاء</button>
                        <button class="btn btn-danger" data-action="confirm-delete" disabled>حذف الحساب</button>
                    </div>
                </div>
            `
        });
    },

    /**
     * Destroy controller
     */
    destroy: function() {
        console.log('SettingsController: Destroying settings page');
        // Clean up event listeners and resources
    }
}; 