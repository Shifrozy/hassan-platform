/**
 * ============================================================================
 * Hassan Platform - Core Application Logic & UI Handlers
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  loadAdminOverrides();
  initNavbar();
  initMobileDrawer();
  initDynamicBranding();
  initAccordions();
  initToasts();
  highlightActiveNav();
  initAdminQuickAccess();
});

/**
 * Sticky Navbar on Scroll
 */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Mobile Navigation Drawer
 */
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.drawer-overlay');
  const closeBtn = document.querySelector('.drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (!drawer || !toggleBtn) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/**
 * Injects dynamic branding and links from SITE_CONFIG
 */
function initDynamicBranding() {
  if (typeof SITE_CONFIG === 'undefined') return;

  // Update current copyright year
  const yearElements = document.querySelectorAll('.current-year');
  const currentYear = new Date().getFullYear();
  yearElements.forEach(el => {
    el.textContent = currentYear;
  });

  // Inject dynamic social & contact links where data-config attribute exists
  document.querySelectorAll('[data-config]').forEach(el => {
    const key = el.getAttribute('data-config');
    const value = getNestedConfig(SITE_CONFIG, key);
    if (value) {
      if (el.tagName === 'A') {
        if (el.getAttribute('href') === '#') {
          el.setAttribute('href', value);
        }
      } else {
        el.textContent = value;
      }
    }
  });
}

function getNestedConfig(obj, path) {
  return path.split('.').reduce((prev, curr) => prev ? prev[curr] : null, obj);
}

/**
 * Active Navigation Link Highlight
 */
function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  
  document.querySelectorAll('.nav-link, .drawer-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Interactive Accordion (FAQ)
 */
function initAccordions() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      // Close other accordion items in the same container
      const container = item.closest('.accordion');
      if (container) {
        container.querySelectorAll('.accordion-item').forEach(other => {
          if (other !== item) other.classList.remove('active');
        });
      }

      // Toggle current
      if (isActive) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });
}

/**
 * Toast Notification System
 */
function initToasts() {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
}

window.showToast = function(message, type = 'success', duration = 4500) {
  const container = document.querySelector('.toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
};

/**
 * ============================================================================
 * Admin Data Override Layer
 * ============================================================================
 * Checks localStorage for admin-modified data and overrides the global
 * static data arrays. This allows admin panel changes to reflect on the
 * main website without any backend.
 */
function loadAdminOverrides() {
  const STORAGE_KEYS = {
    products: 'hassan_admin_products',
    services: 'hassan_admin_services',
    portfolio: 'hassan_admin_portfolio',
    reviews: 'hassan_admin_reviews',
    config: 'hassan_admin_config'
  };

  // Override global data if admin has modified it
  Object.keys(STORAGE_KEYS).forEach(key => {
    const stored = localStorage.getItem(STORAGE_KEYS[key]);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        switch (key) {
          case 'products':
            if (typeof window.PRODUCTS_DATA !== 'undefined') window.PRODUCTS_DATA = data;
            break;
          case 'services':
            if (typeof window.SERVICES_DATA !== 'undefined') window.SERVICES_DATA = data;
            break;
          case 'portfolio':
            if (typeof window.PORTFOLIO_DATA !== 'undefined') window.PORTFOLIO_DATA = data;
            break;
          case 'reviews':
            if (typeof window.REVIEWS_DATA !== 'undefined') window.REVIEWS_DATA = data;
            break;
          case 'config':
            if (typeof window.SITE_CONFIG !== 'undefined') window.SITE_CONFIG = data;
            break;
        }
      } catch (e) {
        // Invalid JSON, skip override
      }
    }
  });
}

/**
 * ============================================================================
 * Admin Quick Access & Floating Toolbar
 * ============================================================================
 * Discreet admin trigger:
 * - Shortcut: Ctrl + Shift + A (or Cmd + Shift + A)
 * - Footer Trigger: Click on the discreet lock icon
 * - Floating Bar: Appears ONLY when Hassan is authenticated
 * ============================================================================
 */
function initAdminQuickAccess() {
  // Don't inject floating bar on the admin page itself
  const isCurrentAdminPage = window.location.pathname.endsWith('admin.html');
  if (isCurrentAdminPage) return;

  // Function to load admin auth dynamically on-demand
  function loadAdminAuthScript() {
    if (typeof AdminAuth !== 'undefined') return Promise.resolve();
    return new Promise((resolve, reject) => {
      const existing = document.querySelector('script[src*="admin-auth.js"]');
      if (existing) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'assets/js/admin-auth.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load auth module'));
      document.head.appendChild(script);
    });
  }

  // Only check session if a session token exists in localStorage
  if (localStorage.getItem('hassan_admin_session')) {
    loadAdminAuthScript().then(() => {
      if (typeof AdminAuth !== 'undefined' && AdminAuth.isAuthenticated()) {
        renderAdminFloatingBar();
      }
    }).catch(() => {});
  }

  // Keyboard shortcut listener (Ctrl + Shift + A or Cmd + Shift + A)
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      triggerAdminAccess();
    }
  });

  // Footer lock icon trigger listener
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.footer-admin-trigger');
    if (trigger) {
      e.preventDefault();
      triggerAdminAccess();
    }
  });

  async function triggerAdminAccess() {
    await loadAdminAuthScript();
    if (typeof AdminAuth !== 'undefined' && AdminAuth.isAuthenticated()) {
      window.location.href = 'admin.html';
    } else {
      openAdminQuickModal();
    }
  }

  function renderAdminFloatingBar() {
    if (document.getElementById('admin-floating-bar')) return;

    const bar = document.createElement('div');
    bar.id = 'admin-floating-bar';
    bar.className = 'admin-floating-bar';
    bar.innerHTML = `
      <div class="admin-floating-status">
        <span class="admin-floating-pulse"></span>
        <span>Admin Active</span>
      </div>
      <div class="admin-floating-actions">
        <a href="admin.html" class="admin-floating-btn admin-floating-btn-dashboard">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          <span>Dashboard</span>
        </a>
        <button type="button" class="admin-floating-btn admin-floating-btn-logout" id="admin-floating-logout">
          <span>Logout</span>
        </button>
      </div>
    `;

    document.body.appendChild(bar);

    const logoutBtn = document.getElementById('admin-floating-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (typeof AdminAuth !== 'undefined') AdminAuth.logout();
        bar.remove();
        if (window.showToast) window.showToast('Admin session logged out', 'info');
      });
    }
  }

  function openAdminQuickModal() {
    let modalOverlay = document.getElementById('admin-quick-modal-overlay');
    if (!modalOverlay) {
      modalOverlay = document.createElement('div');
      modalOverlay.id = 'admin-quick-modal-overlay';
      modalOverlay.className = 'admin-quick-modal-overlay';
      modalOverlay.innerHTML = `
        <div class="admin-quick-modal">
          <button type="button" class="admin-quick-close" id="admin-quick-close-btn">&times;</button>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: var(--accent-cyan);"></span>
            <span style="font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; color: var(--accent-cyan); font-weight: 700;">Hassan Platform</span>
          </div>
          <h3 style="font-size: var(--text-xl); margin-bottom: 6px; color: var(--text-primary);">Owner Admin Access</h3>
          <p style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: var(--space-6);">Enter your password to manage website content and live data.</p>
          <form id="admin-quick-form">
            <input type="password" id="admin-quick-password" class="admin-login-input" placeholder="Enter admin password" style="margin-bottom: var(--space-3);" autocomplete="current-password" autofocus>
            <div id="admin-quick-error" style="font-size: 11px; color: var(--accent-rose); min-height: 16px; margin-bottom: var(--space-4);"></div>
            <button type="submit" class="btn btn-primary btn-block">
              <span>Login to Admin Panel</span>
            </button>
          </form>
        </div>
      `;
      document.body.appendChild(modalOverlay);

      // Close button
      document.getElementById('admin-quick-close-btn').addEventListener('click', closeAdminQuickModal);
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeAdminQuickModal();
      });

      // Form submit
      document.getElementById('admin-quick-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const pwInput = document.getElementById('admin-quick-password');
        const errEl = document.getElementById('admin-quick-error');
        const password = pwInput.value.trim();

        if (!password) {
          errEl.textContent = 'Please enter password';
          return;
        }

        await loadAdminAuthScript();
        if (typeof AdminAuth !== 'undefined') {
          const isValid = await AdminAuth.verifyPassword(password);
          if (isValid) {
            AdminAuth.createSession();
            errEl.textContent = '';
            closeAdminQuickModal();
            if (window.showToast) window.showToast('Login successful! Opening Dashboard...', 'success');
            setTimeout(() => {
              window.location.href = 'admin.html';
            }, 400);
          } else {
            errEl.textContent = 'Incorrect password. Please try again.';
            pwInput.value = '';
            pwInput.focus();
          }
        }
      });
    }

    modalOverlay.classList.add('active');
    const pwInput = document.getElementById('admin-quick-password');
    if (pwInput) {
      pwInput.value = '';
      setTimeout(() => pwInput.focus(), 100);
    }
  }
}

function closeAdminQuickModal() {
  const modalOverlay = document.getElementById('admin-quick-modal-overlay');
  if (modalOverlay) {
    modalOverlay.classList.remove('active');
  }
}

