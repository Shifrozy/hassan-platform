/**
 * ============================================================================
 * Hassan Platform - Admin Application Logic
 * ============================================================================
 * Manages CRUD operations for all site content via localStorage
 * Data priority: localStorage > static JS data files
 * ============================================================================
 */

const AdminApp = (() => {
  // Storage keys for each data type
  const STORAGE_KEYS = {
    products: 'hassan_admin_products',
    services: 'hassan_admin_services',
    portfolio: 'hassan_admin_portfolio',
    reviews: 'hassan_admin_reviews',
    config: 'hassan_admin_config'
  };

  let currentPage = 'dashboard';
  let editingItem = null;

  /**
   * Initialize the admin application
   */
  function init() {
    if (!AdminAuth.isAuthenticated()) {
      showLogin();
      return;
    }
    showDashboard();
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
      form.addEventListener('submit', handleLogin);
    }
  }

  /**
   * Handle login form submission
   */
  async function handleLogin(e) {
    e.preventDefault();
    const passwordInput = document.getElementById('admin-password');
    const errorEl = document.getElementById('admin-login-error');
    const password = passwordInput.value.trim();

    if (!password) {
      errorEl.textContent = 'Please enter your password';
      return;
    }

    const isValid = await AdminAuth.verifyPassword(password);
    if (isValid) {
      AdminAuth.createSession();
      errorEl.textContent = '';
      passwordInput.value = '';
      showDashboard();
    } else {
      errorEl.textContent = 'Invalid password. Try again.';
      passwordInput.value = '';
      passwordInput.focus();
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
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.getAttribute('data-page');
        navigateTo(page);
      });
    });

    // Logout button
    const logoutBtn = document.getElementById('admin-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        AdminAuth.logout();
        showLogin();
      });
    }
  }

  /**
   * Navigate to a specific admin page
   */
  function navigateTo(page) {
    currentPage = page;

    // Update active nav item
    document.querySelectorAll('.admin-nav-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-page') === page);
    });

    // Update active page
    document.querySelectorAll('.admin-page').forEach(p => {
      p.classList.toggle('active', p.id === `page-${page}`);
    });

    // Render page content
    renderPage(page);
  }

  /**
   * Render page content dynamically
   */
  function renderPage(page) {
    switch (page) {
      case 'dashboard': renderDashboard(); break;
      case 'products': renderDataTable('products'); break;
      case 'services': renderDataTable('services'); break;
      case 'portfolio': renderDataTable('portfolio'); break;
      case 'reviews': renderDataTable('reviews'); break;
      case 'settings': renderSettings(); break;
    }
  }

  // =========================================================================
  // Data Access Layer
  // =========================================================================

  /**
   * Get data — localStorage first, then fall back to static JS data
   */
  function getData(type) {
    const stored = localStorage.getItem(STORAGE_KEYS[type]);
    if (stored) {
      try { return JSON.parse(stored); } catch { /* fall through */ }
    }

    // Fall back to global static data
    switch (type) {
      case 'products': return typeof PRODUCTS_DATA !== 'undefined' ? [...PRODUCTS_DATA] : [];
      case 'services': return typeof SERVICES_DATA !== 'undefined' ? [...SERVICES_DATA] : [];
      case 'portfolio': return typeof PORTFOLIO_DATA !== 'undefined' ? [...PORTFOLIO_DATA] : [];
      case 'reviews': return typeof REVIEWS_DATA !== 'undefined' ? [...REVIEWS_DATA] : [];
      case 'config': return typeof SITE_CONFIG !== 'undefined' ? { ...SITE_CONFIG } : {};
      default: return [];
    }
  }

  /**
   * Save data to localStorage
   */
  function saveData(type, data) {
    localStorage.setItem(STORAGE_KEYS[type], JSON.stringify(data));
  }

  /**
   * Add a new item to a data collection
   */
  function addItem(type, item) {
    const data = getData(type);
    item.id = item.id || generateId();
    data.push(item);
    saveData(type, data);
    return item;
  }

  /**
   * Update an existing item
   */
  function updateItem(type, id, updates) {
    const data = getData(type);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) return null;
    data[index] = { ...data[index], ...updates };
    saveData(type, data);
    return data[index];
  }

  /**
   * Delete an item
   */
  function deleteItem(type, id) {
    const data = getData(type);
    const filtered = data.filter(item => item.id !== id);
    saveData(type, filtered);
    return filtered;
  }

  /**
   * Reset data to defaults (clear localStorage for a type)
   */
  function resetData(type) {
    localStorage.removeItem(STORAGE_KEYS[type]);
  }

  /**
   * Export all admin data as JSON
   */
  function exportAllData() {
    const allData = {};
    Object.keys(STORAGE_KEYS).forEach(key => {
      allData[key] = getData(key);
    });
    
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hassan-platform-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Import data from JSON file
   */
  function importData(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          Object.keys(data).forEach(key => {
            if (STORAGE_KEYS[key]) {
              saveData(key, data[key]);
            }
          });
          resolve({ success: true });
        } catch (err) {
          reject({ success: false, message: 'Invalid JSON file' });
        }
      };
      reader.readAsText(file);
    });
  }

  // =========================================================================
  // Page Renderers
  // =========================================================================

  function renderDashboard() {
    const products = getData('products');
    const services = getData('services');
    const portfolio = getData('portfolio');
    const reviews = getData('reviews');

    // Update stat cards
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
  function renderDataTable(type) {
    const data = getData(type);
    const tbody = document.getElementById(`${type}-table-body`);
    if (!tbody) return;

    tbody.innerHTML = '';

    if (data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="10" style="text-align: center; padding: 40px; color: var(--text-muted);">
            No ${type} found. Click "Add New" to create one.
          </td>
        </tr>
      `;
      return;
    }

    data.forEach(item => {
      const row = document.createElement('tr');
      
      switch (type) {
        case 'products':
          row.innerHTML = `
            <td><strong>${item.name || item.title || '—'}</strong></td>
            <td><span class="badge badge-mt5">${item.platform || '—'}</span></td>
            <td style="font-family: var(--font-mono); color: var(--accent-green);">$${item.price || '—'}</td>
            <td>${item.version || '—'}</td>
            <td class="actions-cell">
              <button class="admin-btn-icon" onclick="AdminApp.editItem('products', '${item.id}')" title="Edit">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="admin-btn-icon delete" onclick="AdminApp.confirmDelete('products', '${item.id}', '${(item.name || item.title || '').replace(/'/g, "\\'")}')" title="Delete">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </td>
          `;
          break;

        case 'services':
          row.innerHTML = `
            <td><strong>${item.name || item.title || '—'}</strong></td>
            <td>${item.category || '—'}</td>
            <td>${(item.features || []).length} features</td>
            <td class="actions-cell">
              <button class="admin-btn-icon" onclick="AdminApp.editItem('services', '${item.id}')" title="Edit">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="admin-btn-icon delete" onclick="AdminApp.confirmDelete('services', '${item.id}', '${(item.name || item.title || '').replace(/'/g, "\\'")}')" title="Delete">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </td>
          `;
          break;

        case 'portfolio':
          row.innerHTML = `
            <td><strong>${item.title || item.name || '—'}</strong></td>
            <td><span class="badge badge-cyan">${item.category || '—'}</span></td>
            <td>${item.client || '—'}</td>
            <td class="actions-cell">
              <button class="admin-btn-icon" onclick="AdminApp.editItem('portfolio', '${item.id}')" title="Edit">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="admin-btn-icon delete" onclick="AdminApp.confirmDelete('portfolio', '${item.id}', '${(item.title || item.name || '').replace(/'/g, "\\'")}')" title="Delete">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </td>
          `;
          break;

        case 'reviews':
          row.innerHTML = `
            <td><strong>${item.name || item.author || '—'}</strong></td>
            <td style="color: var(--accent-amber);">${'★'.repeat(item.rating || 5)}</td>
            <td>${item.location || '—'}</td>
            <td style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.quote || item.text || '—'}</td>
            <td class="actions-cell">
              <button class="admin-btn-icon" onclick="AdminApp.editItem('reviews', '${item.id}')" title="Edit">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="admin-btn-icon delete" onclick="AdminApp.confirmDelete('reviews', '${item.id}', '${(item.name || item.author || '').replace(/'/g, "\\'")}')" title="Delete">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </td>
          `;
          break;
      }
      
      tbody.appendChild(row);
    });

    // Update nav counts
    const countEl = document.querySelector(`.admin-nav-item[data-page="${type}"] .nav-count`);
    if (countEl) countEl.textContent = data.length;
  }

  // =========================================================================
  // CRUD Modal Operations
  // =========================================================================

  /**
   * Open the add/edit modal for a data type
   */
  function openModal(type, item = null) {
    editingItem = item;
    const modal = document.getElementById('admin-modal');
    const title = document.getElementById('admin-modal-title');
    const formContainer = document.getElementById('admin-modal-form');
    
    if (!modal) return;
    
    title.textContent = item ? `Edit ${capitalize(type.slice(0, -1))}` : `Add New ${capitalize(type.slice(0, -1))}`;
    
    // Build form fields based on type
    formContainer.innerHTML = buildFormFields(type, item);
    
    // Store type for save handler
    formContainer.setAttribute('data-type', type);
    formContainer.setAttribute('data-editing-id', item ? item.id : '');
    
    modal.classList.add('active');
  }

  /**
   * Close the modal
   */
  function closeModal() {
    const modal = document.getElementById('admin-modal');
    if (modal) modal.classList.remove('active');
    editingItem = null;
  }

  /**
   * Build form fields based on data type
   */
  function buildFormFields(type, item) {
    const val = (key) => item ? (item[key] || '') : '';
    
    switch (type) {
      case 'products':
        return `
          <div class="admin-form-group">
            <label class="admin-form-label">Product Name</label>
            <input class="admin-form-input" name="name" value="${val('name') || val('title')}" placeholder="e.g., Apex Trend Scalper Pro" required>
          </div>
          <div class="admin-form-row">
            <div class="admin-form-group">
              <label class="admin-form-label">Platform</label>
              <select class="admin-form-select" name="platform">
                <option value="MT5" ${val('platform') === 'MT5' ? 'selected' : ''}>MetaTrader 5</option>
                <option value="MT4" ${val('platform') === 'MT4' ? 'selected' : ''}>MetaTrader 4</option>
                <option value="MT5/MT4" ${val('platform') === 'MT5/MT4' ? 'selected' : ''}>MT5 / MT4</option>
                <option value="Python" ${val('platform') === 'Python' ? 'selected' : ''}>Python</option>
                <option value="IBKR" ${val('platform') === 'IBKR' ? 'selected' : ''}>Interactive Brokers</option>
              </select>
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Price (USD)</label>
              <input class="admin-form-input" name="price" type="number" value="${val('price')}" placeholder="299">
            </div>
          </div>
          <div class="admin-form-row">
            <div class="admin-form-group">
              <label class="admin-form-label">Version</label>
              <input class="admin-form-input" name="version" value="${val('version')}" placeholder="v3.4.2">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Rating</label>
              <input class="admin-form-input" name="rating" type="number" step="0.1" min="1" max="5" value="${val('rating')}" placeholder="4.9">
            </div>
          </div>
          <div class="admin-form-group">
            <label class="admin-form-label">Description</label>
            <textarea class="admin-form-textarea" name="description" placeholder="Brief product description...">${val('description') || val('desc')}</textarea>
          </div>
          <div class="admin-form-group">
            <label class="admin-form-label">Features (one per line)</label>
            <textarea class="admin-form-textarea" name="features" placeholder="Feature 1\nFeature 2\nFeature 3">${Array.isArray(item?.features) ? item.features.join('\n') : (val('features') || '')}</textarea>
          </div>
        `;

      case 'services':
        return `
          <div class="admin-form-group">
            <label class="admin-form-label">Service Name</label>
            <input class="admin-form-input" name="name" value="${val('name') || val('title')}" placeholder="e.g., MT5 EA Development" required>
          </div>
          <div class="admin-form-group">
            <label class="admin-form-label">Category</label>
            <select class="admin-form-select" name="category">
              <option value="MetaTrader" ${val('category') === 'MetaTrader' ? 'selected' : ''}>MetaTrader</option>
              <option value="Python" ${val('category') === 'Python' ? 'selected' : ''}>Python</option>
              <option value="IBKR" ${val('category') === 'IBKR' ? 'selected' : ''}>Interactive Brokers</option>
              <option value="Backtesting" ${val('category') === 'Backtesting' ? 'selected' : ''}>Backtesting</option>
              <option value="VPS" ${val('category') === 'VPS' ? 'selected' : ''}>VPS / Infrastructure</option>
              <option value="API" ${val('category') === 'API' ? 'selected' : ''}>API Integration</option>
              <option value="Other" ${val('category') === 'Other' ? 'selected' : ''}>Other</option>
            </select>
          </div>
          <div class="admin-form-group">
            <label class="admin-form-label">Description</label>
            <textarea class="admin-form-textarea" name="description" placeholder="Service description...">${val('description') || val('desc')}</textarea>
          </div>
          <div class="admin-form-group">
            <label class="admin-form-label">Features (one per line)</label>
            <textarea class="admin-form-textarea" name="features" placeholder="Feature 1\nFeature 2">${Array.isArray(item?.features) ? item.features.map(f => f.text || f).join('\n') : (val('features') || '')}</textarea>
          </div>
        `;

      case 'portfolio':
        return `
          <div class="admin-form-group">
            <label class="admin-form-label">Project Title</label>
            <input class="admin-form-input" name="title" value="${val('title') || val('name')}" placeholder="e.g., Gold XAUUSD Scalper EA" required>
          </div>
          <div class="admin-form-row">
            <div class="admin-form-group">
              <label class="admin-form-label">Category</label>
              <select class="admin-form-select" name="category">
                <option value="MT5 EA" ${val('category') === 'MT5 EA' ? 'selected' : ''}>MT5 EA</option>
                <option value="MT4 EA" ${val('category') === 'MT4 EA' ? 'selected' : ''}>MT4 EA</option>
                <option value="Python Bot" ${val('category') === 'Python Bot' ? 'selected' : ''}>Python Bot</option>
                <option value="IBKR System" ${val('category') === 'IBKR System' ? 'selected' : ''}>IBKR System</option>
                <option value="Custom Software" ${val('category') === 'Custom Software' ? 'selected' : ''}>Custom Software</option>
              </select>
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Client</label>
              <input class="admin-form-input" name="client" value="${val('client')}" placeholder="Client name or 'Confidential'">
            </div>
          </div>
          <div class="admin-form-group">
            <label class="admin-form-label">Description</label>
            <textarea class="admin-form-textarea" name="description" placeholder="Project description and results...">${val('description') || val('desc')}</textarea>
          </div>
          <div class="admin-form-row">
            <div class="admin-form-group">
              <label class="admin-form-label">Key Metric Label</label>
              <input class="admin-form-input" name="metricLabel" value="${val('metricLabel')}" placeholder="e.g., Profit Factor">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Key Metric Value</label>
              <input class="admin-form-input" name="metricValue" value="${val('metricValue')}" placeholder="e.g., 2.34">
            </div>
          </div>
        `;

      case 'reviews':
        return `
          <div class="admin-form-row">
            <div class="admin-form-group">
              <label class="admin-form-label">Client Name</label>
              <input class="admin-form-input" name="name" value="${val('name') || val('author')}" placeholder="e.g., David K." required>
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
              <label class="admin-form-label">Location</label>
              <input class="admin-form-input" name="location" value="${val('location')}" placeholder="e.g., United States">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Title / Role</label>
              <input class="admin-form-input" name="role" value="${val('role') || val('title')}" placeholder="e.g., Prop Trader">
            </div>
          </div>
          <div class="admin-form-group">
            <label class="admin-form-label">Review Text</label>
            <textarea class="admin-form-textarea" name="quote" placeholder="Client's testimonial...">${val('quote') || val('text')}</textarea>
          </div>
          <div class="admin-form-group">
            <label class="admin-form-label">Project Type</label>
            <select class="admin-form-select" name="projectType">
              <option value="EA Development" ${val('projectType') === 'EA Development' ? 'selected' : ''}>EA Development</option>
              <option value="Python Bot" ${val('projectType') === 'Python Bot' ? 'selected' : ''}>Python Bot</option>
              <option value="IBKR Automation" ${val('projectType') === 'IBKR Automation' ? 'selected' : ''}>IBKR Automation</option>
              <option value="API Integration" ${val('projectType') === 'API Integration' ? 'selected' : ''}>API Integration</option>
              <option value="Other" ${val('projectType') === 'Other' ? 'selected' : ''}>Other</option>
            </select>
          </div>
        `;

      default:
        return '<p>Unknown data type</p>';
    }
  }

  /**
   * Save form data from the modal
   */
  function saveModal() {
    const formContainer = document.getElementById('admin-modal-form');
    const type = formContainer.getAttribute('data-type');
    const editingId = formContainer.getAttribute('data-editing-id');
    
    // Collect all form values
    const formData = {};
    formContainer.querySelectorAll('input, textarea, select').forEach(input => {
      const name = input.name;
      let value = input.value.trim();
      
      // Handle special fields
      if (name === 'features') {
        value = value.split('\n').filter(f => f.trim()).map(f => f.trim());
      }
      if (name === 'price' || name === 'rating') {
        value = parseFloat(value) || 0;
      }
      
      formData[name] = value;
    });

    // Validate required fields
    const nameField = formData.name || formData.title;
    if (!nameField) {
      alert('Name/Title is required');
      return;
    }

    if (editingId) {
      updateItem(type, editingId, formData);
    } else {
      addItem(type, formData);
    }

    closeModal();
    renderDataTable(type);
    renderDashboard();

    if (typeof showToast === 'function') {
      showToast(editingId ? `${capitalize(type.slice(0, -1))} updated successfully` : `${capitalize(type.slice(0, -1))} added successfully`, 'success');
    }
  }

  /**
   * Edit an existing item
   */
  function editItem(type, id) {
    const data = getData(type);
    const item = data.find(i => i.id === id);
    if (item) {
      openModal(type, item);
    }
  }

  /**
   * Confirm deletion
   */
  function confirmDelete(type, id, name) {
    if (confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
      deleteItem(type, id);
      renderDataTable(type);
      renderDashboard();
      
      if (typeof showToast === 'function') {
        showToast(`${name} has been deleted`, 'success');
      }
    }
  }

  // =========================================================================
  // Settings Page
  // =========================================================================

  function renderSettings() {
    // Settings are handled via inline event handlers in the HTML
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
  // Utilities
  // =========================================================================

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // =========================================================================
  // Public API
  // =========================================================================

  return {
    init,
    navigateTo,
    openModal,
    closeModal,
    saveModal,
    editItem,
    confirmDelete,
    exportAllData,
    importData,
    resetData,
    handleChangePassword,
    getData,
    saveData
  };
})();

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  AdminApp.init();
});
