// Main functionality for Verick Bookings
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initTripOptions();
    initUserDropdown();
    initPassengerInput();
    initCarousel(); // Keeping this but it won't break anything since carousel elements are gone
    initOfferButtons();
    initNewsletter();
    initFlightSearch();
    initExploreButtons(); // NEW: Added explore buttons functionality
});

// Trip Type Functionality
function initTripOptions() {
    const tripOptions = document.querySelectorAll('.trip-option');
    const returnGroup = document.getElementById('return-group');
    
    function handleTripTypeChange(tripType) {
        if (tripType === 'one-way') {
            returnGroup.style.display = 'none';
        } else {
            returnGroup.style.display = 'block';
        }
    }
    
    const activeTripType = document.querySelector('.trip-option.active').getAttribute('data-type');
    handleTripTypeChange(activeTripType);
    
    tripOptions.forEach(option => {
        option.addEventListener('click', function() {
            tripOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            const tripType = this.getAttribute('data-type');
            handleTripTypeChange(tripType);
        });
    });
}

// User Dropdown Functionality
function initUserDropdown() {
    const userDropdown = document.querySelector('.user-dropdown');
    if (userDropdown) {
        const dropdownBtn = userDropdown.querySelector('.user-dropdown-btn');
        const dropdownContent = userDropdown.querySelector('.user-dropdown-content');
        
        dropdownBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownContent.classList.toggle('show');
        });
        
        document.addEventListener('click', function() {
            dropdownContent.classList.remove('show');
        });
        
        checkLoginStatus();
    }
}

function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userDropdown = document.querySelector('.user-dropdown');
    
    if (isLoggedIn === 'true' && userDropdown) {
        userDropdown.classList.add('user-logged-in');
        const userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const userName = userData.firstName || userData.email || 'My Account';
        const dropdownBtn = userDropdown.querySelector('.user-dropdown-btn');
        dropdownBtn.innerHTML = `<i class="fas fa-user"></i> ${userName} <i class="fas fa-chevron-down"></i>`;
        
        const logoutLink = userDropdown.querySelector('.logout-link');
        if (logoutLink) {
            logoutLink.addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('currentUser');
                window.location.reload();
            });
        }
    }
}

// Passenger Dropdown Functionality
function initPassengerInput() {
    const passengerSelector = document.querySelector('.passenger-selector');
    const passengerTrigger = document.getElementById('passengerTrigger');
    const passengerDropdown = document.getElementById('passengerDropdown');
    const passengerText = document.querySelector('.passenger-text');
    const passengerInput = document.getElementById('passengers');
    
    if (!passengerTrigger) return;
    
    // Toggle dropdown
    passengerTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        passengerSelector.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!passengerSelector.contains(e.target)) {
            passengerSelector.classList.remove('active');
        }
    });
    
    // Counter functionality
    document.querySelectorAll('.counter-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const type = button.dataset.type;
            const action = button.dataset.action;
            const countElement = document.querySelector(`.count[data-type="${type}"]`);
            let count = parseInt(countElement.textContent);
            
            if (action === 'increase') {
                count++;
            } else if (action === 'decrease' && count > 0) {
                count--;
            }
            
            countElement.textContent = count;
            updatePassengerDisplay();
        });
    });
    
    // Close dropdown when Done is clicked
    document.querySelector('.done-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        passengerSelector.classList.remove('active');
    });
    
    function updatePassengerDisplay() {
        const adults = parseInt(document.querySelector('.count[data-type="adult"]').textContent);
        const children = parseInt(document.querySelector('.count[data-type="child"]').textContent);
        const total = adults + children;
        
        // Update display text
        passengerText.textContent = `${total} Passenger${total !== 1 ? 's' : ''}`;
        
        // Update hidden input value for form submission
        passengerInput.value = total;
    }
}

// Carousel functionality (keeping this but it won't break anything)
function initCarousel() {
    const carouselTrack = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const indicators = document.querySelectorAll('.indicator');
    const cards = document.querySelectorAll('.destination-card');
    
    // If carousel elements don't exist (we're using grid now), just return
    if (!carouselTrack || cards.length === 0) {
        return;
    }
    
    // Rest of original carousel code would be here...
    console.log('Carousel initialized (but not used in grid layout)');
}

// Explore Buttons Functionality with custom scroll speed
function initExploreButtons() {
    document.querySelectorAll('.explore-btn').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.destination-card');
            const destination = card.querySelector('h3').textContent;
            const country = card.querySelector('.destination-country').textContent;
            
            // Set the destination in the "To" field
            const toInput = document.getElementById('to');
            if (toInput) {
                toInput.value = `${destination}, ${country}`;
                
                // Custom smooth scroll with controlled speed
                const searchForm = document.querySelector('.search-container');
                if (searchForm) {
                    const targetPosition = searchForm.getBoundingClientRect().top + window.pageYOffset;
                    const startPosition = window.pageYOffset;
                    const distance = targetPosition - startPosition;
                    const duration = 1000; // 1 second - adjust this to make it faster/slower
                    let startTime = null;
                    
                    function animation(currentTime) {
                        if (startTime === null) startTime = currentTime;
                        const timeElapsed = currentTime - startTime;
                        const run = ease(timeElapsed, startPosition, distance, duration);
                        window.scrollTo(0, run);
                        if (timeElapsed < duration) {
                            requestAnimationFrame(animation);
                        }
                    }
                    
                    // Easing function for smooth animation
                    function ease(t, b, c, d) {
                        t /= d / 2;
                        if (t < 1) return c / 2 * t * t + b;
                        t--;
                        return -c / 2 * (t * (t - 2) - 1) + b;
                    }
                    
                    requestAnimationFrame(animation);
                    
                    // Add a slight highlight effect to the "To" field
                    toInput.focus();
                    toInput.style.backgroundColor = '#fff9e6';
                    toInput.style.borderColor = '#ff6b35';
                    toInput.style.transition = 'all 0.3s ease';
                    
                    // Remove highlight after 2 seconds
                    setTimeout(() => {
                        toInput.style.backgroundColor = '';
                        toInput.style.borderColor = '';
                    }, 2000);
                }
            }
        });
    });
}

// Offer Buttons
function initOfferButtons() {
    document.querySelectorAll('.offer-btn').forEach(button => {
        button.addEventListener('click', function() {
            const offerCard = this.closest('.offer-card');
            const destination = offerCard.querySelector('h3').textContent;
            const price = offerCard.querySelector('.price-new').textContent;
            alert(`Booking ${destination} for ${price}\nThis would redirect to booking page in a real application.`);
        });
    });
}

// Newsletter
function initNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('.newsletter-input').value;
            if (email) {
                alert(`Thank you for subscribing with ${email}! You'll receive our latest deals soon.`);
                this.querySelector('.newsletter-input').value = '';
            } else {
                alert('Please enter your email address.');
            }
        });
    }
}

// Flight Search Form
function initFlightSearch() {
    const flightSearchForm = document.getElementById('flight-search-form');
    if (flightSearchForm) {
        flightSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const from = document.getElementById('from').value;
            const to = document.getElementById('to').value;
            const departure = document.getElementById('departure').value;
            const passengers = document.getElementById('passengers').value;
            const flightClass = document.getElementById('class').value;
            const tripType = document.querySelector('.trip-option.active').getAttribute('data-type');
            
            if (!from || !to || !departure || !passengers) {
                alert('Please fill in all required fields.');
                return;
            }
            
            const params = new URLSearchParams({
                from: from,
                to: to,
                departure: departure,
                passengers: passengers,
                class: flightClass,
                tripType: tripType
            });
            
            window.location.href = `results.html?${params.toString()}`;
        });
    }
}