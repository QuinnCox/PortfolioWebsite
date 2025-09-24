// ===== PORTFOLIO JAVASCRIPT FUNCTIONALITY =====
// Author: Your Name
// Description: Interactive functionality for portfolio website

// ===== GLOBAL VARIABLES =====
let isScrolling = false;
let scrollTimer = null;

// ===== DOM CONTENT LOADED EVENT =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio loaded successfully! 🚀');
    
    // Initialize all functionality
    initSmoothScrolling();
    initNavbarEffects();
    initContactForm();
    initScrollAnimations();
    initTypingAnimation();
    initMobileMenu();
    initKeyboardNavigation();
    initPerformanceOptimizations();
    
    // Show console message
    showConsoleWelcome();
});

// ===== SMOOTH SCROLLING FOR NAVIGATION LINKS =====
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight - 20;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(targetId);
            }
        });
    });
}

// ===== UPDATE ACTIVE NAVIGATION LINK =====
function updateActiveNavLink(targetId) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`.nav-link[href="${targetId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// ===== NAVBAR SCROLL EFFECTS =====
function initNavbarEffects() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    // Throttled scroll event
    const handleScroll = throttle(function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class
        if (scrollTop > 50) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            navbar.classList.add('scrolled');
        } else {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
            navbar.classList.remove('scrolled');
        }
        
        // Update active section in navigation
        updateActiveSection();
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, 10);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
}

// ===== UPDATE ACTIVE SECTION IN NAVIGATION =====
function updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    let current = '';
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ===== CONTACT FORM HANDLING =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(this);
    });
    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// ===== HANDLE FORM SUBMISSION =====
function handleFormSubmission(form) {
    const formData = new FormData(form);
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const message = formData.get('message').trim();
    
    // Validate all fields
    let isValid = true;
    
    if (!validateField(form.querySelector('#name'))) isValid = false;
    if (!validateField(form.querySelector('#email'))) isValid = false;
    if (!validateField(form.querySelector('#message'))) isValid = false;
    
    if (!isValid) {
        showNotification('Please fix the errors in the form.', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('.btn-primary');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with your actual submission logic)
    setTimeout(() => {
        // Create mailto link as fallback
        const subject = `Portfolio Contact from ${name}`;
        const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
        const mailtoLink = `mailto:your.email@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Open default email client
        window.location.href = mailtoLink;
        
        // Reset form
        form.reset();
        clearAllFieldErrors(form);
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        // Show success message
        showNotification('Thank you! Your message has been sent.', 'success');
    }, 1000);
}

// ===== FORM VALIDATION =====
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;
    
    // Clear previous errors
    clearFieldError(field);
    
    // Required field validation
    if (!value) {
        showFieldError(field, `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required.`);
        return false;
    }
    
    // Email validation
    if (fieldType === 'email' && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address.');
        return false;
    }
    
    // Message length validation
    if (fieldName === 'message' && value.length < 10) {
        showFieldError(field, 'Message should be at least 10 characters long.');
        return false;
    }
    
    // Show success state
    field.parentElement.classList.add('success');
    return true;
}

function showFieldError(field, message) {
    const formGroup = field.parentElement;
    formGroup.classList.add('error');
    formGroup.classList.remove('success');
    
    // Remove existing error message
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        color: #ef4444;
        font-size: 0.8rem;
        margin-top: 0.25rem;
    `;
    errorDiv.textContent = message;
    formGroup.appendChild(errorDiv);
}

function clearFieldError(field) {
    const formGroup = field.parentElement;
    formGroup.classList.remove('error');
    
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function clearAllFieldErrors(form) {
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        group.classList.remove('error', 'success');
        const errorMessage = group.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    });
}

// ===== EMAIL VALIDATION =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info', duration = 5000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Notification colors
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Close notification">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        max-width: 350px;
        animation: slideInRight 0.3s ease-out;
        font-family: inherit;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.add('hide');
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after duration
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('hide');
            setTimeout(() => notification.remove(), 300);
        }
    }, duration);
}

// ===== SCROLL REVEAL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Elements to animate on scroll
    const animateElements = document.querySelectorAll(
        '.project-card, .about-content > *, .contact-content > *, .skills-list li'
    );
    
    animateElements.forEach(element => {
        element.classList.add('animate-on-scroll');
        observer.observe(element);
    });
}

// ===== TYPING ANIMATION FOR HERO SUBTITLE =====
function initTypingAnimation() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;
    
    const roles = [
        'Front-End Developer',
        'UI/UX Enthusiast', 
        'Problem Solver',
        'Creative Coder'
    ];
    
    let currentRole = 0;
    let currentChar = 0;
    let isDeleting = false;
    
    function typeRole() {
        const current = roles[currentRole];
        
        if (isDeleting) {
            subtitle.textContent = current.substring(0, currentChar - 1);
            currentChar--;
        } else {
            subtitle.textContent = current.substring(0, currentChar + 1);
            currentChar++;
        }
        
        // Determine typing speed
        let typeSpeed = isDeleting ? 50 : 100;
        
        // If word is complete
        if (!isDeleting && currentChar === current.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && currentChar === 0) {
            isDeleting = false;
            currentRole = (currentRole + 1) % roles.length;
            typeSpeed = 500;
        }
        
        setTimeout(typeRole, typeSpeed);
    }
    
    // Start typing animation after a short delay
    setTimeout(typeRole, 1000);
}

// ===== MOBILE MENU FUNCTIONALITY =====
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!mobileMenuBtn || !navMenu) return;
    
    mobileMenuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking on nav links
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===== KEYBOARD NAVIGATION ENHANCEMENT =====
function initKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Escape key functionality
        if (e.key === 'Escape') {
            // Close notifications
            const notification = document.querySelector('.notification');
            if (notification) {
                notification.classList.add('hide');
                setTimeout(() => notification.remove(), 300);
                return;
            }
            
            // Close mobile menu
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            const navMenu = document.querySelector('.nav-menu');
            if (mobileMenuBtn && mobileMenuBtn.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                return;
            }
        }
        
        // Enter key on project cards
        if (e.key === 'Enter') {
            const focusedElement = document.activeElement;
            
            if (focusedElement.classList.contains('project-card')) {
                const firstLink = focusedElement.querySelector('.project-link');
                if (firstLink) {
                    firstLink.click();
                }
            }
        }
        
        // Arrow key navigation for project cards
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const projectCards = Array.from(document.querySelectorAll('.project-card'));
            const currentIndex = projectCards.indexOf(document.activeElement);
            
            if (currentIndex !== -1) {
                e.preventDefault();
                let nextIndex;
                
                if (e.key === 'ArrowRight') {
                    nextIndex = (currentIndex + 1) % projectCards.length;
                } else {
                    nextIndex = currentIndex === 0 ? projectCards.length - 1 : currentIndex - 1;
                }
                
                projectCards[nextIndex].focus();
            }
        }
    });
    
    // Make project cards focusable
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Project ${index + 1}: ${card.querySelector('.project-title').textContent}`);
    });
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function initPerformanceOptimizations() {
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Fade in effect
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.3s ease';
                    
                    img.onload = function() {
                        img.style.opacity = '1';
                    };
                    
                    // Handle broken images
                    img.onerror = function() {
                        img.style.display = 'none';
                        console.warn('Failed to load image:', img.src);
                    };
                    
                    imageObserver.unobserve(img);
                }
            });
        });
        
        const images = document.querySelectorAll('img[src]');
        images.forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Preload critical resources
    preloadCriticalResources();
}

// ===== PRELOAD CRITICAL RESOURCES =====
function preloadCriticalResources() {
    // Preload important images
    const criticalImages = [
        'assets/images/profile.jpg'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// ===== UTILITY FUNCTIONS =====

// Throttle function for performance optimization
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Get scroll percentage
function getScrollPercentage() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    return (scrollTop / docHeight) * 100;
}

// Check if element is in viewport
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Smooth scroll to element
function scrollToElement(element, offset = 0) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
    });
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
function initAccessibilityEnhancements() {
    // Add skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        z-index: 9999;
        text-decoration: none;
        border-radius: 4px;
        transition: top 0.3s ease;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main id to main element
    const main = document.querySelector('main');
    if (main && !main.id) {
        main.id = 'main';
    }
    
    // Improve focus management
    enhanceFocusManagement();
}

function enhanceFocusManagement() {
    // Add focus styles for better keyboard navigation
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #3b82f6';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
}

// ===== SCROLL PROGRESS BAR =====
function initScrollProgressBar() {
    // Create progress bar element
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background: linear-gradient(135deg, #3b82f6, #06b6d4);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    // Update progress on scroll
    const updateProgress = throttle(function() {
        const scrollPercentage = getScrollPercentage();
        progressBar.style.width = `${scrollPercentage}%`;
    }, 10);
    
    window.addEventListener('scroll', updateProgress, { passive: true });
}

// ===== DARK MODE TOGGLE (Optional Enhancement) =====
function initDarkModeToggle() {
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Create dark mode toggle button
    const darkModeToggle = document.createElement('button');
    darkModeToggle.innerHTML = '🌙';
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.setAttribute('aria-label', 'Toggle dark mode');
    darkModeToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #3b82f6;
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    // Toggle functionality
    darkModeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update button icon
        this.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
    });
    
    // Update button icon based on current theme
    if (currentTheme === 'dark') {
        darkModeToggle.innerHTML = '☀️';
    }
    
    document.body.appendChild(darkModeToggle);
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('Portfolio error:', e.error);
    
    // In production, you might want to send errors to an analytics service
    // Example: sendErrorToAnalytics(e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});

// ===== CONSOLE WELCOME MESSAGE =====
function showConsoleWelcome() {
    const styles = [
        'color: #3b82f6',
        'font-size: 16px',
        'font-weight: bold'
    ].join(';');
    
    console.log('%c🚀 Welcome to my portfolio!', styles);
    console.log(`
📧 Thanks for checking out the code!
   If you're interested in working together, let's connect:
   
   Email: your.email@example.com
   GitHub: github.com/yourusername
   LinkedIn: linkedin.com/in/yourprofile
   
🔧 This portfolio was built with:
   • Vanilla HTML, CSS, and JavaScript
   • CSS Grid and Flexbox for layouts
   • Intersection Observer API for animations
   • Mobile-first responsive design
   • Accessibility best practices
    `);
}

// ===== ANALYTICS (Optional) =====
function initAnalytics() {
    // Track page views
    trackPageView();
    
    // Track scroll depth
    trackScrollDepth();
    
    // Track button clicks
    trackButtonClicks();
}

function trackPageView() {
    // Example: Replace with your analytics service
    console.log('Page view tracked');
}

function trackScrollDepth() {
    const scrollMilestones = [25, 50, 75, 100];
    let trackedMilestones = [];
    
    const trackScroll = throttle(function() {
        const scrollPercentage = getScrollPercentage();
        
        scrollMilestones.forEach(milestone => {
            if (scrollPercentage >= milestone && !trackedMilestones.includes(milestone)) {
                trackedMilestones.push(milestone);
                console.log(`Scroll depth: ${milestone}%`);
                // Example: gtag('event', 'scroll_depth', { value: milestone });
            }
        });
    }, 250);
    
    window.addEventListener('scroll', trackScroll, { passive: true });
}

function trackButtonClicks() {
    const buttons = document.querySelectorAll('button, .btn, .project-link');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            const buttonType = this.className;
            
            console.log('Button clicked:', { buttonText, buttonType });
            // Example: gtag('event', 'click', { element: buttonText });
        });
    });
}

// ===== PERFORMANCE MONITORING =====
function initPerformanceMonitoring() {
    // Monitor loading performance
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`Page loaded in ${Math.round(loadTime)}ms`);
        
        // Check for Core Web Vitals
        if ('web-vitals' in window) {
            // This would require importing the web-vitals library
            // getCLS(console.log);
            // getFID(console.log);
            // getLCP(console.log);
        }
    });
    
    // Monitor scroll performance
    let scrollStartTime;
    let isScrolling = false;
    
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            scrollStartTime = performance.now();
            isScrolling = true;
        }
        
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function() {
            const scrollEndTime = performance.now();
            const scrollDuration = scrollEndTime - scrollStartTime;
            
            if (scrollDuration > 16) { // More than 60fps
                console.warn(`Slow scroll detected: ${Math.round(scrollDuration)}ms`);
            }
            
            isScrolling = false;
        }, 150);
    }, { passive: true });
}

// ===== CONTACT FORM ENHANCEMENTS =====
function initAdvancedFormFeatures() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // Add character counter to message field
    const messageField = form.querySelector('#message');
    if (messageField) {
        addCharacterCounter(messageField);
    }
    
    // Add form auto-save
    initFormAutoSave(form);
    
    // Add honeypot field for spam protection
    addHoneypotField(form);
}

function addCharacterCounter(textarea) {
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.style.cssText = `
        text-align: right;
        font-size: 0.8rem;
        color: #6b7280;
        margin-top: 0.25rem;
    `;
    
    const updateCounter = () => {
        const length = textarea.value.length;
        const maxLength = 500; // Set your desired max length
        
        counter.textContent = `${length}/${maxLength}`;
        
        if (length > maxLength * 0.9) {
            counter.style.color = '#ef4444';
        } else if (length > maxLength * 0.7) {
            counter.style.color = '#f59e0b';
        } else {
            counter.style.color = '#6b7280';
        }
    };
    
    textarea.addEventListener('input', updateCounter);
    textarea.parentElement.appendChild(counter);
    updateCounter();
}

function initFormAutoSave(form) {
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        // Load saved data
        const savedValue = localStorage.getItem(`form_${input.name}`);
        if (savedValue) {
            input.value = savedValue;
        }
        
        // Save data on input
        input.addEventListener('input', debounce(function() {
            localStorage.setItem(`form_${this.name}`, this.value);
        }, 500));
    });
    
    // Clear saved data on successful submission
    form.addEventListener('submit', function() {
        inputs.forEach(input => {
            localStorage.removeItem(`form_${input.name}`);
        });
    });
}

function addHoneypotField(form) {
    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = 'website';
    honeypot.style.cssText = `
        position: absolute;
        left: -9999px;
        top: -9999px;
        opacity: 0;
        pointer-events: none;
    `;
    honeypot.setAttribute('tabindex', '-1');
    honeypot.setAttribute('aria-hidden', 'true');
    
    form.insertBefore(honeypot, form.firstChild);
    
    // Check honeypot on submission
    form.addEventListener('submit', function(e) {
        if (honeypot.value) {
            e.preventDefault();
            console.log('Spam submission detected');
            return false;
        }
    });
}

// ===== INITIALIZE ADVANCED FEATURES =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize optional enhancements
    initAccessibilityEnhancements();
    initScrollProgressBar();
    initAdvancedFormFeatures();
    initPerformanceMonitoring();
    
    // Uncomment these if you want to enable them:
    // initDarkModeToggle();
    // initAnalytics();
});

// ===== RESIZE HANDLER =====
window.addEventListener('resize', debounce(function() {
    // Handle any resize-dependent functionality
    console.log('Window resized');
}, 250));

// ===== VISIBILITY CHANGE HANDLER =====
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        console.log('Page is now visible');
        // Resume any paused functionality
    } else {
        console.log('Page is now hidden');
        // Pause any unnecessary functionality
    }
});

// ===== EXPORT FUNCTIONS (for testing or external use) =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isValidEmail,
        getScrollPercentage,
        throttle,
        debounce
    };
}
