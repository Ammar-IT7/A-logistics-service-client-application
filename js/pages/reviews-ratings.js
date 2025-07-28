/**
 * Reviews and Ratings Page Controller
 * Manages reviews of service providers that the client has used
 */
window.ReviewsRatingsController = {
    /**
     * Initialize the reviews and ratings page
     */
    init: function() {
        console.log('ReviewsRatingsController: Initializing reviews and ratings page');
        
        this.reviews = [];
        this.currentFilter = 'all';
        this.currentSort = 'newest';
        this.currentPage = 1;
        this.hasMoreReviews = true;
        
        this.loadReviews();
        this.setupEventListeners();
        this.setupFilterTabs();
        this.setupSorting();
        this.updateReviewStats();
        
        console.log('ReviewsRatingsController: Reviews and ratings page initialized successfully');
    },

    /**
     * Set up event listeners
     */
    setupEventListeners: function() {
        // Add review button
        const addReviewBtn = document.querySelector('[data-action="add-review"]');
        if (addReviewBtn) {
            addReviewBtn.addEventListener('click', () => {
                this.showAddReviewModal();
            });
        }

        // Filter tabs
        document.querySelectorAll('.reviews-filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.handleFilterTab(e.target);
            });
        });

        // Sort select
        const sortSelect = document.getElementById('sortReviews');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.handleSortChange(e.target.value);
            });
        }

        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreReviews');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreReviews();
            });
        }

        // Add review button in content
        const addReviewContentBtn = document.querySelector('[data-action="show-add-review-modal"]');
        if (addReviewContentBtn) {
            addReviewContentBtn.addEventListener('click', () => {
                this.showAddReviewModal();
            });
        }

        // Review interactions
        this.setupReviewInteractions();
    },

    /**
     * Set up review interactions
     */
    setupReviewInteractions: function() {
        // Like buttons
        document.querySelectorAll('[data-action="like-review"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleLike(e.target.closest('[data-action="like-review"]'));
            });
        });

        // Report buttons
        document.querySelectorAll('[data-action="report-review"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.reportReview(e.target.closest('[data-action="report-review"]'));
            });
        });

        // Helpful buttons
        document.querySelectorAll('[data-action="mark-helpful"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.markHelpful(e.target.closest('[data-action="mark-helpful"]'));
            });
        });

        document.querySelectorAll('[data-action="mark-not-helpful"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.markNotHelpful(e.target.closest('[data-action="mark-not-helpful"]'));
            });
        });
    },

    /**
     * Set up filter tabs
     */
    setupFilterTabs: function() {
        // Filter tab functionality is handled in setupEventListeners
    },

    /**
     * Set up sorting
     */
    setupSorting: function() {
        // Sorting functionality is handled in setupEventListeners
    },

    /**
     * Load reviews from storage or API
     */
    loadReviews: function() {
        // Mock data for reviews of service providers
        this.reviews = [
            {
                id: 1,
                serviceProviderName: 'شركة الشحن السريع',
                serviceProviderAvatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNmMGYwZjAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSIjOTk5Ij7Yp9mE2LbYp9it2YbYqTwvdGV4dD48L3N2Zz4=',
                rating: 5,
                title: 'خدمة ممتازة وسريعة',
                content: 'استخدمت خدمات الشحن البحري وكانت تجربة رائعة. الشحنة وصلت في الوقت المحدد وبحالة ممتازة. الموظفون متعاونون جداً والتواصل كان سلساً. أنصح بالتعامل معهم بشدة.',
                tags: ['سريع', 'موثوق', 'متعاون'],
                service: 'خدمة الشحن البحري',
                serviceIcon: 'fas fa-ship',
                date: '2025-01-15',
                likes: 12,
                helpful: 8,
                notHelpful: 1,
                isLiked: false,
                isReported: false
            },
            {
                id: 2,
                serviceProviderName: 'مستودعات الرياض',
                serviceProviderAvatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNmMGYwZjAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSIjOTk5Ij7Yp9mE2LbYp9it2YbYqTwvdGV4dD48L3N2Zz4=',
                rating: 4,
                title: 'خدمة جيدة مع بعض التحسينات',
                content: 'الخدمة بشكل عام جيدة، الشحنة وصلت سالمة. لكن كان هناك تأخير بسيط في التوصيل. التواصل كان جيداً والموظفون متعاونون. أتمنى تحسين سرعة التوصيل.',
                tags: ['جيد', 'متأخر قليلاً', 'متعاون'],
                service: 'خدمة التخزين',
                serviceIcon: 'fas fa-warehouse',
                date: '2025-01-10',
                likes: 8,
                helpful: 5,
                notHelpful: 2,
                isLiked: false,
                isReported: false
            },
            {
                id: 3,
                serviceProviderName: 'شركة التخليص الجمركي',
                serviceProviderAvatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNmMGYwZjAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSIjOTk5Ij7Yp9mE2LbYp9it2YbYqTwvdGV4dD48L3N2Zz4=',
                rating: 5,
                title: 'أفضل خدمة تخليص جمركي',
                content: 'استخدمت خدمات التخليص الجمركي وكانت تجربة رائعة. العملية تمت بسرعة وسهولة، والأسعار معقولة. الموظفون محترفون جداً ويقدمون خدمة متميزة. أنصح الجميع بالتعامل معهم.',
                tags: ['سريع', 'محترف', 'أسعار معقولة'],
                service: 'خدمة التخليص الجمركي',
                serviceIcon: 'fas fa-clipboard-check',
                date: '2025-01-08',
                likes: 15,
                helpful: 12,
                notHelpful: 0,
                isLiked: true,
                isReported: false
            },
            {
                id: 4,
                serviceProviderName: 'شركة التغليف المتخصصة',
                serviceProviderAvatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNmMGYwZjAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSIjOTk5Ij7Yp9mE2LbYp9it2YbYqTwvdGV4dD48L3N2Zz4=',
                rating: 4,
                title: 'خدمة تغليف ممتازة',
                content: 'خدمة التغليف والتعبئة كانت ممتازة. المواد المستخدمة عالية الجودة والشحنة وصلت بحالة مثالية. أنصح بالتعامل معهم.',
                tags: ['جودة عالية', 'حماية ممتازة'],
                service: 'خدمة التغليف',
                serviceIcon: 'fas fa-box',
                date: '2025-01-12',
                likes: 6,
                helpful: 4,
                notHelpful: 1,
                isLiked: false,
                isReported: false
            }
        ];

        this.renderReviews();
    },

    /**
     * Render reviews based on current filter and sort
     */
    renderReviews: function() {
        const reviewsGrid = document.getElementById('reviewsGrid');
        if (!reviewsGrid) return;

        // Clear existing reviews
        reviewsGrid.innerHTML = '';

        // Get filtered and sorted reviews
        const filteredReviews = this.getFilteredReviews();
        const sortedReviews = this.sortReviews(filteredReviews);

        // Render reviews
        sortedReviews.forEach(review => {
            const reviewElement = this.createReviewElement(review);
            reviewsGrid.appendChild(reviewElement);
        });

        // Re-attach event listeners
        this.attachReviewEventListeners();
    },

    /**
     * Get filtered reviews
     */
    getFilteredReviews: function() {
        if (this.currentFilter === 'all') {
            return this.reviews;
        }
        const rating = parseInt(this.currentFilter);
        return this.reviews.filter(review => review.rating === rating);
    },

    /**
     * Sort reviews
     */
    sortReviews: function(reviews) {
        switch (this.currentSort) {
            case 'newest':
                return reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
            case 'oldest':
                return reviews.sort((a, b) => new Date(a.date) - new Date(b.date));
            case 'highest':
                return reviews.sort((a, b) => b.rating - a.rating);
            case 'lowest':
                return reviews.sort((a, b) => a.rating - b.rating);
            case 'helpful':
                return reviews.sort((a, b) => b.helpful - a.helpful);
            default:
                return reviews;
        }
    },

    /**
     * Create review element
     */
    createReviewElement: function(review) {
        const element = document.createElement('div');
        element.className = 'reviews-review-item';
        element.dataset.rating = review.rating;

        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        const tags = review.tags.map(tag => `<span class="reviews-tag">${tag}</span>`).join('');
        const date = this.formatDate(review.date);

        element.innerHTML = `
            <div class="reviews-review-header">
                <div class="reviews-reviewer-info">
                    <div class="reviews-reviewer-avatar">
                        <img src="${review.serviceProviderAvatar}" alt="${review.serviceProviderName}">
                    </div>
                    <div class="reviews-reviewer-details">
                        <h4 class="reviews-reviewer-name">${review.serviceProviderName}</h4>
                        <div class="reviews-review-rating">
                            <span class="reviews-stars">${stars}</span>
                            <span class="reviews-review-date">منذ ${date}</span>
                        </div>
                    </div>
                </div>
                <div class="reviews-review-actions">
                    <button class="reviews-action-btn ${review.isLiked ? 'liked' : ''}" data-action="like-review" data-id="${review.id}">
                        <i class="far fa-thumbs-up"></i>
                        <span class="reviews-like-count">${review.likes}</span>
                    </button>
                    <button class="reviews-action-btn" data-action="report-review" data-id="${review.id}">
                        <i class="fas fa-flag"></i>
                    </button>
                </div>
            </div>
            <div class="reviews-review-content">
                <h5 class="reviews-review-title">${review.title}</h5>
                <p class="reviews-review-text">${review.content}</p>
                <div class="reviews-review-tags">
                    ${tags}
                </div>
            </div>
            <div class="reviews-review-footer">
                <div class="reviews-review-service">
                    <i class="${review.serviceIcon}"></i>
                    <span>${review.service}</span>
                </div>
                <div class="reviews-review-helpful">
                    <span>هل كانت هذه المراجعة مفيدة؟</span>
                    <button class="reviews-helpful-btn" data-action="mark-helpful" data-id="${review.id}">نعم</button>
                    <button class="reviews-helpful-btn" data-action="mark-not-helpful" data-id="${review.id}">لا</button>
                </div>
            </div>
        `;

        return element;
    },

    /**
     * Attach event listeners to review elements
     */
    attachReviewEventListeners: function() {
        // Like buttons
        document.querySelectorAll('[data-action="like-review"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleLike(e.target.closest('[data-action="like-review"]'));
            });
        });

        // Report buttons
        document.querySelectorAll('[data-action="report-review"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.reportReview(e.target.closest('[data-action="report-review"]'));
            });
        });

        // Helpful buttons
        document.querySelectorAll('[data-action="mark-helpful"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.markHelpful(e.target.closest('[data-action="mark-helpful"]'));
            });
        });

        document.querySelectorAll('[data-action="mark-not-helpful"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.markNotHelpful(e.target.closest('[data-action="mark-not-helpful"]'));
            });
        });
    },

    /**
     * Handle filter tab click
     */
    handleFilterTab: function(tab) {
        // Remove active class from all tabs
        document.querySelectorAll('.reviews-filter-tab').forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Update current filter
        this.currentFilter = tab.dataset.filter;
        
        // Re-render reviews
        this.renderReviews();
    },

    /**
     * Handle sort change
     */
    handleSortChange: function(sortValue) {
        this.currentSort = sortValue;
        this.renderReviews();
    },

    /**
     * Toggle like on review
     */
    toggleLike: function(button) {
        const reviewId = parseInt(button.dataset.id);
        const review = this.reviews.find(r => r.id === reviewId);
        
        if (!review) return;
        
        if (review.isLiked) {
            review.isLiked = false;
            review.likes--;
            button.classList.remove('liked');
        } else {
            review.isLiked = true;
            review.likes++;
            button.classList.add('liked');
        }
        
        const likeCount = button.querySelector('.reviews-like-count');
        if (likeCount) {
            likeCount.textContent = review.likes;
        }
    },

    /**
     * Report review
     */
    reportReview: function(button) {
        const reviewId = parseInt(button.dataset.id);
        
        Modal.open('report-review', {
            title: 'الإبلاغ عن مراجعة',
            content: `
                <div class="report-review">
                    <p>لماذا تريد الإبلاغ عن هذه المراجعة؟</p>
                    <div class="report-reasons">
                        <label class="report-reason">
                            <input type="radio" name="report-reason" value="spam">
                            <span>محتوى غير مرغوب فيه</span>
                        </label>
                        <label class="report-reason">
                            <input type="radio" name="report-reason" value="inappropriate">
                            <span>محتوى غير مناسب</span>
                        </label>
                        <label class="report-reason">
                            <input type="radio" name="report-reason" value="fake">
                            <span>مراجعة مزيفة</span>
                        </label>
                        <label class="report-reason">
                            <input type="radio" name="report-reason" value="other">
                            <span>سبب آخر</span>
                        </label>
                    </div>
                    <div class="form-group">
                        <textarea class="form-control" placeholder="تفاصيل إضافية (اختياري)"></textarea>
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-outline" data-action="cancel">إلغاء</button>
                        <button class="btn btn-danger" data-action="submit-report">إرسال البلاغ</button>
                    </div>
                </div>
            `,
            onConfirm: () => {
                const review = this.reviews.find(r => r.id === reviewId);
                if (review) {
                    review.isReported = true;
                }
                Toast.show('تم الإبلاغ', 'سيتم مراجعة البلاغ من قبل فريقنا', 'success');
            }
        });
    },

    /**
     * Mark review as helpful
     */
    markHelpful: function(button) {
        const reviewId = parseInt(button.dataset.id);
        const review = this.reviews.find(r => r.id === reviewId);
        
        if (review) {
            review.helpful++;
            Toast.show('شكراً لك', 'تم تسجيل أن المراجعة مفيدة', 'success');
        }
    },

    /**
     * Mark review as not helpful
     */
    markNotHelpful: function(button) {
        const reviewId = parseInt(button.dataset.id);
        const review = this.reviews.find(r => r.id === reviewId);
        
        if (review) {
            review.notHelpful++;
            Toast.show('شكراً لك', 'تم تسجيل ملاحظتك', 'info');
        }
    },

    /**
     * Show add review modal
     */
    showAddReviewModal: function() {
        Modal.open('add-review', {
            title: 'إضافة تقييم لمزود خدمة',
            content: `
                <div class="add-review-form">
                    <div class="form-group">
                        <label>مزود الخدمة</label>
                        <select class="form-control" id="reviewServiceProvider">
                            <option value="">اختر مزود الخدمة</option>
                            <option value="shipping-company">شركة الشحن السريع</option>
                            <option value="storage-company">مستودعات الرياض</option>
                            <option value="customs-company">شركة التخليص الجمركي</option>
                            <option value="packaging-company">شركة التغليف المتخصصة</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>الخدمة المستخدمة</label>
                        <select class="form-control" id="reviewService">
                            <option value="">اختر الخدمة</option>
                            <option value="shipping">خدمة الشحن البحري</option>
                            <option value="storage">خدمة التخزين</option>
                            <option value="customs">خدمة التخليص الجمركي</option>
                            <option value="packaging">خدمة التغليف</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>التقييم</label>
                        <div class="rating-input">
                            <i class="far fa-star" data-rating="1"></i>
                            <i class="far fa-star" data-rating="2"></i>
                            <i class="far fa-star" data-rating="3"></i>
                            <i class="far fa-star" data-rating="4"></i>
                            <i class="far fa-star" data-rating="5"></i>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>عنوان التقييم</label>
                        <input type="text" class="form-control" id="reviewTitle" placeholder="عنوان مختصر للتقييم">
                    </div>
                    <div class="form-group">
                        <label>التقييم التفصيلي</label>
                        <textarea class="form-control" id="reviewContent" rows="4" placeholder="اكتب تجربتك مع مزود الخدمة..."></textarea>
                    </div>
                    <div class="form-group">
                        <label>العلامات (اختياري)</label>
                        <div class="tags-input">
                            <input type="text" class="form-control" id="reviewTags" placeholder="أضف علامات مفصولة بفواصل">
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-outline" data-action="cancel">إلغاء</button>
                        <button class="btn btn-primary" data-action="submit-review">إرسال التقييم</button>
                    </div>
                </div>
            `,
            onConfirm: () => {
                this.submitReview();
            }
        });
    },

    /**
     * Submit new review
     */
    submitReview: function() {
        const serviceProvider = document.getElementById('reviewServiceProvider').value;
        const service = document.getElementById('reviewService').value;
        const title = document.getElementById('reviewTitle').value;
        const content = document.getElementById('reviewContent').value;
        const tags = document.getElementById('reviewTags').value;
        
        if (!serviceProvider || !service || !title || !content) {
            Toast.show('خطأ', 'يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }
        
        // Create new review
        const newReview = {
            id: Date.now(),
            serviceProviderName: serviceProvider,
            serviceProviderAvatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNmMGYwZjAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSIjOTk5Ij7Yp9mE2LbYp9it2YbYqTwvdGV4dD48L3N2Zz4=',
            rating: 5, // Default rating, should be captured from UI
            title: title,
            content: content,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            service: service,
            serviceIcon: 'fas fa-star',
            date: new Date().toISOString().split('T')[0],
            likes: 0,
            helpful: 0,
            notHelpful: 0,
            isLiked: false,
            isReported: false
        };
        
        // Add to reviews array
        this.reviews.unshift(newReview);
        
        // Re-render reviews
        this.renderReviews();
        this.updateReviewStats();
        
        Toast.show('تم إرسال التقييم', 'شكراً لك على تقييمك!', 'success');
    },

    /**
     * Load more reviews
     */
    loadMoreReviews: function() {
        if (!this.hasMoreReviews) return;
        
        this.currentPage++;
        Loader.show();
        
        // Simulate loading more reviews
        setTimeout(() => {
            // Add more mock reviews here if needed
            Loader.hide();
            
            // Check if we have more reviews
            if (this.currentPage >= 3) {
                this.hasMoreReviews = false;
                document.getElementById('loadMoreReviews').style.display = 'none';
            }
        }, 1000);
    },

    /**
     * Update review statistics
     */
    updateReviewStats: function() {
        const totalReviews = this.reviews.length;
        const averageRating = this.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
        
        // Update overall rating
        const ratingNumber = document.querySelector('.reviews-rating-number');
        if (ratingNumber) {
            ratingNumber.textContent = averageRating.toFixed(1);
        }
        
        // Update total reviews count
        const totalReviewsElement = document.getElementById('totalReviews');
        if (totalReviewsElement) {
            totalReviewsElement.textContent = totalReviews;
        }
        
        // Update rating breakdown
        this.updateRatingBreakdown();
    },

    /**
     * Update rating breakdown
     */
    updateRatingBreakdown: function() {
        const ratings = [5, 4, 3, 2, 1];
        const totalReviews = this.reviews.length;
        
        ratings.forEach(rating => {
            const count = this.reviews.filter(review => review.rating === rating).length;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            
            const countElement = document.getElementById(`${rating}Count`);
            if (countElement) {
                countElement.textContent = count;
            }
            
            const progressBar = document.querySelector(`[data-rating="${rating}"] .reviews-progress-bar`);
            if (progressBar) {
                progressBar.style.width = `${percentage}%`;
            }
        });
    },

    /**
     * Format date for display
     */
    formatDate: function(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            return 'يوم واحد';
        } else if (diffDays < 7) {
            return `${diffDays} أيام`;
        } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return `${weeks} أسبوع`;
        } else {
            const months = Math.floor(diffDays / 30);
            return `${months} شهر`;
        }
    },

    /**
     * Destroy controller
     */
    destroy: function() {
        console.log('ReviewsRatingsController: Destroying reviews and ratings page');
    }
}; 