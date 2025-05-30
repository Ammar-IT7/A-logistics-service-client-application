/**
 * Shipping Vehicle Form Controller
 * Handles form navigation, validation, and dynamic content
 */

const ShippingVehicleFormController = {
    init: function() {
        console.log('Shipping Vehicle Form initialized');

        this.form = document.getElementById('vehicleForm');
        this.slides = document.querySelectorAll('.shipping-form-slide');
        this.progressSteps = document.querySelectorAll('.shipping-progress-step');

        this.setupFormNavigation();
        this.setupConditionalFields();
        this.setupFileUploads();
        this.setupChipsInputs();
        this.setupDriversAndMaintenance();
        this.setupFormSubmission();

        // Save button handler
        const saveBtn = document.querySelector('[data-action="save-vehicle"]');
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
                const currentSlide = document.querySelector('.shipping-form-slide.active');
                const currentSlideId = currentSlide.getAttribute('data-slide');
                const moveForward = self.getSlideIndex(targetSlide) > self.getSlideIndex(currentSlideId);

                // if (moveForward && !self.validateSlide(currentSlideId)) {
                //     return;
                // }

                self.goToSlide(targetSlide);
            });
        });
    },

    getSlideIndex: function(slideId) {
        const slideOrder = ['basic', 'specs', 'docs', 'staff'];
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

        document.querySelector('.shipping-form-progress-indicator')?.scrollIntoView({ behavior: 'smooth' });
    },

    setupConditionalFields: function() {
        const shippingTypeSelect = document.getElementById('shippingType');
        const vehicleTypeSelect = document.getElementById('vehicleType');
        const self = this;

        if (!shippingTypeSelect || !vehicleTypeSelect) return;

        shippingTypeSelect.addEventListener('change', () => {
            self.updateVehicleTypeOptions();
            self.updateVisibleFields();
        });

        vehicleTypeSelect.addEventListener('change', () => {
            self.updateVisibleFields();
        });

        const coverageTypeRadios = document.querySelectorAll('input[name="coverageType"]');
        coverageTypeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                self.updateCoverageFields();
            });
        });

        self.updateVehicleTypeOptions();
        self.updateVisibleFields();
        self.updateCoverageFields();
    },

    updateVehicleTypeOptions: function() {
        const shippingTypeSelect = document.getElementById('shippingType');
        const vehicleTypeSelect = document.getElementById('vehicleType');
        if (!shippingTypeSelect || !vehicleTypeSelect) return;

        const shippingType = shippingTypeSelect.value;
        const vehicleTypeOptgroups = vehicleTypeSelect.querySelectorAll('optgroup');

        vehicleTypeOptgroups.forEach(optgroup => {
            optgroup.querySelectorAll('option').forEach(option => {
                option.style.display = 'none';
            });
        });

        if (shippingType) {
            let label = '';
            if (shippingType === 'land') label = 'شحن بري';
            else if (shippingType === 'air') label = 'شحن جوي';
            else if (shippingType === 'sea') label = 'شحن بحري';

            const relevantOptgroup = Array.from(vehicleTypeOptgroups).find(optgroup => optgroup.label === label);

            if (relevantOptgroup) {
                relevantOptgroup.querySelectorAll('option').forEach(option => {
                    option.style.display = '';
                });

                const firstOption = relevantOptgroup.querySelector('option');
                if (firstOption) {
                    vehicleTypeSelect.value = firstOption.value;
                }
            }
        }
    },

    updateVisibleFields: function() {
        const shippingTypeSelect = document.getElementById('shippingType');
        if (!shippingTypeSelect) return;

        const shippingType = shippingTypeSelect.value;

        // Land-specific fields
        const landVehicleFields = document.getElementById('landVehicleFields');
        const landSpecsFields = document.getElementById('landSpecsFields');
        const landDocsFields = document.getElementById('landDocsFields');
        const landStaffFields = document.getElementById('landStaffFields');

        if (landVehicleFields) landVehicleFields.style.display = 'none';
        if (landSpecsFields) landSpecsFields.style.display = 'none';
        if (landDocsFields) landDocsFields.style.display = 'none';
        if (landStaffFields) landStaffFields.style.display = 'none';

        if (shippingType === 'land') {
            if (landVehicleFields) landVehicleFields.style.display = 'block';
            if (landSpecsFields) landSpecsFields.style.display = 'block';
            if (landDocsFields) landDocsFields.style.display = 'block';
            if (landStaffFields) landStaffFields.style.display = 'block';
        }
    },

    updateCoverageFields: function() {
        const coverageType = document.querySelector('input[name="coverageType"]:checked')?.value;
        const localCoverageFields = document.getElementById('localCoverageFields');
        const internationalCoverageFields = document.getElementById('internationalCoverageFields');

        if (!localCoverageFields || !internationalCoverageFields) return;

        if (coverageType === 'local') {
            localCoverageFields.style.display = 'block';
            internationalCoverageFields.style.display = 'none';
        } else {
            localCoverageFields.style.display = 'none';
            internationalCoverageFields.style.display = 'block';
        }
    },

    setupFileUploads: function() {
        const fileInputs = document.querySelectorAll('input[type="file"]');

        fileInputs.forEach(fileInput => {
            const container = fileInput.closest('.shipping-file-upload-container');
            if (!container) return;

            const uploadBtn = container.querySelector('.file-upload-btn');
            const fileNameSpan = container.querySelector('.shipping-file-name');

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

    setupChipsInputs: function() {
        this.setupChipInput('localAreaInput', 'localAreasChips');
        this.setupChipInput('countryInput', 'countriesChips');
    },

    setupChipInput: function(inputId, containerId) {
        const input = document.getElementById(inputId);
        const container = document.getElementById(containerId);

        if (!input || !container) return;

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                e.preventDefault();
                this.addChip(input.value.trim(), container);
                input.value = '';
            }
        });

        // Initial demo chips
        if (containerId === 'localAreasChips') {
            this.addChip('الرياض', container);
            this.addChip('جدة', container);
        } else if (containerId === 'countriesChips') {
            this.addChip('السعودية', container);
            this.addChip('الإمارات', container);
        }
    },

    addChip: function(text, container) {
        const chip = document.createElement('div');
        chip.className = 'shipping-chip';
        chip.innerHTML = `
            <span class="shipping-chip-close">×</span>
            <span class="shipping-chip-text">${text}</span>
        `;

        chip.querySelector('.shipping-chip-close').addEventListener('click', () => {
            chip.remove();
        });

        container.appendChild(chip);
    },

    setupDriversAndMaintenance: function() {
        const addDriverBtn = document.getElementById('addDriver');
        const driversContainer = document.querySelector('.shipping-drivers-container');
        const addMaintenanceBtn = document.getElementById('addMaintenance');
        const maintenanceContainer = document.querySelector('.shipping-maintenance-container');
        const self = this;

        if (addDriverBtn && driversContainer) {
            addDriverBtn.addEventListener('click', () => {
                const driverCount = driversContainer.querySelectorAll('.shipping-driver-item').length + 1;
                const newDriver = self.createDriverItem(driverCount);
                driversContainer.appendChild(newDriver);
                self.setupFileUploads();
            });

            driversContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('shipping-remove-driver')) {
                    const driverItem = e.target.closest('.shipping-driver-item');
                    if (driversContainer.querySelectorAll('.shipping-driver-item').length > 1) {
                        driverItem.remove();
                        self.renumberDrivers(driversContainer);
                    } else {
                        alert('يجب أن يكون هناك سائق واحد على الأقل');
                    }
                }
            });
        }

        if (addMaintenanceBtn && maintenanceContainer) {
            addMaintenanceBtn.addEventListener('click', () => {
                const maintenanceCount = maintenanceContainer.querySelectorAll('.shipping-maintenance-item').length + 1;
                const newMaintenance = self.createMaintenanceItem(maintenanceCount);
                maintenanceContainer.appendChild(newMaintenance);
            });

            maintenanceContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('shipping-remove-maintenance')) {
                    const maintenanceItem = e.target.closest('.shipping-maintenance-item');
                    if (maintenanceContainer.querySelectorAll('.shipping-maintenance-item').length > 1) {
                        maintenanceItem.remove();
                        self.renumberMaintenance(maintenanceContainer);
                    } else {
                        alert('يجب أن تكون هناك صيانة واحدة على الأقل');
                    }
                }
            });
        }
    },

    createDriverItem: function(index) {
        const driverItem = document.createElement('div');
        driverItem.className = 'shipping-driver-item';
        driverItem.innerHTML = `
            <div class="shipping-driver-header">
                <h4 class="shipping-driver-title">السائق ${index}</h4>
                <button type="button" class="btn btn-icon shipping-remove-driver" aria-label="إزالة">×</button>
            </div>
            <div class="form-group">
                <label class="form-label">اسم السائق</label>
                <input type="text" name="driverName[]" class="form-control" placeholder="أدخل اسم السائق">
            </div>
            <div class="form-group">
                <label class="form-label">رقم رخصة القيادة</label>
                <input type="text" name="driverLicense[]" class="form-control" placeholder="أدخل رقم الرخصة">
            </div>
            <div class="form-group">
                <label class="form-label">تاريخ انتهاء الرخصة</label>
                <input type="date" name="driverLicenseExpiry[]" class="form-control">
            </div>
            <div class="form-group">
                <label class="form-label">رقم الجوال</label>
                <input type="tel" name="driverPhone[]" class="form-control" placeholder="أدخل رقم الجوال">
            </div>
            <div class="form-group">
                <label class="form-label">صورة الهوية</label>
                <div class="shipping-file-upload-container">
                    <input type="file" name="driverID[]" class="form-control" accept="image/*,.pdf">
                    <button type="button" class="btn btn-outline btn-sm file-upload-btn">اختر الملف</button>
                    <span class="shipping-file-name">لم يتم اختيار ملف</span>
                </div>
            </div>
        `;
        return driverItem;
    },

    createMaintenanceItem: function(index) {
        const maintenanceItem = document.createElement('div');
        maintenanceItem.className = 'shipping-maintenance-item';
        maintenanceItem.innerHTML = `
            <div class="shipping-maintenance-header">
                <h4 class="shipping-maintenance-title">الصيانة ${index}</h4>
                <button type="button" class="btn btn-icon shipping-remove-maintenance" aria-label="إزالة">×</button>
            </div>
            <div class="form-group">
                <label class="form-label">نوع الصيانة</label>
                <input type="text" name="maintenanceType[]" class="form-control" placeholder="أدخل نوع الصيانة">
            </div>
            <div class="form-group">
                <label class="form-label">تاريخ آخر صيانة</label>
                <input type="date" name="lastMaintenance[]" class="form-control">
            </div>
            <div class="form-group">
                <label class="form-label">تاريخ الصيانة القادمة</label>
                <input type="date" name="nextMaintenance[]" class="form-control">
            </div>
        `;
        return maintenanceItem;
    },

    renumberDrivers: function(driversContainer) {
        const drivers = driversContainer.querySelectorAll('.shipping-driver-item');
        drivers.forEach((driver, index) => {
            driver.querySelector('.shipping-driver-title').textContent = `السائق ${index + 1}`;
        });
    },

    renumberMaintenance: function(maintenanceContainer) {
        const maintenanceItems = maintenanceContainer.querySelectorAll('.shipping-maintenance-item');
        maintenanceItems.forEach((item, index) => {
            item.querySelector('.shipping-maintenance-title').textContent = `الصيانة ${index + 1}`;
        });
    },

    setupFormSubmission: function() {
        const self = this;

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();

            const slideIds = ['basic', 'specs', 'docs', 'staff'];
            let isValid = true;

            for (const slideId of slideIds) {
                if (!self.validateSlide(slideId)) {
                    isValid = false;
                    self.goToSlide(slideId);
                    break;
                }
            }

            if (isValid) {
                self.saveVehicleData();
            }
        });
    },

    saveVehicleData: function() {
        const formData = new FormData(this.form);

        // Add chips data
        const localAreas = Array.from(document.querySelectorAll('#localAreasChips .shipping-chip-text')).map(chip => chip.textContent);
        const countries = Array.from(document.querySelectorAll('#countriesChips .shipping-chip-text')).map(chip => chip.textContent);

        // You can append these arrays to formData or handle as needed
        // Example: formData.append('localAreas', JSON.stringify(localAreas));

        this.showSaveSuccessMessage();
    },

    showSaveSuccessMessage: function() {
        const toast = document.createElement('div');
        toast.className = 'shipping-toast success';
        toast.innerHTML = `
            <div class="shipping-toast-icon">✓</div>
            <div class="shipping-toast-content">
                <div class="shipping-toast-title">تم الحفظ بنجاح</div>
                <div class="shipping-toast-message">تم حفظ بيانات وسيلة الشحن بنجاح</div>
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
                window.location.href = '#/shipping';
            }, 300);
        }, 3000);
    }
};