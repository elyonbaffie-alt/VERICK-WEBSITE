// User Authentication Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Registration Form Validation
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        setupRegistrationForm();
    }

    // Login Form Validation (for login.html)
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        setupLoginForm();
    }
});

// Login Form Validation
function setupLoginForm() {
    const form = document.getElementById('login-form');
    const loginBtn = document.getElementById('login-btn');

    // Real-time validation
    setupLoginRealTimeValidation();

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateLoginForm()) {
            loginUser();
        }
    });
}

function setupLoginRealTimeValidation() {
    // Email validation on blur
    document.getElementById('login-email').addEventListener('blur', function() {
        const email = this.value.trim();
        if (email && !isValidEmail(email)) {
            showLoginError('login-email', 'Please enter a valid email address');
        } else {
            hideLoginError('login-email');
        }
    });

    // Password validation on blur
    document.getElementById('login-password').addEventListener('blur', function() {
        const password = this.value;
        if (password && password.length < 6) {
            showLoginError('login-password', 'Password must be at least 6 characters');
        } else {
            hideLoginError('login-password');
        }
    });
}

function validateLoginForm() {
    let isValid = true;

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!email) {
        showLoginError('login-email', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showLoginError('login-email', 'Please enter a valid email address');
        isValid = false;
    } else {
        hideLoginError('login-email');
    }

    if (!password) {
        showLoginError('login-password', 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showLoginError('login-password', 'Password must be at least 6 characters');
        isValid = false;
    } else {
        hideLoginError('login-password');
    }

    return isValid;
}

function showLoginError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + '-error');
    
    if (field) {
        field.classList.add('error');
    }
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function hideLoginError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + '-error');
    
    if (field) {
        field.classList.remove('error');
    }
    
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

function loginUser() {
    const btn = document.getElementById('login-btn');
    const btnText = btn.querySelector('.btn-text');
    const btnLoading = btn.querySelector('.btn-loading');
    
    // Show loading state
    btn.disabled = true;
    btn.classList.add('loading');
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    // Simulate API call
    setTimeout(() => {
        // For demo purposes - in real app, verify credentials with backend
        const userData = {
            email: email,
            firstName: email.split('@')[0], // Extract name from email for demo
            lastName: 'User',
            phone: '+233 XX XXX XXXX'
        };
        
        console.log('Login attempt:', { email, password, rememberMe });
        
        // Store user data
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');
        
        if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
        }
        
        // Redirect to dashboard or previous page
        alert('Login successful! Welcome back!');
        const returnUrl = new URLSearchParams(window.location.search).get('return') || 'dashboard.html';
        window.location.href = returnUrl;
        
    }, 1500);
}

// Initialize login form if it exists
document.addEventListener('DOMContentLoaded', function() {
    // Registration Form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        setupRegistrationForm();
    }

    // Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        setupLoginForm();
        
        // Add demo credentials info for testing
        const form = document.getElementById('login-form');
        const demoHtml = `
            <div class="demo-credentials">
                <h4><i class="fas fa-info-circle"></i> Demo Credentials</h4>
                <p><strong>Email:</strong> demo@verick.com</p>
                <p><strong>Password:</strong> any password will work</p>
            </div>
        `;
        form.insertAdjacentHTML('afterbegin', demoHtml);
    }
});

function setupRegistrationForm() {
    const form = document.getElementById('register-form');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');

    // Real-time password strength checking
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        
        strengthBar.className = 'strength-bar ' + strength;
        strengthText.className = 'strength-text ' + strength;
        strengthText.textContent = strength.charAt(0).toUpperCase() + strength.slice(1);
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateRegistrationForm()) {
            registerUser();
        }
    });

    // Real-time validation
    setupRealTimeValidation();
}

function calculatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    
    if (strength < 2) return 'weak';
    if (strength < 4) return 'medium';
    return 'strong';
}

function validateRegistrationForm() {
    let isValid = true;
    const errors = [];

    // Get form values
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;

    // Validation
    if (!firstName) {
        showError('firstName', 'First name is required');
        isValid = false;
    } else {
        hideError('firstName');
    }

    if (!lastName) {
        showError('lastName', 'Last name is required');
        isValid = false;
    } else {
        hideError('lastName');
    }

    if (!email) {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    } else {
        hideError('email');
    }

    if (!phone) {
        showError('phone', 'Phone number is required');
        isValid = false;
    } else if (!isValidPhone(phone)) {
        showError('phone', 'Please enter a valid phone number');
        isValid = false;
    } else {
        hideError('phone');
    }

    if (!password) {
        showError('password', 'Password is required');
        isValid = false;
    } else if (password.length < 8) {
        showError('password', 'Password must be at least 8 characters long');
        isValid = false;
    } else {
        hideError('password');
    }

    if (!confirmPassword) {
        showError('confirmPassword', 'Please confirm your password');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('confirmPassword', 'Passwords do not match');
        isValid = false;
    } else {
        hideError('confirmPassword');
    }

    if (!terms) {
        showError('terms', 'You must agree to the terms and conditions');
        isValid = false;
    } else {
        hideError('terms');
    }

    return isValid;
}

function setupRealTimeValidation() {
    // Email validation on blur
    document.getElementById('email').addEventListener('blur', function() {
        const email = this.value.trim();
        if (email && !isValidEmail(email)) {
            showError('email', 'Please enter a valid email address');
        } else {
            hideError('email');
        }
    });

    // Phone validation on blur
    document.getElementById('phone').addEventListener('blur', function() {
        const phone = this.value.trim();
        if (phone && !isValidPhone(phone)) {
            showError('phone', 'Please enter a valid phone number');
        } else {
            hideError('phone');
        }
    });

    // Confirm password real-time check
    document.getElementById('confirmPassword').addEventListener('input', function() {
        const password = document.getElementById('password').value;
        const confirmPassword = this.value;
        
        if (confirmPassword && password !== confirmPassword) {
            showError('confirmPassword', 'Passwords do not match');
        } else {
            hideError('confirmPassword');
        }
    });
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + '-error');
    
    if (field) {
        field.classList.add('error');
    }
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function hideError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + '-error');
    
    if (field) {
        field.classList.remove('error');
    }
    
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-()+]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function registerUser() {
    const btn = document.getElementById('register-btn');
    const btnText = btn.querySelector('.btn-text');
    const btnLoading = btn.querySelector('.btn-loading');
    
    // Show loading state
    btn.disabled = true;
    btn.classList.add('loading');
    
    // Simulate API call
    setTimeout(() => {
        // In real app, you'd send data to your backend
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            newsletter: document.getElementById('newsletter').checked
        };
        
        console.log('Registration data:', formData);
        
        // Store user data (in real app, this would be a session/token)
        localStorage.setItem('currentUser', JSON.stringify(formData));
        localStorage.setItem('isLoggedIn', 'true');
        
        // Redirect to dashboard
        alert('Account created successfully! Redirecting to dashboard...');
        window.location.href = 'dashboard.html';
        
    }, 2000);
}

// Login form setup (for login.html)
function setupLoginForm() {
    const form = document.getElementById('login-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Simple validation
        if (email && password) {
            // Simulate login
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify({ email: email }));
            
            alert('Login successful!');
            window.location.href = 'dashboard.html';
        } else {
            alert('Please fill in all fields');
        }
    });
}