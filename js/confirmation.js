// Confirmation page functionality - Refactored for API readiness
document.addEventListener('DOMContentLoaded', function() {
    initializeConfirmationApp();
});

// Service layer for confirmation page
const ConfirmationService = {
    async fetchBookingDetails(bookingId) {
        // This will be replaced with actual API call
        return new Promise((resolve) => {
            setTimeout(() => {
                // In real implementation:
                // return fetch(`/api/bookings/${bookingId}`);
                
                const storedData = localStorage.getItem('verick_booking_data');
                if (storedData) {
                    resolve(JSON.parse(storedData));
                } else {
                    resolve(generateDemoBookingData(bookingId));
                }
            }, 500);
        });
    },
    
    async generateETicket(bookingId) {
        // Future API integration for e-ticket generation
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    ticketUrl: `/api/tickets/${bookingId}/download`,
                    qrCode: `VRB-${bookingId}`
                });
            }, 1000);
        });
    },
    
    async sendConfirmationEmail(bookingData) {
        // Future API integration for email service
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Email sent to:', bookingData.contact.email);
                resolve({ success: true });
            }, 800);
        });
    }
};

// Main initialization function
async function initializeConfirmationApp() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const bookingId = urlParams.get('bookingId');
        
        if (!bookingId) {
            throw new Error('No booking ID provided');
        }
        
        // Fetch booking details
        const bookingData = await ConfirmationService.fetchBookingDetails(bookingId);
        
        // Populate confirmation page
        populateConfirmationPage(bookingData);
        
        // Send confirmation email
        await ConfirmationService.sendConfirmationEmail(bookingData);
        
        // Setup event listeners
        setupConfirmationEvents(bookingData);
        
    } catch (error) {
        console.error('Error initializing confirmation app:', error);
        showErrorToUser('Failed to load booking confirmation. Please contact support.');
    }
}

// Data formatting utilities
/*const Formatter = {
    formatCurrency(amount, currency = 'GHS') {
        return `${currency} ${amount.toLocaleString()}`;
    },
    
    formatDate(dateString, options = {}) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const defaultOptions = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
    },
    
    formatTime(timeString) {
        if (!timeString) return 'N/A';
        // Simple time formatting - in real app, use proper time parsing
        return timeString;
    },
    
    getNationalityName(code) {
        const nationalities = {
            'gh': 'Ghanaian', 'ng': 'Nigerian', 'us': 'American',
            'uk': 'British', 'fr': 'French', 'de': 'German'
        };
        return nationalities[code] || code;
    },
    
    formatGender(gender) {
        const genders = { 'male': 'Male', 'female': 'Female', 'other': 'Other' };
        return genders[gender] || gender;
    },
    
    maskCardNumber(lastFour) {
        return `•••• ${lastFour}`;
    },
    
    formatPaymentMethod(payment) {
        if (payment.method === 'card') {
            return `Credit Card ${this.maskCardNumber(payment.cardLastFour)}`;
        } else if (payment.method === 'mobile') {
            return `Mobile Money (${payment.mobileProvider})`;
        }
        return 'Unknown';
    }
};*/


// ... existing code remains the same until populateConfirmationPage function ...

async function populateConfirmationPage(bookingData) {
    console.log('Populating confirmation with:', bookingData);
    
    // Set booking reference
    document.getElementById('booking-reference').textContent = bookingData.bookingId;
    
    // Flight details
    document.getElementById('departure-city').textContent = bookingData.flight.from;
    document.getElementById('arrival-city').textContent = bookingData.flight.to;
    document.getElementById('departure-date').textContent = 
        `${Formatter.formatDate(bookingData.flight.departureDate)} • ${Formatter.formatTime(bookingData.flight.departureTime)}`;
    document.getElementById('arrival-time').textContent = Formatter.formatTime(bookingData.flight.arrivalTime);
    document.getElementById('flight-duration').textContent = bookingData.flight.duration;
    document.getElementById('trip-type').textContent = 
        bookingData.flight.tripType === 'round-trip' ? 'Round Trip' : 'One Way';
    document.getElementById('airline-info').textContent = 
        `${bookingData.flight.airline} • ${bookingData.flight.flightNumber}`;
    document.getElementById('aircraft-info').textContent = 
        `${bookingData.flight.aircraft} • ${bookingData.flight.class} • ${bookingData.flight.baggage}`;
    
    // Passengers
    renderPassengersList(bookingData.passengers);
    
    // Contact information
    document.getElementById('contact-email').textContent = bookingData.contact.email;
    document.getElementById('contact-phone').textContent = bookingData.contact.phone;
    document.getElementById('sent-email').textContent = bookingData.contact.email;
    
    // Payment information - Enhanced with transaction details
    renderPaymentInformation(bookingData);
}


// ... existing code remains the same until renderPaymentInformation function ...

function renderPaymentInformation(bookingData) {
    console.log('Payment data for confirmation:', bookingData.payment);
    
    // Ensure we have the correct total amount
    const totalAmount = bookingData.payment.total || bookingData.totalAmount || 0;
    document.getElementById('total-paid').textContent = Formatter.formatCurrency(totalAmount);
    
    let paymentMethodText = '';
    let transactionDetails = '';
    
    // Use the actual payment data from booking
    if (bookingData.payment.method === 'card') {
        const cardType = getCardType(bookingData.payment.cardNumber);
        const cardLastFour = bookingData.payment.cardLastFour || 
                           (bookingData.payment.cardNumber ? bookingData.payment.cardNumber.slice(-4) : '****');
        paymentMethodText = `${cardType} ${Formatter.maskCardNumber(cardLastFour)}`;
        transactionDetails = `Transaction ID: ${bookingData.payment.transactionId || generateTransactionId()}`;
    } else if (bookingData.payment.method === 'mobile') {
        const providerNames = {
            'mtn': 'MTN Mobile Money',
            'vodafone': 'Vodafone Cash', 
            'airteltigo': 'AirtelTigo Money'
        };
        const provider = bookingData.payment.mobileProvider || bookingData.payment.provider;
        paymentMethodText = `Mobile Money (${providerNames[provider] || provider})`;
        transactionDetails = `Transaction ID: ${bookingData.payment.transactionId || generateTransactionId('MM_')}`;
        
        // Show mobile number if available
        if (bookingData.payment.mobileNumber) {
            transactionDetails += ` • Number: ${bookingData.payment.mobileNumber}`;
        }
    } else {
        paymentMethodText = 'Payment Method';
        transactionDetails = 'Transaction details not available';
    }
    
    document.getElementById('payment-method').textContent = paymentMethodText;
    document.getElementById('payment-date').textContent = 
        bookingData.payment.paymentDate || 
        new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    
    // Add transaction details to payment section
    const paymentSection = document.querySelector('.booking-summary');
    if (paymentSection) {
        const existingTransaction = paymentSection.querySelector('.transaction-details');
        if (existingTransaction) {
            existingTransaction.remove();
        }
        
        const transactionDiv = document.createElement('div');
        transactionDiv.className = 'transaction-details';
        transactionDiv.style.cssText = `
            background: #e8f5e8;
            border: 1px solid #4caf50;
            border-radius: 6px;
            padding: 12px;
            margin-top: 10px;
            font-size: 12px;
            color: #2e7d32;
        `;
        transactionDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
                <i class="fas fa-check-circle" style="color: #4caf50;"></i>
                <strong>Payment Successful</strong>
            </div>
            <div>${transactionDetails}</div>
            <div>Status: <strong style="color: #4caf50;">Completed</strong></div>
            <div>Amount: <strong>${Formatter.formatCurrency(totalAmount)}</strong></div>
        `;
        
        const paymentInfo = paymentSection.querySelector('#payment-method').closest('div');
        if (paymentInfo) {
            paymentInfo.appendChild(transactionDiv);
        }
    }
}

function generateTransactionId(prefix = 'TXN_') {
    return prefix + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Update the Formatter to handle currency better
const Formatter = {
    formatCurrency(amount, currency = 'GHS') {
        if (typeof amount !== 'number') {
            amount = parseFloat(amount) || 0;
        }
        return `${currency} ${amount.toLocaleString()}`;
    },
    
    formatDate(dateString, options = {}) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const defaultOptions = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
    },
    
    formatTime(timeString) {
        if (!timeString) return 'N/A';
        return timeString;
    },
    
    getNationalityName(code) {
        const nationalities = {
            'gh': 'Ghanaian', 'ng': 'Nigerian', 'us': 'American',
            'uk': 'British', 'fr': 'French', 'de': 'German'
        };
        return nationalities[code] || code;
    },
    
    formatGender(gender) {
        const genders = { 'male': 'Male', 'female': 'Female', 'other': 'Other' };
        return genders[gender] || gender;
    },
    
    maskCardNumber(lastFour) {
        return `•••• ${lastFour}`;
    }
};

// Enhanced loadBookingData to handle data structure properly
function loadBookingData() {
    // Try to get from localStorage first (from booking form)
    const storedBooking = localStorage.getItem('verick_booking_data');
    
    if (storedBooking) {
        try {
            const bookingData = JSON.parse(storedBooking);
            console.log('Loaded booking data from storage:', bookingData);
            
            // Ensure payment data structure is correct
            if (bookingData.payment && !bookingData.payment.total && bookingData.totalAmount) {
                bookingData.payment.total = bookingData.totalAmount;
            }
            
            return bookingData;
        } catch (error) {
            console.error('Error parsing stored booking data:', error);
        }
    }
    
    // Fallback: Generate demo data if no stored data
    return generateDemoBookingData();
}

function generateDemoBookingData() {
    const bookingId = generateBookingId();
    return {
        bookingId: bookingId,
        flight: {
            from: 'Accra, Ghana (ACC)',
            to: 'London, UK (LHR)',
            departureDate: 'Fri, Jun 15, 2024',
            departureTime: '08:30',
            arrivalTime: '19:45',
            duration: '7h 15m',
            airline: 'British Airways',
            flightNumber: 'BA 114',
            aircraft: 'Boeing 777',
            class: 'Economy',
            tripType: 'one-way',
            baggage: '2 x 23kg',
            stops: 'Non-stop'
        },
        passengers: [
            {
                title: 'Mr',
                firstName: 'Kwame',
                lastName: 'Asante',
                dob: '1985-03-15',
                gender: 'male',
                nationality: 'gh',
                passportNumber: 'G12345678',
                passportExpiry: '2028-12-31'
            }
        ],
        contact: {
            email: 'customer@example.com',
            phone: '+233 55 123 4567'
        },
        payment: {
            total: 2450,
            method: 'card',
            cardNumber: '4111111111111111',
            cardLastFour: '1111',
            cardName: 'Kwame Asante',
            transactionId: 'TXN_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            status: 'completed',
            paymentDate: new Date().toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        },
        totalAmount: 2450,
        timestamp: new Date().toISOString()
    };
}

// ... rest of the existing code remains the same ...


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

function renderPassengersList(passengers) {
    const passengersList = document.getElementById('passengers-list');
    passengersList.innerHTML = '';
    
    passengers.forEach((passenger, index) => {
        const passengerCard = document.createElement('div');
        passengerCard.className = 'passenger-card';
        passengerCard.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div>
                    <strong>${passenger.title} ${passenger.firstName} ${passenger.lastName}</strong>
                    <div style="font-size: 14px; color: #666; margin-top: 5px;">
                        ${Formatter.getNationalityName(passenger.nationality)} • 
                        ${Formatter.formatDate(passenger.dob)} • 
                        ${Formatter.formatGender(passenger.gender)}
                    </div>
                    ${passenger.passportNumber ? 
                        `<div style="font-size: 12px; color: #666; margin-top: 3px;">
                            Passport: ${passenger.passportNumber} • 
                            Exp: ${Formatter.formatDate(passenger.passportExpiry)}
                        </div>` : ''
                    }
                </div>
                <div style="background: #ff6b35; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                    Seat ${String.fromCharCode(65 + (index % 6))}${Math.floor(index / 6) + 1}
                </div>
            </div>
        `;
        passengersList.appendChild(passengerCard);
    });
}

async function downloadETicket() {
    const btn = event.target.closest('.btn') || event.target;
    const originalHTML = btn.innerHTML;
    
    try {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        btn.disabled = true;
        
        const urlParams = new URLSearchParams(window.location.search);
        const bookingId = urlParams.get('bookingId');
        
        const ticketResult = await ConfirmationService.generateETicket(bookingId);
        
        if (ticketResult.success) {
            // In real app, this would download the actual file
            // window.location.href = ticketResult.ticketUrl;
            
            showDownloadSuccess();
            console.log('E-Ticket generated:', ticketResult);
        } else {
            throw new Error('Failed to generate e-ticket');
        }
        
    } catch (error) {
        console.error('E-ticket download error:', error);
        showErrorToUser('Failed to download e-ticket. Please try again.');
    } finally {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
    }
}

function setupConfirmationEvents(bookingData) {
    // Additional event listeners can be added here
}

function showErrorToUser(message) {
    // Implement user-friendly error display
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background: #f8d7da;
        color: #721c24;
        padding: 15px;
        border-radius: 8px;
        margin: 20px 0;
        border: 1px solid #f5c6cb;
    `;
    errorDiv.textContent = message;
    
    const container = document.querySelector('.confirmation-container');
    container.insertBefore(errorDiv, container.firstChild);
    
    setTimeout(() => errorDiv.remove(), 5000);
}

// Keep existing helper functions like showDownloadSuccess, printConfirmation, etc.
// ... (rest of existing confirmation.js utilities)