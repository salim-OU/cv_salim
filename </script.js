// DOM Elements
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const particlesContainer = document.getElementById('particles');

// Configuration
const config = {
    particlesCount: 50,
    animationSpeed: 0.5,
    maxParticleSize: 4
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initParticles();
    initNavigation();
    initScrollAnimations();
    initSkillBars();
    initTypingEffect();
    initSmoothScrolling();
    initVisitorCounter();
    initScrollNavigation();
});

// Navigation visibility on scroll
function initScrollNavigation() {
    const navMenu = document.querySelector('.nav-menu');
    const heroSection = document.querySelector('.hero-section');
    
    window.addEventListener('scroll', () => {
        const heroHeight = heroSection.offsetHeight;
        const scrollY = window.pageYOffset;
        
        if (scrollY > heroHeight * 0.8) {
            navMenu.classList.add('visible');
        } else {
            navMenu.classList.remove('visible');
        }
    });
}

// Particles Background Animation
function initParticles() {
    createParticles();
    animateParticles();
}

function createParticles() {
    for (let i = 0; i < config.particlesCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * config.maxParticleSize + 1}px;
            height: ${Math.random() * config.maxParticleSize + 1}px;
            background: rgba(100, 255, 218, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            pointer-events: none;
        `;
        
        // Add movement properties
        particle.speedX = (Math.random() - 0.5) * config.animationSpeed;
        particle.speedY = (Math.random() - 0.5) * config.animationSpeed;
        
        particlesContainer.appendChild(particle);
    }
}

function animateParticles() {
    const particles = document.querySelectorAll('.particle');
    
    function moveParticles() {
        particles.forEach(particle => {
            let rect = particle.getBoundingClientRect();
            let x = rect.left + particle.speedX;
            let y = rect.top + particle.speedY;
            
            // Bounce off edges
            if (x <= 0 || x >= window.innerWidth) {
                particle.speedX *= -1;
            }
            if (y <= 0 || y >= window.innerHeight) {
                particle.speedY *= -1;
            }
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
        });
        
        requestAnimationFrame(moveParticles);
    }
    
    moveParticles();
}

// Navigation functionality
function initNavigation() {
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    navLinks.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // Update active navigation item on scroll
    updateActiveNavItem();
}

function updateActiveNavItem() {
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    });
}

// Scroll animations with Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add animation classes to elements
    const animatedElements = document.querySelectorAll(`
        .timeline-content,
        .education-card,
        .project-card,
        .contact-item,
        .stat-card
    `);

    animatedElements.forEach((element, index) => {
        element.classList.add('fade-in');
        // Add stagger effect
        element.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(element);
    });

    // Special animations for specific elements
    const leftElements = document.querySelectorAll('.about-text');
    const rightElements = document.querySelectorAll('.about-stats');

    leftElements.forEach(element => {
        element.classList.add('slide-in-left');
        observer.observe(element);
    });

    rightElements.forEach(element => {
        element.classList.add('slide-in-right');
        observer.observe(element);
    });
}

// Animated skill bars
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.getAttribute('data-width');
                
                setTimeout(() => {
                    skillBar.style.width = width + '%';
                }, 200);
                
                skillObserver.unobserve(skillBar);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// Typing effect for hero title
function initTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const texts = [
        'Développeur Full-Stack',
        'Expert Java/Spring Boot',
        'Spécialiste APIs REST',
        'Passionné de Code'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 150;
    
    function typeText() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 75;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 150;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            setTimeout(() => {
                isDeleting = true;
            }, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }
        
        setTimeout(typeText, typingSpeed);
    }
    
    // Start typing effect after page load
    setTimeout(typeText, 1000);
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Visitor counter (invisible tracking)
function initVisitorCounter() {
    // Simple invisible visitor tracking
    try {
        // Use an API or localStorage for visitor counting
        fetch('https://api.countapi.xyz/hit/salim-cv-2025/visits')
            .then(response => response.json())
            .then(data => {
                console.log(`Visitor count: ${data.value}`);
                // Store for potential future use
                sessionStorage.setItem('visitorCount', data.value);
            })
            .catch(error => {
                console.log('Visitor tracking unavailable');
            });
    } catch (error) {
        console.log('Visitor counter initialization failed');
    }
}

// Utility functions
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

// Performance optimizations
window.addEventListener('scroll', throttle(updateScrollProgress, 10));

function updateScrollProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    // Could be used for a progress bar
    document.documentElement.style.setProperty('--scroll-progress', scrollPercent + '%');
}

// Interactive hover effects
document.addEventListener('mouseover', (e) => {
    // Add hover effects to cards
    if (e.target.closest('.timeline-content, .project-card, .education-card')) {
        e.target.closest('.timeline-content, .project-card, .education-card').style.transform = 'translateY(-5px) scale(1.02)';
    }
});

document.addEventListener('mouseout', (e) => {
    if (e.target.closest('.timeline-content, .project-card, .education-card')) {
        e.target.closest('.timeline-content, .project-card, .education-card').style.transform = '';
    }
});

// Dynamic background gradient based on scroll
window.addEventListener('scroll', throttle(() => {
    const scrollPercent = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);
    const hue = Math.floor(scrollPercent * 60) + 220; // From blue to purple
    document.body.style.background = `linear-gradient(135deg, hsl(${hue}, 70%, 8%) 0%, hsl(${hue + 20}, 60%, 12%) 100%)`;
}, 100));

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    // Fun animation when Konami code is entered
    document.body.style.animation = 'rainbow 2s linear infinite';
    
    setTimeout(() => {
        document.body.style.animation = '';
        alert('🎉 Konami code activé ! Développeur confirmé détecté ! 🎉');
    }, 2000);
}

// Add rainbow animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Print optimization
window.addEventListener('beforeprint', () => {
    // Hide interactive elements before printing
    document.querySelectorAll('.nav-menu, #particles').forEach(el => {
        el.style.display = 'none';
    });
});

window.addEventListener('afterprint', () => {
    // Restore interactive elements after printing
    document.querySelectorAll('.nav-menu, #particles').forEach(el => {
        el.style.display = '';
    });
});

// Error handling for all async operations
window.addEventListener('error', (e) => {
    console.log('Error caught:', e.error);
    // Graceful degradation - don't break the page
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page loaded in ${Math.round(loadTime)}ms`);
    });
}
