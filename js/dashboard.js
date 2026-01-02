// Dashboard Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkAuthentication();
    
    // Load user data
    loadUserData();
    
    // Load dashboard stats
    loadDashboardStats();
    
    // Setup logout
    setupLogout();
});

function checkAuthentication() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn || isLoggedIn !== 'true') {
        // Redirect to login if not authenticated
        window.location.href = 'login.html?return=dashboard.html';
        return;
    }
}

function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    // Update greeting
    const userName = userData.firstName || userData.email?.split('@')[0] || 'Traveler';
    document.getElementById('user-name').textContent = userName;
    document.getElementById('user-greeting').textContent = userName;
}

function loadDashboardStats() {
    // In a real app, you'd fetch this from an API
    // For now, we'll use localStorage or default values
    
    const userBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    const savedDeals = JSON.parse(localStorage.getItem('savedDeals') || '[]');
    
    // Update stats
    document.getElementById('total-bookings').textContent = userBookings.length;
    document.getElementById('upcoming-trips').textContent = userBookings.filter(booking => 
        new Date(booking.departureDate) > new Date()
    ).length;
    document.getElementById('saved-deals').textContent = savedDeals.length;
    
    // Load recent bookings
    loadRecentBookings(userBookings);
}

function loadRecentBookings(bookings) {
    const bookingsContainer = document.getElementById('recent-bookings');
    
    if (bookings.length === 0) {
        // Show empty state (already in HTML)
        return;
    }
    
    // Sort by date (most recent first) and take latest 3
    const recentBookings = bookings
        .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
        .slice(0, 3);
    
    const bookingsHTML = recentBookings.map(booking => `
        <div class="booking-item">
            <div class="booking-route">
                <strong>${booking.from} → ${booking.to}</strong>
                <span class="booking-date">${formatDate(booking.departureDate)}</span>
            </div>
            <div class="booking-details">
                <span class="booking-airline">${booking.airline}</span>
                <span class="booking-price">GHS ${booking.price}</span>
            </div>
            <div class="booking-status ${booking.status}">
                ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </div>
        </div>
    `).join('');
    
    bookingsContainer.innerHTML = bookingsHTML;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear user data
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            
            // Redirect to homepage
            window.location.href = 'index.html';
        });
    }
}

// Sample data for demo (you can remove this in production)
function addSampleData() {
    // Only add sample data if no bookings exist
    if (!localStorage.getItem('userBookings')) {
        const sampleBookings = [
            {
                from: 'Accra (ACC)',
                to: 'London (LHR)',
                departureDate: '2024-03-15',
                airline: 'British Airways',
                price: '1,850',
                status: 'confirmed',
                bookingDate: '2024-01-10'
            }
        ];
        localStorage.setItem('userBookings', JSON.stringify(sampleBookings));
        localStorage.setItem('savedDeals', JSON.stringify([1, 2, 3])); // Sample saved deals
    }
}

// Uncomment the line below to add sample data for testing
// addSampleData();