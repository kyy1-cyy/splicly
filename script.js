// Function to load content via AJAX
async function loadPage(url) {
    try {
        // Show loading state
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = '<div class="loading">Loading...</div>';
        
        // Fetch the page
        const response = await fetch(url);
        const text = await response.text();
        
        // Create a temporary container to parse the response
        const temp = document.createElement('div');
        temp.innerHTML = text;
        
        // Extract the main content
        const newContent = temp.querySelector('.main-content').innerHTML;
        
        // Update the URL without reloading
        window.history.pushState({}, '', url);
        
        // Update the content
        mainContent.innerHTML = newContent;
        
        // Update active navigation
        updateActiveNav();
        
        // Reinitialize any components
        initializePage();
    } catch (error) {
        console.error('Error loading page:', error);
        document.querySelector('.main-content').innerHTML = '<div class="error">Error loading page. Please try again.</div>';
    }
}

// Function to update active navigation
function updateActiveNav() {
    // Remove active class from all nav items
    document.querySelectorAll('.sidebar nav a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current page
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const currentLink = document.querySelector(`.sidebar nav a[href="${currentPath}"]`);
    if (currentLink) {
        currentLink.classList.add('active');
    }
}

// Function to initialize page-specific components
function initializePage() {
    // Handle Getting Started steps
    const stepHeaders = document.querySelectorAll('.step-header');
    stepHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const step = this.parentElement;
            const isActive = step.classList.contains('active');
            
            // Close all steps first
            document.querySelectorAll('.step').forEach(s => {
                s.classList.remove('active');
            });
            
            // Open the clicked step if it wasn't active
            if (!isActive) {
                step.classList.add('active');
            }
        });
    });
    
    // Open the first step by default in Getting Started
    if (stepHeaders.length > 0) {
        stepHeaders[0].parentElement.classList.add('active');
    }

    // Handle FAQ accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all FAQ items first
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Open the clicked FAQ item if it wasn't active
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
    
    // Open the first FAQ item by default
    if (faqQuestions.length > 0 && !window.location.hash) {
        faqQuestions[0].parentElement.classList.add('active');
    }
}

// Handle navigation clicks
document.addEventListener('click', function(e) {
    // Check if the clicked element is a navigation link
    const navLink = e.target.closest('.sidebar nav a');
    if (navLink) {
        e.preventDefault();
        const href = navLink.getAttribute('href');
        loadPage(href);
    }
});

// Handle browser back/forward buttons
window.addEventListener('popstate', function() {
    loadPage(window.location.pathname);
});

// Initialize the page when loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set up initial active navigation
    updateActiveNav();
    
    // Initialize page components
    initializePage();
});