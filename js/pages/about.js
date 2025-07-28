/**
 * About Page Controller
 * Enhanced for Mobile-First 2-Column Grid Design
 */
window.AboutController = {
    /**
     * Initialize the about page
     */
    init: function() {
        this.bindEvents();
        this.initializeAnimations();
        this.loadTeamData();
        this.setupScrollEffects();
        this.setupMobileOptimizations();
    },

    /**
     * Bind event listeners
     */
    bindEvents: function() {
        // Contact information click handlers
        document.addEventListener('click', (e) => {
            if (e.target.closest('.about-contact-item')) {
                this.handleContactClick(e.target.closest('.about-contact-item'));
            }
        });

        // Team member click handlers
        document.addEventListener('click', (e) => {
            if (e.target.closest('.about-team-member')) {
                this.showTeamMemberDetails(e.target.closest('.about-team-member'));
            }
        });

        // Certification click handlers
        document.addEventListener('click', (e) => {
            if (e.target.closest('.about-certification-item')) {
                this.showCertificationDetails(e.target.closest('.about-certification-item'));
            }
        });

        // Value item click handlers
        document.addEventListener('click', (e) => {
            if (e.target.closest('.about-value-item')) {
                this.showValueDetails(e.target.closest('.about-value-item'));
            }
        });

        // Mission/Vision card click handlers
        document.addEventListener('click', (e) => {
            if (e.target.closest('.about-mission-card, .about-vision-card')) {
                this.showCardDetails(e.target.closest('.about-mission-card, .about-vision-card'));
            }
        });
    },

    /**
     * Initialize animations
     */
    initializeAnimations: function() {
        // Animate stats on scroll
        this.animateStats();
        
        // Animate timeline on scroll
        this.animateTimeline();
        
        // Animate team members on scroll
        this.animateTeamMembers();
        
        // Animate value items on scroll
        this.animateValueItems();
    },

    /**
     * Animate statistics
     */
    animateStats: function() {
        const stats = document.querySelectorAll('.about-stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = parseInt(target.textContent.replace(/,/g, ''));
                    this.animateNumber(target, 0, finalValue, 2000);
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => observer.observe(stat));
    },

    /**
     * Animate number counting
     */
    animateNumber: function(element, start, end, duration) {
        const startTime = performance.now();
        const startValue = start;
        const change = end - start;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = startValue + (change * easeOutQuart);
            
            element.textContent = Math.floor(currentValue).toLocaleString() + '+';
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    },

    /**
     * Animate timeline items
     */
    animateTimeline: function() {
        const timelineItems = document.querySelectorAll('.about-timeline-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        timelineItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'all 0.6s ease-out';
            observer.observe(item);
        });
    },

    /**
     * Animate team members
     */
    animateTeamMembers: function() {
        const teamMembers = document.querySelectorAll('.about-team-member');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        teamMembers.forEach((member, index) => {
            member.style.opacity = '0';
            member.style.transform = 'translateY(20px)';
            member.style.transition = `all 0.6s ease-out ${index * 0.1}s`;
            observer.observe(member);
        });
    },

    /**
     * Animate value items
     */
    animateValueItems: function() {
        const valueItems = document.querySelectorAll('.about-value-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        valueItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = `all 0.6s ease-out ${index * 0.1}s`;
            observer.observe(item);
        });
    },

    /**
     * Setup scroll effects
     */
    setupScrollEffects: function() {
        // Parallax effect for hero section
        window.addEventListener('scroll', () => {
            const hero = document.querySelector('.about-hero');
            if (hero) {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                hero.style.transform = `translateY(${rate}px)`;
            }
        });
    },

    /**
     * Setup mobile optimizations
     */
    setupMobileOptimizations: function() {
        // Touch feedback for mobile
        const touchElements = document.querySelectorAll('.about-value-item, .about-team-member, .about-certification-item, .about-contact-item');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.style.transform = 'scale(0.98)';
            });
            
            element.addEventListener('touchend', () => {
                element.style.transform = 'scale(1)';
            });
        });

        // Optimize for mobile performance
        if (window.innerWidth <= 768) {
            this.optimizeForMobile();
        }
    },

    /**
     * Optimize for mobile performance
     */
    optimizeForMobile: function() {
        // Reduce animation complexity on mobile
        const style = document.createElement('style');
        style.textContent = `
            .about-value-item,
            .about-team-member,
            .about-certification-item,
            .about-contact-item {
                transition: transform 0.2s ease-out;
            }
            
            .about-hero {
                transform: none !important;
            }
        `;
        document.head.appendChild(style);
    },

    /**
     * Handle contact item click
     */
    handleContactClick: function(contactItem) {
        const title = contactItem.querySelector('.about-contact-title').textContent;
        const text = contactItem.querySelector('.about-contact-text').textContent;
        
        // Show contact details in a modal or toast
        this.showToast(`${title}: ${text}`, 'info');
        
        // Add haptic feedback on mobile
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    },

    /**
     * Show team member details
     */
    showTeamMemberDetails: function(teamMember) {
        const name = teamMember.querySelector('.about-member-name').textContent;
        const position = teamMember.querySelector('.about-member-position').textContent;
        const bio = teamMember.querySelector('.about-member-bio').textContent;
        
        // Show detailed modal
        this.showModal({
            title: name,
            subtitle: position,
            content: bio,
            type: 'team-member'
        });
    },

    /**
     * Show certification details
     */
    showCertificationDetails: function(certItem) {
        const title = certItem.querySelector('.about-cert-title').textContent;
        const description = certItem.querySelector('.about-cert-description').textContent;
        
        // Show certification details
        this.showModal({
            title: title,
            content: description,
            type: 'certification'
        });
    },

    /**
     * Show value details
     */
    showValueDetails: function(valueItem) {
        const title = valueItem.querySelector('.about-value-title').textContent;
        const description = valueItem.querySelector('.about-value-description').textContent;
        
        // Show value details
        this.showModal({
            title: title,
            content: description,
            type: 'value'
        });
    },

    /**
     * Show card details
     */
    showCardDetails: function(card) {
        const title = card.querySelector('.about-card-title').textContent;
        const description = card.querySelector('.about-card-description').textContent;
        
        // Show card details
        this.showModal({
            title: title,
            content: description,
            type: 'card'
        });
    },

    /**
     * Show modal
     */
    showModal: function(data) {
        // Implementation for showing modal
        console.log('Showing modal:', data);
        
        // You can implement your modal system here
        // For now, we'll just show a toast
        this.showToast(data.title, 'info');
    },

    /**
     * Show toast notification
     */
    showToast: function(message, type = 'info') {
        // Implementation for showing toast
        console.log('Toast:', message, type);
        
        // You can implement your toast system here
        // For now, we'll use alert as fallback
        alert(message);
    },

    /**
     * Load team data
     */
    loadTeamData: function() {
        // This could load team data from an API
        console.log('Loading team data...');
    },

    /**
     * Update page content
     */
    updateContent: function() {
        // Update any dynamic content
        this.animateStats();
    },

    /**
     * Handle page visibility change
     */
    handleVisibilityChange: function() {
        if (!document.hidden) {
            this.updateContent();
        }
    },

    /**
     * Cleanup on page unload
     */
    cleanup: function() {
        // Remove event listeners and cleanup
        window.removeEventListener('scroll', this.setupScrollEffects);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('about-page')) {
        AboutController.init();
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (AboutController.handleVisibilityChange) {
        AboutController.handleVisibilityChange();
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (AboutController.cleanup) {
        AboutController.cleanup();
    }
}); 