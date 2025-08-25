/* ==========================================
   AEC - Algemene Economie C-cluster
   Shared JavaScript Functionality
   Version: 1.0
   ========================================== */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // Navigation Enhancement
    // ==========================================
    const portalCards = document.querySelectorAll('.portal-card');
    
    portalCards.forEach(card => {
        // Add ripple effect on click
        card.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Add keyboard navigation
        const link = card.querySelector('.card-link');
        if (link) {
            link.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        }
    });
    
    // ==========================================
    // Smooth Scroll for Anchor Links
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ==========================================
    // Lazy Loading for Images (if any)
    // ==========================================
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
    
    // ==========================================
    // Print Optimization
    // ==========================================
    window.addEventListener('beforeprint', function() {
        document.body.classList.add('printing');
    });
    
    window.addEventListener('afterprint', function() {
        document.body.classList.remove('printing');
    });
    
    // ==========================================
    // Accessibility Enhancements
    // ==========================================
    
    // Add focus visible polyfill for better keyboard navigation
    function applyFocusVisiblePolyfill() {
        const hadKeyboardEvent = true;
        const keyboardThrottleTimeoutID = 0;
        
        // Add or remove 'focus-visible' class based on keyboard vs mouse
        document.addEventListener('keydown', function() {
            document.body.classList.add('keyboard-nav');
        });
        
        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-nav');
        });
    }
    
    applyFocusVisiblePolyfill();
    
    // ==========================================
    // Performance Monitoring (Development)
    // ==========================================
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.addEventListener('load', function() {
            if (window.performance && window.performance.timing) {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`Page Load Time: ${pageLoadTime}ms`);
            }
        });
    }
    
    // ==========================================
    // Service Worker Registration (for PWA)
    // ==========================================
    if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful');
        }).catch(function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    }
    
    // ==========================================
    // Theme Detection and Application
    // ==========================================
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    function applyTheme(isDark) {
        if (isDark) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }
    
    // Apply initial theme
    applyTheme(prefersDarkScheme.matches);
    
    // Listen for theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        applyTheme(e.matches);
    });
    
});

// ==========================================
// Utility Functions (Global)
// ==========================================

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - Success status
 */
window.copyToClipboard = async function(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            return successful;
        }
    } catch (err) {
        console.error('Failed to copy text: ', err);
        return false;
    }
};

/**
 * Format date to Dutch locale
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date string
 */
window.formatDateNL = function(date) {
    return new Intl.DateTimeFormat('nl-NL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
};

/**
 * Debounce function for performance
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
window.debounce = function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// ==========================================
// Ripple Effect CSS (injected dynamically)
// ==========================================
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .portal-card {
        position: relative;
        overflow: hidden;
    }
    
    .keyboard-nav *:focus {
        outline: 2px solid var(--primary-green);
        outline-offset: 2px;
    }
    
    body:not(.keyboard-nav) *:focus {
        outline: none;
    }
`;
document.head.appendChild(style);

console.log('AEC Website JavaScript loaded successfully');