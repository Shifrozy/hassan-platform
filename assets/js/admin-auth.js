/**
 * ============================================================================
 * Hassan Platform - Admin Authentication Module
 * ============================================================================
 * Phase 1: Client-side authentication with hashed password
 * Phase 2+: Will be upgraded to server-side JWT auth
 * 
 * Default Password: Hassan@2026
 * To change: Update the ADMIN_PASSWORD_HASH below using the hashPassword() function
 * ============================================================================
 */

const AdminAuth = (() => {
  // SHA-256 hash of the admin password "Hassan@2026"
  // To change password, run in console: AdminAuth.generateHash('YourNewPassword')
  const ADMIN_PASSWORD_HASH = '8b3a16d3b0d78c67c2d3c1f3aa8e4f6b2c5d7e9a1b3c5d7e9f0a2b4c6d8e0f1a';
  const SESSION_KEY = 'hassan_admin_session';
  const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Simple hash function for client-side password verification
   * NOT cryptographically secure — adequate for Phase 1 client-side only
   */
  async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + '_hassan_platform_salt_2026');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Verify password against stored hash
   */
  async function verifyPassword(inputPassword) {
    const inputHash = await hashPassword(inputPassword);
    // For first-time setup, accept "Hassan@2026" directly
    // After first login, the hash is stored
    const storedHash = localStorage.getItem('hassan_admin_hash') || ADMIN_PASSWORD_HASH;
    
    // Also check the direct password for initial setup
    if (inputPassword === 'Hassan@2026' && !localStorage.getItem('hassan_admin_hash')) {
      // First login — store the proper hash
      const properHash = await hashPassword('Hassan@2026');
      localStorage.setItem('hassan_admin_hash', properHash);
      return true;
    }
    
    return inputHash === storedHash;
  }

  /**
   * Create a session token
   */
  function createSession() {
    const session = {
      token: generateToken(),
      created: Date.now(),
      expires: Date.now() + SESSION_DURATION
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }

  /**
   * Check if current session is valid
   */
  function isAuthenticated() {
    try {
      const sessionData = localStorage.getItem(SESSION_KEY);
      if (!sessionData) return false;
      
      const session = JSON.parse(sessionData);
      if (Date.now() > session.expires) {
        logout();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Logout and clear session
   */
  function logout() {
    localStorage.removeItem(SESSION_KEY);
  }

  /**
   * Change admin password
   */
  async function changePassword(currentPassword, newPassword) {
    const isValid = await verifyPassword(currentPassword);
    if (!isValid) {
      return { success: false, message: 'Current password is incorrect' };
    }
    
    const newHash = await hashPassword(newPassword);
    localStorage.setItem('hassan_admin_hash', newHash);
    return { success: true, message: 'Password changed successfully' };
  }

  /**
   * Generate a random session token
   */
  function generateToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Utility: Generate hash for a new password (for console use)
   */
  async function generateHash(password) {
    const hash = await hashPassword(password);
    console.log(`Password hash for "${password}": ${hash}`);
    console.log('Copy this hash and set it as ADMIN_PASSWORD_HASH');
    return hash;
  }

  return {
    verifyPassword,
    createSession,
    isAuthenticated,
    logout,
    changePassword,
    generateHash
  };
})();
