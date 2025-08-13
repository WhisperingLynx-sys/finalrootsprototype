/**
 * =========================================================
 * ROOTS ACADEMY - main.js (Core JavaScript)
 * Author: Roots Academy Dev Team
 * Date: 2025
 * Description: Core functionality including navigation,
 *              smooth scrolling, counters, modals, forms,
 *              lazy loading, and interactive elements
 * =========================================================
 */

'use strict';

// ========================
// 1. GLOBAL VARIABLES
// ========================

const rootsAcademy = {
    // DOM Elements
    navbar: null,
    hamburger: null,
    navLinks: null,
    scrollProgress: null,
    backToTop: null,
    
    // State
    isScrolled: false,
    isMobileMenuOpen: false,
    
    // Configuration
    config: {
        scrollThreshold: 100,
        counterSpeed: 2000,
        lazyLoadOffset: 100,
        debounceDelay: 16
    }
};

// ========================
// 2. INITIALIZATION
// ========================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Cache DOM elements
    cacheDOMElements();
    
    // Initialize core features
    initNavigation();
    initScrollEffects();
    initCounters();
    initModals();
    initForms();
    initLazyLoading();
    initCustomCursor();
    initSmoothScrolling();
    initBackToTop();
    
    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }
    
    console.log('🌳 Roots Academy initialized successfully!');
}

function cacheDOMElements() {
    rootsAcademy.navbar = document.querySelector('.navbar');
    rootsAcademy.hamburger = document.querySelector('.navbar-toggler');
    rootsAcademy.navLinks = document.querySelectorAll('.nav-link');
    rootsAcademy.scrollProgress = document.querySelector('.scroll-progress');
    rootsAcademy.backToTop = document.querySelector('.back-to-top');
}

// ========================
// 3. NAVIGATION SYSTEM
// ========================

function initNavigation() {
    // Mobile menu toggle
    if (rootsAcademy.hamburger) {
        rootsAcademy.hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking nav links
    rootsAcademy.navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.navbar') && rootsAcademy.isMobileMenuOpen) {
            closeMobileMenu();
        }
    });
    
    // Active link highlighting
    highlightActiveNavLink();
    window.addEventListener('scroll', debounce(highlightActiveNavLink, rootsAcademy.config.debounceDelay));
}

function toggleMobileMenu() {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    rootsAcademy.isMobileMenuOpen = !rootsAcademy.isMobileMenuOpen;
    
    if (rootsAcademy.isMobileMenuOpen) {
        navbarCollapse.classList.add('show');
        rootsAcademy.hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    } else {
        navbarCollapse.classList.remove('show');
        rootsAcademy.hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
}

function closeMobileMenu() {
    if (rootsAcademy.isMobileMenuOpen) {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        navbarCollapse.classList.remove('show');
        rootsAcademy.hamburger.setAttribute('aria-expanded', 'false');
        rootsAcademy.isMobileMenuOpen = false;
        document.body.style.overflow = '';
    }
}

function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            // Remove active from all links
            rootsAcademy.navLinks.forEach(link => link.classList.remove('active'));
            
            // Add active to current section link
            const activeLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

// ========================
// 4. SCROLL EFFECTS
// ========================

function initScrollEffects() {
    window.addEventListener('scroll', debounce(handleScroll, rootsAcademy.config.debounceDelay));
}

function handleScroll() {
    const scrollY = window.scrollY;
    
    // Navbar scroll effect
    handleNavbarScroll(scrollY);
    
    // Scroll progress
    updateScrollProgress();
    
    // Back to top visibility
    toggleBackToTop(scrollY);
    
    // Parallax effects
    handleParallaxEffects(scrollY);
}

function handleNavbarScroll(scrollY) {
    if (!rootsAcademy.navbar) return;
    
    if (scrollY > rootsAcademy.config.scrollThreshold && !rootsAcademy.isScrolled) {
        rootsAcademy.navbar.classList.add('scrolled');
        rootsAcademy.isScrolled = true;
    } else if (scrollY <= rootsAcademy.config.scrollThreshold && rootsAcademy.isScrolled) {
        rootsAcademy.navbar.classList.remove('scrolled');
        rootsAcademy.isScrolled = false;
    }
}

function updateScrollProgress() {
    if (!rootsAcademy.scrollProgress) return;
    
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    rootsAcademy.scrollProgress.style.width = `${scrollPercent}%`;
}

function handleParallaxEffects(scrollY) {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrollY * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
}

// ========================
// 5. COUNTER ANIMATIONS
// ========================

function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    if (counters.length === 0) return;
    
    const observerOptions = {
        threshold: 0.7,
        rootMargin: '0px'
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(counter) {
    const target = parseInt(counter.dataset.target) || 0;
    const duration = rootsAcademy.config.counterSpeed;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        counter.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// ========================
// 6. MODAL SYSTEM
// ========================

function initModals() {
    // Video modal functionality
    initVideoModals();
    
    // Custom modals
    initCustomModals();
}

function initVideoModals() {
    const videoTriggers = document.querySelectorAll('[data-video-modal]');
    
    videoTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const videoUrl = this.dataset.videoModal;
            openVideoModal(videoUrl);
        });
    });
}

function openVideoModal(videoUrl) {
    const modal = document.createElement('div');
    modal.className = 'modal-custom video-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" aria-label="Close modal">&times;</button>
            <div class="video-container">
                <iframe src="${videoUrl}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close modal events
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.classList.contains('modal-close')) {
            closeModal(modal);
        }
    });
    
    // ESC key close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal(modal);
        }
    });
}

function initCustomModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.dataset.modal;
            const modal = document.getElementById(modalId);
            if (modal) {
                openModal(modal);
            }
        });
    });
}

function openModal(modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Close events
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal(modal));
    }
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
}

function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    
    // Remove dynamically created modals
    if (modal.classList.contains('video-modal')) {
        modal.remove();
    }
}

// ========================
// 7. FORM HANDLING
// ========================

function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
        
        // Form submission
        form.addEventListener('submit', handleFormSubmission);
    });
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    
    let isValid = true;
    let errorMessage = '';
    
    // Required validation
    if (required && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    if (type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    showFieldValidation(field, isValid, errorMessage);
    return isValid;
}

function showFieldValidation(field, isValid, errorMessage) {
    const errorElement = field.parentNode.querySelector('.field-error');
    
    if (isValid) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        if (errorElement) {
            errorElement.textContent = '';
        }
    } else {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
        
        if (errorElement) {
            errorElement.textContent = errorMessage;
        } else {
            const error = document.createElement('div');
            error.className = 'field-error text-danger small mt-1';
            error.textContent = errorMessage;
            field.parentNode.appendChild(error);
        }
    }
}

function clearFieldError(field) {
    field.classList.remove('is-invalid');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.textContent = '';
    }
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const inputs = form.querySelectorAll('input, textarea, select');
    let isFormValid = true;
    
    // Validate all fields
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    if (isFormValid) {
        submitForm(form);
    } else {
        // Focus first invalid field
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) {
            firstInvalid.focus();
        }
    }
}

function submitForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        showFormSuccess();
        form.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Clear validation classes
        const validatedFields = form.querySelectorAll('.is-valid, .is-invalid');
        validatedFields.forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');
        });
    }, 2000);
}

function showFormSuccess() {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'alert alert-success position-fixed';
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999;';
    notification.textContent = 'Form submitted successfully!';
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ========================
// 8. LAZY LOADING
// ========================

function initLazyLoading() {
    const lazyElements = document.querySelectorAll('[data-lazy]');
    
    if (lazyElements.length === 0) return;
    
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadLazyElement(entry.target);
                lazyObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: `${rootsAcademy.config.lazyLoadOffset}px`
    });
    
    lazyElements.forEach(element => lazyObserver.observe(element));
}

function loadLazyElement(element) {
    const src = element.dataset.lazy;
    
    if (element.tagName === 'IMG') {
        element.src = src;
        element.classList.add('loaded');
    } else if (element.tagName === 'DIV' || element.tagName === 'SECTION') {
        element.style.backgroundImage = `url(${src})`;
        element.classList.add('loaded');
    }
    
    element.removeAttribute('data-lazy');
}

// ========================
// 9. CUSTOM CURSOR
// ========================

function initCustomCursor() {
    if (window.innerWidth < 768) return; // Skip on mobile
    
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function updateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.1;
        cursorY += dy * 0.1;
        
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        requestAnimationFrame(updateCursor);
    }
    updateCursor();
    
    // Cursor interactions
    const interactiveElements = document.querySelectorAll('a, button, .btn, [data-cursor]');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
        element.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });
}

// ========================
// 10. SMOOTH SCROLLING
// ========================

function initSmoothScrolling() {
    const smoothLinks = document.querySelectorAll('a[href*="#"]:not([href="#"])');
    
    smoothLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================
// 11. BACK TO TOP
// ========================

function initBackToTop() {
    if (!rootsAcademy.backToTop) {
        createBackToTopButton();
    }
    
    if (rootsAcademy.backToTop) {
        rootsAcademy.backToTop.addEventListener('click', scrollToTop);
    }
}

function createBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);
    
    rootsAcademy.backToTop = backToTop;
}

function toggleBackToTop(scrollY) {
    if (!rootsAcademy.backToTop) return;
    
    if (scrollY > 500) {
        rootsAcademy.backToTop.classList.add('visible');
    } else {
        rootsAcademy.backToTop.classList.remove('visible');
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ========================
// 12. UTILITY FUNCTIONS
// ========================

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

// ========================
// 13. PERFORMANCE MONITORING
// ========================

// Performance observer for monitoring
if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
                console.log(`🚀 Page load time: ${entry.loadEventEnd - entry.loadEventStart}ms`);
            }
        }
    });
    observer.observe({entryTypes: ['navigation']});
}

// ========================
// 14. ERROR HANDLING
// ========================

window.addEventListener('error', function(e) {
    console.error('🚨 JavaScript Error:', e.error);
    
    // Optional: Send error to analytics
    // analytics.track('javascript_error', { message: e.message });
});

// Export for use in other scripts
window.rootsAcademy = rootsAcademy;