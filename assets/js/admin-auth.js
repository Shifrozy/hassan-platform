/**
 * ============================================================================
 * Algenza Platform - Server-Side Authentication Controller
 * ============================================================================
 * Handles administrator authentication via JWT with the Render/Node backend.
 * Plaintext passwords and client-side hashes are completely eliminated.
 * ============================================================================
 */

const AdminAuth = (() => {

  /**
   * Log into the backend via POST /api/auth/login
   */
  async function login(email, password) {
    if (!password) {
      return { success: false, message: 'Please enter your password' };
    }

    try {
      if (typeof AlgenzaAPI === 'undefined') {
        throw new Error('AlgenzaAPI client not loaded');
      }

      const response = await AlgenzaAPI.login(email, password);
      return {
        success: true,
        token: response.token,
        admin: response.admin
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Authentication failed. Please verify credentials.'
      };
    }
  }

  /**
   * Check if client has an active token
   */
  function isAuthenticated() {
    if (typeof AlgenzaAPI !== 'undefined') {
      return AlgenzaAPI.isAuthenticated();
    }
    return Boolean(localStorage.getItem('algenza_admin_token'));
  }

  /**
   * Verify session validity with backend /api/auth/me
   */
  async function verifySession() {
    if (!isAuthenticated()) return false;
    try {
      const res = await AlgenzaAPI.getMe();
      return res.success;
    } catch (e) {
      logout();
      return false;
    }
  }

  /**
   * Terminate active session
   */
  async function logout() {
    if (typeof AlgenzaAPI !== 'undefined') {
      await AlgenzaAPI.logout();
    } else {
      localStorage.removeItem('algenza_admin_token');
    }
  }

  /**
   * Update admin password via POST /api/auth/change-password
   */
  async function changePassword(currentPassword, newPassword) {
    if (!currentPassword || !newPassword) {
      return { success: false, message: 'Current and new password are required' };
    }
    if (newPassword.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters' };
    }

    try {
      const res = await AlgenzaAPI.changePassword(currentPassword, newPassword);
      return { success: true, message: res.message || 'Password changed successfully' };
    } catch (error) {
      return { success: false, message: error.message || 'Failed to update password' };
    }
  }

  return {
    login,
    isAuthenticated,
    verifySession,
    logout,
    changePassword
  };
})();
