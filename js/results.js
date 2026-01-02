// Enhanced Flight results functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get search parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const from = urlParams.get('from') || 'Accra, Ghana (ACC)';
    const to = urlParams.get('to') || 'London, UK (LHR)';
    const departure = urlParams.get('departure') || getDefaultDate();
    const passengers = urlParams.get('passengers') || '1';
    const tripType = urlParams.get('tripType') || 'one-way';
    const flightClass = urlParams.get('class') || 'Economy';

    // Display search parameters
    displaySearchParams(from, to, departure, passengers, tripType, flightClass);
    
    // Generate and display flight results
    generateEnhancedFlightResults(from, to, departure, flightClass, tripType, passengers);
    
    // Setup filters and sorting
    setupFilters();
    setupSorting();
    
    // ADD THIS LINE:
    addMobileQuickFilters();
});

function displaySearchParams(from, to, departure, passengers, tripType, flightClass) {
    const searchParamsDiv = document.getElementById('search-params');
    searchParamsDiv.innerHTML = `
        <h3>${from} → ${to}</h3>
        <p>
            <strong>Departure:</strong> ${departure} | 
            <strong>Passengers:</strong> ${passengers} | 
            <strong>Class:</strong> ${flightClass} | 
            <strong>Trip:</strong> ${tripType.charAt(0).toUpperCase() + tripType.slice(1).replace('-', ' ')}
        </p>
    `;
}

// Mobile results enhancements - ADD THIS FUNCTION
function addMobileQuickFilters() {
    if (window.innerWidth <= 768) {
        const quickFilters = document.createElement('div');
        quickFilters.className = 'mobile-quick-filters';
        quickFilters.innerHTML = `
            <button class="quick-filter active" onclick="filterFlightsBy('all')">All</button>
            <button class="quick-filter" onclick="filterFlightsBy('nonstop')">Non-stop</button>
            <button class="quick-filter" onclick="filterFlightsBy('cheapest')">Cheapest</button>
            <button class="quick-filter" onclick="filterFlightsBy('morning')">Morning</button>
        `;
        
        const resultsContainer = document.getElementById('flight-results-container');
        if (resultsContainer) {
            resultsContainer.parentNode.insertBefore(quickFilters, resultsContainer);
        }
    }
}

function filterFlightsBy(type) {
    const flightCards = document.querySelectorAll('.flight-card');
    const quickFilters = document.querySelectorAll('.quick-filter');
    
    quickFilters.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    flightCards.forEach(card => {
        card.style.display = 'block';
        
        if (type === 'nonstop') {
            const stops = card.getAttribute('data-stops');
            if (!stops.includes('non-stop')) card.style.display = 'none';
        } else if (type === 'cheapest') {
            const price = parseInt(card.getAttribute('data-price'));
            if (price > 1500) card.style.display = 'none';
        } else if (type === 'morning') {
            const departure = card.getAttribute('data-departure');
            const hour = parseInt(departure.split(':')[0]);
            if (hour < 6 || hour > 11) card.style.display = 'none';
        }
    });
}

function generateEnhancedFlightResults(from, to, departure, flightClass, tripType, passengers) {
    const resultsContainer = document.getElementById('flight-results-container');
    const resultsCount = document.getElementById('results-count');
    
    // Enhanced flight data with more airlines and real logos
    const flights = [
        {
            id: 1,
            airline: 'Emirates',
            airlineCode: 'EK',
            flightNumber: 'EK 789',
            departureTime: '08:15',
            arrivalTime: '18:45',
            duration: '6h 30m',
            stops: 'non-stop',
            basePrice: 2125,
            aircraft: 'Boeing 777',
            features: ['Meal', 'Entertainment', 'WiFi', 'Lounge'],
            rating: 4.7,
            reviews: 1247,
            baggage: '30kg',
            logo: 'https://images.kiwi.com/airlines/64/EK.png'
        },
        {
            id: 2,
            airline: 'British Airways',
            airlineCode: 'BA',
            flightNumber: 'BA 123',
            departureTime: '11:30',
            arrivalTime: '22:15',
            duration: '6h 45m',
            stops: 'non-stop',
            basePrice: 1945,
            aircraft: 'Airbus A380',
            features: ['Meal', 'Entertainment', 'WiFi'],
            rating: 4.5,
            reviews: 892,
            baggage: '23kg',
            logo: 'https://images.kiwi.com/airlines/64/BA.png'
        },
        {
            id: 3,
            airline: 'Ethiopian Airlines',
            airlineCode: 'ET',
            flightNumber: 'ET 901',
            departureTime: '14:20',
            arrivalTime: '01:30',
            duration: '7h 10m',
            stops: '1-stop',
            basePrice: 1625,
            aircraft: 'Boeing 787',
            features: ['Meal', 'Entertainment'],
            rating: 4.3,
            reviews: 567,
            baggage: '30kg',
            logo: 'https://images.kiwi.com/airlines/64/ET.png'
        },
        {
            id: 4,
            airline: 'Turkish Airlines',
            airlineCode: 'TK',
            flightNumber: 'TK 567',
            departureTime: '16:45',
            arrivalTime: '04:20',
            duration: '7h 35m',
            stops: '1-stop',
            basePrice: 1490,
            aircraft: 'Airbus A330',
            features: ['Meal', 'Entertainment', 'WiFi'],
            rating: 4.6,
            reviews: 1034,
            baggage: '30kg',
            logo: 'https://images.kiwi.com/airlines/64/TK.png'
        },
        {
            id: 5,
            airline: 'KLM',
            airlineCode: 'KL',
            flightNumber: 'KL 589',
            departureTime: '20:10',
            arrivalTime: '07:55',
            duration: '7h 45m',
            stops: '1-stop',
            basePrice: 2060,
            aircraft: 'Boeing 777',
            features: ['Meal', 'Entertainment'],
            rating: 4.4,
            reviews: 789,
            baggage: '23kg',
            logo: 'https://images.kiwi.com/airlines/64/KL.png'
        },
        {
            id: 6,
            airline: 'Qatar Airways',
            airlineCode: 'QR',
            flightNumber: 'QR 145',
            departureTime: '22:30',
            arrivalTime: '09:40',
            duration: '7h 10m',
            stops: '1-stop',
            basePrice: 2335,
            aircraft: 'Airbus A350',
            features: ['Meal', 'Entertainment', 'WiFi', 'Lounge'],
            rating: 4.8,
            reviews: 1567,
            baggage: '35kg',
            logo: 'https://images.kiwi.com/airlines/64/QR.png'
        },
        {
            id: 7,
            airline: 'South African Airways',
            airlineCode: 'SA',
            flightNumber: 'SA 234',
            departureTime: '09:45',
            arrivalTime: '20:30',
            duration: '6h 45m',
            stops: 'non-stop',
            basePrice: 1725,
            aircraft: 'Airbus A340',
            features: ['Meal', 'Entertainment'],
            rating: 4.2,
            reviews: 445,
            baggage: '23kg',
            logo: 'https://images.kiwi.com/airlines/64/SA.png'
        },
        {
            id: 8,
            airline: 'Kenya Airways',
            airlineCode: 'KQ',
            flightNumber: 'KQ 509',
            departureTime: '13:15',
            arrivalTime: '23:45',
            duration: '6h 30m',
            stops: 'non-stop',
            basePrice: 1890,
            aircraft: 'Boeing 787',
            features: ['Meal', 'Entertainment'],
            rating: 4.1,
            reviews: 334,
            baggage: '30kg',
            logo: 'https://images.kiwi.com/airlines/64/KQ.png'
        },
        {
            id: 9,
            airline: 'Lufthansa',
            airlineCode: 'LH',
            flightNumber: 'LH 672',
            departureTime: '17:20',
            arrivalTime: '03:15',
            duration: '7h 55m',
            stops: '1-stop',
            basePrice: 2160,
            aircraft: 'Airbus A330',
            features: ['Meal', 'Entertainment', 'WiFi'],
            rating: 4.5,
            reviews: 1123,
            baggage: '23kg',
            logo: 'https://images.kiwi.com/airlines/64/LH.png'
        },
        {
            id: 10,
            airline: 'Air France',
            airlineCode: 'AF',
            flightNumber: 'AF 789',
            departureTime: '19:30',
            arrivalTime: '05:45',
            duration: '8h 15m',
            stops: '1-stop',
            basePrice: 1990,
            aircraft: 'Boeing 777',
            features: ['Meal', 'Entertainment'],
            rating: 4.3,
            reviews: 876,
            baggage: '23kg',
            logo: 'https://images.kiwi.com/airlines/64/AF.png'
        }
    ];

    // Adjust prices based on class, trip type, AND passengers
    const classMultipliers = {
        'Economy': 1,
        'Premium Economy': 1.5,
        'Business': 2.5,
        'First Class': 4
    };

    // For round trip, double the base price
    const tripTypeMultiplier = tripType === 'round-trip' ? 2 : 1;

    // Get passenger count and convert to number
    const passengerCount = parseInt(passengers) || 1;

    const multiplier = (classMultipliers[flightClass] || 1) * tripTypeMultiplier * passengerCount;

    // Find cheapest and recommended flights
    const adjustedFlights = flights.map(flight => ({
        ...flight,
        adjustedPrice: Math.round(flight.basePrice * multiplier),
        score: calculateFlightScore(flight, multiplier)
    }));

    const cheapestFlight = adjustedFlights.reduce((cheapest, current) => 
        current.adjustedPrice < cheapest.adjustedPrice ? current : cheapest
    );

    const recommendedFlight = adjustedFlights.reduce((best, current) => 
        current.score > best.score ? current : best
    );

    // Display results count
resultsCount.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
        <h3 style="font-size: 16px; margin: 0;">${adjustedFlights.length} flights found</h3>
        <div class="sort-options" style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 5px; flex-shrink: 0;">
            <button class="sort-btn active" data-sort="recommended">Recommended</button>
            <button class="sort-btn" data-sort="price">Price</button>
            <button class="sort-btn" data-sort="duration">Duration</button>
            <button class="sort-btn" data-sort="departure">Departure</button>
        </div>
    </div>
`;

    // Generate flight cards
    displayFlights(adjustedFlights, cheapestFlight, recommendedFlight, from, to, flightClass, tripType);
}

function calculateFlightScore(flight, multiplier) {
    // Calculate a score based on multiple factors
    let score = 0;
    
    // Price (lower is better) - 40% weight
    const maxPrice = 2500 * multiplier;
    const priceScore = (1 - (flight.basePrice * multiplier / maxPrice)) * 40;
    
    // Rating - 30% weight
    const ratingScore = (flight.rating / 5) * 30;
    
    // Duration (shorter is better) - 20% weight
    const durationHours = parseInt(flight.duration);
    const durationScore = (1 - (durationHours / 10)) * 20;
    
    // Features - 10% weight
    const featureScore = (flight.features.length / 4) * 10;
    
    score = priceScore + ratingScore + durationScore + featureScore;
    return score;
}

function displayFlights(flights, cheapestFlight, recommendedFlight, from, to, flightClass, tripType) {
    const resultsContainer = document.getElementById('flight-results-container');
    
    let flightsHTML = '';
    
    flights.forEach(flight => {
        const isCheapest = flight.id === cheapestFlight.id;
        const isRecommended = flight.id === recommendedFlight.id;
        const cardClass = isRecommended ? 'featured' : isCheapest ? 'cheapest' : '';
        
        // Determine price description based on trip type
        const priceDescription = tripType === 'round-trip' 
            ? 'Round trip' 
            : tripType === 'multi-city' 
                ? 'Multi-city' 
                : 'One way';
        
        flightsHTML += `
            <div class="flight-card ${cardClass}" data-price="${flight.adjustedPrice}" data-airline="${flight.airline.toLowerCase()}" data-stops="${flight.stops}" data-duration="${flight.duration}" data-departure="${flight.departureTime}">
                <div class="flight-header">
                    <div class="airline-info">
                        <img src="${flight.logo}" alt="${flight.airline}" class="airline-logo-img" onerror="this.src='https://via.placeholder.com/40/ff6b35/ffffff?text=${flight.airlineCode}'">
                        <div>
                            <h4>${flight.airline}</h4>
                            <div style="font-size: 12px; color: #666;">
                                ${flight.flightNumber} • ${flight.aircraft}
                                <span style="color: #ffc107; margin-left: 10px;">
                                    ⭐ ${flight.rating} (${flight.reviews})
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="flight-header-features">
                        ${isCheapest ? '<span class="badge badge-cheapest">Cheapest</span>' : ''}
                        ${isRecommended ? '<span class="badge badge-recommended">Recommended</span>' : ''}
                        ${flight.rating >= 4.5 ? '<span class="badge badge-popular">Popular</span>' : ''}
                    </div>
                </div>
                
                <div class="flight-details">
                    <div class="time-place">
                        <div class="time">${flight.departureTime}</div>
                        <div class="place">${getCityName(from)}</div>
                    </div>
                    
                    <div class="duration">
                        <div>${flight.duration}</div>
                        <div style="font-size: 12px; color: #999;">${flight.stops}</div>
                        <div style="font-size: 11px; color: #666; margin-top: 5px;">Baggage: ${flight.baggage}</div>
                    </div>
                    
                    <div class="time-place">
                        <div class="time">${flight.arrivalTime}</div>
                        <div class="place">${getCityName(to)}</div>
                    </div>
                </div>
                
                <div class="flight-actions">
                    <div class="flight-features">
                        ${flight.features.map(feature => `<span class="feature">${feature}</span>`).join('')}
                    </div>
                    
                    <div class="flight-price">
                        <div class="price">GHS ${flight.adjustedPrice.toLocaleString()}</div>
                        <div class="price-desc">${flightClass} • ${priceDescription}</div>
                    </div>
                    <button class="select-btn" onclick="selectFlight(${flight.id}, '${tripType}', this.closest('.flight-card'))">
                        Select
                    </button>
                </div>
            </div>
        `;
    });

    resultsContainer.innerHTML = flightsHTML;
}

function getCityName(cityString) {
    // Extract city name from "City, Country (CODE)" format
    if (!cityString) return '';
    return cityString.split('(')[0].trim();
}

function setupSorting() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('sort-btn')) {
            // Remove active class from all buttons
            document.querySelectorAll('.sort-btn').forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            e.target.classList.add('active');
            
            // Sort flights based on selected option
            const sortType = e.target.getAttribute('data-sort');
            sortFlights(sortType);
        }
    });
}

function sortFlights(sortType) {
    const flightCards = Array.from(document.querySelectorAll('.flight-card'));
    
    flightCards.sort((a, b) => {
        switch(sortType) {
            case 'price':
                return parseInt(a.getAttribute('data-price')) - parseInt(b.getAttribute('data-price'));
            case 'duration':
                const aDuration = parseInt(a.getAttribute('data-duration'));
                const bDuration = parseInt(b.getAttribute('data-duration'));
                return aDuration - bDuration;
            case 'departure':
                const aTime = a.getAttribute('data-departure');
                const bTime = b.getAttribute('data-departure');
                return aTime.localeCompare(bTime);
            case 'recommended':
            default:
                // Featured flights first, then by score
                const aFeatured = a.classList.contains('featured');
                const bFeatured = b.classList.contains('featured');
                if (aFeatured && !bFeatured) return -1;
                if (!aFeatured && bFeatured) return 1;
                return parseInt(a.getAttribute('data-price')) - parseInt(b.getAttribute('data-price'));
        }
    });
    
    const resultsContainer = document.getElementById('flight-results-container');
    resultsContainer.innerHTML = '';
    flightCards.forEach(card => resultsContainer.appendChild(card));
}

function setupFilters() {
    // Price range filter
    const priceSlider = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    
    if (priceSlider && priceValue) {
        priceSlider.addEventListener('input', function() {
            priceValue.textContent = `GHS ${this.value}`;
            filterFlights();
        });
    }

    // Checkbox filters
    const allCheckboxes = document.querySelectorAll('.filter-option input');
    allCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterFlights);
    });
}

function filterFlights() {
    const priceRange = parseInt(document.getElementById('priceRange').value);
    const flightCards = document.querySelectorAll('.flight-card');
    
    flightCards.forEach(card => {
        const flightPrice = parseInt(card.getAttribute('data-price'));
        const airline = card.getAttribute('data-airline');
        const stops = card.getAttribute('data-stops');
        
        // Check airline filter
        const airlineCheckbox = document.getElementById(airline);
        const airlineVisible = !airlineCheckbox || airlineCheckbox.checked;
        
        // Check stops filter
        let stopsVisible = false;
        const nonstopCheckbox = document.getElementById('nonstop');
        const onestopCheckbox = document.getElementById('onestop');
        const twostopsCheckbox = document.getElementById('twostops');
        
        if (nonstopCheckbox && nonstopCheckbox.checked && stops.includes('non-stop')) stopsVisible = true;
        if (onestopCheckbox && onestopCheckbox.checked && stops.includes('1-stop')) stopsVisible = true;
        if (twostopsCheckbox && twostopsCheckbox.checked && stops.includes('2-stop')) stopsVisible = true;
        
        // Show/hide based on filters
        if (flightPrice <= priceRange && airlineVisible && stopsVisible) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    // Update results count
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
        resultsCount.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                <h3 style="font-size: 16px; margin: 0;">${visibleFlights} flights found</h3>
                <div class="sort-options" style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 5px; flex-shrink: 0;">
                    <button class="sort-btn active" data-sort="recommended">Recommended</button>
                    <button class="sort-btn" data-sort="price">Price</button>
                    <button class="sort-btn" data-sort="duration">Duration</button>
                    <button class="sort-btn" data-sort="departure">Departure</button>
                </div>
            </div>
        `;
    }
}

function selectFlight(flightId, tripType, flightElement) {
    // Get search parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const from = urlParams.get('from');
    const to = urlParams.get('to');
    const passengers = urlParams.get('passengers') || '1';
    const flightClass = urlParams.get('class') || 'Economy';
    
    // Extract ALL flight details from the card/data
    const flightData = {
        id: flightId,
        airline: flightElement.querySelector('.airline-info h4').textContent,
        flightNumber: flightElement.querySelector('.airline-info div').textContent.split('•')[0].trim(),
        departureTime: flightElement.querySelectorAll('.time-place .time')[0].textContent,
        arrivalTime: flightElement.querySelectorAll('.time-place .time')[1].textContent,
        duration: flightElement.querySelector('.duration div').textContent,
        stops: flightElement.querySelector('.duration div:nth-child(2)').textContent,
        price: flightElement.getAttribute('data-price'),
        aircraft: flightElement.querySelector('.airline-info div').textContent.split('•')[1].trim(),
        baggage: flightElement.querySelector('.duration div:nth-child(3)').textContent.replace('Baggage: ', '')
    };

    // Build URL parameters - pass ALL flight data
    const params = new URLSearchParams({
        // Search parameters
        from: from,
        to: to,
        passengers: passengers,
        class: flightClass,
        tripType: tripType,
        
        // Flight details
        flightId: flightId,
        airline: flightData.airline,
        flightNumber: flightData.flightNumber,
        departureTime: flightData.departureTime,
        arrivalTime: flightData.arrivalTime,
        duration: flightData.duration,
        stops: flightData.stops,
        price: flightData.price,
        aircraft: flightData.aircraft,
        baggage: flightData.baggage
    });

    window.location.href = `booking.html?${params.toString()}`;
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

// Add this function to results.js
function setupMobileFilters() {
    const filterBtn = document.createElement('button');
    filterBtn.className = 'mobile-filter-btn';
    filterBtn.innerHTML = '<i class="fas fa-filter"></i> Filters';
    filterBtn.style.cssText = `
        display: none;
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #ff6b35;
        color: white;
        border: none;
        border-radius: 50px;
        padding: 12px 24px;
        font-weight: 600;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
        cursor: pointer;
    `;
    
    document.body.appendChild(filterBtn);
    
    // Show/hide based on screen size
    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            filterBtn.style.display = 'block';
            document.querySelector('.filters-sidebar').style.display = 'none';
        } else {
            filterBtn.style.display = 'none';
            document.querySelector('.filters-sidebar').style.display = 'block';
        }
    }
    
    // Toggle filters on mobile
    filterBtn.addEventListener('click', function() {
        const filters = document.querySelector('.filters-sidebar');
        filters.style.display = filters.style.display === 'none' ? 'block' : 'none';
        
        if (filters.style.display === 'block') {
            filters.scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
}

// Add this function to results.js
function setupMobileFilters() {
    // Create mobile filter button
    const filterBtn = document.createElement('button');
    filterBtn.className = 'mobile-filter-btn';
    filterBtn.innerHTML = '<i class="fas fa-filter"></i> Filters';
    document.body.appendChild(filterBtn);
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'filter-overlay';
    document.body.appendChild(overlay);
    
    // Get filters sidebar
    const filters = document.querySelector('.filters-sidebar');
    
    // Toggle filters
    filterBtn.addEventListener('click', () => {
        filters.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close filters
    overlay.addEventListener('click', () => {
        filters.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close filters on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            filters.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Hide sidebar on desktop
    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            filters.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            filterBtn.style.display = 'flex';
            filters.style.display = 'block';
        } else {
            filterBtn.style.display = 'none';
            overlay.style.display = 'none';
        }
    }
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
}

// Call this in your DOMContentLoaded function
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    setupMobileFilters();
});

