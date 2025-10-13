// Simple JavaScript for Atlas Logged Landing Page

document.addEventListener('DOMContentLoaded', () => {
    detectSafari();
    initFAQ();
    initSmoothScroll();
    initMobileMenu();
});

// Safari Browser Detection for Progressive Enhancement
function detectSafari() {
    // Detect Safari browser (but not Chrome which also has Safari in UA)
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isSafari) {
        document.documentElement.classList.add('is-safari');
        console.log('%cSafari detected - using standard glassmorphism', 'color: #2563eb;');
        console.log('%c(Liquid glass distortion effects only work in Chromium)', 'color: #64748b; font-size: 11px;');
    } else {
        console.log('%cChromium detected - liquid glass distortion enabled!', 'color: #10b981;');
        console.log('%c(SVG filter-based refraction effects active on desktop)', 'color: #64748b; font-size: 11px;');
    }
}

// FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all FAQs
            faqItems.forEach(faq => faq.classList.remove('open'));

            // Toggle current FAQ
            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });
}

// Smooth Scroll for Navigation
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
}

// Console message
console.log('%cAtlas Logged', 'font-size: 24px; font-weight: bold; color: #2563eb;');
console.log('%cPrivacy-First Location Tracking', 'font-size: 14px; color: #64748b;');
