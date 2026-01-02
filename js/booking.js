// Booking page functionality - Refactored for API readiness
document.addEventListener('DOMContentLoaded', function() {
    initializeBookingApp();
});

// Main initialization function
function initializeBookingApp() {
    try {
        // Get booking parameters from URL
        const bookingParams = getBookingParamsFromURL();
        
        console.log('Booking params:', bookingParams);
        
        // Get flight details with dynamic pricing
        const flightDetails = getFlightDetails(bookingParams);
        
        // Initialize the booking page
        initializeBookingPage(flightDetails, bookingParams);
        
        // Setup event listeners
        setupEventListeners();
        
    } catch (error) {
        console.error('Error initializing booking app:', error);
        showErrorToUser('Failed to initialize booking page. Please try again.');
    }
}

// Service layer for API interactions
const BookingService = {
    // This will be replaced with actual API calls
    async submitBooking(bookingData) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                // In real implementation, this would be:
                // return fetch('/api/bookings', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(bookingData)
                // });
                
                const mockResponse = {
                    success: true,
                    bookingId: generateBookingId(),
                    timestamp: new Date().toISOString(),
                    message: 'Booking confirmed successfully'
                };
                resolve(mockResponse);
            }, 1500);
        });
    },
    
    async validatePassport(passportData) {
        // Future API integration for passport validation
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ isValid: true, message: 'Passport validation passed' });
            }, 500);
        });
    },
    
    async processPayment(paymentData) {
        // Future API integration for payment processing
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ 
                    success: true, 
                    transactionId: 'TXN_' + Math.random().toString(36).substr(2, 9),
                    message: 'Payment processed successfully'
                });
            }, 1000);
        });
    }
};

// Data models
const BookingModels = {
    Passenger: class {
        constructor(data = {}) {
            this.title = data.title || '';
            this.firstName = data.firstName || '';
            this.lastName = data.lastName || '';
            this.dateOfBirth = data.dateOfBirth || '';
            this.gender = data.gender || '';
            this.nationality = data.nationality || '';
            this.passportNumber = data.passportNumber || '';
            this.passportExpiry = data.passportExpiry || '';
        }
        
        validate() {
            const errors = [];
            if (!this.title) errors.push('Title is required');
            if (!this.firstName) errors.push('First name is required');
            if (!this.lastName) errors.push('Last name is required');
            if (!this.dateOfBirth) errors.push('Date of birth is required');
            if (!this.gender) errors.push('Gender is required');
            if (!this.nationality) errors.push('Nationality is required');
            
            return {
                isValid: errors.length === 0,
                errors: errors
            };
        }
        
        toAPIFormat() {
            return {
                title: this.title,
                first_name: this.firstName,
                last_name: this.lastName,
                date_of_birth: this.dateOfBirth,
                gender: this.gender,
                nationality: this.nationality,
                passport_number: this.passportNumber,
                passport_expiry: this.passportExpiry
            };
        }
    },
    
    Contact: class {
        constructor(data = {}) {
            this.email = data.email || '';
            this.phone = data.phone || '';
        }
        
        validate() {
            const errors = [];
            if (!this.email) errors.push('Email is required');
            else if (!isValidEmail(this.email)) errors.push('Valid email is required');
            if (!this.phone) errors.push('Phone is required');
            else if (!isValidPhone(this.phone)) errors.push('Valid phone number is required');
            
            return {
                isValid: errors.length === 0,
                errors: errors
            };
        }
        
        toAPIFormat() {
            return {
                email: this.email,
                phone_number: this.phone
            };
        }
    },
    
    Payment: class {
        constructor(data = {}) {
            this.method = data.method || '';
            this.cardNumber = data.cardNumber || '';
            this.cardName = data.cardName || '';
            this.cardExpiry = data.cardExpiry || '';
            this.cardCVV = data.cardCVV || '';
            this.mobileProvider = data.mobileProvider || '';
            this.mobileNumber = data.mobileNumber || '';
        }
        
        validate() {
            const errors = [];
            
            if (!this.method) {
                errors.push('Payment method is required');
                return { isValid: false, errors };
            }
            
            if (this.method === 'card') {
                if (!this.cardNumber) errors.push('Card number is required');
                else if (!isValidCardNumber(this.cardNumber)) errors.push('Valid card number is required');
                if (!this.cardName) errors.push('Cardholder name is required');
                if (!this.cardExpiry) errors.push('Expiry date is required');
                else if (!isValidExpiry(this.cardExpiry)) errors.push('Valid expiry date is required');
                if (!this.cardCVV) errors.push('CVV is required');
                else if (!isValidCVV(this.cardCVV)) errors.push('Valid CVV is required');
            } else if (this.method === 'mobile') {
                if (!this.mobileProvider) errors.push('Mobile provider is required');
                if (!this.mobileNumber) errors.push('Mobile number is required');
                else if (!isValidPhone(this.mobileNumber)) errors.push('Valid mobile number is required');
            }
            
            return {
                isValid: errors.length === 0,
                errors: errors
            };
        }
        
        toAPIFormat() {
            const base = {
                method: this.method,
                amount: 0 // Will be set from flight details
            };
            
            if (this.method === 'card') {
                base.card_details = {
                    number: this.cardNumber.replace(/\s/g, ''),
                    name: this.cardName,
                    expiry: this.cardExpiry,
                    cvv: this.cardCVV
                };
            } else if (this.method === 'mobile') {
                base.mobile_details = {
                    provider: this.mobileProvider,
                    number: this.mobileNumber
                };
            }
            
            return base;
        }
    },
    
    Booking: class {
        constructor(data = {}) {
            this.flight = data.flight || {};
            this.passengers = data.passengers || [];
            this.contact = data.contact || new BookingModels.Contact();
            this.payment = data.payment || new BookingModels.Payment();
            this.bookingId = data.bookingId || '';
            this.totalAmount = data.totalAmount || 0;
        }
        
        validate() {
            const errors = [];
            
            // Validate flight details
            if (!this.flight.id) errors.push('Flight selection is required');
            
            // Validate passengers
            if (this.passengers.length === 0) {
                errors.push('At least one passenger is required');
            } else {
                this.passengers.forEach((passenger, index) => {
                    const validation = passenger.validate();
                    if (!validation.isValid) {
                        validation.errors.forEach(error => {
                            errors.push(`Passenger ${index + 1}: ${error}`);
                        });
                    }
                });
            }
            
            // Validate contact
            const contactValidation = this.contact.validate();
            if (!contactValidation.isValid) {
                errors.push(...contactValidation.errors);
            }
            
            // Validate payment
            const paymentValidation = this.payment.validate();
            if (!paymentValidation.isValid) {
                errors.push(...paymentValidation.errors);
            }
            
            return {
                isValid: errors.length === 0,
                errors: errors
            };
        }
        
        toAPIFormat() {
            return {
                flight_id: this.flight.id,
                passengers: this.passengers.map(p => p.toAPIFormat()),
                contact_info: this.contact.toAPIFormat(),
                payment_info: {
                    ...this.payment.toAPIFormat(),
                    amount: this.totalAmount
                },
                metadata: {
                    user_agent: navigator.userAgent,
                    timestamp: new Date().toISOString()
                }
            };
        }
    }
};

// Utility functions
function getBookingParamsFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        flightId: urlParams.get('flightId'),
        tripType: urlParams.get('tripType') || 'one-way',
        passengers: urlParams.get('passengers') || '1',
        from: urlParams.get('from') || 'Accra, Ghana (ACC)',
        to: urlParams.get('to') || 'London, UK (LHR)',
        class: urlParams.get('class') || 'economy'
    };
}

function getFlightDetails(bookingParams) {
    return {
        // From search
        from: bookingParams.from,
        to: bookingParams.to,
        passengers: bookingParams.passengers,
        class: bookingParams.class,
        tripType: bookingParams.tripType,
        
        // Flight specifics
        id: bookingParams.flightId,
        airline: getURLParam('airline') || 'British Airways',
        flightNumber: getURLParam('flightNumber') || 'BA 114',
        departureTime: getURLParam('departureTime') || '08:30',
        arrivalTime: getURLParam('arrivalTime') || '19:45',
        duration: getURLParam('duration') || '7h 15m',
        stops: getURLParam('stops') || 'Non-stop',
        basePrice: parseInt(getURLParam('price')) || calculateBasePrice(bookingParams.from, bookingParams.to),
        aircraft: getURLParam('aircraft') || 'Boeing 777',
        baggage: getURLParam('baggage') || '2 x 23kg',
        date: getDefaultDate()
    };
}

function getURLParam(param) {
    return new URLSearchParams(window.location.search).get(param);
}

function calculateBasePrice(from, to) {
    // Calculate base price based on route distance
    const routePrices = {
        'ACC-LOS': 450,    // Accra to Lagos
        'ACC-ABJ': 380,    // Accra to Abidjan
        'ACC-LHR': 2100,   // Accra to London
        'ACC-JFK': 2500,   // Accra to New York
        'ACC-DXB': 2200,   // Accra to Dubai
        'ACC-JNB': 1800,   // Accra to Johannesburg
        'ACC-NBO': 1200,   // Accra to Nairobi
        'ACC-CDG': 2000,   // Accra to Paris
        'ACC-IST': 1900,   // Accra to Istanbul
        'ACC-DOH': 2300,   // Accra to Doha
        'ACC-FRA': 2050,   // Accra to Frankfurt
        'ACC-AMS': 1950,   // Accra to Amsterdam
        'ACC-MAD': 1850,   // Accra to Madrid
        'ACC-ADD': 1100    // Accra to Addis Ababa
    };
    
    // Extract airport codes from "City, Country (CODE)" format
    const fromCode = extractAirportCode(from);
    const toCode = extractAirportCode(to);
    const routeKey = `${fromCode}-${toCode}`;
    
    console.log('Route calculation:', { fromCode, toCode, routeKey, price: routePrices[routeKey] });
    
    // Return price for route or default price
    return routePrices[routeKey] || 1500;
}

function extractAirportCode(cityString) {
    // Extract airport code from "City, Country (CODE)" format
    const match = cityString.match(/\(([^)]+)\)/);
    return match ? match[1] : 'ACC';
}

function getDefaultDate() {
    const today = new Date();
    return today.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
    });
}

function getCityName(cityString) {
    // Extract city name from "City, Country (CODE)" format
    if (!cityString) return '';
    return cityString.split('(')[0].trim();
}


// ... existing code remains the same until processBooking function ...

// Updated processBooking function with proper payment flow
async function processBooking() {
    const submitBtn = document.querySelector('.complete-booking-btn');
    if (!submitBtn) return;
    
    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    try {
        // Collect and validate booking data
        const bookingData = collectBookingData();
        const validation = bookingData.validate();
        
        if (!validation.isValid) {
            showValidationErrors(validation.errors);
            resetButton(submitBtn, originalText);
            return;
        }
        
        // Show payment processing modal
        const paymentResult = await showPaymentProcessing(bookingData);
        
        if (!paymentResult.success) {
            throw new Error(`Payment failed: ${paymentResult.message}`);
        }
        
        // Submit booking after successful payment
        const bookingResult = await BookingService.submitBooking(bookingData.toAPIFormat());
        if (!bookingResult.success) {
            throw new Error(`Booking failed: ${bookingResult.message}`);
        }
        
        // Store booking data and redirect
        storeBookingData(bookingData, bookingResult.bookingId);
        redirectToConfirmation(bookingResult.bookingId);
        
    } catch (error) {
        console.error('Booking process error:', error);
        showErrorToUser(`Booking failed: ${error.message}`);
        resetButton(submitBtn, originalText);
    }
}

// New payment processing modal
function showPaymentProcessing(bookingData) {
    return new Promise((resolve) => {
        // Create payment processing modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        `;
        
        modal.innerHTML = `
            <div style="background: white; border-radius: 12px; padding: 30px; max-width: 500px; width: 90%; text-align: center;">
                <div style="margin-bottom: 20px;">
                    <div style="width: 60px; height: 60px; background: #ff6b35; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
                        <i class="fas fa-lock" style="color: white; font-size: 24px;"></i>
                    </div>
                    <h3 style="margin: 0 0 10px 0; color: #333;">Processing Payment</h3>
                    <p style="color: #666; margin: 0;">Please wait while we process your payment</p>
                </div>
                
                <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="color: #666;">Amount:</span>
                        <strong style="color: #333;">GHS ${bookingData.totalAmount.toLocaleString()}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="color: #666;">Payment Method:</span>
                        <span style="color: #333;">${formatPaymentMethodForDisplay(bookingData.payment)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #666;">Booking Reference:</span>
                        <span style="color: #333; font-family: monospace;">${generateBookingId()}</span>
                    </div>
                </div>
                
                <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 20px;">
                    <div class="payment-step active">
                        <div class="step-icon">1</div>
                        <div class="step-label">Validation</div>
                    </div>
                    <div class="step-connector"></div>
                    <div class="payment-step">
                        <div class="step-icon">2</div>
                        <div class="step-label">Processing</div>
                    </div>
                    <div class="step-connector"></div>
                    <div class="payment-step">
                        <div class="step-icon">3</div>
                        <div class="step-label">Confirmation</div>
                    </div>
                </div>
                
                <div id="payment-status" style="margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                        <i class="fas fa-spinner fa-spin" style="color: #ff6b35;"></i>
                        <span style="color: #666;">Validating payment details...</span>
                    </div>
                </div>
                
                <button id="cancel-payment" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                    Cancel Payment
                </button>
                
                <style>
                    .payment-step {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 5px;
                    }
                    .step-icon {
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        background: #e9ecef;
                        color: #6c757d;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px;
                        font-weight: bold;
                    }
                    .payment-step.active .step-icon {
                        background: #ff6b35;
                        color: white;
                    }
                    .step-label {
                        font-size: 11px;
                        color: #6c757d;
                        text-transform: uppercase;
                    }
                    .payment-step.active .step-label {
                        color: #ff6b35;
                        font-weight: 600;
                    }
                    .step-connector {
                        width: 40px;
                        height: 2px;
                        background: #e9ecef;
                        margin-top: 15px;
                    }
                </style>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Simulate payment processing steps
        simulatePaymentSteps(modal, resolve);
        
        // Cancel button handler
        const cancelBtn = modal.querySelector('#cancel-payment');
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
            resolve({ success: false, message: 'Payment cancelled by user' });
        });
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
                resolve({ success: false, message: 'Payment cancelled' });
            }
        });
    });
}

function simulatePaymentSteps(modal, resolve) {
    const steps = modal.querySelectorAll('.payment-step');
    const statusEl = modal.querySelector('#payment-status');
    let currentStep = 0;
    
    const stepsConfig = [
        { delay: 1500, message: 'Validating payment details...', icon: 'fa-check' },
        { delay: 2000, message: 'Processing payment with bank...', icon: 'fa-university' },
        { delay: 2500, message: 'Confirming transaction...', icon: 'fa-check-double' },
        { delay: 1000, message: 'Payment successful!', icon: 'fa-check-circle' }
    ];
    
    function processStep(stepIndex) {
        if (stepIndex >= stepsConfig.length) {
            // Payment completed successfully
            setTimeout(() => {
                document.body.removeChild(modal);
                resolve({ 
                    success: true, 
                    transactionId: 'TXN_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                    message: 'Payment processed successfully'
                });
            }, 1000);
            return;
        }
        
        const step = stepsConfig[stepIndex];
        
        // Update current step visual
        if (stepIndex > 0) {
            steps[stepIndex - 1].classList.remove('active');
            const previousIcon = steps[stepIndex - 1].querySelector('.step-icon');
            previousIcon.innerHTML = `<i class="fas ${stepsConfig[stepIndex - 1].icon}" style="color: white;"></i>`;
        }
        
        if (stepIndex < steps.length) {
            steps[stepIndex].classList.add('active');
        }
        
        // Update status message
        statusEl.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                <i class="fas fa-spinner fa-spin" style="color: #ff6b35;"></i>
                <span style="color: #666;">${step.message}</span>
            </div>
        `;
        
        // Move to next step after delay
        setTimeout(() => {
            processStep(stepIndex + 1);
        }, step.delay);
    }
    
    // Start processing steps
    processStep(0);
}

function formatPaymentMethodForDisplay(payment) {
    if (payment.method === 'card') {
        const cardType = getCardType(payment.cardNumber);
        return `${cardType} •••• ${payment.cardNumber ? payment.cardNumber.slice(-4) : '****'}`;
    } else if (payment.method === 'mobile') {
        const providerNames = {
            'mtn': 'MTN Mobile Money',
            'vodafone': 'Vodafone Cash', 
            'airteltigo': 'AirtelTigo Money'
        };
        return `Mobile Money (${providerNames[payment.mobileProvider] || payment.mobileProvider})`;
    }
    return 'Unknown Payment Method';
}

function getCardType(cardNumber) {
    if (!cardNumber) return 'Card';
    
    const cleaned = cardNumber.replace(/\s/g, '');
    
    if (/^4/.test(cleaned)) return 'Visa';
    if (/^5[1-5]/.test(cleaned)) return 'MasterCard';
    if (/^3[47]/.test(cleaned)) return 'American Express';
    if (/^6(?:011|5)/.test(cleaned)) return 'Discover';
    
    return 'Credit Card';
}

// ... rest of the existing code remains the same ...


function collectBookingData() {
    const flightDetails = getFlightDetails(getBookingParamsFromURL());
    const passengerCount = document.querySelectorAll('.passenger-section').length;
    
    // Collect passengers
    const passengers = [];
    const passengerSections = document.querySelectorAll('.passenger-section');
    
    passengerSections.forEach((section, index) => {
        const passengerNum = index + 1;
        const passengerData = {
            title: getInputValue(`title-${passengerNum}`),
            firstName: getInputValue(`firstName-${passengerNum}`),
            lastName: getInputValue(`lastName-${passengerNum}`),
            dateOfBirth: getInputValue(`dob-${passengerNum}`),
            gender: getInputValue(`gender-${passengerNum}`),
            nationality: getInputValue(`nationality-${passengerNum}`),
            passportNumber: getInputValue(`passport-${passengerNum}`),
            passportExpiry: getInputValue(`passportExpiry-${passengerNum}`)
        };
        
        passengers.push(new BookingModels.Passenger(passengerData));
    });
    
    // Collect contact
    const contact = new BookingModels.Contact({
        email: getInputValue('contact-email'),
        phone: getInputValue('contact-phone')
    });
    
    // Collect payment
    const selectedPaymentMethod = document.querySelector('.payment-method.selected');
    const paymentMethod = selectedPaymentMethod?.getAttribute('data-method');
    
    const paymentData = { method: paymentMethod };
    if (paymentMethod === 'card') {
        paymentData.cardNumber = getInputValue('card-number');
        paymentData.cardName = getInputValue('card-name');
        paymentData.cardExpiry = getInputValue('card-expiry');
        paymentData.cardCVV = getInputValue('card-cvv');
    } else if (paymentMethod === 'mobile') {
        paymentData.mobileProvider = getInputValue('mobile-provider');
        paymentData.mobileNumber = getInputValue('mobile-number');
    }
    
    const payment = new BookingModels.Payment(paymentData);
    
    // Calculate total
    const totalAmount = calculateTotalPrice(flightDetails, passengerCount);
    
    return new BookingModels.Booking({
        flight: flightDetails,
        passengers: passengers,
        contact: contact,
        payment: payment,
        totalAmount: totalAmount
    });
}

function getInputValue(fieldId) {
    const element = document.getElementById(fieldId);
    return element ? element.value.trim() : '';
}


// ... existing code remains the same until storeBookingData function ...

function storeBookingData(bookingData, bookingId, paymentResult) {
    const storageData = {
        ...bookingData,
        bookingId: bookingId,
        // Convert class instances to plain objects for storage
        passengers: bookingData.passengers.map(p => ({ ...p })),
        contact: { ...bookingData.contact },
        payment: { 
            ...bookingData.payment,
            // Add payment result details
            transactionId: paymentResult.transactionId,
            status: 'completed',
            paymentDate: new Date().toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        },
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('verick_booking_data', JSON.stringify(storageData));
}

// Updated processBooking function to pass payment result
async function processBooking() {
    const submitBtn = document.querySelector('.complete-booking-btn');
    if (!submitBtn) return;
    
    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    try {
        // Collect and validate booking data
        const bookingData = collectBookingData();
        const validation = bookingData.validate();
        
        if (!validation.isValid) {
            showValidationErrors(validation.errors);
            resetButton(submitBtn, originalText);
            return;
        }
        
        // Show payment processing modal
        const paymentResult = await showPaymentProcessing(bookingData);
        
        if (!paymentResult.success) {
            throw new Error(`Payment failed: ${paymentResult.message}`);
        }
        
        // Submit booking after successful payment
        const bookingResult = await BookingService.submitBooking(bookingData.toAPIFormat());
        if (!bookingResult.success) {
            throw new Error(`Booking failed: ${bookingResult.message}`);
        }
        
        // Store booking data WITH payment result and redirect
        storeBookingData(bookingData, bookingResult.bookingId, paymentResult);
        redirectToConfirmation(bookingResult.bookingId);
        
    } catch (error) {
        console.error('Booking process error:', error);
        showErrorToUser(`Booking failed: ${error.message}`);
        resetButton(submitBtn, originalText);
    }
}

// Updated collectBookingData to capture ALL payment details
function collectBookingData() {
    const flightDetails = getFlightDetails(getBookingParamsFromURL());
    const passengerCount = document.querySelectorAll('.passenger-section').length;
    
    // Collect passengers
    const passengers = [];
    const passengerSections = document.querySelectorAll('.passenger-section');
    
    passengerSections.forEach((section, index) => {
        const passengerNum = index + 1;
        const passengerData = {
            title: getInputValue(`title-${passengerNum}`),
            firstName: getInputValue(`firstName-${passengerNum}`),
            lastName: getInputValue(`lastName-${passengerNum}`),
            dateOfBirth: getInputValue(`dob-${passengerNum}`),
            gender: getInputValue(`gender-${passengerNum}`),
            nationality: getInputValue(`nationality-${passengerNum}`),
            passportNumber: getInputValue(`passport-${passengerNum}`),
            passportExpiry: getInputValue(`passportExpiry-${passengerNum}`)
        };
        
        passengers.push(new BookingModels.Passenger(passengerData));
    });
    
    // Collect contact
    const contact = new BookingModels.Contact({
        email: getInputValue('contact-email'),
        phone: getInputValue('contact-phone')
    });
    
    // Collect payment - CAPTURE ALL DETAILS
    const selectedPaymentMethod = document.querySelector('.payment-method.selected');
    const paymentMethod = selectedPaymentMethod?.getAttribute('data-method');
    
    const paymentData = { method: paymentMethod };
    if (paymentMethod === 'card') {
        paymentData.cardNumber = getInputValue('card-number');
        paymentData.cardName = getInputValue('card-name');
        paymentData.cardExpiry = getInputValue('card-expiry');
        paymentData.cardCVV = getInputValue('card-cvv');
        paymentData.cardLastFour = paymentData.cardNumber ? paymentData.cardNumber.slice(-4) : '****';
    } else if (paymentMethod === 'mobile') {
        paymentData.mobileProvider = getInputValue('mobile-provider');
        paymentData.mobileNumber = getInputValue('mobile-number');
    }
    
    const payment = new BookingModels.Payment(paymentData);
    
    // Calculate total
    const totalAmount = calculateTotalPrice(flightDetails, passengerCount);
    
    return new BookingModels.Booking({
        flight: flightDetails,
        passengers: passengers,
        contact: contact,
        payment: payment,
        totalAmount: totalAmount
    });
}

// ... rest of the existing code remains the same ...

function redirectToConfirmation(bookingId) {
    window.location.href = `confirmation.html?bookingId=${bookingId}`;
}

function resetButton(button, originalHTML) {
    button.innerHTML = originalHTML;
    button.disabled = false;
}

function showErrorToUser(message) {
    // Implement user-friendly error display
    alert(`Error: ${message}`);
}

function initializeBookingPage(flightDetails, bookingParams) {
    console.log('Initializing booking page:', { flightDetails, bookingParams });
    
    try {
        // Display flight details
        displayFlightDetails(flightDetails, bookingParams.tripType, bookingParams.from, bookingParams.to);
        
        // Generate passenger forms - THIS WAS MISSING!
        generatePassengerForms(parseInt(bookingParams.passengers));
        
        // Calculate and display pricing
        calculateAndDisplayPricing(flightDetails, bookingParams.tripType, parseInt(bookingParams.passengers));
        
    } catch (error) {
        console.error('Error initializing booking page:', error);
        showErrorToUser('Failed to load booking form. Please refresh the page.');
    }
}

function generatePassengerForms(passengerCount) {
    const passengersContainer = document.getElementById('passengers-container');
    
    if (!passengersContainer) {
        console.error('Passengers container element not found!');
        return;
    }
    
    passengersContainer.innerHTML = '';
    
    for (let i = 1; i <= passengerCount; i++) {
        const passengerHTML = `
            <div class="passenger-section" data-passenger="${i}">
                <div class="passenger-header">
                    <h4>Passenger ${i}</h4>
                    ${i > 1 ? `<button type="button" class="remove-passenger-btn" onclick="removePassenger(${i})">Remove</button>` : ''}
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Title *</label>
                        <select name="title-${i}" id="title-${i}" required>
                            <option value="">Select</option>
                            <option value="mr">Mr</option>
                            <option value="mrs">Mrs</option>
                            <option value="ms">Ms</option>
                            <option value="miss">Miss</option>
                            <option value="dr">Dr</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>First Name *</label>
                        <input type="text" name="firstName-${i}" id="firstName-${i}" required>
                    </div>
                    <div class="form-group">
                        <label>Last Name *</label>
                        <input type="text" name="lastName-${i}" id="lastName-${i}" required>
                    </div>
                    <div class="form-group">
                        <label>Date of Birth *</label>
                        <input type="date" name="dob-${i}" id="dob-${i}" required>
                    </div>
                    <div class="form-group">
                        <label>Gender *</label>
                        <select name="gender-${i}" id="gender-${i}" required>
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Nationality *</label>
                        <select name="nationality-${i}" id="nationality-${i}" required>
                            <option value="">Select Nationality</option>
                            <option value="gh">Ghanaian</option>
                            <option value="ng">Nigerian</option>
                            <option value="us">American</option>
                            <option value="uk">British</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Passport Number</label>
                        <input type="text" name="passport-${i}" id="passport-${i}">
                    </div>
                    <div class="form-group">
                        <label>Passport Expiry Date</label>
                        <input type="date" name="passportExpiry-${i}" id="passportExpiry-${i}">
                    </div>
                </div>
            </div>
        `;
        
        passengersContainer.innerHTML += passengerHTML;
    }
}

function displayFlightDetails(flightDetails, tripType, from, to) {
    const flightDisplay = document.getElementById('flight-details-display');
    
    if (!flightDisplay) {
        console.error('Flight details display element not found!');
        return;
    }
    
    flightDisplay.innerHTML = `
        <div class="flight-details-card">
            <div class="flight-route">
                <div>
                    <strong>${getCityName(from)}</strong>
                    <div>${flightDetails.departureTime} • ${flightDetails.date}</div>
                </div>
                <div style="text-align: center;">
                    <div>${flightDetails.duration}</div>
                    <div style="font-size: 12px; color: #666;">${tripType === 'round-trip' ? 'Round Trip' : 'One Way'}</div>
                </div>
                <div style="text-align: right;">
                    <strong>${getCityName(to)}</strong>
                    <div>${flightDetails.arrivalTime}</div>
                </div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 14px; color: #666;">
                <span>${flightDetails.airline} • ${flightDetails.flightNumber}</span>
                <span>${flightDetails.aircraft} • Baggage: ${flightDetails.baggage}</span>
            </div>
        </div>
    `;
}

function calculateAndDisplayPricing(flightDetails, tripType, passengerCount) {
    const summaryDisplay = document.getElementById('booking-summary-display');
    
    if (!summaryDisplay) {
        console.error('Booking summary display element not found!');
        return;
    }
    
    // Calculate prices
    const basePrice = flightDetails.basePrice;
    const tripMultiplier = tripType === 'round-trip' ? 2 : 1;
    const subtotal = basePrice * tripMultiplier * passengerCount;
    const tax = subtotal * 0.05; // 5% tax
    const serviceFee = 50 * passengerCount;
    const total = subtotal + tax + serviceFee;
    
    summaryDisplay.innerHTML = `
        <div class="price-breakdown">
            <div class="price-item">
                <span>Base Fare (${passengerCount} ${passengerCount > 1 ? 'passengers' : 'passenger'})</span>
                <span>GHS ${subtotal.toLocaleString()}</span>
            </div>
            <div class="price-item">
                <span>Taxes & Fees</span>
                <span>GHS ${Math.round(tax)}</span>
            </div>
            <div class="price-item">
                <span>Service Fee</span>
                <span>GHS ${serviceFee.toLocaleString()}</span>
            </div>
            <div class="price-total">
                <span>Total</span>
                <span>GHS ${Math.round(total).toLocaleString()}</span>
            </div>
        </div>
        <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; font-size: 14px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <i class="fas fa-shield-alt" style="color: #28a745;"></i>
                <strong>Secure Booking</strong>
            </div>
            <p style="margin: 0; color: #666;">Your payment information is encrypted and secure.</p>
        </div>
    `;
}

function calculateTotalPrice(flightDetails, passengerCount) {
    const basePrice = flightDetails.basePrice;
    const tripMultiplier = flightDetails.tripType === 'round-trip' ? 2 : 1;
    const subtotal = basePrice * tripMultiplier * passengerCount;
    const tax = subtotal * 0.05;
    const serviceFee = 50 * passengerCount;
    return Math.round(subtotal + tax + serviceFee);
}

function generateBookingId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'VRB-';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Validation helper functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // Basic phone validation - accepts numbers, spaces, dashes, parentheses
    const phoneRegex = /^[\d\s\-()+]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function isValidCardNumber(cardNumber) {
    // Basic card number validation (just numbers, 13-19 digits)
    const cleaned = cardNumber.replace(/\s/g, '');
    return /^\d{13,19}$/.test(cleaned);
}

function isValidExpiry(expiry) {
    // MM/YY format
    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!expiryRegex.test(expiry)) return false;
    
    // Check if card is expired
    const [month, year] = expiry.split('/');
    const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    return expiryDate > new Date();
}

function isValidCVV(cvv) {
    return /^\d{3,4}$/.test(cvv);
}

function showValidationErrors(errors) {
    // Remove existing error messages
    const existingErrors = document.querySelectorAll('.error-message');
    existingErrors.forEach(error => error.remove());
    
    // Create error container
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-container';
    errorContainer.style.cssText = `
        background: #f8d7da;
        color: #721c24;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
        border: 1px solid #f5c6cb;
    `;
    
    // Add error title
    const errorTitle = document.createElement('h4');
    errorTitle.textContent = 'Please fix the following errors:';
    errorTitle.style.margin = '0 0 10px 0';
    errorTitle.style.color = '#721c24';
    errorContainer.appendChild(errorTitle);
    
    // Add error list
    const errorList = document.createElement('ul');
    errorList.style.margin = '0';
    errorList.style.paddingLeft = '20px';
    
    errors.forEach(error => {
        const errorItem = document.createElement('li');
        errorItem.textContent = error;
        errorItem.style.marginBottom = '5px';
        errorList.appendChild(errorItem);
    });
    
    errorContainer.appendChild(errorList);
    
    // Insert error message at top of form
    const form = document.getElementById('booking-form');
    if (form) {
        form.insertBefore(errorContainer, form.firstChild);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (errorContainer.parentNode) {
                errorContainer.remove();
            }
        }, 10000);
    }
}

function setupEventListeners() {
    // Payment method selection
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', function() {
            document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
            this.classList.add('selected');
            
            // Show/hide payment fields
            const methodType = this.getAttribute('data-method');
            const cardFields = document.getElementById('card-payment-fields');
            const mobileFields = document.getElementById('mobile-payment-fields');
            
            if (cardFields) {
                cardFields.style.display = methodType === 'card' ? 'block' : 'none';
            }
            if (mobileFields) {
                mobileFields.style.display = methodType === 'mobile' ? 'block' : 'none';
            }
        });
    });
    
    // Add passenger button
    const addPassengerBtn = document.getElementById('add-passenger');
    if (addPassengerBtn) {
        addPassengerBtn.addEventListener('click', function() {
            const passengersContainer = document.getElementById('passengers-container');
            const passengerCount = passengersContainer.children.length + 1;
            
            // In a real app, you'd update pricing when adding passengers
            alert('Adding passengers would update pricing in a real application');
        });
    }
    
    // Form submission
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Use the new validation system
            const bookingData = collectBookingData();
            const validation = bookingData.validate();
            
            if (!validation.isValid) {
                showValidationErrors(validation.errors);
                return;
            }
            
            // If validation passes, process booking
            processBooking();
        });
    }

    // Add real-time validation
    setupRealTimeValidation();
}

function removePassenger(passengerNumber) {
    const passengerElement = document.querySelector(`[data-passenger="${passengerNumber}"]`);
    if (passengerElement) {
        passengerElement.remove();
        // In a real app, you'd update pricing here
        alert('Passenger removed. Pricing would update in a real application.');
    }
}

// Real-time validation setup (keep existing real-time validation functions)
function setupRealTimeValidation() {
    // Contact fields
    const emailField = document.getElementById('contact-email');
    const phoneField = document.getElementById('contact-phone');
    
    if (emailField) {
        emailField.addEventListener('blur', validateEmailField);
        emailField.addEventListener('input', clearEmailError);
    }
    if (phoneField) {
        phoneField.addEventListener('blur', validatePhoneField);
        phoneField.addEventListener('input', clearPhoneError);
    }
    
    // Card payment fields
    const cardFields = ['card-number', 'card-name', 'card-expiry', 'card-cvv'];
    cardFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', () => validateCardField(fieldId));
            field.addEventListener('input', () => clearFieldError(fieldId));
        }
    });
    
    // Mobile money fields
    const mobileProvider = document.getElementById('mobile-provider');
    const mobileNumber = document.getElementById('mobile-number');
    
    if (mobileProvider) {
        mobileProvider.addEventListener('change', () => validateMobileField('mobile-provider'));
    }
    if (mobileNumber) {
        mobileNumber.addEventListener('blur', () => validateMobileField('mobile-number'));
        mobileNumber.addEventListener('input', () => clearFieldError('mobile-number'));
    }
    
    // Passport fields validation
    setupPassportValidation();
}

// Real-time validation functions (keep existing ones)
function validateEmailField() {
    const email = this.value.trim();
    if (!email) {
        highlightField('contact-email');
        showFieldError('contact-email', 'Email address is required');
    } else if (!isValidEmail(email)) {
        highlightField('contact-email');
        showFieldError('contact-email', 'Please enter a valid email address');
    } else {
        unhighlightField('contact-email');
        clearFieldError('contact-email');
    }
}

function validatePhoneField() {
    const phone = this.value.trim();
    if (!phone) {
        highlightField('contact-phone');
        showFieldError('contact-phone', 'Phone number is required');
    } else if (!isValidPhone(phone)) {
        highlightField('contact-phone');
        showFieldError('contact-phone', 'Please enter a valid phone number');
    } else {
        unhighlightField('contact-phone');
        clearFieldError('contact-phone');
    }
}

function validateCardField(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    const value = field.value.trim();
    
    if (!value) {
        highlightField(fieldId);
        showFieldError(fieldId, `${getFieldLabel(fieldId)} is required`);
        return;
    }
    
    let isValid = true;
    let errorMessage = '';
    
    switch(fieldId) {
        case 'card-number':
            isValid = isValidCardNumber(value);
            errorMessage = 'Please enter a valid card number';
            break;
        case 'card-expiry':
            isValid = isValidExpiry(value);
            errorMessage = 'Please enter a valid expiry date (MM/YY)';
            break;
        case 'card-cvv':
            isValid = isValidCVV(value);
            errorMessage = 'Please enter a valid CVV (3-4 digits)';
            break;
        case 'card-name':
            isValid = value.length >= 2;
            errorMessage = 'Please enter the name on card';
            break;
    }
    
    if (!isValid) {
        highlightField(fieldId);
        showFieldError(fieldId, errorMessage);
    } else {
        unhighlightField(fieldId);
        clearFieldError(fieldId);
    }
}

function validateMobileField(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    const value = field.value.trim();
    
    if (!value) {
        highlightField(fieldId);
        showFieldError(fieldId, `${getFieldLabel(fieldId)} is required`);
    } else if (fieldId === 'mobile-number' && !isValidPhone(value)) {
        highlightField(fieldId);
        showFieldError(fieldId, 'Please enter a valid mobile number');
    } else {
        unhighlightField(fieldId);
        clearFieldError(fieldId);
    }
}

// Helper functions for real-time validation
function clearEmailError() {
    clearFieldError('contact-email');
}

function clearPhoneError() {
    clearFieldError('contact-phone');
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.remove('field-error');
    }
    
    // Remove any existing error message for this field
    const errorMessage = document.querySelector(`[data-field-error="${fieldId}"]`);
    if (errorMessage) {
        errorMessage.remove();
    }
}

function showFieldError(fieldId, message) {
    // Remove existing error for this field
    clearFieldError(fieldId);
    
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error-message';
    errorElement.setAttribute('data-field-error', fieldId);
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #dc3545;
        font-size: 12px;
        margin-top: 5px;
        display: block;
    `;
    
    // Insert after the field
    field.parentNode.appendChild(errorElement);
}

function getFieldLabel(fieldId) {
    const labels = {
        'card-number': 'Card number',
        'card-name': 'Name on card', 
        'card-expiry': 'Expiry date',
        'card-cvv': 'CVV',
        'mobile-provider': 'Mobile provider',
        'mobile-number': 'Mobile number',
        'passport': 'Passport number',
        'passportExpiry': 'Passport expiry date'
    };
    
    return labels[fieldId] || fieldId;
}

function highlightField(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.add('field-error');
        field.focus();
    }
}

function unhighlightField(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.remove('field-error');
    }
}

function setupPassportValidation() {
    // Validate passport expiry as user selects date
    document.addEventListener('change', function(e) {
        if (e.target.name && e.target.name.includes('passportExpiry')) {
            validatePassportField(e.target);
        }
    });
    
    // Also validate on blur for better UX
    document.addEventListener('blur', function(e) {
        if (e.target.name && e.target.name.includes('passportExpiry')) {
            validatePassportField(e.target);
        }
    }, true);
}

function validatePassportField(passportField) {
    const fieldId = passportField.id;
    const expiryDate = passportField.value;
    
    if (!expiryDate) {
        // If no date selected, just clear any errors
        clearFieldError(fieldId);
        return true;
    }
    
    const validation = isValidPassportExpiry(expiryDate);
    
    if (!validation.isValid) {
        highlightField(fieldId);
        showFieldError(fieldId, validation.message);
        return false;
    } else {
        unhighlightField(fieldId);
        clearFieldError(fieldId);
        return true;
    }
}

function isValidPassportExpiry(expiryDate) {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(today.getMonth() + 6);
    
    // Reset times to compare dates only
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);
    sixMonthsFromNow.setHours(0, 0, 0, 0);
    
    if (expiry < today) {
        return {
            isValid: false,
            message: 'Passport has expired. Please check the expiry date.'
        };
    }
    
    if (expiry <= sixMonthsFromNow) {
        return {
            isValid: false,
            message: 'Passport expires within 6 months. Many countries require 6 months validity.'
        };
    }
    
    return {
        isValid: true,
        message: 'Passport validity OK'
    };
}