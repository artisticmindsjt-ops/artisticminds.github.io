// Utility functions for ArtisticMinds Gallery
// Note: No imports to avoid circular dependencies

// Local Storage utilities
export const storage = {
    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },
    
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            return false;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    }
};

// DOM utilities
export const dom = {
    $(selector) {
        return document.querySelector(selector);
    },
    
    $$(selector) {
        return document.querySelectorAll(selector);
    },
    
    create(tag, className = '', attributes = {}) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
        
        return element;
    },
    
    hide(element) {
        if (element) element.style.display = 'none';
    },
    
    show(element, display = 'block') {
        if (element) element.style.display = display;
    },
    
    addClass(element, className) {
        if (element) element.classList.add(className);
    },
    
    removeClass(element, className) {
        if (element) element.classList.remove(className);
    },
    
    toggleClass(element, className) {
        if (element) element.classList.toggle(className);
    }
};

// Animation utilities
export const animation = {
    fadeIn(element, duration = 300) {
        if (!element) return;
        
        element.style.opacity = '0';
        element.style.display = 'block';
        
        const start = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    },
    
    fadeOut(element, duration = 300) {
        if (!element) return;
        
        const start = performance.now();
        const startOpacity = parseFloat(getComputedStyle(element).opacity);
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = startOpacity * (1 - progress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        };
        
        requestAnimationFrame(animate);
    },
    
    slideIn(element, direction = 'left', duration = 300) {
        if (!element) return;
        
        const transform = direction === 'left' ? 'translateX(-100%)' : 'translateX(100%)';
        element.style.transform = transform;
        element.style.display = 'block';
        
        requestAnimationFrame(() => {
            element.style.transition = `transform ${duration}ms ease`;
            element.style.transform = 'translateX(0)';
        });
    }
};

// Validation utilities
export const validation = {
    isEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    isRequired(value) {
        return value !== null && value !== undefined && value.toString().trim() !== '';
    },
    
    isNumber(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    },
    
    isPositiveNumber(value) {
        return this.isNumber(value) && parseFloat(value) > 0;
    },
    
    minLength(value, min) {
        return value && value.toString().length >= min;
    },
    
    maxLength(value, max) {
        return value && value.toString().length <= max;
    }
};

// Format utilities
export const format = {
    currency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },
    
    date(date, options = { year: 'numeric', month: 'long', day: 'numeric' }) {
        return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
    },
    
    number(number) {
        return new Intl.NumberFormat('en-US').format(number);
    },
    
    truncate(text, length = 100, suffix = '...') {
        if (!text || text.length <= length) return text;
        return text.substring(0, length).trim() + suffix;
    },
    
    capitalize(text) {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    },
    
    slugify(text) {
        return text
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-');
    }
};

// Event utilities
export const events = {
    on(element, event, handler) {
        if (element && typeof handler === 'function') {
            element.addEventListener(event, handler);
        }
    },
    
    off(element, event, handler) {
        if (element && typeof handler === 'function') {
            element.removeEventListener(event, handler);
        }
    },
    
    once(element, event, handler) {
        if (element && typeof handler === 'function') {
            const onceHandler = (e) => {
                handler(e);
                element.removeEventListener(event, onceHandler);
            };
            element.addEventListener(event, onceHandler);
        }
    },
    
    delegate(parent, selector, event, handler) {
        if (parent && typeof handler === 'function') {
            parent.addEventListener(event, (e) => {
                const target = e.target.closest(selector);
                if (target) {
                    handler.call(target, e);
                }
            });
        }
    }
};

// Debounce and throttle utilities
export const debounce = (func, wait) => {
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

export const throttle = (func, limit) => {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Random ID generator
export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// URL utilities
export const url = {
    getParams() {
        return new URLSearchParams(window.location.search);
    },
    
    getParam(key) {
        return this.getParams().get(key);
    },
    
    setParam(key, value) {
        const url = new URL(window.location);
        url.searchParams.set(key, value);
        window.history.replaceState({}, '', url);
    },
    
    removeParam(key) {
        const url = new URL(window.location);
        url.searchParams.delete(key);
        window.history.replaceState({}, '', url);
    }
};
