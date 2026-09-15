/**
 * ============================================================================
 * Algenza Platform - Admin Application Logic
 * ============================================================================
 * Production CMS connected to Node.js / PostgreSQL backend via AlgenzaAPI.
 * Database is the central source of truth for all devices globally.
 * ============================================================================
 */

const AdminApp = (() => {
  let currentPage = 'dashboard';
  let editingItem = null;

  // In-memory cache of database records
  const _adminCache = {
    products: null,
    services: null,
    portfolio: null,
    reviews: null,
    config: null
  };

  /**
   * Initialize the admin application
   */
  async function init() {
    if (!AdminAuth.isAuthenticated()) {
      showLogin();
      return;
    }

    // Verify session in background
    showDashboard();
    checkBackendConnectivity();
  }

  /**
   * Check connection to Render PostgreSQL backend
   */
  async function checkBackendConnectivity() {
    const statusPill = document.getElementById('admin-api-status');
    if (!statusPill) return;

    try {
      const health = await AlgenzaAPI.checkHealth();
      if (health.status === 'ok') {
        statusPill.innerHTML = '🟢 API Connected';
        statusPill.title = `Backend online at: ${AlgenzaAPI.getBaseUrl()}`;
        statusPill.style.color = 'var(--accent-green)';
      } else {
        statusPill.innerHTML = '🟡 Backend Standby';
        statusPill.title = 'Connecting or spinning up...';
        statusPill.style.color = 'var(--accent-amber)';
      }
    } catch (e) {
      statusPill.innerHTML = '🔴 API Offline';
      statusPill.title = e.message;
      statusPill.style.color = '#ef4444';
    }
  }

  /**
   * Show the login screen
   */
  function showLogin() {
    const overlay = document.getElementById('admin-login-overlay');
    const layout = document.getElementById('admin-layout');
    if (overlay) overlay.classList.remove('hidden');
    if (layout) layout.classList.remove('active');

    const form = document.getElementById('admin-login-form');
    if (form) {
      form.removeEventListener('submit', handleLogin);
      form.addEventListener('submit', handleLogin);
    }
  }

  /**
   * Handle login form submission
   */
  async function handleLogin(e) {
    e.preventDefault();
    const emailInput = document.getElementById('admin-email');
    const passwordInput = document.getElementById('admin-password');
    const errorEl = document.getElementById('admin-login-error');
    const submitBtn = e.target.querySelector('button[type="submit"]');

    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value.trim() : '';

    if (!password) {
      if (errorEl) errorEl.textContent = 'Please enter your password';
      return;
    }

    if (errorEl) errorEl.textContent = 'Verifying credentials with server...';
    if (submitBtn) submitBtn.disabled = true;

    try {
      const result = await AdminAuth.login(email, password);
      if (result.success) {
        if (errorEl) errorEl.textContent = '';
        if (passwordInput) passwordInput.value = '';
        showDashboard();
      } else {
        if (errorEl) errorEl.textContent = result.message || 'Invalid password. Try again.';
        if (passwordInput) {
          passwordInput.value = '';
          passwordInput.focus();
        }
      }
    } catch (err) {
      if (errorEl) errorEl.textContent = err.message || 'Failed to connect to backend.';
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  }

  /**
   * Show the admin dashboard
   */
  function showDashboard() {
    const overlay = document.getElementById('admin-login-overlay');
    const layout = document.getElementById('admin-layout');
    if (overlay) overlay.classList.add('hidden');
    if (layout) layout.classList.add('active');

    setupNavigation();
    navigateTo('dashboard');
  }

  /**
   * Setup sidebar navigation
   */
  function setupNavigation() {
    document.querySelectorAll('.admin-nav-item[data-page]').forEach(item => {
      item.onclick = (e) => {
        e.preventDefault();
        const page = item.getAttribute('data-page');
        navigateTo(page);
      };
    });

    const logoutBtn = document.getElementById('admin-logout-btn');
    if (logoutBtn) {
      logoutBtn.onclick = async () => {
        await AdminAuth.logout();
        showLogin();
      };
    }
  }

  /**
   * Navigate to a specific admin page
   */
  async function navigateTo(page) {
    currentPage = page;

    document.querySelectorAll('.admin-nav-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-page') === page);
    });

    document.querySelectorAll('.admin-page').forEach(p => {
      p.classList.toggle('active', p.id === `page-${page}`);
    });

    await renderPage(page);
  }

  /**
   * Render page content dynamically from PostgreSQL
   */
  async function renderPage(page) {
    switch (page) {
      case 'dashboard':
        await renderDashboard();
        break;
      case 'products':
      case 'services':
      case 'portfolio':
      case 'reviews':
        await renderDataTable(page);
        break;
      case 'branding':
        await renderBrandingPage();
        break;
      case 'settings':
        renderSettings();
        break;
    }
  }

  // =========================================================================
  // Data Access Layer (PostgreSQL via AlgenzaAPI with graceful fallback)
  // =========================================================================

  /**
   * Load data from PostgreSQL API
   */
  async function loadData(type, forceRefresh = false) {
    if (!forceRefresh && _adminCache[type] && Array.isArray(_adminCache[type]) && _adminCache[type].length > 0) {
      return _adminCache[type];
    }

    try {
      let res = null;
      switch (type) {
        case 'products':
          res = await AlgenzaAPI.getProducts({ all: true });
          break;
        case 'services':
          res = await AlgenzaAPI.getServices({ all: true });
          break;
        case 'portfolio':
          res = await AlgenzaAPI.getPortfolio({ all: true });
          break;
        case 'reviews':
          res = await AlgenzaAPI.getReviews({ all: true });
          break;
        case 'config':
          res = await AlgenzaAPI.getConfig();
          break;
      }

      if (res && res.success && res.data) {
        _adminCache[type] = res.data;
        return res.data;
      }
    } catch (error) {
      console.warn(`API fetch failed for ${type}, using fallback:`, error.message);
    }

    // Fallback if backend is cold-starting or offline
    return getFallbackData(type);
  }

  function getFallbackData(type) {
    if (_adminCache[type]) return _adminCache[type];

    switch (type) {
      case 'products':
        return typeof window.PRODUCTS_DATA !== 'undefined' ? [...window.PRODUCTS_DATA] : [];
      case 'services':
        return typeof window.SERVICES_DATA !== 'undefined' ? [...window.SERVICES_DATA] : [];
      case 'portfolio':
        return typeof window.PORTFOLIO_DATA !== 'undefined' ? [...window.PORTFOLIO_DATA] : [];
      case 'reviews':
        return typeof window.REVIEWS_DATA !== 'undefined' ? [...window.REVIEWS_DATA] : [];
      case 'config':
        return typeof window.SITE_CONFIG !== 'undefined' ? { ...window.SITE_CONFIG } : {};
      default:
        return [];
    }
  }

  function getData(type) {
    return _adminCache[type] || getFallbackData(type);
  }

  // =========================================================================
  // Page Renderers
  // =========================================================================

  async function renderDashboard() {
    const [products, services, portfolio, reviews] = await Promise.all([
      loadData('products'),
      loadData('services'),
      loadData('portfolio'),
      loadData('reviews')
    ]);

    updateStat('stat-products', products.length);
    updateStat('stat-services', services.length);
    updateStat('stat-portfolio', portfolio.length);
    updateStat('stat-reviews', reviews.length);
  }

  function updateStat(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  /**
   * Render a data table for products, services, portfolio, or reviews
   */
  async function renderDataTable(type) {
    const tbody = document.getElementById(`${type}-table-body`);
    if (!tbody) return;

    tbody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align: center; padding: 40px; color: var(--text-muted);">
          Loading ${type} from database...
        </td>
      </tr>
    `;

    const data = await loadData(type, true);
    tbody.innerHTML = '';

    if (data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="10" style="text-align: center; padding: 40px; color: var(--text-muted);">
            No ${type} found in database. Click "Add New" to create one.
          </td>
        </tr>
      `;
      return;
    }

    data.forEach(item => {
      const row = document.createElement('tr');

      switch (type) {
        case 'products': {
          const prodThumb = item.image
            ? `<img src="${escapeHtml(item.image)}" style="width: 26px; height: 26px; border-radius: 4px; object-fit: cover; border: 1px solid var(--border-subtle); flex-shrink: 0;" alt="Thumb">`
            : `<span style="font-size: 16px;">📦</span>`;
          row.innerHTML = `
            <td>
              <div style="display: flex; align-items: center; gap: 8px;">
                ${prodThumb}
                <strong>${escapeHtml(item.name || item.title || '—')}</strong>
              </div>
            </td>
            <td><span class="badge badge-mt5">${escapeHtml(item.platform || '—')}</span></td>
            <td style="font-family: var(--font-mono); color: var(--accent-green);">$${item.price || '0'}</td>
            <td>${escapeHtml(item.version || '—')}</td>
            <td class="actions-cell">
              <button class="admin-btn-icon" onclick="AdminApp.editItem('products', '${item.id}')" title="Edit">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="admin-btn-icon delete" onclick="AdminApp.confirmDelete('products', '${item.id}', '${escapeAttr(item.name || item.title || '')}')" title="Delete">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </td>
          `;
          break;
        }

        case 'services': {
          row.innerHTML = `
            <td><strong>${escapeHtml(item.title || item.name || '—')}</strong></td>
            <td>${escapeHtml(item.category || '—')}</td>
            <td>${(item.benefits || item.features || []).length} features</td>
            <td class="actions-cell">
              <button class="admin-btn-icon" onclick="AdminApp.editItem('services', '${item.id}')" title="Edit">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="admin-btn-icon delete" onclick="AdminApp.confirmDelete('services', '${item.id}', '${escapeAttr(item.title || item.name || '')}')" title="Delete">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </td>
          `;
          break;
        }

        case 'portfolio': {
          const portThumb = item.image
            ? `<img src="${escapeHtml(item.image)}" style="width: 26px; height: 26px; border-radius: 4px; object-fit: cover; border: 1px solid var(--border-subtle); flex-shrink: 0;" alt="Thumb">`
            : `<span style="font-size: 16px;">📊</span>`;
          row.innerHTML = `
            <td>
              <div style="display: flex; align-items: center; gap: 8px;">
                ${portThumb}
                <strong>${escapeHtml(item.title || item.name || '—')}</strong>
              </div>
            </td>
            <td><span class="badge badge-cyan">${escapeHtml(item.category || '—')}</span></td>
            <td>${escapeHtml(item.clientType || item.client || '—')}</td>
            <td class="actions-cell">
              <button class="admin-btn-icon" onclick="AdminApp.editItem('portfolio', '${item.id}')" title="Edit">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="admin-btn-icon delete" onclick="AdminApp.confirmDelete('portfolio', '${item.id}', '${escapeAttr(item.title || item.name || '')}')" title="Delete">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </td>
          `;
          break;
        }

        case 'reviews': {
          row.innerHTML = `
            <td><strong>${escapeHtml(item.clientName || item.name || '—')}</strong></td>
            <td style="color: var(--accent-amber);">${'★'.repeat(item.rating || 5)}</td>
            <td>${escapeHtml(item.country || item.location || '—')}</td>
            <td style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(item.comment || item.quote || '—')}</td>
            <td class="actions-cell">
              <button class="admin-btn-icon" onclick="AdminApp.editItem('reviews', '${item.id}')" title="Edit">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="admin-btn-icon delete" onclick="AdminApp.confirmDelete('reviews', '${item.id}', '${escapeAttr(item.clientName || item.name || '')}')" title="Delete">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </td>
          `;
          break;
        }
      }

      tbody.appendChild(row);
    });
  }

  // =========================================================================
  // Modal / Form Management
  // =========================================================================

  function openModal(type, item = null) {
    editingItem = item;
    const modal = document.getElementById('admin-modal');
    const title = document.getElementById('admin-modal-title');
    const formContainer = document.getElementById('admin-modal-form');

    if (!modal || !formContainer) return;

    title.textContent = item
      ? `Edit ${capitalize(type.slice(0, -1))}`
      : `Add New ${capitalize(type.slice(0, -1))}`;

    formContainer.innerHTML = generateFormFields(type, item);
    formContainer.setAttribute('data-type', type);
    if (item && item.id) {
      formContainer.setAttribute('data-editing-id', item.id);
    } else {
      formContainer.removeAttribute('data-editing-id');
    }

    modal.classList.add('active');
  }

  function closeModal() {
    const modal = document.getElementById('admin-modal');
    if (modal) modal.classList.remove('active');
    editingItem = null;
  }

  function generateFormFields(type, item) {
    const val = (k) => item ? (item[k] !== undefined && item[k] !== null ? item[k] : '') : '';

    switch (type) {
      case 'products':
        return `
          <div class="admin-form-group">
            <label class="admin-form-label">Product Name</label>
            <input class="admin-form-input" name="name" value="${escapeAttr(val('name'))}" placeholder="e.g., Apex Trend Scalper Pro" required>
          </div>
          <div class="admin-form-row">
            <div class="admin-form-group">
              <label class="admin-form-label">Platform</label>
              <input class="admin-form-input" name="platform" value="${escapeAttr(val('platform'))}" placeholder="e.g., MT5 / MT4">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Version</label>
              <input class="admin-form-input" name="version" value="${escapeAttr(val('version'))}" placeholder="e.g., v3.4.2">
            </div>
          </div>
          <div class="admin-form-row">
            <div class="admin-form-group">
              <label class="admin-form-label">Price ($)</label>
              <input class="admin-form-input" name="price" type="number" step="0.01" value="${val('price')}" placeholder="349">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Badge</label>
              <input class="admin-form-input" name="badge" value="${escapeAttr(val('badge'))}" placeholder="e.g., Flagship EA">
            </div>
          </div>
          <div class="admin-form-group">
            <label class="admin-form-label">Product Picture</label>
            <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
              <input class="admin-form-input" name="image" id="modal-product-img-input" value="${escapeAttr(val('image'))}" placeholder="assets/images/products/... or Image URL">
              <label class="btn btn-secondary btn-sm" style="cursor: pointer; white-space: nowrap;">
                <span>Upload Picture</span>
                <input type="file" accept="image/*" style="display: none;" onchange="AdminApp.handleImageUpload(event, 'modal-product-img-input', 'modal-product-img-preview')">
              </label>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 60px; height: 60px; border-radius: 6px; background: var(--bg-tertiary); border: 1px solid var(--border-subtle); overflow: hidden; display: flex; align-items: center; justify-content: center;">
                <img id="modal-product-img-preview" src="${escapeAttr(val('image'))}" style="${val('image') ? 'width: 100%; height: 100%; object-fit: cover;' : 'display: none;'}" alt="Preview">
                <span id="modal-product-img-placeholder" style="${val('image') ? 'display: none;' : 'font-size: 10px; color: var(--text-muted);'}">No Image</span>
              </div>
              <button type="button" class="btn btn-outline btn-sm" style="font-size: 11px;" onclick="AdminApp.clearImage('modal-product-img-input', 'modal-product-img-preview')">Clear Picture</button>
            </div>
          </div>
          <div class="admin-form-group">
            <label class="admin-form-label">Tagline</label>
            <input class="admin-form-input" name="tagline" value="${escapeAttr(val('tagline'))}" placeholder="Institutional Order-Flow Scalper...">
          </div>
          <div class="admin-form-group">
            <label class="admin-form-label">Short Description</label>
            <textarea class="admin-form-textarea" name="shortDesc" placeholder="Brief product summary...">${escapeHtml(val('shortDesc') || val('description'))}</textarea>
          </div>
          <div class="admin-form-group">
            <label class="admin-form-label">Key Features (one per line)</label>
            <textarea class="admin-form-textarea" name="features" placeholder="Feature 1\nFeature 2">${Array.isArray(item?.features) ? item.features.map(f => f.text || f).join('\n') : escapeHtml(val('features'))}</textarea>
          </div>
        `;

      case 'services':
        return `
          <div class="admin-form-group">
            <label class="admin-form-label">Service Title</label>
            <input class="admin-form-input" name="title" value="${escapeAttr(val('title') || val('name'))}" placeholder="e.g., MT5 EA Development" required>
          </div>
          <div class="admin-form-group">
            <label class="admin-form-label">Category</label>
            <select class="admin-form-select" name="category">
              <option value="MetaTrader" ${val('category') === 'MetaTrader' ? 'selected' : ''}>MetaTrader</option>
              <option value="Python & Crypto" ${val('category') === 'Python & Crypto' ? 'selected' : ''}>Python & Crypto</option>
              <option value="Broker APIs" ${val('category') === 'Broker APIs' ? 'selected' : ''}>Broker APIs (IBKR)</option>
              <option value="Strategy Design" ${val('category') === 'Strategy Design' ? 'selected' : ''}>Strategy Design</option>
              <option value="Quantitative" ${val('category') === 'Quantitative' ? 'selected' : ''}>Quantitative / Backtesting</option>
              <option value="Infrastructure" ${val('category') === 'Infrastructure' ? 'selected' : ''}>Infrastructure & VPS</option>
              <option value="Other" ${val('category') === 'Other' ? 'selected' : ''}>Other</option>
            </select>
          </div>
          <div class="admin-form-group">
            <label class="admin-form-label">Short Description</label>
            <textarea class="admin-form-textarea" name="shortDesc" placeholder="Service description...">${escapeHtml(val('shortDesc') || val('description'))}</textarea>
          </div>
          <div class="admin-form-group">
            <label class="admin-form-label">Benefits / Features (one per line)</label>
            <textarea class="admin-form-textarea" name="benefits" placeholder="Benefit 1\nBenefit 2">${Array.isArray(item?.benefits || item?.features) ? (item.benefits || item.features).join('\n') : escapeHtml(val('benefits'))}</textarea>
          </div>
        `;

      case 'portfolio':
        return `
          <div class="admin-form-group">
            <label class="admin-form-label">Project Title</label>
            <input class="admin-form-input" name="title" value="${escapeAttr(val('title') || val('name'))}" placeholder="e.g., Institutional Gold EA" required>
          </div>
          <div class="admin-form-row">
            <div class="admin-form-group">
              <label class="admin-form-label">Category</label>
              <input class="admin-form-input" name="category" value="${escapeAttr(val('category'))}" placeholder="e.g., MetaTrader">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Client Type</label>
              <input class="admin-form-input" name="clientType" value="${escapeAttr(val('clientType') || val('client'))}" placeholder="e.g., Private Prop Trader">
            </div>
          </div>
          <div class="admin-form-group">
            <label class="admin-form-label">Project Picture / Diagram</label>
            <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
              <input class="admin-form-input" name="image" id="modal-portfolio-img-input" value="${escapeAttr(val('image'))}" placeholder="assets/images/portfolio/... or Image URL">
              <label class="btn btn-secondary btn-sm" style="cursor: pointer; white-space: nowrap;">
                <span>Upload Picture</span>
                <input type="file" accept="image/*" style="display: none;" onchange="AdminApp.handleImageUpload(event, 'modal-portfolio-img-input', 'modal-portfolio-img-preview')">
              </label>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 80px; height: 60px; border-radius: 6px; background: var(--bg-tertiary); border: 1px solid var(--border-subtle); overflow: hidden; display: flex; align-items: center; justify-content: center;">
                <img id="modal-portfolio-img-preview" src="${escapeAttr(val('image'))}" style="${val('image') ? 'width: 100%; height: 100%; object-fit: cover;' : 'display: none;'}" alt="Preview">
                <span id="modal-portfolio-img-placeholder" style="${val('image') ? 'display: none;' : 'font-size: 10px; color: var(--text-muted);'}">No Image</span>
              </div>
              <button type="button" class="btn btn-outline btn-sm" style="font-size: 11px;" onclick="AdminApp.clearImage('modal-portfolio-img-input', 'modal-portfolio-img-preview')">Clear Picture</button>
            </div>
          </div>
          <div class="admin-form-group">
            <label class="admin-form-label">Description</label>
            <textarea class="admin-form-textarea" name="description" placeholder="Project description and results...">${escapeHtml(val('description'))}</textarea>
          </div>
        `;

      case 'reviews':
        return `
          <div class="admin-form-row">
            <div class="admin-form-group">
              <label class="admin-form-label">Client Name</label>
              <input class="admin-form-input" name="clientName" value="${escapeAttr(val('clientName') || val('name'))}" placeholder="e.g., David K." required>
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Rating (1-5)</label>
              <select class="admin-form-select" name="rating">
                <option value="5" ${(val('rating') || 5) == 5 ? 'selected' : ''}>★★★★★ (5)</option>
                <option value="4" ${val('rating') == 4 ? 'selected' : ''}>★★★★☆ (4)</option>
                <option value="3" ${val('rating') == 3 ? 'selected' : ''}>★★★☆☆ (3)</option>
                <option value="2" ${val('rating') == 2 ? 'selected' : ''}>★★☆☆☆ (2)</option>
                <option value="1" ${val('rating') == 1 ? 'selected' : ''}>★☆☆☆☆ (1)</option>
              </select>
            </div>
          </div>
          <div class="admin-form-row">
            <div class="admin-form-group">
              <label class="admin-form-label">Country / Location</label>
              <input class="admin-form-input" name="country" value="${escapeAttr(val('country') || val('location'))}" placeholder="e.g., United States">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Role / Title</label>
              <input class="admin-form-input" name="role" value="${escapeAttr(val('role'))}" placeholder="e.g., Prop Trader">
            </div>
          </div>
          <div class="admin-form-group">
            <label class="admin-form-label">Review Comment</label>
            <textarea class="admin-form-textarea" name="comment" placeholder="Client's testimonial...">${escapeHtml(val('comment') || val('quote'))}</textarea>
          </div>
        `;

      default:
        return '<p>Unknown data type</p>';
    }
  }

  /**
   * Save form data from modal to PostgreSQL via AlgenzaAPI
   */
  async function saveModal() {
    const formContainer = document.getElementById('admin-modal-form');
    const type = formContainer.getAttribute('data-type');
    const editingId = formContainer.getAttribute('data-editing-id');
    const saveBtn = document.querySelector('#admin-modal .modal-footer .btn-primary');

    const formData = {};
    formContainer.querySelectorAll('input, textarea, select').forEach(input => {
      const name = input.name;
      let value = input.value.trim();

      if (name === 'features' || name === 'benefits') {
        value = value.split('\n').filter(f => f.trim()).map(f => f.trim());
      }
      if (name === 'price' || name === 'rating') {
        value = parseFloat(value) || 0;
      }
      formData[name] = value;
    });

    const nameField = formData.name || formData.title || formData.clientName;
    if (!nameField) {
      alert('Name/Title is required');
      return;
    }

    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving to Database...';
    }

    try {
      if (editingId) {
        switch (type) {
          case 'products': await AlgenzaAPI.updateProduct(editingId, formData); break;
          case 'services': await AlgenzaAPI.updateService(editingId, formData); break;
          case 'portfolio': await AlgenzaAPI.updatePortfolio(editingId, formData); break;
          case 'reviews': await AlgenzaAPI.updateReview(editingId, formData); break;
        }
      } else {
        switch (type) {
          case 'products': await AlgenzaAPI.createProduct(formData); break;
          case 'services': await AlgenzaAPI.createService(formData); break;
          case 'portfolio': await AlgenzaAPI.createPortfolio(formData); break;
          case 'reviews': await AlgenzaAPI.createReview(formData); break;
        }
      }

      closeModal();
      await renderDataTable(type);
      await renderDashboard();
      showToast('Saved to database successfully!', 'success');
    } catch (err) {
      alert(`Error saving to database: ${err.message}`);
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Changes';
      }
    }
  }

  async function editItem(type, id) {
    const data = await loadData(type);
    const item = data.find(i => i.id === id);
    if (item) {
      openModal(type, item);
    }
  }

  async function confirmDelete(type, id, name) {
    if (confirm(`Are you sure you want to delete "${name}" from PostgreSQL? This cannot be undone.`)) {
      try {
        switch (type) {
          case 'products': await AlgenzaAPI.deleteProduct(id); break;
          case 'services': await AlgenzaAPI.deleteService(id); break;
          case 'portfolio': await AlgenzaAPI.deletePortfolio(id); break;
          case 'reviews': await AlgenzaAPI.deleteReview(id); break;
        }
        await renderDataTable(type);
        await renderDashboard();
        showToast(`"${name}" deleted from database`, 'success');
      } catch (err) {
        alert(`Failed to delete: ${err.message}`);
      }
    }
  }

  // =========================================================================
  // Settings Page
  // =========================================================================

  function renderSettings() {
    const apiUrlInput = document.getElementById('settings-api-url');
    if (apiUrlInput) {
      apiUrlInput.value = AlgenzaAPI.getBaseUrl();
    }
  }

  async function handleSaveApiUrl() {
    const input = document.getElementById('settings-api-url');
    if (input) {
      AlgenzaAPI.setBaseUrl(input.value.trim());
      showToast('Backend API URL updated!', 'success');
      checkBackendConnectivity();
    }
  }

  async function handleChangePassword() {
    const currentPw = document.getElementById('settings-current-pw');
    const newPw = document.getElementById('settings-new-pw');
    const confirmPw = document.getElementById('settings-confirm-pw');

    if (!currentPw || !newPw || !confirmPw) return;

    if (newPw.value !== confirmPw.value) {
      alert('New passwords do not match');
      return;
    }

    if (newPw.value.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    const result = await AdminAuth.changePassword(currentPw.value, newPw.value);
    alert(result.message);

    if (result.success) {
      currentPw.value = '';
      newPw.value = '';
      confirmPw.value = '';
    }
  }

  // =========================================================================
  // Branding Page
  // =========================================================================

  async function renderBrandingPage() {
    let config = await loadData('config', true);
    if (!config || Object.keys(config).length === 0) {
      config = getFallbackData('config');
    }

    const val = (path, def) => {
      const parts = path.split('.');
      let cur = config;
      for (const p of parts) {
        if (!cur || cur[p] === undefined) return def || '';
        cur = cur[p];
      }
      return cur || def || '';
    };

    setVal('brand-input-name', val('brand.name', 'ALGENZA'));
    setVal('brand-input-suffix', val('brand.suffix', ''));
    setVal('brand-input-tag', val('brand.tag', 'PRO'));
    setVal('brand-input-devname', val('author.name', 'M. Hassan'));
    setVal('brand-input-devtitle', val('author.title', 'CEO & Co-Founder of Algenza'));
    setVal('brand-input-profile-img', val('hero.profileImage', 'assets/images/brand/hassan-profile.jpg'));
    setVal('brand-input-status', val('hero.status', 'AVAILABLE FOR PROJECTS'));
    setVal('brand-input-line1', val('hero.line1', 'I Build'));
    setVal('brand-input-highlight', val('hero.highlight', 'Trading Algorithms'));
    setVal('brand-input-line2', val('hero.line2', 'That Actually Work'));
    setVal('brand-input-description', val('hero.description', 'Professional developer specializing in MetaTrader 4/5 Expert Advisors...'));
    setVal('brand-input-stat1-val', val('hero.stat1Val', '140+'));
    setVal('brand-input-stat1-lbl', val('hero.stat1Label', 'EAs & Bots Deployed'));
    setVal('brand-input-stat2-val', val('hero.stat2Val', '6+'));
    setVal('brand-input-stat2-lbl', val('hero.stat2Label', 'Years Experience'));
    setVal('brand-input-stat3-val', val('hero.stat3Val', '5.0'));
    setVal('brand-input-stat3-lbl', val('hero.stat3Label', 'Client Rating'));
    setVal('brand-input-email', val('contact.email', 'contact@algenza.com'));
    setVal('brand-input-telegram', val('contact.telegramUrl', 'https://t.me/HassanAlgo'));
    setVal('brand-input-whatsapp', val('contact.whatsapp', ''));
    setVal('brand-input-github', val('contact.githubUrl', 'https://github.com/Shifrozy/hassan-platform'));
    setVal('brand-input-bio', val('brand.shortBio', 'Developing institutional-grade MetaTrader 4/5 EAs...'));

    const profileImgPreview = document.getElementById('brand-preview-profile-img');
    if (profileImgPreview) {
      profileImgPreview.src = val('hero.profileImage', 'assets/images/brand/hassan-profile.jpg');
    }
  }

  function setVal(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value;
  }

  async function saveBranding() {
    const getV = (id) => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : '';
    };

    const saveBtn = document.querySelector('#page-branding .btn-primary');
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving to Database...';
    }

    const payload = {
      brand: {
        name: getV('brand-input-name') || 'ALGENZA',
        suffix: getV('brand-input-suffix') || '',
        tag: getV('brand-input-tag') || 'PRO',
        shortBio: getV('brand-input-bio'),
        logoText: getV('brand-input-name') || 'ALGENZA'
      },
      author: {
        name: getV('brand-input-devname') || 'M. Hassan',
        title: getV('brand-input-devtitle') || 'CEO & Co-Founder of Algenza'
      },
      hero: {
        badge: getV('brand-input-devtitle') || 'CEO & Co-Founder of Algenza',
        status: getV('brand-input-status') || 'AVAILABLE FOR PROJECTS',
        line1: getV('brand-input-line1') || 'I Build',
        highlight: getV('brand-input-highlight') || 'Trading Algorithms',
        line2: getV('brand-input-line2') || 'That Actually Work',
        description: getV('brand-input-description'),
        profileImage: getV('brand-input-profile-img') || 'assets/images/brand/hassan-profile.jpg',
        stat1Val: getV('brand-input-stat1-val'),
        stat1Label: getV('brand-input-stat1-lbl'),
        stat2Val: getV('brand-input-stat2-val'),
        stat2Label: getV('brand-input-stat2-lbl'),
        stat3Val: getV('brand-input-stat3-val'),
        stat3Label: getV('brand-input-stat3-lbl')
      },
      contact: {
        email: getV('brand-input-email') || 'contact@algenza.com',
        telegramUrl: getV('brand-input-telegram'),
        whatsapp: getV('brand-input-whatsapp'),
        githubUrl: getV('brand-input-github')
      }
    };

    try {
      await AlgenzaAPI.updateConfig(payload);
      _adminCache.config = payload;
      localStorage.setItem('algenza_cache_config', JSON.stringify(payload));
      showToast('Branding updated in PostgreSQL successfully!', 'success');
    } catch (err) {
      alert(`Failed to save branding: ${err.message}`);
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Branding Changes';
      }
    }
  }

  // =========================================================================
  // Image Upload Handling (Multipart POST to /api/upload)
  // =========================================================================

  async function handleImageUpload(event, targetInputId, previewImgId) {
    const file = event.target.files[0];
    if (!file) return;

    const input = document.getElementById(targetInputId);
    const preview = document.getElementById(previewImgId);
    const placeholder = document.getElementById(previewImgId.replace('-preview', '-placeholder'));

    showToast('Uploading image to backend...', 'info');

    try {
      const result = await AlgenzaAPI.uploadImage(file);
      const imageUrl = result.file.fullUrl || result.file.url;

      if (input) {
        input.value = imageUrl;
        input.dispatchEvent(new Event('input'));
      }
      if (preview) {
        preview.src = imageUrl;
        preview.style.display = 'block';
      }
      if (placeholder) {
        placeholder.style.display = 'none';
      }

      showToast('Image uploaded successfully!', 'success');
    } catch (err) {
      alert(`Image upload failed: ${err.message}`);
    }
  }

  function clearImage(targetInputId, previewImgId) {
    const input = document.getElementById(targetInputId);
    if (input) {
      input.value = '';
      input.dispatchEvent(new Event('input'));
    }
    const preview = document.getElementById(previewImgId);
    if (preview) {
      preview.src = '';
      preview.style.display = 'none';
    }
    const placeholder = document.getElementById(previewImgId.replace('-preview', '-placeholder'));
    if (placeholder) placeholder.style.display = 'block';
  }

  // =========================================================================
  // Utilities
  // =========================================================================

  function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  }

  function escapeHtml(str) {
    if (typeof str !== 'string') return str || '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeAttr(str) {
    if (typeof str !== 'string') return str || '';
    return str.replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function showToast(message, type = 'success') {
    if (typeof window.showToast === 'function') {
      window.showToast(message, type);
    } else {
      console.log(`[Toast ${type}]: ${message}`);
    }
  }

  return {
    init,
    navigateTo,
    openModal,
    closeModal,
    saveModal,
    editItem,
    confirmDelete,
    renderBrandingPage,
    saveBranding,
    handleImageUpload,
    clearImage,
    handleChangePassword,
    handleSaveApiUrl,
    getData,
    loadData
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  AdminApp.init();
});
