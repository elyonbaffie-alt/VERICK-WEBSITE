// Business Trip Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeBusinessTripPage();
});

function initializeBusinessTripPage() {
    // Tab functionality
    setupFormTabs();
    
    // Traveler management
    setupTravelerManagement();
    
    // Budget slider
    setupBudgetSlider();
    
    // Form submissions
    setupFormSubmissions();
    
    // File upload handling
    setupFileUploads();
}

function setupFormTabs() {
    const tabs = document.querySelectorAll('.form-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to current tab and content
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

function setupTravelerManagement() {
    const addTravelerBtn = document.getElementById('add-traveler');
    const travelersContainer = document.getElementById('travelers-container');
    
    if (!addTravelerBtn || !travelersContainer) return;
    
    let travelerCount = 0;
    
    addTravelerBtn.addEventListener('click', function() {
        travelerCount++;
        addTravelerForm(travelerCount);
    });
    
    // Add first traveler by default
    addTravelerForm(1);
}

function addTravelerForm(travelerNumber) {
    const travelersContainer = document.getElementById('travelers-container');
    
    const travelerHTML = `
        <div class="traveler-card" data-traveler="${travelerNumber}">
            <div class="traveler-header">
                <h4 style="margin: 0;">Traveler ${travelerNumber}</h4>
                ${travelerNumber > 1 ? `
                    <button type="button" class="remove-traveler-btn" onclick="removeTraveler(${travelerNumber})">
                        Remove
                    </button>
                ` : ''}
            </div>
            <div class="business-grid">
                <div class="form-group">
                    <label>Full Name *</label>
                    <input type="text" name="traveler-name-${travelerNumber}" required>
                </div>
                <div class="form-group">
                    <label>Position/Title *</label>
                    <input type="text" name="traveler-position-${travelerNumber}" required>
                </div>
                <div class="form-group">
                    <label>Department</label>
                    <input type="text" name="traveler-department-${travelerNumber}">
                </div>
                <div class="form-group">
                    <label>Email *</label>
                    <input type="email" name="traveler-email-${travelerNumber}" required>
                </div>
                <div class="form-group">
                    <label>Phone</label>
                    <input type="tel" name="traveler-phone-${travelerNumber}">
                </div>
                <div class="form-group">
                    <label>Employee ID</label>
                    <input type="text" name="traveler-employee-id-${travelerNumber}">
                </div>
            </div>
            <div class="form-group">
                <label>Travel Preferences/Notes</label>
                <textarea name="traveler-notes-${travelerNumber}" rows="2" placeholder="Seat preferences, dietary requirements, etc."></textarea>
            </div>
        </div>
    `;
    
    travelersContainer.innerHTML += travelerHTML;
}

function removeTraveler(travelerNumber) {
    const travelerElement = document.querySelector(`[data-traveler="${travelerNumber}"]`);
    if (travelerElement) {
        travelerElement.remove();
        
        // Renumber remaining travelers
        const remainingTravelers = document.querySelectorAll('.traveler-card');
        remainingTravelers.forEach((traveler, index) => {
            const newNumber = index + 1;
            traveler.setAttribute('data-traveler', newNumber);
            traveler.querySelector('h4').textContent = `Traveler ${newNumber}`;
            
            // Update remove button if needed
            const removeBtn = traveler.querySelector('.remove-traveler-btn');
            if (removeBtn && newNumber === 1) {
                removeBtn.remove();
            }
        });
    }
}

function setupBudgetSlider() {
    const budgetSlider = document.getElementById('budget-range');
    const budgetValue = document.getElementById('budget-value');
    
    if (!budgetSlider || !budgetValue) return;
    
    budgetSlider.addEventListener('input', function() {
        const value = parseInt(this.value);
        budgetValue.textContent = `GHS ${value.toLocaleString()}`;
    });
}

function setupFormSubmissions() {
    const forms = [
        'quick-inquiry-form',
        'detailed-request-form', 
        'corporate-account-form'
    ];
    
    forms.forEach(formId => {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', handleFormSubmission);
        }
    });
}

function handleFormSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const formType = form.id.replace('-form', '').replace(/-/g, ' ');
    
    // Show loading state
    const submitBtn = form.querySelector('.submit-business-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // In real implementation, this would be an API call
        console.log('Form submission:', {
            type: formType,
            data: Object.fromEntries(formData)
        });
        
        showSubmissionSuccess(formType);
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Reset form
        form.reset();
        
    }, 2000);
}

function showSubmissionSuccess(formType) {
    // Create success message
    const successMsg = document.createElement('div');
    successMsg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    let message = '';
    switch(formType) {
        case 'quick inquiry':
            message = 'Thank you! Our corporate team will contact you within 24 hours.';
            break;
        case 'detailed request':
            message = 'Request received! We are processing your detailed travel requirements.';
            break;
        case 'corporate account':
            message = 'Corporate account request submitted! Our team will contact you for setup.';
            break;
        default:
            message = 'Request submitted successfully!';
    }
    
    successMsg.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px;">
            <div style="font-size: 24px;">
                <i class="fas fa-check-circle"></i>
            </div>
            <div>
                <h4 style="margin: 0 0 5px 0;">Success!</h4>
                <p style="margin: 0; font-size: 14px;">${message}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(successMsg);
    
    // Remove after 5 seconds
    setTimeout(() => {
        successMsg.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (successMsg.parentNode) {
                successMsg.parentNode.removeChild(successMsg);
            }
        }, 300);
    }, 5000);
}

function setupFileUploads() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const fileUpload = this.closest('.file-upload');
                if (fileUpload) {
                    fileUpload.innerHTML = `
                        <i class="fas fa-file" style="color: #28a745;"></i>
                        <p style="margin: 5px 0; font-weight: 600;">${file.name}</p>
                        <p style="margin: 0; font-size: 12px; color: #666;">
                            ${(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                    `;
                }
            }
        });
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);