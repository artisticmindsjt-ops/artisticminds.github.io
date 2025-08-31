/**
 * Enhanced Secure Storage for ArtisticMinds Gallery
 * Provides encrypted password storage options
 */

class SecureStorage {
    
    /**
     * Method 1: Hash-based storage (current best option for client-side)
     */
    static async storePasswordHash(password) {
        // Generate salt for extra security
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
        
        // Create password hash with salt
        const encoder = new TextEncoder();
        const data = encoder.encode(password + saltHex);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        // Store hash and salt separately
        localStorage.setItem('adminPasswordHash', hashHex);
        localStorage.setItem('adminPasswordSalt', saltHex);
        
        return { hash: hashHex, salt: saltHex };
    }
    
    /**
     * Verify password against stored hash
     */
    static async verifyPassword(inputPassword) {
        const storedHash = localStorage.getItem('adminPasswordHash');
        const storedSalt = localStorage.getItem('adminPasswordSalt');
        
        if (!storedHash || !storedSalt) {
            return false;
        }
        
        // Hash input password with stored salt
        const encoder = new TextEncoder();
        const data = encoder.encode(inputPassword + storedSalt);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const inputHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        return inputHash === storedHash;
    }
    
    /**
     * Method 2: Encrypted storage using Web Crypto API
     */
    static async storeEncryptedPassword(password, userKey) {
        try {
            // Generate encryption key from user input
            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                new TextEncoder().encode(userKey),
                { name: 'PBKDF2' },
                false,
                ['deriveKey']
            );
            
            // Derive encryption key
            const key = await crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt: new TextEncoder().encode('artisticminds-salt'),
                    iterations: 100000,
                    hash: 'SHA-256'
                },
                keyMaterial,
                { name: 'AES-GCM', length: 256 },
                false,
                ['encrypt', 'decrypt']
            );
            
            // Encrypt password
            const iv = crypto.getRandomValues(new Uint8Array(12));
            const encodedPassword = new TextEncoder().encode(password);
            const encryptedPassword = await crypto.subtle.encrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                encodedPassword
            );
            
            // Store encrypted data
            const encryptedData = {
                data: Array.from(new Uint8Array(encryptedPassword)),
                iv: Array.from(iv)
            };
            
            localStorage.setItem('encryptedAdminPassword', JSON.stringify(encryptedData));
            return true;
            
        } catch (error) {
            console.error('Encryption failed:', error);
            return false;
        }
    }
    
    /**
     * Decrypt and verify password
     */
    static async verifyEncryptedPassword(inputPassword, userKey) {
        try {
            const encryptedData = JSON.parse(localStorage.getItem('encryptedAdminPassword'));
            if (!encryptedData) return false;
            
            // Recreate key
            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                new TextEncoder().encode(userKey),
                { name: 'PBKDF2' },
                false,
                ['deriveKey']
            );
            
            const key = await crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt: new TextEncoder().encode('artisticminds-salt'),
                    iterations: 100000,
                    hash: 'SHA-256'
                },
                keyMaterial,
                { name: 'AES-GCM', length: 256 },
                false,
                ['encrypt', 'decrypt']
            );
            
            // Decrypt stored password
            const decryptedPassword = await crypto.subtle.decrypt(
                {
                    name: 'AES-GCM',
                    iv: new Uint8Array(encryptedData.iv)
                },
                key,
                new Uint8Array(encryptedData.data)
            );
            
            const storedPassword = new TextDecoder().decode(decryptedPassword);
            return storedPassword === inputPassword;
            
        } catch (error) {
            console.error('Decryption failed:', error);
            return false;
        }
    }
    
    /**
     * Method 3: Session-only storage (most secure)
     */
    static storeSessionPassword(password) {
        // Store only for current session
        sessionStorage.setItem('adminPassword', password);
    }
    
    static getSessionPassword() {
        return sessionStorage.getItem('adminPassword');
    }
    
    /**
     * Clear all stored passwords
     */
    static clearAllPasswords() {
        localStorage.removeItem('secureAdminPassword');
        localStorage.removeItem('adminPasswordHash');
        localStorage.removeItem('adminPasswordSalt');
        localStorage.removeItem('encryptedAdminPassword');
        sessionStorage.removeItem('adminPassword');
    }
    
    /**
     * Get storage information
     */
    static getStorageInfo() {
        return {
            plainTextPassword: !!localStorage.getItem('secureAdminPassword'),
            hashedPassword: !!localStorage.getItem('adminPasswordHash'),
            encryptedPassword: !!localStorage.getItem('encryptedAdminPassword'),
            sessionPassword: !!sessionStorage.getItem('adminPassword'),
            storageLocation: 'Browser localStorage/sessionStorage',
            security: {
                plainText: 'Low - visible in dev tools',
                hashed: 'Medium - protected against casual viewing',
                encrypted: 'High - requires decryption key',
                session: 'High - cleared when browser closes'
            }
        };
    }
}

// Usage examples:
console.log('🔒 Secure Storage Methods Available:');
console.log('1. Hash-based: SecureStorage.storePasswordHash(password)');
console.log('2. Encrypted: SecureStorage.storeEncryptedPassword(password, userKey)');
console.log('3. Session-only: SecureStorage.storeSessionPassword(password)');
console.log('4. Info: SecureStorage.getStorageInfo()');

// Export for use
window.SecureStorage = SecureStorage;

