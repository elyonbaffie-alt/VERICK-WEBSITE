// mobile-nav.js - Simple working version
console.log('mobile-nav.js loaded'); // Debug log

function initMobileNavigation() {
    console.log('initMobileNavigation called'); // Debug log
    
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileCloseBtn = document.getElementById('mobileCloseBtn');
    const mobileNav = document.getElementById('mobileNav');
    
    console.log('Elements found:', { // Debug log
        mobileMenuBtn: !!mobileMenuBtn,
        mobileCloseBtn: !!mobileCloseBtn,
        mobileNav: !!mobileNav
    });
    
    if (!mobileMenuBtn || !mobileNav) {
        console.error('Mobile navigation elements not found!');
        return;
    }
    
    // In mobile-nav.js, update the open/close functions:

// Open mobile menu
mobileMenuBtn.addEventListener('click', function() {
    console.log('📱 Opening sidebar menu');
    mobileNav.classList.add('active');
    mobileNavOverlay.classList.add('active');
    document.body.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
});

// Close mobile menu
function closeMenu() {
    console.log('❌ Closing sidebar menu');
    mobileNav.classList.remove('active');
    mobileNavOverlay.classList.remove('active');
    document.body.classList.remove('menu-open');
    document.body.style.overflow = '';
}
    
    // Close when clicking links
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close when clicking outside (on overlay)
    mobileNav.addEventListener('click', function(e) {
        if (e.target === mobileNav) {
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    console.log('Mobile navigation initialized successfully'); // Debug log
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded fired'); // Debug log
    initMobileNavigation();
});

// Also try to initialize if DOM is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('Document already ready, initializing now'); // Debug log
    setTimeout(initMobileNavigation, 1);
}// mobile-nav.js - Slide-in sidebar like YouTube mobile
console.log('📱 mobile-nav.js loaded');

function initMobileNavigation() {
    console.log('🚀 Initializing mobile navigation...');
    
    // Get elements
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileCloseBtn = document.getElementById('mobileCloseBtn');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    
    // Debug check
    console.log('🔍 Elements found:', {
        menuBtn: mobileMenuBtn ? '✅' : '❌',
        closeBtn: mobileCloseBtn ? '✅' : '❌',
        nav: mobileNav ? '✅' : '❌',
        overlay: mobileNavOverlay ? '✅' : '❌'
    });
    
    // If essential elements don't exist, exit
    if (!mobileMenuBtn || !mobileNav || !mobileNavOverlay) {
        console.error('❌ Mobile navigation elements not found!');
        return;
    }
    
    // Open mobile menu
    mobileMenuBtn.addEventListener('click', function() {
        console.log('📱 Opening sidebar menu');
        mobileNav.classList.add('active');
        mobileNavOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
    
    // Close mobile menu
    function closeMenu() {
        console.log('❌ Closing sidebar menu');
        mobileNav.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    if (mobileCloseBtn) {
        mobileCloseBtn.addEventListener('click', closeMenu);
    }
    
    // Close menu when clicking on overlay
    mobileNavOverlay.addEventListener('click', closeMenu);
    
    // Close menu when clicking on links
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Close menu with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Highlight current page in mobile menu
    function highlightCurrentPage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        console.log('📍 Current page:', currentPage);
        
        mobileLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref && linkHref.includes(currentPage)) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Initialize
    highlightCurrentPage();
    console.log('✅ Mobile navigation initialized successfully!');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initMobileNavigation);

// Also initialize if DOM is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initMobileNavigation, 1);
}