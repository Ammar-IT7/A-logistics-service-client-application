/**
 * About Page Controller
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
    },

    /**
     * Bind event listeners
     */
    bindEvents: function() {
        // Contact information click handlers
        document.addEventListener('click', (e) => {
            if (e.target.closest('.contact-item')) {
                this.handleContactClick(e.target.closest('.contact-item'));
            }
        });

        // Team member click handlers
        document.addEventListener('click', (e) => {
            if (e.target.closest('.team-member')) {
                this.showTeamMemberDetails(e.target.closest('.team-member'));
            }
        });

        // Certification click handlers
        document.addEventListener('click', (e) => {
            if (e.target.closest('.certification-item')) {
                this.showCertificationDetails(e.target.closest('.certification-item'));
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
    },

    /**
     * Animate statistics
     */
    animateStats: function() {
        const stats = document.querySelectorAll('.stat-number');
        
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
     * Animate timeline
     */
    animateTimeline: function() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, index * 200);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        timelineItems.forEach(item => observer.observe(item));
    },

    /**
     * Animate team members
     */
    animateTeamMembers: function() {
        const teamMembers = document.querySelectorAll('.team-member');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, index * 150);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        teamMembers.forEach(member => observer.observe(member));
    },

    /**
     * Setup scroll effects
     */
    setupScrollEffects: function() {
        // Parallax effect for hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.about-hero');
            
            if (hero) {
                const rate = scrolled * -0.5;
                hero.style.transform = `translateY(${rate}px)`;
            }
        });

        // Fade in sections on scroll
        const sections = document.querySelectorAll('.values-section, .story-section, .team-section, .certifications-section, .contact-info-section');
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(section => sectionObserver.observe(section));
    },

    /**
     * Load team data
     */
    loadTeamData: function() {
        // This could load team data from an API
        // For now, we'll just add some interactive features
        this.addTeamMemberInteractions();
    },

    /**
     * Add team member interactions
     */
    addTeamMemberInteractions: function() {
        const teamMembers = document.querySelectorAll('.team-member');
        
        teamMembers.forEach(member => {
            member.addEventListener('mouseenter', () => {
                member.classList.add('hover');
            });
            
            member.addEventListener('mouseleave', () => {
                member.classList.remove('hover');
            });
        });
    },

    /**
     * Handle contact item click
     */
    handleContactClick: function(contactItem) {
        const type = contactItem.querySelector('h4').textContent;
        const value = contactItem.querySelector('p').textContent;
        
        switch (type) {
            case 'الهاتف':
                this.copyToClipboard(value.replace(/\s/g, ''));
                Toast.show('تم النسخ', 'تم نسخ رقم الهاتف إلى الحافظة', 'success');
                break;
            case 'البريد الإلكتروني':
                this.copyToClipboard(value);
                Toast.show('تم النسخ', 'تم نسخ البريد الإلكتروني إلى الحافظة', 'success');
                break;
            case 'العنوان':
                this.showMap(value);
                break;
            case 'ساعات العمل':
                this.showWorkingHours();
                break;
        }
    },

    /**
     * Copy text to clipboard
     */
    copyToClipboard: function(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
    },

    /**
     * Show map
     */
    showMap: function(address) {
        // Open Google Maps with the address
        const encodedAddress = encodeURIComponent(address);
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    },

    /**
     * Show working hours
     */
    showWorkingHours: function() {
        const currentTime = new Date();
        const currentDay = currentTime.getDay(); // 0 = Sunday, 6 = Saturday
        const currentHour = currentTime.getHours();
        
        let isOpen = false;
        let message = '';
        
        if (currentDay >= 0 && currentDay <= 4) { // Sunday to Thursday
            if (currentHour >= 8 && currentHour < 18) {
                isOpen = true;
                message = 'نحن مفتوحون الآن! 🟢';
            } else {
                message = 'نحن مغلقون الآن. ساعات العمل: الأحد - الخميس 8:00 ص - 6:00 م 🔴';
            }
        } else {
            message = 'نحن مغلقون اليوم. ساعات العمل: الأحد - الخميس 8:00 ص - 6:00 م 🔴';
        }
        
        Toast.show('ساعات العمل', message, isOpen ? 'success' : 'info');
    },

    /**
     * Show team member details
     */
    showTeamMemberDetails: function(memberElement) {
        const name = memberElement.querySelector('h4').textContent;
        const position = memberElement.querySelector('.member-position').textContent;
        const bio = memberElement.querySelector('.member-bio').textContent;
        
        Modal.open('team-member-modal', {
            title: name,
            content: `
                <div class="team-member-details">
                    <div class="member-info">
                        <h3>${position}</h3>
                        <p>${bio}</p>
                    </div>
                    <div class="member-contact">
                        <button class="btn btn-primary" onclick="AboutController.contactTeamMember('${name}')">
                            <i class="fas fa-envelope"></i>
                            تواصل مع ${name}
                        </button>
                    </div>
                </div>
            `
        });
    },

    /**
     * Contact team member
     */
    contactTeamMember: function(name) {
        Modal.close('team-member-modal');
        Toast.show('تم الإرسال', `سيتم التواصل مع ${name} قريباً`, 'success');
    },

    /**
     * Show certification details
     */
    showCertificationDetails: function(certElement) {
        const title = certElement.querySelector('h4').textContent;
        const description = certElement.querySelector('p').textContent;
        
        const certDetails = {
            'ISO 9001': {
                description: 'نظام إدارة الجودة الذي يضمن تقديم خدمات عالية الجودة',
                validity: 'صالح حتى 2025',
                scope: 'جميع الخدمات اللوجستية'
            },
            'ISO 27001': {
                description: 'نظام إدارة أمن المعلومات لحماية بيانات العملاء',
                validity: 'صالح حتى 2024',
                scope: 'أنظمة المعلومات والبيانات'
            },
            'ISO 14001': {
                description: 'نظام إدارة البيئة لضمان الممارسات المستدامة',
                validity: 'صالح حتى 2026',
                scope: 'العمليات البيئية'
            }
        };
        
        const details = certDetails[title] || {
            description: description,
            validity: 'صالح',
            scope: 'جميع الخدمات'
        };
        
        Modal.open('certification-modal', {
            title: title,
            content: `
                <div class="certification-details">
                    <div class="cert-info">
                        <p><strong>الوصف:</strong> ${details.description}</p>
                        <p><strong>الصلاحية:</strong> ${details.validity}</p>
                        <p><strong>النطاق:</strong> ${details.scope}</p>
                    </div>
                    <div class="cert-actions">
                        <button class="btn btn-outline" onclick="AboutController.downloadCertificate('${title}')">
                            <i class="fas fa-download"></i>
                            تحميل الشهادة
                        </button>
                    </div>
                </div>
            `
        });
    },

    /**
     * Download certificate
     */
    downloadCertificate: function(certName) {
        Modal.close('certification-modal');
        Toast.show('تم التحميل', `جاري تحميل شهادة ${certName}`, 'info');
        
        // Simulate download
        setTimeout(() => {
            Toast.show('تم التحميل', `تم تحميل شهادة ${certName} بنجاح`, 'success');
        }, 2000);
    },

    /**
     * Destroy controller
     */
    destroy: function() {
        // Cleanup if needed
    }
}; 