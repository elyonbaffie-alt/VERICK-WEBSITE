// City data for autocomplete
// City data for autocomplete
const cities = [
    // Ghanaian Cities
    "Accra, Ghana (ACC)",
    "Kumasi, Ghana (KMS)",
    "Takoradi, Ghana (TKD)",
    "Tamale, Ghana (TML)",
    "Cape Coast, Ghana",
    "Sunyani, Ghana",
    "Ho, Ghana",
    "Wa, Ghana",
    "Bolgatanga, Ghana",
    
    // West African Cities
    "Abidjan, Ivory Coast (ABJ)",
    "Lagos, Nigeria (LOS)",
    "Abuja, Nigeria (ABV)",
    "Port Harcourt, Nigeria (PHC)",
    "Kano, Nigeria (KAN)",
    "Dakar, Senegal (DKR)",
    "Bamako, Mali (BKO)",
    "Ouagadougou, Burkina Faso (OUA)",
    "Lomé, Togo (LFW)",
    "Cotonou, Benin (COO)",
    
    // African Cities
    "Johannesburg, South Africa (JNB)",
    "Cape Town, South Africa (CPT)",
    "Durban, South Africa (DUR)",
    "Nairobi, Kenya (NBO)",
    "Mombasa, Kenya (MBA)",
    "Addis Ababa, Ethiopia (ADD)",
    "Dar es Salaam, Tanzania (DAR)",
    "Kigali, Rwanda (KGL)",
    "Kampala, Uganda (EBB)",
    "Cairo, Egypt (CAI)",
    "Casablanca, Morocco (CMN)",
    "Marrakech, Morocco (RAK)",
    
    // European Cities
    "London, UK (LHR)",
    "London, UK (LGW)",
    "Manchester, UK (MAN)",
    "Paris, France (CDG)",
    "Paris, France (ORY)",
    "Amsterdam, Netherlands (AMS)",
    "Frankfurt, Germany (FRA)",
    "Rome, Italy (FCO)",
    "Madrid, Spain (MAD)",
    "Barcelona, Spain (BCN)",
    "Istanbul, Turkey (IST)",
    "Lisbon, Portugal (LIS)",
    "Brussels, Belgium (BRU)",
    
    // North American Cities
    "New York, USA (JFK)",
    "New York, USA (LGA)",
    "Los Angeles, USA (LAX)",
    "Chicago, USA (ORD)",
    "Toronto, Canada (YYZ)",
    "Montreal, Canada (YUL)",
    "Washington DC, USA (IAD)",
    "Miami, USA (MIA)",
    "Atlanta, USA (ATL)",
    
    // Middle Eastern & Asian Cities
    "Dubai, UAE (DXB)",
    "Abu Dhabi, UAE (AUH)",
    "Doha, Qatar (DOH)",
    "Riyadh, Saudi Arabia (RUH)",
    "Tokyo, Japan (NRT)",
    "Tokyo, Japan (HND)",
    "Singapore, Singapore (SIN)",
    "Hong Kong, Hong Kong (HKG)",
    "Bangkok, Thailand (BKK)",
    "Seoul, South Korea (ICN)",
    "Beijing, China (PEK)",
    "Shanghai, China (PVG)",
    "Mumbai, India (BOM)",
    "Delhi, India (DEL)",
    
    // Australian Cities
    "Sydney, Australia (SYD)",
    "Melbourne, Australia (MEL)",
    "Perth, Australia (PER)"
];

// Initialize autocomplete when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize autocomplete for From field
    initAutocomplete('from', 'from-autocomplete');
    
    // Initialize autocomplete for To field
    initAutocomplete('to', 'to-autocomplete');
});

// Autocomplete functionality
function initAutocomplete(inputId, autocompleteId) {
    const input = document.getElementById(inputId);
    const autocomplete = document.getElementById(autocompleteId);
    
    input.addEventListener('input', function() {
        const val = this.value.trim();
        closeAllAutocompleteLists();
        
        if (!val) {
            autocomplete.style.display = 'none';
            return;
        }
        
        // Filter cities that match the input (case insensitive)
        const filteredCities = cities.filter(city => 
            city.toLowerCase().includes(val.toLowerCase())
        );
        
        if (filteredCities.length > 0) {
            autocomplete.style.display = 'block';
            autocomplete.innerHTML = '';
            
            // Show up to 8 suggestions
            const suggestions = filteredCities.slice(0, 8);
            
            suggestions.forEach(city => {
                const item = document.createElement('div');
                const matchIndex = city.toLowerCase().indexOf(val.toLowerCase());
                
                if (matchIndex !== -1) {
                    const beforeMatch = city.substring(0, matchIndex);
                    const match = city.substring(matchIndex, matchIndex + val.length);
                    const afterMatch = city.substring(matchIndex + val.length);
                    
                    item.innerHTML = `${beforeMatch}<strong>${match}</strong>${afterMatch}`;
                } else {
                    item.textContent = city;
                }
                
                item.addEventListener('click', function() {
                    input.value = city;
                    closeAllAutocompleteLists();
                });
                
                item.addEventListener('mouseenter', function() {
                    // Remove active class from all items
                    const allItems = autocomplete.querySelectorAll('div');
                    allItems.forEach(item => item.classList.remove('autocomplete-active'));
                    // Add active class to current item
                    this.classList.add('autocomplete-active');
                });
                
                autocomplete.appendChild(item);
            });
        } else {
            autocomplete.style.display = 'none';
        }
    });
    
    // Keyboard navigation
    input.addEventListener('keydown', function(e) {
        const autocomplete = document.getElementById(autocompleteId);
        const items = autocomplete.querySelectorAll('div');
        let activeItem = autocomplete.querySelector('.autocomplete-active');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (!activeItem) {
                // First item
                items[0]?.classList.add('autocomplete-active');
            } else {
                activeItem.classList.remove('autocomplete-active');
                const nextItem = activeItem.nextElementSibling || items[0];
                nextItem.classList.add('autocomplete-active');
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (activeItem) {
                activeItem.classList.remove('autocomplete-active');
                const prevItem = activeItem.previousElementSibling || items[items.length - 1];
                prevItem.classList.add('autocomplete-active');
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeItem) {
                input.value = activeItem.textContent;
                closeAllAutocompleteLists();
            }
        } else if (e.key === 'Escape') {
            closeAllAutocompleteLists();
        }
    });
    
    // Close autocomplete when clicking elsewhere
    document.addEventListener('click', function(e) {
        if (e.target !== input && !autocomplete.contains(e.target)) {
            closeAllAutocompleteLists();
        }
    });
    
    // Close autocomplete when input loses focus
    input.addEventListener('blur', function() {
        setTimeout(() => closeAllAutocompleteLists(), 150);
    });
}
    
function closeAllAutocompleteLists() {
    const items = document.getElementsByClassName('autocomplete-items');
    for (let i = 0; i < items.length; i++) {
        items[i].style.display = 'none';
    }
}