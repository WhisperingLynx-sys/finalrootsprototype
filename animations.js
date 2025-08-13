/**
 * =========================================================
 * ROOTS ACADEMY - animations.js (Animation Controller)
 * Author: Roots Academy Dev Team
 * Date: 2025
 * Description: Advanced animations, scroll-triggered effects,
 *              timeline animations, and interactive elements
 * =========================================================
 */

'use strict';

// ========================
// 1. ANIMATION CONTROLLER
// ========================

const AnimationController = {
    // Configuration
    config: {
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        scrollOffset: 100,
        animationDuration: 800,
        staggerDelay: 100,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    },
    
    // State
    observers: new Map(),
    activeAnimations: new Set(),
    timeline: null,
    
    // Initialize all animations
    init() {
        if (this.config.reducedMotion) {
            console.log('🎭 Reduced motion preference detected - animations disabled');
            this.applyReducedMotionStyles();
            return;
        }
        
        this.initScrollAnimations();
        this.initRevealAnimations();
        this.initTypewriterAnimations();
        this.initFloatingElements();
        this.initMorphingShapes();
        this.initInteractiveElements();
        this.initPageTransitions();
        this.initHeroAnimations();
        
        console.log('🎭 Animation Controller initialized');
    },
    
    // Apply reduced motion styles
    applyReducedMotionStyles() {
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        `;
        document.head.appendChild(style);
    },
    
    // Clean up observers
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.activeAnimations.clear();
    }
};

// ========================
// 2. SCROLL ANIMATIONS
// ========================

AnimationController.initScrollAnimations = function() {
    const scrollElements = document.querySelectorAll('[data-scroll-animation]');
    
    if (scrollElements.length === 0) return;
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.triggerScrollAnimation(entry.target);
                scrollObserver.unobserve(entry.target); // Animate only once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: `-${this.config.scrollOffset}px`
    });
    
    scrollElements.forEach(element => {
        scrollObserver.observe(element);
        this.setInitialState(element);
    });
    
    this.observers.set('scroll', scrollObserver);
};

AnimationController.setInitialState = function(element) {
    const animationType = element.dataset.scrollAnimation;
    const delay = element.dataset.animationDelay || 0;
    
    element.style.animationDelay = `${delay}ms`;
    
    switch (animationType) {
        case 'fade-up':
            element.style.cssText += `
                opacity: 0;
                transform: translateY(30px);
                transition: all ${this.config.animationDuration}ms ${this.config.easing} ${delay}ms;
            `;
            break;
        case 'fade-left':
            element.style.cssText += `
                opacity: 0;
                transform: translateX(30px);
                transition: all ${this.config.animationDuration}ms ${this.config.easing} ${delay}ms;
            `;
            break;
        case 'fade-right':
            element.style.cssText += `
                opacity: 0;
                transform: translateX(-30px);
                transition: all ${this.config.animationDuration}ms ${this.config.easing} ${delay}ms;
            `;
            break;
        case 'scale-up':
            element.style.cssText += `
                opacity: 0;
                transform: scale(0.8);
                transition: all ${this.config.animationDuration}ms ${this.config.easing} ${delay}ms;
            `;
            break;
        case 'rotate-in':
            element.style.cssText += `
                opacity: 0;
                transform: rotate(-5deg) scale(0.9);
                transition: all ${this.config.animationDuration}ms ${this.config.easing} ${delay}ms;
            `;
            break;
    }
};

AnimationController.triggerScrollAnimation = function(element) {
    const animationType = element.dataset.scrollAnimation;
    
    // Add animation class for CSS-based animations
    element.classList.add('animate-in');
    
    // Apply transform based on animation type
    switch (animationType) {
        case 'fade-up':
        case 'fade-left':
        case 'fade-right':
            element.style.opacity = '1';
            element.style.transform = 'translate(0, 0)';
            break;
        case 'scale-up':
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
            break;
        case 'rotate-in':
            element.style.opacity = '1';
            element.style.transform = 'rotate(0deg) scale(1)';
            break;
    }
    
    this.activeAnimations.add(element);
};

// ========================
// 3. REVEAL ANIMATIONS
// ========================

AnimationController.initRevealAnimations = function() {
    const revealElements = document.querySelectorAll('.reveal-animation');
    
    revealElements.forEach((element, index) => {
        const delay = index * this.config.staggerDelay;
        
        element.style.cssText += `
            opacity: 0;
            transform: translateY(20px);
            transition: all 600ms ease-out ${delay}ms;
        `;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
    });
};

// ========================
// 4. TYPEWRITER ANIMATIONS
// ========================

AnimationController.initTypewriterAnimations = function() {
    const typewriterElements = document.querySelectorAll('.typewriter-text');
    
    typewriterElements.forEach(element => {
        this.createTypewriter(element);
    });
};

AnimationController.createTypewriter = function(element) {
    const text = element.textContent;
    const speed = parseInt(element.dataset.typeSpeed) || 50;
    const delay = parseInt(element.dataset.typeDelay) || 0;
    
    element.textContent = '';
    element.style.borderRight = '2px solid var(--primary)';
    element.style.animation = 'blink-cursor 1s infinite';
    
    setTimeout(() => {
        let index = 0;
        const typeTimer = setInterval(() => {
            element.textContent = text.slice(0, index + 1);
            index++;
            
            if (index === text.length) {
                clearInterval(typeTimer);
                // Remove cursor after typing is complete
                setTimeout(() => {
                    element.style.borderRight = 'none';
                    element.style.animation = 'none';
                }, 1000);
            }
        }, speed);
    }, delay);
};

// ========================
// 5. FLOATING ELEMENTS
// ========================

AnimationController.initFloatingElements = function() {
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((element, index) => {
        const duration = 3000 + (index * 500); // Varied duration
        const delay = index * 200; // Staggered start
        
        element.style.animation = `
            float ${duration}ms ${this.config.easing} ${delay}ms infinite alternate
        `;
    });
    
    // Add CSS keyframes if not already present
    this.addFloatingKeyframes();
};

AnimationController.addFloatingKeyframes = function() {
    if (document.querySelector('#floating-keyframes')) return;
    
    const style = document.createElement('style');
    style.id = 'floating-keyframes';
    style.textContent = `
        @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(1deg); }
            100% { transform: translateY(-20px) rotate(0deg); }
        }
        
        @keyframes blink-cursor {
            0%, 50% { border-color: var(--primary); }
            51%, 100% { border-color: transparent; }
        }
        
        @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(46, 204, 113, 0.3); }
            50% { box-shadow: 0 0 40px rgba(46, 204, 113, 0.6); }
        }
        
        @keyframes morphing-shape {
            0% { border-radius: 50% 30% 70% 40%; }
            25% { border-radius: 30% 60% 40% 70%; }
            50% { border-radius: 70% 40% 30% 60%; }
            75% { border-radius: 40% 70% 60% 30%; }
            100% { border-radius: 50% 30% 70% 40%; }
        }
    `;
    document.head.appendChild(style);
};

// ========================
// 6. MORPHING SHAPES
// ========================

AnimationController.initMorphingShapes = function() {
    const morphingElements = document.querySelectorAll('.morphing-shape');
    
    morphingElements.forEach((element, index) => {
        const duration = 8000 + (index * 1000);
        element.style.animation = `morphing-shape ${duration}ms ease-in-out infinite`;
    });
};

// ========================
// 7. INTERACTIVE ELEMENTS
// ========================

AnimationController.initInteractiveElements = function() {
    // Hover animations for cards
    this.initCardHoverEffects();
    
    // Button interactions
    this.initButtonAnimations();
    
    // Image hover effects
    this.initImageHoverEffects();
};

AnimationController.initCardHoverEffects = function() {
    const cards = document.querySelectorAll('.hover-card, .glass-card, .course-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'all 300ms ease';
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '';
        });
        
        // Add subtle animation on card appearance
        card.style.transition = 'all 300ms ease';
    });
};

AnimationController.initButtonAnimations = function() {
    const buttons = document.querySelectorAll('.btn, .btn-custom, .cta-button');
    
    buttons.forEach(button => {
        // Ripple effect
        button.addEventListener('click', function(e) {
            if (this.querySelector('.ripple')) return;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255,255,255,0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple-effect 600ms ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
        
        // Pulse animation for CTA buttons
        if (button.classList.contains('cta-button')) {
            button.style.animation = 'pulse-glow 2s ease-in-out infinite';
        }
    });
    
    // Add ripple keyframes
    this.addRippleKeyframes();
};

AnimationController.addRippleKeyframes = function() {
    if (document.querySelector('#ripple-keyframes')) return;
    
    const style = document.createElement('style');
    style.id = 'ripple-keyframes';
    style.textContent = `
        @keyframes ripple-effect {
            0% { transform: scale(0); opacity: 1; }
            100% { transform: scale(2); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
};

AnimationController.initImageHoverEffects = function() {
    const hoverImages = document.querySelectorAll('.hover-zoom, .team-member img');
    
    hoverImages.forEach(img => {
        const container = img.parentElement;
        container.style.overflow = 'hidden';
        
        img.style.transition = 'transform 500ms ease';
        
        container.addEventListener('mouseenter', () => {
            img.style.transform = 'scale(1.1)';
        });
        
        container.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
        });
    });
};

// ========================
// 8. HERO ANIMATIONS
// ========================

AnimationController.initHeroAnimations = function() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    // Animate hero elements in sequence
    const heroTitle = heroSection.querySelector('h1');
    const heroSubtitle = heroSection.querySelector('.hero-subtitle');
    const heroCTA = heroSection.querySelector('.hero-cta');
    const heroImage = heroSection.querySelector('.hero-image');
    
    const elements = [heroTitle, heroSubtitle, heroCTA, heroImage].filter(Boolean);
    
    elements.forEach((element, index) => {
        element.style.cssText += `
            opacity: 0;
            transform: translateY(30px);
            transition: all 800ms ${this.config.easing};
        `;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 200 + (index * 200));
    });
};

// ========================
// 9. PAGE TRANSITIONS
// ========================

AnimationController.initPageTransitions = function() {
    // Smooth page load animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 500ms ease';
    
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });
    
    // Link transition effects
    const transitionLinks = document.querySelectorAll('a[href]:not([href^="#"]):not([target="_blank"])');
    
    transitionLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (e.metaKey || e.ctrlKey) return; // Allow normal behavior for new tabs
            
            e.preventDefault();
            const href = link.getAttribute('href');
            
            document.body.style.opacity = '0';
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    });
};

// ========================
// 10. SCROLL-BASED ANIMATIONS
// ========================

AnimationController.initScrollBasedAnimations = function() {
    let ticking = false;
    
    function updateAnimations() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Parallax backgrounds
        const parallaxElements = document.querySelectorAll('.parallax-bg');
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
        
        // Scale elements based on scroll
        const scaleElements = document.querySelectorAll('.scroll-scale');
        scaleElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const scale = Math.max(0.8, 1 - (Math.abs(rect.top) / window.innerHeight));
            element.style.transform = `scale(${scale})`;
        });
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateAnimations);
            ticking = true;
        }
    });
};

// ========================
// 11. INTERSECTION ANIMATIONS
// ========================

AnimationController.createStaggeredAnimation = function(elements, animationType = 'fade-up') {
    elements.forEach((element, index) => {
        const delay = index * this.config.staggerDelay;
        
        element.style.cssText += `
            opacity: 0;
            transform: translateY(20px);
            transition: all 600ms ${this.config.easing} ${delay}ms;
        `;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(element);
    });
};

// ========================
// 12. INITIALIZATION
// ========================

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    AnimationController.init();
    
    // Initialize staggered animations for specific elements
    const staggerElements = document.querySelectorAll('.stagger-animation');
    if (staggerElements.length > 0) {
        AnimationController.createStaggeredAnimation(staggerElements);
    }
    
    // Initialize scroll-based animations
    AnimationController.initScrollBasedAnimations();
});

// Handle visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        AnimationController.activeAnimations.forEach(element => {
            element.style.animationPlayState = 'paused';
        });
    } else {
        AnimationController.activeAnimations.forEach(element => {
            element.style.animationPlayState = 'running';
        });
    }
});

// Export for use in other scripts
window.AnimationController = AnimationController;