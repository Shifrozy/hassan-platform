/**
 * ============================================================================
 * Algenza Platform - Centralized API Client Module
 * ============================================================================
 * Handles all communication between the frontend and the Node.js/PostgreSQL
 * backend on Render (or local development).
 * ============================================================================
 */

const AlgenzaAPI = (() => {
  const TOKEN_KEY = 'algenza_admin_token';
  const URL_OVERRIDE_KEY = 'algenza_api_url';

  /**
   * Resolve active API Base URL dynamically:
   * 1. Window explicit variable (window.__API_BASE_URL__)
   * 2. Local storage override (for testing/custom staging)
   * 3. SITE_CONFIG.api.baseUrl
   * 4. Auto-detected localhost or default production Render endpoint
   */
  function getBaseUrl() {
    if (typeof window !== 'undefined' && window.__API_BASE_URL__) {
      return window.__API_BASE_URL__.replace(/\/+$/, '');
    }

    const storedOverride = typeof localStorage !== 'undefined' ? localStorage.getItem(URL_OVERRIDE_KEY) : null;
    if (storedOverride) {
      return storedOverride.replace(/\/+$/, '');
    }

    if (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.api && SITE_CONFIG.api.baseUrl) {
      return SITE_CONFIG.api.baseUrl.replace(/\/+$/, '');
    }

    // Default heuristics based on current hostname
    if (typeof window !== 'undefined') {
      const host = window.location.hostname;
      if (host === 'localhost' || host === '127.0.0.1') {
        return 'http://localhost:5000';
      }
    }

    // Default production Render backend endpoint
    return 'https://algenza-backend.onrender.com';
  }

  function setBaseUrl(url) {
    if (!url) {
      localStorage.removeItem(URL_OVERRIDE_KEY);
    } else {
      localStorage.setItem(URL_OVERRIDE_KEY, url.trim().replace(/\/+$/, ''));
    }
  }

  function getToken() {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  }

  function setToken(token) {
    if (typeof localStorage !== 'undefined') {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    }
  }

  function removeToken() {
    setToken(null);
  }

  function isAuthenticated() {
    return Boolean(getToken());
  }

  /**
   * Generic fetch wrapper with JSON serialization, timeout, and Bearer token attachment
   */
  async function request(endpoint, options = {}) {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const headers = {
      'Accept': 'application/json',
      ...options.headers
    };

    // Attach Bearer token if present and not already provided
    const token = getToken();
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Only set Content-Type if body is not FormData
    if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const config = {
      ...options,
      headers
    };

    // Add a 12-second timeout controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || 12000);
    config.signal = controller.signal;

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      // Handle 401 Unauthorized (expired or invalid token)
      if (response.status === 401 && endpoint !== '/api/auth/login') {
        console.warn('Session expired or unauthorized request. Clearing token.');
        removeToken();
        if (window.location.pathname.includes('admin.html')) {
          const overlay = document.getElementById('admin-login-overlay');
          const layout = document.getElementById('admin-layout');
          if (overlay) overlay.classList.remove('hidden');
          if (layout) layout.classList.remove('active');
        }
      }

      const contentType = response.headers.get('content-type') || '';
      let data = null;
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      if (!response.ok) {
        const error = new Error(data && data.message ? data.message : `HTTP error ${response.status}`);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        const timeoutErr = new Error('Backend request timed out. Please try again.');
        timeoutErr.isTimeout = true;
        throw timeoutErr;
      }
      throw err;
    }
  }

  // =========================================================================
  // Authentication Endpoints
  // =========================================================================

  async function login(email, password) {
    const data = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data.success && data.token) {
      setToken(data.token);
    }
    return data;
  }

  async function logout() {
    try {
      await request('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      // Ignore network errors on logout
    }
    removeToken();
    return { success: true };
  }

  async function getMe() {
    return request('/api/auth/me');
  }

  async function changePassword(currentPassword, newPassword) {
    return request('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  }

  // =========================================================================
  // Products Endpoints
  // =========================================================================

  async function getProducts(options = {}) {
    const query = options.all ? '?all=true' : '';
    return request(`/api/products${query}`);
  }

  async function getProductById(id) {
    return request(`/api/products/${encodeURIComponent(id)}`);
  }

  async function createProduct(productData) {
    return request('/api/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  }

  async function updateProduct(id, updates) {
    return request(`/api/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  async function deleteProduct(id) {
    return request(`/api/products/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  }

  // =========================================================================
  // Services Endpoints
  // =========================================================================

  async function getServices(options = {}) {
    const query = options.all ? '?all=true' : '';
    return request(`/api/services${query}`);
  }

  async function getServiceById(id) {
    return request(`/api/services/${encodeURIComponent(id)}`);
  }

  async function createService(serviceData) {
    return request('/api/services', {
      method: 'POST',
      body: JSON.stringify(serviceData)
    });
  }

  async function updateService(id, updates) {
    return request(`/api/services/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  async function deleteService(id) {
    return request(`/api/services/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  }

  // =========================================================================
  // Portfolio Endpoints
  // =========================================================================

  async function getPortfolio(options = {}) {
    const query = options.all ? '?all=true' : '';
    return request(`/api/portfolio${query}`);
  }

  async function getPortfolioById(id) {
    return request(`/api/portfolio/${encodeURIComponent(id)}`);
  }

  async function createPortfolio(portfolioData) {
    return request('/api/portfolio', {
      method: 'POST',
      body: JSON.stringify(portfolioData)
    });
  }

  async function updatePortfolio(id, updates) {
    return request(`/api/portfolio/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  async function deletePortfolio(id) {
    return request(`/api/portfolio/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  }

  // =========================================================================
  // Reviews Endpoints
  // =========================================================================

  async function getReviews(options = {}) {
    const query = options.all ? '?all=true' : '';
    return request(`/api/reviews${query}`);
  }

  async function getReviewById(id) {
    return request(`/api/reviews/${encodeURIComponent(id)}`);
  }

  async function createReview(reviewData) {
    return request('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
  }

  async function updateReview(id, updates) {
    return request(`/api/reviews/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  async function deleteReview(id) {
    return request(`/api/reviews/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  }

  // =========================================================================
  // Site Configuration Endpoints
  // =========================================================================

  async function getConfig() {
    return request('/api/config');
  }

  async function updateConfig(configData) {
    return request('/api/config', {
      method: 'PUT',
      body: JSON.stringify(configData)
    });
  }

  // =========================================================================
  // File Upload Endpoint
  // =========================================================================

  async function uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const baseUrl = getBaseUrl();
    const result = await request('/api/upload', {
      method: 'POST',
      body: formData
    });

    // Ensure full URL is returned
    if (result.file && result.file.url && !result.file.url.startsWith('http')) {
      result.file.fullUrl = `${baseUrl}${result.file.url}`;
    }
    return result;
  }

  // =========================================================================
  // Health & Connectivity Check
  // =========================================================================

  async function checkHealth() {
    try {
      return await request('/api/health', { timeout: 4000 });
    } catch (e) {
      return { status: 'offline', error: e.message };
    }
  }

  return {
    getBaseUrl,
    setBaseUrl,
    getToken,
    setToken,
    removeToken,
    isAuthenticated,
    request,
    // Auth
    login,
    logout,
    getMe,
    changePassword,
    // Products
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    // Services
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    // Portfolio
    getPortfolio,
    getPortfolioById,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
    // Reviews
    getReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview,
    // Config
    getConfig,
    updateConfig,
    // Upload
    uploadImage,
    // Health
    checkHealth
  };
})();

if (typeof window !== 'undefined') {
  window.AlgenzaAPI = AlgenzaAPI;
}
