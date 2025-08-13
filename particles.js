/**
 * =========================================================
 * ROOTS ACADEMY - particles.js (Particle Effects System)
 * Author: Roots Academy Dev Team
 * Date: 2025
 * Description: Interactive particle backgrounds for hero
 *              sections with performance optimization
 * =========================================================
 */

'use strict';

// ========================
// 1. PARTICLE SYSTEM
// ========================

class ParticleSystem {
    constructor(container, options = {}) {
        this.container = container;
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
        
        // Configuration
        this.config = {
            particleCount: options.particleCount || 50,
            particleSize: options.particleSize || 2,
            particleSpeed: options.particleSpeed || 0.5,
            connectionDistance: options.connectionDistance || 150,
            particleColor: options.particleColor || 'rgba(46, 204, 113, 0.6)',
            connectionColor: options.connectionColor || 'rgba(46, 204, 113, 0.2)',
            mouseInteraction: options.mouseInteraction !== false,
            mouseRadius: options.mouseRadius || 100,
            responsive: options.responsive !== false,
            ...options
        };
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.createParticles();
        this.bindEvents();
        this.animate();
        
        console.log('✨ Particle System initialized');
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'particle-canvas';
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        
        this.container.style.position = 'relative';
        this.container.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
    }
    
    resizeCanvas() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        // Adjust particle count based on screen size
        if (this.config.responsive) {
            const screenArea = rect.width * rect.height;
            const baseArea = 1920 * 1080;
            const ratio = Math.min(screenArea / baseArea, 1);
            this.config.particleCount = Math.floor(this.config.particleCount * ratio);
        }
    }
    
    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push(new Particle(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                this.config
            ));
        }
    }
    
    bindEvents() {
        if (this.config.mouseInteraction) {
            this.container.addEventListener('mousemove', (e) => {
                const rect = this.container.getBoundingClientRect();
                this.mouse.x = e.clientX - rect.left;
                this.mouse.y = e.clientY - rect.top;
            });
            
            this.container.addEventListener('mouseleave', () => {
                this.mouse.x = -1000;
                this.mouse.y = -1000;
            });
        }
        
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
        });
        
        // Pause animation when page is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach(particle => {
            particle.update(this.canvas, this.mouse, this.config);
            particle.draw(this.ctx, this.config);
        });
        
        // Draw connections
        this.drawConnections();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.connectionDistance) {
                    const opacity = (this.config.connectionDistance - distance) / this.config.connectionDistance;
                    
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = this.config.connectionColor.replace('0.2', opacity * 0.2);
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    resume() {
        if (!this.animationId) {
            this.animate();
        }
    }
    
    destroy() {
        this.pause();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// ========================
// 2. PARTICLE CLASS
// ========================

class Particle {
    constructor(x, y, config) {
        this.x = x;
        this.y = y;
        this.originalX = x;
        this.originalY = y;
        
        this.vx = (Math.random() - 0.5) * config.particleSpeed;
        this.vy = (Math.random() - 0.5) * config.particleSpeed;
        
        this.size = Math.random() * config.particleSize + 1;
        this.opacity = Math.random() * 0.5 + 0.5;
        
        // Floating animation
        this.angle = Math.random() * Math.PI * 2;
        this.amplitude = Math.random() * 20 + 10;
        this.frequency = Math.random() * 0.02 + 0.01;
    }
    
    update(canvas, mouse, config) {
        // Basic movement
        this.x += this.vx;
        this.y += this.vy;
        
        // Floating effect
        this.angle += this.frequency;
        this.y += Math.sin(this.angle) * 0.5;
        
        // Boundary checking with wrapping
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
        
        // Mouse interaction
        if (config.mouseInteraction && mouse.x > -500) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < config.mouseRadius) {
                const force = (config.mouseRadius - distance) / config.mouseRadius;
                const angle = Math.atan2(dy, dx);
                
                this.vx -= Math.cos(angle) * force * 0.5;
                this.vy -= Math.sin(angle) * force * 0.5;
            }
        }
        
        // Apply friction
        this.vx *= 0.99;
        this.vy *= 0.99;
        
        // Gentle return to original position
        const returnForce = 0.001;
        this.vx += (this.originalX - this.x) * returnForce;
        this.vy += (this.originalY - this.y) * returnForce;
    }
    
    draw(ctx, config) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = config.particleColor.replace('0.6', this.opacity);
        ctx.fill();
        
        // Add glow effect
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = config.particleColor.replace('0.6', this.opacity * 0.1);
        ctx.fill();
    }
}

// ========================
// 3. GEOMETRIC PARTICLES
// ========================

class GeometricParticleSystem extends ParticleSystem {
    constructor(container, options = {}) {
        super(container, {
            particleCount: 30,
            shapes: ['triangle', 'square', 'hexagon'],
            rotationSpeed: 0.02,
            ...options
        });
    }
    
    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push(new GeometricParticle(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                this.config
            ));
        }
    }
}

class GeometricParticle extends Particle {
    constructor(x, y, config) {
        super(x, y, config);
        this.shape = config.shapes[Math.floor(Math.random() * config.shapes.length)];
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * config.rotationSpeed;
    }
    
    update(canvas, mouse, config) {
        super.update(canvas, mouse, config);
        this.rotation += this.rotationSpeed;
    }
    
    draw(ctx, config) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        ctx.strokeStyle = config.particleColor.replace('0.6', this.opacity);
        ctx.lineWidth = 1;
        
        switch (this.shape) {
            case 'triangle':
                this.drawTriangle(ctx);
                break;
            case 'square':
                this.drawSquare(ctx);
                break;
            case 'hexagon':
                this.drawHexagon(ctx);
                break;
        }
        
        ctx.restore();
    }
    
    drawTriangle(ctx) {
        const size = this.size * 3;
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(-size, size);
        ctx.lineTo(size, size);
        ctx.closePath();
        ctx.stroke();
    }
    
    drawSquare(ctx) {
        const size = this.size * 2;
        ctx.beginPath();
        ctx.rect(-size, -size, size * 2, size * 2);
        ctx.stroke();
    }
    
    drawHexagon(ctx) {
        const size = this.size * 2.5;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const x = Math.cos(angle) * size;
            const y = Math.sin(angle) * size;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
    }
}

// ========================
// 4. PARTICLE MANAGER
// ========================

const ParticleManager = {
    systems: new Map(),
    
    init() {
        this.initHeroParticles();
        this.initSectionParticles();
        console.log('✨ Particle Manager initialized');
    },
    
    initHeroParticles() {
        const heroSections = document.querySelectorAll('.hero-section, .hero-banner');
        
        heroSections.forEach((section, index) => {
            const options = {
                particleCount: window.innerWidth > 768 ? 60 : 30,
                particleSize: 3,
                particleSpeed: 0.3,
                connectionDistance: 120,
                particleColor: 'rgba(46, 204, 113, 0.8)',
                connectionColor: 'rgba(46, 204, 113, 0.15)',
                mouseRadius: 120
            };
            
            const system = new ParticleSystem(section, options);
            this.systems.set(`hero-${index}`, system);
        });
    },
    
    initSectionParticles() {
        const particleSections = document.querySelectorAll('[data-particles]');
        
        particleSections.forEach((section, index) => {
            const type = section.dataset.particles || 'default';
            const options = this.getOptionsForType(type);
            
            let system;
            if (type === 'geometric') {
                system = new GeometricParticleSystem(section, options);
            } else {
                system = new ParticleSystem(section, options);
            }
            
            this.systems.set(`section-${index}`, system);
        });
    },
    
    getOptionsForType(type) {
        const baseOptions = {
            particleCount: window.innerWidth > 768 ? 40 : 20,
            mouseInteraction: true
        };
        
        switch (type) {
            case 'subtle':
                return {
                    ...baseOptions,
                    particleCount: 25,
                    particleColor: 'rgba(148, 163, 184, 0.4)',
                    connectionColor: 'rgba(148, 163, 184, 0.1)',
                    particleSpeed: 0.2
                };
                
            case 'geometric':
                return {
                    ...baseOptions,
                    particleCount: 20,
                    particleColor: 'rgba(46, 204, 113, 0.6)',
                    shapes: ['triangle', 'square', 'hexagon'],
                    rotationSpeed: 0.01
                };
                
            case 'floating':
                return {
                    ...baseOptions,
                    particleSpeed: 0.1,
                    particleColor: 'rgba(255, 255, 255, 0.6)',
                    connectionDistance: 80,
                    mouseRadius: 80
                };
                
            default:
                return baseOptions;
        }
    },
    
    pauseAll() {
        this.systems.forEach(system => system.pause());
    },
    
    resumeAll() {
        this.systems.forEach(system => system.resume());
    },
    
    destroyAll() {
        this.systems.forEach(system => system.destroy());
        this.systems.clear();
    }
};

// ========================
// 5. PERFORMANCE UTILITIES
// ========================

const PerformanceManager = {
    isHighPerformance: true,
    
    init() {
        this.detectPerformance();
        this.monitorFrameRate();
    },
    
    detectPerformance() {
        // Simple performance detection
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx || window.innerWidth < 768) {
            this.isHighPerformance = false;
            return;
        }
        
        // Check device memory if available
        if (navigator.deviceMemory && navigator.deviceMemory < 4) {
            this.isHighPerformance = false;
        }
        
        // Check connection speed
        if (navigator.connection && navigator.connection.effectiveType === 'slow-2g') {
            this.isHighPerformance = false;
        }
    },
    
    monitorFrameRate() {
        let frames = 0;
        let lastTime = performance.now();
        
        const checkFrameRate = () => {
            frames++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = frames;
                frames = 0;
                lastTime = currentTime;
                
                // Adjust particle systems based on FPS
                if (fps < 30 && this.isHighPerformance) {
                    this.isHighPerformance = false;
                    this.optimizeParticles();
                }
            }
            
            requestAnimationFrame(checkFrameRate);
        };
        
        requestAnimationFrame(checkFrameRate);
    },
    
    optimizeParticles() {
        ParticleManager.systems.forEach(system => {
            system.config.particleCount = Math.floor(system.config.particleCount * 0.6);
            system.createParticles();
        });
    }
};

// ========================
// 6. INITIALIZATION
// ========================

document.addEventListener('DOMContentLoaded', () => {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        console.log('✨ Particles disabled due to reduced motion preference');
        return;
    }
    
    // Initialize performance manager
    PerformanceManager.init();
    
    // Initialize particles only if performance allows
    if (PerformanceManager.isHighPerformance) {
        ParticleManager.init();
    }
});

// Handle page visibility
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        ParticleManager.pauseAll();
    } else {
        ParticleManager.resumeAll();
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    ParticleManager.destroyAll();
});

// Export for use in other scripts
window.ParticleSystem = ParticleSystem;
window.ParticleManager = ParticleManager;