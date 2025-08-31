/**
 * Secure Authentication Module for ArtisticMinds Gallery
 * No hardcoded passwords - uses secure methods
 */

// Secure authentication configuration
const AUTH_CONFIG = {
    // Hash of the actual password (instead of plain text)
    // Generated using: await crypto.subtle.digest('SHA-256', encoder.encode('your_password'))
    ADMIN_PASSWORD_HASH: null, // Set this programmatically
    
    // Session settings
    SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
    MAX_LOGIN_ATTEMPTS: 3,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
    
    // Admin email (this can be public)
    ADMIN_EMAIL: 'admin@gallery.com'
};

/**
 * Generate password hash (run this once to generate hash)
 */
async function generatePasswordHash(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Secure password verification
 */
async function verifyPassword(inputPassword, storedHash) {
    const inputHash = await generatePasswordHash(inputPassword);
    return inputHash === storedHash;
}

/**
 * Initialize secure authentication
 */
async function initSecureAuth() {
    // Method 1: Prompt user for password on first setup
    let adminPasswordHash = localStorage.getItem('adminPasswordHash');
    
    if (!adminPasswordHash) {
        const setupPassword = prompt('🔒 First-time setup: Enter admin password for this gallery:');
        if (setupPassword) {
            adminPasswordHash = await generatePasswordHash(setupPassword);
            localStorage.setItem('adminPasswordHash', adminPasswordHash);
            alert('✅ Admin password configured securely!');
        } else {
            throw new Error('Admin password setup required');
        }
    }
    
    AUTH_CONFIG.ADMIN_PASSWORD_HASH = adminPasswordHash;
}

/**
 * Secure login function
 */
async function secureLogin(email, password) {
    try {
        // Check login attempts
        const attempts = getLoginAttempts();
        if (attempts.count >= AUTH_CONFIG.MAX_LOGIN_ATTEMPTS) {
            const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
            if (timeSinceLastAttempt < AUTH_CONFIG.LOCKOUT_DURATION) {
                const remainingTime = Math.ceil((AUTH_CONFIG.LOCKOUT_DURATION - timeSinceLastAttempt) / 60000);
                throw new Error(`Too many failed attempts. Try again in ${remainingTime} minutes.`);
            } else {
                // Reset attempts after lockout period
                resetLoginAttempts();
            }
        }
        
        // Verify credentials
        if (email === AUTH_CONFIG.ADMIN_EMAIL) {
            const isValidPassword = await verifyPassword(password, AUTH_CONFIG.ADMIN_PASSWORD_HASH);
            
            if (isValidPassword) {
                // Successful login
                resetLoginAttempts();
                const sessionData = {
                    email: email,
                    loginTime: Date.now(),
                    sessionId: generateSessionId()
                };
                localStorage.setItem('adminSession', JSON.stringify(sessionData));
                return { success: true, user: sessionData };
            }
        }
        
        // Failed login
        incrementLoginAttempts();
        throw new Error('Invalid credentials');
        
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

/**
 * Login attempt tracking
 */
function getLoginAttempts() {
    const attempts = localStorage.getItem('loginAttempts');
    return attempts ? JSON.parse(attempts) : { count: 0, lastAttempt: 0 };
}

function incrementLoginAttempts() {
    const attempts = getLoginAttempts();
    attempts.count++;
    attempts.lastAttempt = Date.now();
    localStorage.setItem('loginAttempts', JSON.stringify(attempts));
}

function resetLoginAttempts() {
    localStorage.removeItem('loginAttempts');
}

/**
 * Generate secure session ID
 */
function generateSessionId() {
    return Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    const session = localStorage.getItem('adminSession');
    if (!session) return false;
    
    try {
        const sessionData = JSON.parse(session);
        const sessionAge = Date.now() - sessionData.loginTime;
        
        if (sessionAge > AUTH_CONFIG.SESSION_TIMEOUT) {
            localStorage.removeItem('adminSession');
            return false;
        }
        
        return true;
    } catch (error) {
        localStorage.removeItem('adminSession');
        return false;
    }
}

/**
 * Logout function
 */
function logout() {
    localStorage.removeItem('adminSession');
    localStorage.removeItem('loginAttempts');
}

// Export functions for use
window.SecureAuth = {
    init: initSecureAuth,
    login: secureLogin,
    isAuthenticated,
    logout,
    generatePasswordHash // For development/setup only
};

