const ClientServiceRequestFormController = {
    init: function() {
        console.log('Client Service Request Form initialized');

        this.form = document.getElementById('clientRequestForm');
        if (!this.form) {
            console.error("Form not found");
            return;
        }

        this.slides = this.form.querySelectorAll('.form-slide');
        this.progressSteps = document.querySelectorAll('.csr-progress-step');
        this.requestedServiceTypeSelect = document.getElementById('requestedServiceType');

        this.setupFormNavigation();
        this.setupConditionalServiceDetails();
        this.setupFileUploads();
        this.setupFormSubmission();
        this.setupHeaderActions();
        this.addInputFocusEffects();
        this.updateServiceDetailsVisibility();
    },

    addInputFocusEffects: function() {
        const inputs = this.form.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('focus', () => input.classList.add('is-focused'));
            input.addEventListener('blur', () => input.classList.remove('is-focused'));
        });
    },

    setupHeaderActions: function() {
        const submitBtn = document.querySelector('[data-action="submit-client-request"]');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.form.dispatchEvent(new Event('submit', { cancelable: true }));
            });
        }

        const backBtn = document.querySelector('[data-action="navigate-back"]');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                const currentSlide = this.form.querySelector('.form-slide.active');
                const currentSlideId = currentSlide.getAttribute('data-slide');
                const currentIndex = this.getSlideIndex(currentSlideId);
                
                if (currentIndex > 0) {
                    const prevSlideId = this.getSlideIdByIndex(currentIndex - 1);
                    if (prevSlideId) this.goToSlide(prevSlideId);
                } else {
                    this.showToast('أنت بالفعل في الخطوة الأولى', 'info');
                }
            });
        }
    },

    getSlideIdByIndex: function(index) {
        const slideOrder = ['client_info', 'select_service', 'service_details', 'attachments_submit'];
        return slideOrder[index];
    },

    setupFormNavigation: function() {
        const self = this;
        this.form.querySelectorAll('[data-action="goto-slide"]').forEach(button => {
            button.addEventListener('click', (e) => {
                const targetSlideId = e.target.closest('[data-action="goto-slide"]').getAttribute('data-target');
                // const currentSlide = self.form.querySelector('.form-slide.active');
                // const currentSlideId = currentSlide.getAttribute('data-slide');
                
                // const moveForward = self.getSlideIndex(targetSlideId) > self.getSlideIndex(currentSlideId);
                // if (moveForward && !self.validateSlide(currentSlideId)) {
                //     self.showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
                //     return;
                // }
                self.goToSlide(targetSlideId);
            });
        });
    },

    getSlideIndex: function(slideId) {
        const slideOrder = ['client_info', 'select_service', 'service_details', 'attachments_submit'];
        return slideOrder.indexOf(slideId);
    },

    goToSlide: function(slideId) {
        // إخفاء جميع الخطوات
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });

        // إظهار الخطوة المطلوبة
        const targetSlide = this.form.querySelector(`[data-slide="${slideId}"]`);
        if (targetSlide) {
            targetSlide.classList.add('active');
        }

        // تحديث مؤشر التقدم
        this.progressSteps.forEach(step => {
            const stepId = step.getAttribute('data-step');
            step.classList.remove('active', 'completed');
            
            const currentStepIndex = this.getSlideIndex(slideId);
            const stepIndex = this.getSlideIndex(stepId);

            if (stepId === slideId) {
                step.classList.add('active');
            } else if (stepIndex < currentStepIndex) {
                step.classList.add('completed');
            }
        });

        // التمرير لأعلى
        document.querySelector('.content')?.scrollTo(0, 0);
    },

    setupConditionalServiceDetails: function() {
        if (this.requestedServiceTypeSelect) {
            this.requestedServiceTypeSelect.addEventListener('change', () => {
                this.updateServiceDetailsVisibility();
            });
        }
    },

    updateServiceDetailsVisibility: function() {
        const selectedService = this.requestedServiceTypeSelect ? this.requestedServiceTypeSelect.value : '';
        const serviceDetailsSlide = this.form.querySelector('.form-slide[data-slide="service_details"]');
        if (!serviceDetailsSlide) return;

        // إخفاء جميع الأقسام
        serviceDetailsSlide.querySelectorAll('.csr-service-details-section').forEach(section => {
            section.style.display = 'none';
            section.querySelectorAll('input, select, textarea').forEach(input => {
                input.removeAttribute('required');
            });
        });

        // إظهار القسم المطلوب
        if (selectedService) {
            const targetSection = serviceDetailsSlide.querySelector(`#details_${selectedService}`);
            if (targetSection) {
                targetSection.style.display = 'block';
                targetSection.querySelectorAll('input[data-required], select[data-required], textarea[data-required]').forEach(input => {
                    input.setAttribute('required', '');
                });
            }
        }
    },

    validateSlide: function(slideId) {
        const slideElement = this.form.querySelector(`.form-slide[data-slide="${slideId}"]`);
        if (!slideElement) return true;

        let isValid = true;
        slideElement.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

        const inputs = slideElement.querySelectorAll('input[required], select[required], textarea[required]');
        
        for (let input of inputs) {
            const parentSection = input.closest('.csr-service-details-section');
            if (parentSection && window.getComputedStyle(parentSection).display === 'none') {
                continue;
            }

            let fieldValid = true;
            
            if (input.type === 'radio') {
                const radioGroup = slideElement.querySelectorAll(`input[name="${input.name}"][required]`);
                let isChecked = Array.from(radioGroup).some(radio => radio.checked);
                if (!isChecked) fieldValid = false;
            } else if (!input.value.trim()) {
                fieldValid = false;
            }

            if (!fieldValid) {
                isValid = false;
                input.classList.add('is-invalid');
                if (isValid === false) input.focus();
            }
        }
        
        return isValid;
    },

    setupFileUploads: function() {
        this.form.querySelectorAll('input[type="file"]').forEach(fileInput => {
            const container = fileInput.closest('.file-upload-container');
            if (!container) return;

            const uploadBtn = container.querySelector('.file-upload-btn');
            const fileNameSpan = container.querySelector('.file-name');

            uploadBtn?.addEventListener('click', () => {
                fileInput.click();
            });

            fileInput.addEventListener('change', () => {
                if (fileInput.files.length > 0) {
                    if (fileInput.multiple) {
                        fileNameSpan.textContent = `تم اختيار ${fileInput.files.length} ملفات`;
                    } else {
                        fileNameSpan.textContent = fileInput.files[0].name;
                    }
                    fileNameSpan.classList.add('has-file');
                } else {
                    fileNameSpan.textContent = 'لم يتم اختيار ملفات';
                    fileNameSpan.classList.remove('has-file');
                }
            });
        });
    },

    setupFormSubmission: function() {
        const self = this;
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();

            const slideIds = ['client_info', 'select_service', 'service_details', 'attachments_submit'];
            let firstInvalidSlide = null;

            for (const slideId of slideIds) {
                if (!self.validateSlide(slideId)) {
                    if (!firstInvalidSlide) firstInvalidSlide = slideId;
                }
            }

            if (firstInvalidSlide) {
                self.goToSlide(firstInvalidSlide);
                self.showToast('يرجى تصحيح الأخطاء في النموذج', 'error');
                return;
            }

            self.saveClientRequestData();
        });
    },

    saveClientRequestData: function() {
        const formData = new FormData(this.form);
        const dataObject = {};

        formData.forEach((value, key) => {
            if (dataObject[key]) {
                if (!Array.isArray(dataObject[key])) {
                    dataObject[key] = [dataObject[key]];
                }
                dataObject[key].push(value);
            } else {
                dataObject[key] = value;
            }
        });

        console.log("بيانات الطلب:", dataObject);
        this.showToast('تم إرسال طلبك بنجاح! سيتم التواصل معك قريباً', 'success', 5000);
    },

    showToast: function(message, type = 'info', duration = 3000) {
        document.querySelectorAll('.toast-message').forEach(t => t.remove());

        const toast = document.createElement('div');
        toast.className = `toast-message ${type}`;

        let iconHtml = '';
        if (type === 'success') iconHtml = '<div class="toast-icon"><i class="fas fa-check-circle"></i></div>';
        else if (type === 'error') iconHtml = '<div class="toast-icon"><i class="fas fa-times-circle"></i></div>';
        else iconHtml = '<div class="toast-icon"><i class="fas fa-info-circle"></i></div>';

        toast.innerHTML = `
            ${iconHtml}
            <div class="toast-content">
                <div class="toast-text">${message}</div>
            </div>
        `;
        
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
};