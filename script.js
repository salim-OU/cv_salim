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
    
    // Performance monitoring
    logPagePerformance();
});

// Navigation visibility on scroll (but nav is invisible anyway)
function initScrollNavigation() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return; // Skip if nav doesn't exist
    
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    window.addEventListener('scroll', () => {
        const heroHeight = heroSection.offsetHeight;
        const scrollY = window.pageYOffset;
        
        // Navigation remains invisible as per CSS
        if (scrollY > heroHeight * 0.8) {
            navMenu.classList.add('visible');
        } else {
            navMenu.classList.remove('visible');
        }
    });
}

// Particles Background Animation
function initParticles() {
    if (!particlesContainer) return;
    
    createParticles();
    animateParticles();
}

function createParticles() {
    const colors = [
        'rgba(231, 76, 60, 0.6)',   // Red
        'rgba(52, 152, 219, 0.6)',  // Blue  
        'rgba(46, 204, 113, 0.6)',  // Green
        'rgba(155, 89, 182, 0.6)',  // Purple
        'rgba(241, 196, 15, 0.6)'   // Yellow
    ];
    
    for (let i = 0; i < config.particlesCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * config.maxParticleSize + 1}px;
            height: ${Math.random() * config.maxParticleSize + 1}px;
            background: ${color};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            pointer-events: none;
            box-shadow: 0 0 6px ${color};
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
            let x = parseFloat(particle.style.left) || rect.left;
            let y = parseFloat(particle.style.top) || rect.top;
            
            x += particle.speedX;
            y += particle.speedY;
            
            // Bounce off edges
            if (x <= 0 || x >= window.innerWidth - 10) {
                particle.speedX *= -1;
            }
            if (y <= 0 || y >= window.innerHeight - 10) {
                particle.speedY *= -1;
            }
            
            particle.style.left = Math.max(0, Math.min(x, window.innerWidth - 10)) + 'px';
            particle.style.top = Math.max(0, Math.min(y, window.innerHeight - 10)) + 'px';
        });
        
        requestAnimationFrame(moveParticles);
    }
    
    moveParticles();
}

// Navigation functionality (even though nav is invisible)
function initNavigation() {
    if (!navToggle || !navLinks) return;
    
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

    if (!sections.length || !navItems.length) return;

    window.addEventListener('scroll', throttle(() => {
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
    }, 100));
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
                // Track section view locally
                trackSectionView(entry.target.id);
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
    
    if (!skillBars.length) return;
    
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
        'Passionné de Code',
        'Architecte Logiciel'
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

// Enhanced Local Visitor Counter with unique visitor detection
function initVisitorCounter() {
    trackUniqueVisitor();
    displayVisitorStats();
}

function trackUniqueVisitor() {
    try {
        const now = new Date();
        const today = now.toDateString();
        const visitTime = now.toISOString();
        
        // Create a unique fingerprint for the visitor
        const fingerprint = generateVisitorFingerprint();
        
        // Check if this is a unique visitor today
        const dailyVisitorsKey = `dailyVisitors_${today}`;
        const todayVisitors = JSON.parse(localStorage.getItem(dailyVisitorsKey) || '[]');
        
        // Check if visitor already visited today (within 30 minutes)
        const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
        const recentVisit = todayVisitors.find(visitor => 
            visitor.fingerprint === fingerprint && 
            new Date(visitor.lastVisit) > thirtyMinutesAgo
        );
        
        let totalVisitors = parseInt(localStorage.getItem('totalVisitors') || '0');
        let dailyVisitors = todayVisitors.length;
        
        if (!recentVisit) {
            // New unique visitor or returning after 30+ minutes
            totalVisitors++;
            localStorage.setItem('totalVisitors', totalVisitors.toString());
            
            // Add or update visitor in today's list
            const existingVisitorIndex = todayVisitors.findIndex(v => v.fingerprint === fingerprint);
            if (existingVisitorIndex >= 0) {
                // Update existing visitor's last visit time
                todayVisitors[existingVisitorIndex].lastVisit = visitTime;
                todayVisitors[existingVisitorIndex].visitCount++;
            } else {
                // New visitor today
                dailyVisitors++;
                todayVisitors.push({
                    fingerprint: fingerprint,
                    firstVisit: visitTime,
                    lastVisit: visitTime,
                    visitCount: 1
                });
            }
            
            localStorage.setItem(dailyVisitorsKey, JSON.stringify(todayVisitors));
            
            console.log(`👤 Visiteur unique total n°${totalVisitors}`);
            console.log(`📅 Visiteur unique du jour n°${dailyVisitors}`);
        } else {
            // Same visitor within 30 minutes - don't count as new visit
            console.log(`🔄 Visiteur déjà compté (dernière visite: ${new Date(recentVisit.lastVisit).toLocaleTimeString()})`);
            console.log(`👤 Total visiteurs: ${totalVisitors}`);
            console.log(`📅 Visiteurs du jour: ${dailyVisitors}`);
        }
        
        // Generate session ID for current session
        const sessionId = generateSessionId();
        
        // Track session data
        const sessionData = {
            sessionId: sessionId,
            fingerprint: fingerprint,
            timestamp: visitTime,
            screen: `${screen.width}x${screen.height}`,
            userAgent: navigator.userAgent.substring(0, 100),
            referrer: document.referrer || 'Direct',
            language: navigator.language,
            platform: navigator.platform,
            isUniqueVisit: !recentVisit
        };
        
        sessionStorage.setItem('currentSession', JSON.stringify(sessionData));
        console.log(`🔗 Session: ${sessionId}`);
        
        // Store visit history (only unique visits)
        if (!recentVisit) {
            let visitHistory = JSON.parse(localStorage.getItem('visitHistory') || '[]');
            visitHistory.unshift({
                date: visitTime,
                sessionId: sessionId,
                fingerprint: fingerprint
            });
            
            // Keep only last 20 visits
            visitHistory = visitHistory.slice(0, 20);
            localStorage.setItem('visitHistory', JSON.stringify(visitHistory));
        }
        
        // Clean old daily counters (keep only last 30 days)
        cleanOldDailyCounters();
        
    } catch (error) {
        console.log('Erreur de tracking unique:', error);
    }
}

function generateVisitorFingerprint() {
    // Create a semi-unique fingerprint based on browser characteristics
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Browser fingerprint', 2, 2);
    
    const fingerprint = btoa([
        navigator.userAgent,
        navigator.language,
        screen.width + 'x' + screen.height,
        screen.colorDepth,
        new Date().getTimezoneOffset(),
        navigator.platform,
        navigator.hardwareConcurrency || 'unknown',
        canvas.toDataURL().slice(0, 50) // Canvas fingerprint (partial)
    ].join('|')).slice(0, 32);
    
    return fingerprint;
}

function getVisitorStats() {
    const totalVisitors = parseInt(localStorage.getItem('totalVisitors') || '0');
    const today = new Date().toDateString();
    const dailyKey = `dailyVisitors_${today}`;
    const todayVisitors = JSON.parse(localStorage.getItem(dailyKey) || '[]');
    const dailyCount = todayVisitors.length;
    
    const sessionData = JSON.parse(sessionStorage.getItem('currentSession') || '{}');
    const visitHistory = JSON.parse(localStorage.getItem('visitHistory') || '[]');
    
    // Get section views
    const sectionStats = {};
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('section_')) {
            const sectionName = key.replace('section_', '');
            sectionStats[sectionName] = parseInt(localStorage.getItem(key) || '0');
        }
    });
    
    // Calculate returning visitors
    const returningVisitors = todayVisitors.filter(v => v.visitCount > 1).length;
    
    return {
        total: totalVisitors,
        today: dailyCount,
        todayReturning: returningVisitors,
        session: sessionData,
        visitHistory: visitHistory,
        sectionViews: sectionStats,
        todayDetails: todayVisitors.map(v => ({
            visits: v.visitCount,
            firstVisit: new Date(v.firstVisit).toLocaleTimeString(),
            lastVisit: new Date(v.lastVisit).toLocaleTimeString()
        })),
        timestamp: new Date().toISOString()
    };
}

function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function cleanOldDailyCounters() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('dailyVisitors_')) {
            const dateStr = key.replace('dailyVisitors_', '');
            const date = new Date(dateStr);
            
            if (date < thirtyDaysAgo) {
                localStorage.removeItem(key);
            }
        }
    });
}

function trackSectionView(sectionId) {
    if (!sectionId) return;
    
    // Only track if section hasn't been viewed in this session
    const sessionViews = JSON.parse(sessionStorage.getItem('sectionViews') || '[]');
    if (sessionViews.includes(sectionId)) {
        return; // Already tracked in this session
    }
    
    sessionViews.push(sectionId);
    sessionStorage.setItem('sectionViews', JSON.stringify(sessionViews));
    
    const sectionKey = `section_${sectionId}`;
    let sectionViews = parseInt(localStorage.getItem(sectionKey) || '0');
    sectionViews++;
    localStorage.setItem(sectionKey, sectionViews.toString());
    
    console.log(`👁️ Section "${sectionId}" vue ${sectionViews} fois`);
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

// Performance monitoring
function logPagePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                const loadTime = Math.round(performance.now());
                
                console.group('⚡ Performance');
                console.log(`Temps de chargement: ${loadTime}ms`);
                if (perfData) {
                    console.log(`DNS: ${Math.round(perfData.domainLookupEnd - perfData.domainLookupStart)}ms`);
                    console.log(`Connexion: ${Math.round(perfData.connectEnd - perfData.connectStart)}ms`);
                    console.log(`DOM ready: ${Math.round(perfData.domContentLoadedEventEnd - perfData.navigationStart)}ms`);
                }
                console.groupEnd();
            }, 1000);
        });
    }
}

// Performance optimizations
window.addEventListener('scroll', throttle(updateScrollProgress, 16));

function updateScrollProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.max(0, Math.min(100, (scrollTop / docHeight) * 100));
    
    document.documentElement.style.setProperty('--scroll-progress', scrollPercent + '%');
}

// Interactive hover effects
document.addEventListener('mouseover', (e) => {
    const card = e.target.closest('.timeline-content, .project-card, .education-card');
    if (card && !card.classList.contains('hovering')) {
        card.classList.add('hovering');
        card.style.transform = 'translateY(-5px) scale(1.02)';
    }
});

document.addEventListener('mouseout', (e) => {
    const card = e.target.closest('.timeline-content, .project-card, .education-card');
    if (card && card.classList.contains('hovering')) {
        card.classList.remove('hovering');
        card.style.transform = '';
    }
});

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
    document.body.style.animation = 'rainbow 2s linear infinite';
    console.log('🎉 Konami code activé !');
    
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
    
    .particle {
        transition: all 0.3s ease;
    }
    
    .hovering {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
`;
document.head.appendChild(style);

// Print optimization
window.addEventListener('beforeprint', () => {
    document.querySelectorAll('#particles').forEach(el => {
        el.style.display = 'none';
    });
});

window.addEventListener('afterprint', () => {
    document.querySelectorAll('#particles').forEach(el => {
        el.style.display = '';
    });
});

// Error handling for all async operations
window.addEventListener('error', (e) => {
    console.log('Erreur capturée:', e.error);
});

// Page visibility API for accurate tracking
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        console.log('👀 Page visible');
    } else {
        console.log('🔇 Page cachée');
    }
});

// Export functions for potential external use
window.CVAnalytics = {
    getStats: getVisitorStats,
    displayStats: displayVisitorStats,
    generateSessionId: generateSessionId
};
