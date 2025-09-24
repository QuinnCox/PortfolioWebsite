// ===== SMOOTH SCROLLING FOR NAVIGATION LINKS =====
document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Calculate offset for fixed navbar
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight - 20;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// ===== CONTACT FORM HANDLING =====
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }
            
            // Email validation
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission (replace with actual submission logic)
            submitForm(name, email, message);
        });
    }
});

// ===== FORM SUBMISSION FUNCTION =====
function submitForm(name, email, message) {
    // Show loading state
    const submitBtn = document.querySelector('.contact-form .btn-primary');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call (replace with your actual form submission)
    setTimeout(() => {
        // Create mailto link as fallback
        const subject = `Portfolio Contact from ${name}`;
        const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
        const mailtoLink = `mailto:your.email@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Open default email client
        window.location.href = mailtoLink;
        
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showNotification('Thank you! Your message has been sent.', 'success');
    }, 1000);
}

// ===== EMAIL VALIDATION =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        max-width: 350px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background-color 0.2s ease;
            }
            
            .notification-close:hover {
                background-color: rgba(255, 255, 255, 0.2);
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// ===== SCROLL REVEAL ANIMATIONS =====
// Simple intersection observer for scroll animations
document.addEventListener('DOMContentLoaded', function() {
    // Elements to animate on scroll
    const animateElements = document.querySelectorAll('.project-card, .about-content, .contact-content');
    
    // Intersection Observer options
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    // Create observer
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Set initial styles and observe elements
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
});

// ===== TYPING ANIMATION FOR HERO SUBTITLE =====
document.addEventListener('DOMContentLoaded', function() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
        const roles = ['Front-End Developer', 'UI/UX Enthusiast', 'Problem Solver', 'Creative Coder'];
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
                // Pause at end
                typeSpeed = 2000;
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
});

// ===== KEYBOARD NAVIGATION ENHANCEMENT =====
document.addEventListener('keydown', function(e) {
    // Escape key closes notifications
    if (e.key === 'Escape') {
        const notification = document.querySelector('.notification');
        if (notification) {
            notification.remove();
        }
    }
    
    // Enter key on project cards opens GitHub link
    if (e.key === 'Enter') {
        const focusedCard = document.activeElement;
        if (focusedCard.classList.contains('project-card')) {
            const link = focusedCard.querySelector('.project-link');
            if (link) {
                link.click();
            }
        }
    }
});

// ===== PERFORMANCE OPTIMIZATION =====
// Lazy load images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.3s ease';
                    
                    img.onload = function() {
                        img.style.opacity = '1';
                    };
                    
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
});

// ===== ACCESSIBLE FOCUS MANAGEMENT =====
document.addEventListener('DOMContentLoaded', function() {
    // Add focus styles for better keyboard navigation
    const focusableElements = document.querySelectorAll('a, button, input, textarea, [tabindex]');
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #3b82f6';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
});

// ===== CONSOLE EASTER EGG =====
console.log(`
🚀 Welcome to my portfolio!
   
Thanks for checking out the code. 
If you're interested in working together, 
let's connect!

Email: your.email@example.com
GitHub: github.com/yourusername
`);

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('Portfolio error:', e.error);
    // In production, you might want to send errors to an analytics service
});

// ===== UTILITY FUNCTIONS =====
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

// Throttle function for scroll events
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