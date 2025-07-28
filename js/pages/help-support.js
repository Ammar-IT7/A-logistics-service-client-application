/**
 * Help Support Page Controller
 */
window.HelpSupportController = {
    /**
     * Initialize the help support page
     */
    init: function() {
        this.bindEvents();
        this.loadFAQData();
        this.setupSearch();
        this.initializeCategories();
    },

    /**
     * Bind event listeners
     */
    bindEvents: function() {
        // FAQ accordion
        document.addEventListener('click', (e) => {
            if (e.target.closest('.faq-item')) {
                this.toggleFAQ(e.target.closest('.faq-item'));
            }
        });

        // Category filters
        document.addEventListener('click', (e) => {
            if (e.target.closest('.category-filter')) {
                this.filterByCategory(e.target.closest('.category-filter').dataset.category);
            }
        });

        // Contact form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactSubmit.bind(this));
        }

        // Search functionality
        const searchInput = document.getElementById('helpSearch');
        if (searchInput) {
            searchInput.addEventListener('input', this.handleSearch.bind(this));
        }
    },

    /**
     * Load FAQ data
     */
    loadFAQData: function() {
        // Mock FAQ data
        const faqData = [
            {
                id: 1,
                category: 'general',
                question: 'كيف يمكنني إنشاء حساب جديد؟',
                answer: 'يمكنك إنشاء حساب جديد من خلال الضغط على زر "إنشاء حساب" في صفحة تسجيل الدخول وملء النموذج بالمعلومات المطلوبة.'
            },
            {
                id: 2,
                category: 'general',
                question: 'كيف يمكنني إعادة تعيين كلمة المرور؟',
                answer: 'يمكنك إعادة تعيين كلمة المرور من خلال الضغط على "نسيت كلمة المرور" في صفحة تسجيل الدخول.'
            },
            {
                id: 3,
                category: 'services',
                question: 'ما هي أنواع الخدمات المتوفرة؟',
                answer: 'نوفر خدمات الشحن البحري والجوي والبري، خدمات التخزين، خدمات التخليص الجمركي، وغيرها من الخدمات اللوجستية.'
            },
            {
                id: 4,
                category: 'services',
                question: 'كيف يمكنني تتبع شحنتي؟',
                answer: 'يمكنك تتبع شحنتك من خلال إدخال رقم التتبع في صفحة التتبع أو من خلال صفحة "سجل الطلبات".'
            },
            {
                id: 5,
                category: 'payment',
                question: 'ما هي طرق الدفع المتوفرة؟',
                answer: 'نوفر عدة طرق دفع: البطاقات الائتمانية، التحويل البنكي، المحافظ الإلكترونية، والدفع عند الاستلام.'
            },
            {
                id: 6,
                category: 'payment',
                question: 'كيف يمكنني طلب استرداد المال؟',
                answer: 'يمكنك طلب استرداد المال من خلال التواصل مع خدمة العملاء أو من خلال صفحة "سجل المعاملات".'
            },
            {
                id: 7,
                category: 'technical',
                question: 'الموقع لا يعمل بشكل صحيح، ماذا أفعل؟',
                answer: 'جرب تحديث الصفحة أو مسح ذاكرة التخزين المؤقت للمتصفح. إذا استمرت المشكلة، تواصل معنا.'
            },
            {
                id: 8,
                category: 'technical',
                question: 'كيف يمكنني تغيير اللغة؟',
                answer: 'يمكنك تغيير اللغة من خلال إعدادات الحساب أو من خلال شريط التنقل العلوي.'
            }
        ];

        this.renderFAQ(faqData);
    },

    /**
     * Render FAQ items
     */
    renderFAQ: function(faqData) {
        const faqContainer = document.getElementById('faqContainer');
        if (!faqContainer) return;

        const faqHTML = faqData.map(item => `
            <div class="faq-item" data-category="${item.category}" data-id="${item.id}">
                <div class="faq-question">
                    <h4>${item.question}</h4>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="faq-answer">
                    <p>${item.answer}</p>
                </div>
            </div>
        `).join('');

        faqContainer.innerHTML = faqHTML;
    },

    /**
     * Toggle FAQ item
     */
    toggleFAQ: function(faqItem) {
        const answer = faqItem.querySelector('.faq-answer');
        const icon = faqItem.querySelector('.faq-question i');
        const isOpen = faqItem.classList.contains('active');

        // Close all other FAQ items
        document.querySelectorAll('.faq-item.active').forEach(item => {
            if (item !== faqItem) {
                item.classList.remove('active');
                const otherAnswer = item.querySelector('.faq-answer');
                const otherIcon = item.querySelector('.faq-question i');
                otherAnswer.style.maxHeight = '0';
                otherIcon.className = 'fas fa-chevron-down';
            }
        });

        // Toggle current item
        if (isOpen) {
            faqItem.classList.remove('active');
            answer.style.maxHeight = '0';
            icon.className = 'fas fa-chevron-down';
        } else {
            faqItem.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
            icon.className = 'fas fa-chevron-up';
        }
    },

    /**
     * Setup search functionality
     */
    setupSearch: function() {
        const searchInput = document.getElementById('helpSearch');
        if (!searchInput) return;

        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value);
            }, 300);
        });
    },

    /**
     * Perform search
     */
    performSearch: function(query) {
        const faqItems = document.querySelectorAll('.faq-item');
        const searchResults = document.getElementById('searchResults');
        const noResults = document.getElementById('noResults');

        if (!query.trim()) {
            faqItems.forEach(item => item.style.display = 'block');
            if (searchResults) searchResults.style.display = 'none';
            if (noResults) noResults.style.display = 'none';
            return;
        }

        const matchingItems = Array.from(faqItems).filter(item => {
            const question = item.querySelector('h4').textContent.toLowerCase();
            const answer = item.querySelector('p').textContent.toLowerCase();
            const searchTerm = query.toLowerCase();
            
            return question.includes(searchTerm) || answer.includes(searchTerm);
        });

        // Hide all items
        faqItems.forEach(item => item.style.display = 'none');

        // Show matching items
        matchingItems.forEach(item => item.style.display = 'block');

        // Show/hide results message
        if (matchingItems.length === 0) {
            if (noResults) noResults.style.display = 'block';
            if (searchResults) searchResults.style.display = 'none';
        } else {
            if (noResults) noResults.style.display = 'none';
            if (searchResults) {
                searchResults.style.display = 'block';
                searchResults.textContent = `تم العثور على ${matchingItems.length} نتيجة`;
            }
        }
    },

    /**
     * Initialize categories
     */
    initializeCategories: function() {
        const categories = [
            { id: 'all', name: 'الكل', icon: 'fas fa-th' },
            { id: 'general', name: 'عام', icon: 'fas fa-info-circle' },
            { id: 'services', name: 'الخدمات', icon: 'fas fa-shipping-fast' },
            { id: 'payment', name: 'الدفع', icon: 'fas fa-credit-card' },
            { id: 'technical', name: 'تقني', icon: 'fas fa-cog' }
        ];

        this.renderCategories(categories);
    },

    /**
     * Render categories
     */
    renderCategories: function(categories) {
        const categoryContainer = document.getElementById('categoryFilters');
        if (!categoryContainer) return;

        const categoryHTML = categories.map(category => `
            <button class="category-filter ${category.id === 'all' ? 'active' : ''}" data-category="${category.id}">
                <i class="${category.icon}"></i>
                <span>${category.name}</span>
            </button>
        `).join('');

        categoryContainer.innerHTML = categoryHTML;
    },

    /**
     * Filter by category
     */
    filterByCategory: function(category) {
        const faqItems = document.querySelectorAll('.faq-item');
        const categoryFilters = document.querySelectorAll('.category-filter');

        // Update active filter
        categoryFilters.forEach(filter => {
            filter.classList.toggle('active', filter.dataset.category === category);
        });

        // Filter items
        faqItems.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    },

    /**
     * Handle contact form submission
     */
    handleContactSubmit: function(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        // Validate form
        if (!data.name || !data.email || !data.subject || !data.message) {
            Toast.show('خطأ', 'يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }

        // Show loading
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            Toast.show('تم الإرسال', 'سيتم التواصل معك قريباً', 'success');
            e.target.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    },

    /**
     * Handle search input
     */
    handleSearch: function(e) {
        this.performSearch(e.target.value);
    },

    /**
     * Destroy controller
     */
    destroy: function() {
        // Cleanup if needed
    }
}; 