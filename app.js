// Custom Cursor
class CustomCursor {
    constructor() {
        this.cursor = document.querySelector('.cursor');
        this.follower = document.querySelector('.cursor-follower');
        this.init();
    }

    init() {
        if (window.innerWidth > 768) {
            document.addEventListener('mousemove', (e) => {
                this.cursor.style.left = e.clientX + 'px';
                this.cursor.style.top = e.clientY + 'px';
                
                setTimeout(() => {
                    this.follower.style.left = e.clientX - 20 + 'px';
                    this.follower.style.top = e.clientY - 20 + 'px';
                }, 100);
            });

            // Hover effects
            const hoverElements = document.querySelectorAll('a, button, .project-card, .achievement-card');
            hoverElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    this.cursor.style.transform = 'scale(2)';
                    this.follower.style.transform = 'scale(1.5)';
                    this.follower.style.borderColor = '#6c5ce7';
                });

                el.addEventListener('mouseleave', () => {
                    this.cursor.style.transform = 'scale(1)';
                    this.follower.style.transform = 'scale(1)';
                    this.follower.style.borderColor = '#6c5ce7';
                });
            });
        }
    }
}

// Typing Effect
class TypingEffect {
    constructor(element, texts, typeSpeed = 100, deleteSpeed = 50, delayBetween = 2000) {
        this.element = element;
        this.texts = texts;
        this.typeSpeed = typeSpeed;
        this.deleteSpeed = deleteSpeed;
        this.delayBetween = delayBetween;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = this.delayBetween;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Smooth Scrolling
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Navigation functionality
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navMenu = document.querySelector('.nav-menu');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => {
                this.navMenu.classList.toggle('active');
                this.animateHamburger();
            });
        }

        // Close mobile menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                scrollToSection(targetId);
                this.navMenu.classList.remove('active');
            });
        });

        // Navbar background on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.navbar.style.background = 'rgba(26, 26, 46, 0.95)';
            } else {
                this.navbar.style.background = 'rgba(26, 26, 46, 0.9)';
            }
        });

        // Active nav link highlighting
        this.updateActiveNavLink();
        window.addEventListener('scroll', () => this.updateActiveNavLink());
    }

    animateHamburger() {
        const bars = document.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            bar.style.transform = this.navMenu.classList.contains('active') 
                ? `rotate(${index === 0 ? 45 : index === 1 ? 0 : -45}deg) translate(${index === 1 ? '10px' : '0'}, ${index === 0 ? '6px' : index === 2 ? '-6px' : '0'})`
                : 'none';
            bar.style.opacity = index === 1 && this.navMenu.classList.contains('active') ? '0' : '1';
        });
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        // Fade in animation observer
        this.fadeInObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                    this.fadeInObserver.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        // Apply fade-in animations
        const fadeElements = document.querySelectorAll('.section-header, .about-text, .achievement-card, .project-card, .floating-card, .contact-detail-item');
        fadeElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            this.fadeInObserver.observe(el);
        });

        // Skills animation observer
        this.skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSkills();
                    this.skillsObserver.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        const skillsSection = document.querySelector('.skills-section');
        if (skillsSection) {
            this.skillsObserver.observe(skillsSection);
        }
    }

    animateSkills() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width + '%';
            }, index * 200);
        });
    }
}

// 3D Card Effects
class Card3D {
    constructor() {
        this.init();
    }

    init() {
        const cards = document.querySelectorAll('.card-3d, .project-card, .achievement-card, .floating-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) rotateX(5deg) rotateY(5deg)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
            });

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10;
                const rotateY = -(x - centerX) / 10;

                card.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
            });
        });
    }
}

// Parallax Effect
class ParallaxEffect {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.particles');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
}

// Form Handler
class FormHandler {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });

            // Floating label effects
            const inputs = document.querySelectorAll('.form-input');
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    input.parentElement.classList.add('focused');
                });

                input.addEventListener('blur', () => {
                    if (input.value === '') {
                        input.parentElement.classList.remove('focused');
                    }
                });

                // Check if input has value on load
                if (input.value !== '') {
                    input.parentElement.classList.add('focused');
                }
            });
        }
    }

    handleSubmit() {
        const submitButton = document.querySelector('.contact-submit');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = 'Sending...';
        submitButton.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            submitButton.innerHTML = 'Message Sent! ✓';
            submitButton.style.background = 'linear-gradient(135deg, #00b894, #00cec9)';
            
            // Reset form
            this.form.reset();
            document.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('focused');
            });

            // Reset button after 3 seconds
            setTimeout(() => {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                submitButton.style.background = '';
            }, 3000);
        }, 2000);
    }
}

// Particle System Enhancement
class ParticleSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.init();
    }

    init() {
        this.createCanvas();
        if (this.canvas && window.innerWidth > 768) {
            this.createParticles();
            this.animate();
            this.handleResize();
        }
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
            this.resizeCanvas();
        }
    }

    resizeCanvas() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }

    createParticles() {
        const particleCount = Math.min(50, Math.floor(window.innerWidth / 20));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2,
                color: Math.random() > 0.5 ? '#6c5ce7' : '#74b9ff'
            });
        }
    }

    animate() {
        if (!this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Wrap around edges
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.y > this.canvas.height) particle.y = 0;
            if (particle.y < 0) particle.y = this.canvas.height;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fill();
        });

        // Draw connections
        this.drawConnections();
        
        requestAnimationFrame(() => this.animate());
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = '#6c5ce7';
                    this.ctx.globalAlpha = (100 - distance) / 100 * 0.2;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.particles = [];
            this.createParticles();
        });
    }
}

// Performance Optimization
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        // Reduce animations on low-end devices
        if (this.isLowEndDevice()) {
            this.disableHeavyAnimations();
        }

        // Pause animations when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });
    }

    isLowEndDevice() {
        return window.navigator.hardwareConcurrency < 4 || 
               window.navigator.deviceMemory < 4;
    }

    disableHeavyAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            .particles::before,
            .particles::after {
                display: none;
            }
            .rotating-icon {
                animation: none;
            }
        `;
        document.head.appendChild(style);
    }

    pauseAnimations() {
        document.body.style.animationPlayState = 'paused';
    }

    resumeAnimations() {
        document.body.style.animationPlayState = 'running';
    }
}

// Loading Animation
class LoadingAnimation {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('load', () => {
            // Hide loading animation if any
            const loader = document.querySelector('.loader');
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 300);
            }

            // Start entrance animations
            this.startEntranceAnimations();
        });
    }

    startEntranceAnimations() {
        // Animate hero elements
        const heroElements = document.querySelectorAll('.hero-text, .hero-card');
        heroElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.8s ease-out';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize typing effect
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        new TypingEffect(typingElement, ['ANUJ YADAV'], 150, 50, 1000);
    }

    // Initialize all other components
    new CustomCursor();
    new Navigation();
    new ScrollAnimations();
    new Card3D();
    new ParallaxEffect();
    new FormHandler();
    new ParticleSystem();
    new PerformanceOptimizer();
    new LoadingAnimation();

    // Add smooth reveal animation for sections
    const sections = document.querySelectorAll('section');
    const revealSection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    };

    const sectionObserver = new IntersectionObserver(revealSection, {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 0.8s ease-out';
        sectionObserver.observe(section);
    });
});

// Utility Functions
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
    }
}

// Add optimized scroll handler
const optimizedScrollHandler = throttle(() => {
    // Handle scroll-based animations here
    const scrollTop = window.pageYOffset;
    
    // Update parallax elements
    const parallaxElements = document.querySelectorAll('.floating-card');
    parallaxElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const speed = 0.1;
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            element.style.transform = `translateY(${scrollTop * speed}px)`;
        }
    });
}, 16);

window.addEventListener('scroll', optimizedScrollHandler);

// Enhanced mobile experience
if (window.innerWidth <= 768) {
    // Disable heavy animations on mobile
    document.body.classList.add('mobile-device');
    
    // Add touch-friendly interactions
    const cards = document.querySelectorAll('.project-card, .achievement-card');
    cards.forEach(card => {
        card.addEventListener('touchstart', () => {
            card.style.transform = 'scale(0.95)';
        });
        
        card.addEventListener('touchend', () => {
            card.style.transform = 'scale(1)';
        });
    });
}

// Add CSS class for reduced motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('reduce-motion');
}