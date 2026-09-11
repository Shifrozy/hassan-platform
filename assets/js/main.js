/**
 * ============================================================================
 * Hassan Platform - Core Application Logic & UI Handlers
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileDrawer();
  initDynamicBranding();
  initAccordions();
  initToasts();
  highlightActiveNav();
  loadAdminOverrides();
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
    reviews: 'hassan_admin_reviews'
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
        }
      } catch (e) {
        // Invalid JSON, skip override
      }
    }
  });
}
