// Calendar functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize calendars
    initCalendar('departure-calendar-icon', 'departure-calendar', 'departure');
    initCalendar('return-calendar-icon', 'return-calendar', 'return');
});

function initCalendar(iconId, calendarId, inputId) {
    const icon = document.getElementById(iconId);
    const calendar = document.getElementById(calendarId);
    const input = document.getElementById(inputId);
    
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    
    icon.addEventListener('click', function(e) {
        e.stopPropagation();
        closeAllCalendars();
        calendar.style.display = 'block';
        renderCalendar(calendar, input, currentMonth, currentYear);
    });
    
    // Close calendar when clicking elsewhere
    document.addEventListener('click', function() {
        calendar.style.display = 'none';
    });
    
    // Prevent calendar from closing when clicking inside it
    calendar.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

function closeAllCalendars() {
    const calendars = document.getElementsByClassName('calendar-popup');
    for (let i = 0; i < calendars.length; i++) {
        calendars[i].style.display = 'none';
    }
}

function renderCalendar(calendar, input, month, year) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    
    calendar.innerHTML = `
        <div class="calendar-header">
            <button class="prev-month">&lt;</button>
            <h3>${monthNames[month]} ${year}</h3>
            <button class="next-month">&gt;</button>
        </div>
        <div class="calendar-grid">
            <div class="calendar-day">Sun</div>
            <div class="calendar-day">Mon</div>
            <div class="calendar-day">Tue</div>
            <div class="calendar-day">Wed</div>
            <div class="calendar-day">Thu</div>
            <div class="calendar-day">Fri</div>
            <div class="calendar-day">Sat</div>
        </div>
    `;
    
    const calendarGrid = calendar.querySelector('.calendar-grid');
    const prevBtn = calendar.querySelector('.prev-month');
    const nextBtn = calendar.querySelector('.next-month');
    
    // Get first day of month (0 = Sunday, 1 = Monday, etc.)
    const firstDay = new Date(year, month, 1).getDay();
    
    // Get days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Get days in previous month
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    // Add previous month's days
    for (let i = firstDay - 1; i >= 0; i--) {
        const dateElement = document.createElement('div');
        dateElement.className = 'calendar-date other-month';
        dateElement.textContent = daysInPrevMonth - i;
        calendarGrid.appendChild(dateElement);
    }
    
    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
        const dateElement = document.createElement('div');
        dateElement.className = 'calendar-date';
        dateElement.textContent = i;
        
        // Check if this date is today
        const today = new Date();
        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dateElement.classList.add('selected');
        }
        
        dateElement.addEventListener('click', function() {
            // Remove selected class from all dates
            const allDates = calendarGrid.querySelectorAll('.calendar-date');
            allDates.forEach(date => date.classList.remove('selected'));
            
            // Add selected class to clicked date
            this.classList.add('selected');
            
            // Format the date
            const selectedDate = new Date(year, month, i);
            const formattedDate = formatDate(selectedDate);
            
            // Set the input value
            input.value = formattedDate;
            
            // Close the calendar
            calendar.style.display = 'none';
        });
        
        calendarGrid.appendChild(dateElement);
    }
    
    // Calculate how many days from next month to show
    const totalCells = 42; // 6 rows * 7 days
    const cellsUsed = firstDay + daysInMonth;
    const nextMonthDays = totalCells - cellsUsed;
    
    // Add next month's days
    for (let i = 1; i <= nextMonthDays; i++) {
        const dateElement = document.createElement('div');
        dateElement.className = 'calendar-date other-month';
        dateElement.textContent = i;
        calendarGrid.appendChild(dateElement);
    }
    
    // Previous month button
    prevBtn.addEventListener('click', function() {
        if (month === 0) {
            month = 11;
            year--;
        } else {
            month--;
        }
        renderCalendar(calendar, input, month, year);
    });
    
    // Next month button
    nextBtn.addEventListener('click', function() {
        if (month === 11) {
            month = 0;
            year++;
        } else {
            month++;
        }
        renderCalendar(calendar, input, month, year);
    });
}

function formatDate(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear().toString().substr(-2);
    const dayName = days[date.getDay()];
    
    return `${day} ${month}/${year} ${dayName}`;
}