/**
 * ============================================================================
 * Platform Authentication Controller
 * ============================================================================
 * Cryptographic verification module using Web Crypto API (SHA-256)
 * ============================================================================
 */

const AdminAuth = (() => {
  // Salted cryptographic digest
  const _DIGEST = '9f6ed163d2f8e7ca7032e665831b6531158df66a9a9b1a73f0f0f0026e45da2f';
  const _SALT = '_hassan_platform_salt_2026';
  const SESSION_KEY = 'hassan_admin_session';
  const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * One-way cryptographic hash with salt
   */
  async function hashPassword(str) {
    if (!str) return '';
    const encoder = new TextEncoder();
    const data = encoder.encode(str + _SALT);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Verify credentials against secure digest
   */
  async function verifyPassword(candidate) {
    if (!candidate) return false;
    try {
      const candidateHash = await hashPassword(candidate);
      const customHash = localStorage.getItem('hassan_admin_hash');
      if (customHash && candidateHash === customHash) return true;
      return candidateHash === _DIGEST;
    } catch (e) {
      console.error('Auth verification error:', e);
      return false;
    }
  }

  /**
   * Create authenticated session
   */
  function createSession() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const token = Array.from(array, b => b.toString(16).padStart(2, '0')).join('');

    const session = {
      token: token,
      created: Date.now(),
      expires: Date.now() + SESSION_DURATION
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }

  /**
   * Check if current session is active and valid
   */
  function isAuthenticated() {
    try {
      const sessionData = localStorage.getItem(SESSION_KEY);
      if (!sessionData) return false;
      
      const session = JSON.parse(sessionData);
      if (!session || !session.expires || Date.now() > session.expires) {
        logout();
        return false;
      }
      return true;
    } catch {
      logout();
      return false;
    }
  }

  /**
   * Terminate active session
   */
  function logout() {
    localStorage.removeItem(SESSION_KEY);
  }

  /**
   * Update credentials with new secure hash
   */
  async function changePassword(currentSecret, newSecret) {
    const isValid = await verifyPassword(currentSecret);
    if (!isValid) {
      return { success: false, message: 'Current password verification failed' };
    }
    if (!newSecret || newSecret.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters' };
    }
    
    const newHash = await hashPassword(newSecret);
    localStorage.setItem('hassan_admin_hash', newHash);
    return { success: true, message: 'Password updated successfully' };
  }

  return {
    verifyPassword,
    createSession,
    isAuthenticated,
    logout,
    changePassword
  };
})();
