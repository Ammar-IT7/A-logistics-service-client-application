/**
 * Warehouse Form Controller
 * Handles form navigation, validation, and dynamic content
 */

const WarehouseFormController = {
    init: function() {
        console.log('Warehouse Form initialized');

        this.form = document.getElementById('warehouseForm');
        this.slides = document.querySelectorAll('.wh-form-slide');
        this.progressSteps = document.querySelectorAll('.wh-progress-step');

        this.setupFormNavigation();
        this.setupConditionalFields();
        this.setupFileUploads();
        this.setupImagePreviews();
        this.setupLocationMap();
        this.setupCitySelection();
        this.setupFormSubmission();


        // Save button handler
        const saveBtn = document.querySelector('[data-action="save-warehouse"]');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.form.dispatchEvent(new Event('submit'));
            });
        }
    },

    setupFormNavigation: function() {
        const self = this;

        document.querySelectorAll('[data-action="goto-slide"]').forEach(button => {
            button.addEventListener('click', (e) => {
                const targetSlide = e.target.getAttribute('data-target');
                const currentSlide = document.querySelector('.wh-form-slide.active');
                const currentSlideId = currentSlide.getAttribute('data-slide');
                const moveForward = self.getSlideIndex(targetSlide) > self.getSlideIndex(currentSlideId);

                // Uncomment to enable validation
                // if (moveForward && !self.validateSlide(currentSlideId)) {
                //     return;
                // }

                self.goToSlide(targetSlide);
            });
        });
    },

    getSlideIndex: function(slideId) {
        const slideOrder = ['basic', 'details', 'safety', 'media'];
        return slideOrder.indexOf(slideId);
    },

    goToSlide: function(slideId) {
        this.slides.forEach(slide => {
            slide.classList.toggle('active', slide.getAttribute('data-slide') === slideId);
        });

        this.progressSteps.forEach(step => {
            const stepId = step.getAttribute('data-step');
            step.classList.remove('active', 'completed');

            if (stepId === slideId) {
                step.classList.add('active');
            } else if (this.getSlideIndex(stepId) < this.getSlideIndex(slideId)) {
                step.classList.add('completed');
            }
        });

        // Scroll to top of form for better UX
        this.form.scrollIntoView({ behavior: 'smooth' });
    },

    setupConditionalFields: function() {
        const warehouseTypeSelect = document.getElementById('warehouseType');
        const workingHoursSelect = document.getElementById('workingHours');
        const self = this;

        if (warehouseTypeSelect) {
            warehouseTypeSelect.addEventListener('change', () => {
                self.updateWarehouseTypeFields();
            });
        }

        if (workingHoursSelect) {
            workingHoursSelect.addEventListener('change', () => {
                self.updateWorkingHoursFields();
            });
        }

        // Initial call to setup conditional fields
        self.updateWarehouseTypeFields();
        self.updateWorkingHoursFields();
    },

    updateWarehouseTypeFields: function() {
        const warehouseType = document.getElementById('warehouseType')?.value;
        const storageConditionsGroup = document.querySelector('.wh-conditions-grid')?.closest('.form-group');
        
        if (warehouseType && storageConditionsGroup) {
            // Show temperature and humidity fields for refrigerated warehouses
            if (warehouseType === 'refrigerated') {
                storageConditionsGroup.style.display = 'block';
                document.getElementById('temperature').setAttribute('required', 'required');
                document.getElementById('humidity').setAttribute('required', 'required');
            } else {
                storageConditionsGroup.style.display = warehouseType === 'hazardous' ? 'block' : 'none';
                document.getElementById('temperature').removeAttribute('required');
                document.getElementById('humidity').removeAttribute('required');
            }
        }
    },

    updateWorkingHoursFields: function() {
        const workingHours = document.getElementById('workingHours')?.value;
        // If needed, add logic to show custom working hours fields
        // For example, show days and times selector for custom option
    },

    setupFileUploads: function() {
        const fileInputs = document.querySelectorAll('input[type="file"]');

        fileInputs.forEach(fileInput => {
            const container = fileInput.closest('.wh-file-upload-container');
            if (!container) return;

            const uploadBtn = container.querySelector('.wh-file-upload-btn');
            const fileNameSpan = container.querySelector('.wh-file-name');

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
                } else {
                    fileNameSpan.textContent = 'لم يتم اختيار ملف';
                }
            });
        });
    },

    setupImagePreviews: function() {
        const mainImageInput = document.getElementById('mainImage');
        const additionalImagesInput = document.getElementById('additionalImages');
        const mainImagePreview = document.getElementById('mainImagePreview');
        const additionalImagesPreview = document.getElementById('additionalImagesPreview');

        if (mainImageInput && mainImagePreview) {
            mainImageInput.addEventListener('change', () => {
                this.previewImage(mainImageInput, mainImagePreview, false);
            });
        }

        if (additionalImagesInput && additionalImagesPreview) {
            additionalImagesInput.addEventListener('change', () => {
                this.previewImage(additionalImagesInput, additionalImagesPreview, true);
            });
        }
    },

    previewImage: function(input, previewContainer, isMultiple) {
        previewContainer.innerHTML = '';

        if (input.files && input.files.length > 0) {
            if (isMultiple) {
                Array.from(input.files).forEach(file => {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const previewItem = document.createElement('div');
                        previewItem.className = 'wh-image-preview-item';
                        previewItem.innerHTML = `
                            <img src="${e.target.result}" alt="Preview">
                            <button type="button" class="wh-remove-image">×</button>
                        `;
                        previewContainer.appendChild(previewItem);

                        previewItem.querySelector('.wh-remove-image').addEventListener('click', function() {
                            previewItem.remove();
                            // Note: Removing from preview doesn't remove from FileList
                            // A complete solution would need a custom file collection
                        });
                    }
                    reader.readAsDataURL(file);
                });
            } else {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewContainer.innerHTML = `
                        <div class="wh-image-preview-item">
                            <img src="${e.target.result}" alt="Preview">
                            <button type="button" class="wh-remove-image">×</button>
                        </div>
                    `;
                    
                    previewContainer.querySelector('.wh-remove-image').addEventListener('click', function() {
                        previewContainer.innerHTML = '';
                        input.value = '';
                    });
                }
                reader.readAsDataURL(input.files[0]);
            }
        }
    },

    setupLocationMap: function() {
        const mapContainer = document.querySelector('.wh-map-container');
        
        if (mapContainer) {
            mapContainer.addEventListener('click', () => {
                // Here you would typically open a map modal or interface
                alert('سيتم فتح الخريطة لتحديد الموقع (في التطبيق الكامل)');
                // Just for demo, set a fake location
                document.getElementById('warehouseLocation').value = '21.543333,39.172778';
            });
        }
    },

    setupCitySelection: function() {
        const countrySelect = document.getElementById('country');
        const citySelect = document.getElementById('city');
        
        if (countrySelect && citySelect) {
            countrySelect.addEventListener('change', () => {
                const country = countrySelect.value;
                citySelect.innerHTML = '<option value="" disabled selected>اختر المدينة</option>';
                
                if (country === 'saudi') {
                    this.addOption(citySelect, 'riyadh', 'الرياض');
                    this.addOption(citySelect, 'jeddah', 'جدة');
                    this.addOption(citySelect, 'dammam', 'الدمام');
                    this.addOption(citySelect, 'makkah', 'مكة المكرمة');
                } else if (country === 'uae') {
                    this.addOption(citySelect, 'dubai', 'دبي');
                    this.addOption(citySelect, 'abudhabi', 'أبوظبي');
                    this.addOption(citySelect, 'sharjah', 'الشارقة');
                } else if (country === 'yemen') {
                    this.addOption(citySelect, 'sanaa', 'صنعاء');
                    this.addOption(citySelect, 'aden', 'عدن');
                    this.addOption(citySelect, 'taiz', 'تعز');
                }
            });
        }
    },

    addOption: function(selectElement, value, text) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        selectElement.appendChild(option);
    },

    validateSlide: function(slideId) {
        const slide = document.querySelector(`.wh-form-slide[data-slide="${slideId}"]`);
        if (!slide) return true;

        const requiredFields = slide.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('invalid');
                isValid = false;
                
                // Add error message if not exists
                const errorMsg = field.nextElementSibling?.classList.contains('error-message') 
                    ? field.nextElementSibling 
                    : null;
                
                if (!errorMsg) {
                    const msg = document.createElement('div');
                    msg.className = 'error-message';
                    msg.textContent = 'هذا الحقل مطلوب';
                    field.parentNode.insertBefore(msg, field.nextSibling);
                }
            } else {
                field.classList.remove('invalid');
                const errorMsg = field.nextElementSibling?.classList.contains('error-message')
                    ? field.nextElementSibling
                    : null;
                
                if (errorMsg) {
                    errorMsg.remove();
                }
            }
        });

        // Additional validation for specific slides
        if (slideId === 'safety') {
            const securityFeatures = document.querySelectorAll('input[name="securityFeature"]:checked');
            if (securityFeatures.length === 0) {
                const featuresContainer = document.querySelector('.wh-security-features-grid');
                isValid = false;
                
                const errorMsg = featuresContainer.nextElementSibling?.classList.contains('error-message')
                    ? featuresContainer.nextElementSibling
                    : null;
                
                if (!errorMsg) {
                    const msg = document.createElement('div');
                    msg.className = 'error-message';
                    msg.textContent = 'يجب اختيار ميزة أمان واحدة على الأقل';
                    featuresContainer.parentNode.insertBefore(msg, featuresContainer.nextSibling);
                }
            } else {
                const featuresContainer = document.querySelector('.wh-security-features-grid');
                const errorMsg = featuresContainer.nextElementSibling?.classList.contains('error-message')
                    ? featuresContainer.nextElementSibling
                    : null;
                
                if (errorMsg) {
                    errorMsg.remove();
                }
            }
        }

        return isValid;
    },

    setupFormSubmission: function() {
        const self = this;

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();

            const slideIds = ['basic', 'details', 'safety', 'media'];
            let isValid = true;

            for (const slideId of slideIds) {
                if (!self.validateSlide(slideId)) {
                    isValid = false;
                    self.goToSlide(slideId);
                    break;
                }
            }

            if (isValid) {
                self.saveWarehouseData();
            }
        });
    },

    saveWarehouseData: function() {
        const formData = new FormData(this.form);
        
        // Add security features
        const securityFeatures = Array.from(document.querySelectorAll('input[name="securityFeature"]:checked')).map(cb => cb.value);
        formData.append('securityFeatures', JSON.stringify(securityFeatures));

        // Get map location
        const warehouseLocation = document.getElementById('warehouseLocation').value;
        formData.append('location', warehouseLocation);

        console.log('Saving warehouse data...');
        // Here you would typically send the data to server
        // For demo purposes, just show success message
        this.showSaveSuccessMessage();
    },

    showSaveSuccessMessage: function() {
        const toast = document.createElement('div');
        toast.className = 'wh-toast success';
        toast.innerHTML = `
            <div class="wh-toast-icon">✓</div>
            <div class="wh-toast-content">
                <div class="wh-toast-title">تم الحفظ بنجاح</div>
                <div class="wh-toast-message">تم حفظ بيانات المخزن بنجاح</div>
            </div>
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
                window.location.href = '#/warehouses';
            }, 300);
        }, 3000);
    }
};