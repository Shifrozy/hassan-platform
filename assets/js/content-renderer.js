/**
 * ============================================================================
 * Hassan Platform - Dynamic Content Renderer & Live Sync Module
 * ============================================================================
 * Renders website sections dynamically from data arrays (SERVICES_DATA,
 * PRODUCTS_DATA, PORTFOLIO_DATA, REVIEWS_DATA) which are overridden by
 * admin modifications in localStorage.
 * ============================================================================
 */

const ContentRenderer = (() => {

  /**
   * Initialize rendering based on current page
   */
  function init() {
    renderHomeSections();
    renderProductsPage();
    renderServicesPage();
    renderPortfolioPage();
    renderReviewsPage();
  }

  // =========================================================================
  // Homepage Dynamic Renderers
  // =========================================================================

  function renderHomeSections() {
    renderHomeServices();
    renderHomeProducts();
    renderHomeReviews();
  }

  function renderHomeServices() {
    const container = document.getElementById('home-services-grid');
    if (!container || typeof SERVICES_DATA === 'undefined') return;

    const items = SERVICES_DATA.slice(0, 3);
    container.innerHTML = items.map(service => {
      const title = service.title || service.name || 'Custom Service';
      const desc = service.shortDesc || service.detailedDesc || service.description || '';
      let techs = service.technologies || [];
      if (typeof techs === 'string') techs = techs.split(',').map(s => s.trim());
      const techBadges = techs.slice(0, 2).map(t => `<span class="badge badge-cyan">${escapeHtml(t)}</span>`).join(' ');

      return `
        <div class="glass-card">
          <div class="service-icon-wrapper">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="1.5">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </div>
          <h3 class="service-card-title">${escapeHtml(title)}</h3>
          <p class="service-card-desc">${escapeHtml(desc)}</p>
          <div class="service-card-tags">
            ${techBadges}
          </div>
          <a href="services.html" class="btn btn-secondary btn-sm btn-block">Learn More</a>
        </div>
      `;
    }).join('');
  }

  function renderHomeProducts() {
    const container = document.getElementById('home-products-grid');
    if (!container || typeof PRODUCTS_DATA === 'undefined') return;

    const items = PRODUCTS_DATA.slice(0, 3);
    container.innerHTML = items.map(product => {
      const name = product.name || product.title || 'Trading Bot';
      const desc = product.shortDesc || product.tagline || product.description || '';
      let rawFeatures = product.features || [];
      if (typeof rawFeatures === 'string') rawFeatures = rawFeatures.split('\n').filter(f => f.trim());
      const featuresList = rawFeatures.slice(0, 3).map(f => `
        <div class="product-feature-item"><span class="feature-check">✓</span> ${escapeHtml(f)}</div>
      `).join('');

      const priceStr = product.priceFormatted || (product.price ? '$' + product.price : '$299');

      return `
        <div class="product-card">
          <div class="product-content">
            <div class="product-meta">
              <span class="badge ${product.platformBadge || 'badge-mt5'}">${escapeHtml(product.platform || 'Algorithmic')}</span>
              <span class="product-version">⭐ ${product.rating || '5.0'}</span>
            </div>
            <h3 class="product-title">${escapeHtml(name)}</h3>
            <p class="product-desc">${escapeHtml(desc)}</p>
            <div class="product-features-list">
              ${featuresList}
            </div>
            <div class="product-footer">
              <div class="product-price">
                <span class="price-label">${escapeHtml(product.billingType || 'One-Time License')}</span>
                <span class="price-amount">${escapeHtml(priceStr)}</span>
              </div>
              <button type="button" class="btn btn-primary btn-sm" data-product-id="${product.id}" data-action="buy">Get Access</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderHomeReviews() {
    const container = document.getElementById('home-reviews-grid');
    if (!container || typeof REVIEWS_DATA === 'undefined') return;

    const items = REVIEWS_DATA.slice(0, 3);
    container.innerHTML = items.map(review => {
      const name = review.clientName || review.name || review.author || 'Verified Trader';
      const comment = review.comment || review.quote || review.text || review.description || '';
      const location = review.country || review.location || '';
      const role = review.role || review.title || 'Trader';
      const stars = '★'.repeat(parseInt(review.rating, 10) || 5);
      const avatar = review.avatar || (name ? name.substring(0, 2).toUpperCase() : 'TR');

      return `
        <div class="review-card">
          <div class="stars-row" style="justify-content: flex-start;">${stars}</div>
          <p class="review-quote">"${escapeHtml(comment)}"</p>
          <div class="review-author">
            <div class="author-avatar">${avatar}</div>
            <div class="author-info">
              <span class="author-name">${escapeHtml(name)}</span>
              <span class="author-location">${escapeHtml(location)}${location ? ' • ' : ''}${escapeHtml(role)}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // =========================================================================
  // Products Page Renderer
  // =========================================================================

  function renderProductsPage() {
    const container = document.getElementById('products-grid-container');
    if (!container || typeof PRODUCTS_DATA === 'undefined') return;

    renderProductsList(PRODUCTS_DATA);
    initProductsFilter();
  }

  function renderProductsList(products) {
    const container = document.getElementById('products-grid-container');
    if (!container) return;

    if (products.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-12); color: var(--text-secondary);">
          <p>No products found in this category.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = products.map(product => {
      // Determine filter category
      let categoryAttr = 'all';
      const plat = (product.platform || '').toLowerCase();
      if (plat.includes('mt5')) categoryAttr = 'mt5';
      else if (plat.includes('mt4')) categoryAttr = 'mt4';
      else if (plat.includes('python') || plat.includes('ibkr')) categoryAttr = 'python';

      const featuresList = (product.features || []).slice(0, 3).map(f => `
        <div class="product-feature-item"><span class="feature-check">✓</span> ${escapeHtml(f)}</div>
      `).join('');

      return `
        <div class="product-card" data-category="${categoryAttr}">
          <div class="product-visual">
            <img src="${product.image || 'assets/images/products/apex-scalper.svg'}" alt="${escapeHtml(product.name)}" style="max-height: 140px;">
            <span class="badge ${product.platformBadge || 'badge-mt5'} product-badge-float">${escapeHtml(product.platform || 'Trading Software')}</span>
          </div>
          <div class="product-content">
            <div class="product-meta">
              <span class="badge badge-cyan">${escapeHtml(product.version || 'v1.0')}</span>
              <span class="product-version">⭐ ${product.rating || '5.0'} (${product.reviewsCount || 10} Reviews)</span>
            </div>
            <h2 class="product-title" style="font-size: var(--text-xl);">${escapeHtml(product.name)}</h2>
            <p class="product-desc">${escapeHtml(product.shortDesc || product.tagline || '')}</p>
            <div class="product-features-list">
              ${featuresList}
            </div>
            <div class="product-footer">
              <div class="product-price">
                <span class="price-label">${escapeHtml(product.billingType || 'One-Time License')}</span>
                <span class="price-amount">${escapeHtml(product.priceFormatted || '$' + product.price)}</span>
              </div>
              <div style="display: flex; gap: 6px;">
                <button type="button" class="btn btn-secondary btn-sm" data-product-id="${product.id}" data-action="view">Details</button>
                <button type="button" class="btn btn-primary btn-sm" data-product-id="${product.id}" data-action="buy">Get Access</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function initProductsFilter() {
    const filterButtons = document.querySelectorAll('.filter-nav .filter-btn');
    if (!filterButtons.length) return;

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        const cards = document.querySelectorAll('#products-grid-container .product-card');

        cards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if (filter === 'all' || cardCat === filter || (filter === 'mt4' && (cardCat === 'mt5' || cardCat === 'mt4'))) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // =========================================================================
  // Services Page Renderer
  // =========================================================================

  function renderServicesPage() {
    const container = document.getElementById('services-grid-container');
    if (!container || typeof SERVICES_DATA === 'undefined') return;

    container.innerHTML = SERVICES_DATA.map(service => {
      const benefitsList = (service.benefits || []).map(b => `
        <li><span class="feature-check">✓</span> ${escapeHtml(b)}</li>
      `).join('');

      const techString = (service.technologies || []).join(' • ');

      return `
        <div class="glass-card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-4);">
            <span class="badge badge-cyan">${escapeHtml(service.category || 'Trading Service')}</span>
            ${service.badge ? `<span class="badge badge-success">${escapeHtml(service.badge)}</span>` : ''}
          </div>
          <h2 style="font-size: var(--text-2xl); margin-bottom: var(--space-3);">${escapeHtml(service.title)}</h2>
          <p style="font-size: var(--text-sm); line-height: 1.6; margin-bottom: var(--space-4);">
            ${escapeHtml(service.detailedDesc || service.shortDesc || '')}
          </p>
          <div style="background: var(--bg-tertiary); padding: var(--space-4); border-radius: var(--radius-md); margin-bottom: var(--space-5);">
            <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px;">Key Deliverables</div>
            <ul style="font-size: var(--text-xs); color: var(--text-secondary); display: flex; flex-direction: column; gap: 4px;">
              ${benefitsList}
            </ul>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <div style="font-family: var(--font-mono); font-size: 12px; color: var(--accent-cyan);">${escapeHtml(techString)}</div>
            <a href="contact.html?service=${encodeURIComponent(service.title)}" class="btn btn-primary btn-sm">${escapeHtml(service.ctaText || 'Request Quote')}</a>
          </div>
        </div>
      `;
    }).join('');
  }

  // =========================================================================
  // Portfolio Page Renderer
  // =========================================================================

  function renderPortfolioPage() {
    const container = document.getElementById('portfolio-grid-container');
    if (!container || typeof PORTFOLIO_DATA === 'undefined') return;

    container.innerHTML = PORTFOLIO_DATA.map(project => {
      const metricsHtml = (project.metrics || []).slice(0, 3).map(m => `
        <div class="metric-item">
          <span class="metric-label">${escapeHtml(m.label)}</span>
          <span class="metric-val" style="color: var(--accent-green);">${escapeHtml(m.value)}</span>
        </div>
      `).join('');

      return `
        <div class="project-card" data-category="${escapeHtml(project.category || 'all')}" data-project-id="${project.id}" style="cursor: pointer;">
          <div class="project-preview">
            <img src="${project.image || 'assets/images/portfolio/project-mt5-ea.svg'}" alt="${escapeHtml(project.title)}">
          </div>
          <div class="project-info">
            <span class="project-category">${escapeHtml(project.categoryLabel || project.category || 'Case Study')}</span>
            <h2 class="project-title" style="font-size: var(--text-xl);">${escapeHtml(project.title)}</h2>
            <p class="project-desc">${escapeHtml(project.description || '')}</p>
            
            <div class="project-metrics">
              ${metricsHtml}
            </div>

            <div class="project-footer">
              <span class="project-status">${escapeHtml(project.status || 'Active')}</span>
              <span style="font-size: var(--text-xs); color: var(--accent-cyan); font-weight: 600; display: flex; align-items: center; gap: 4px;">
                View Case Study
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // =========================================================================
  // Reviews Page Renderer
  // =========================================================================

  function renderReviewsPage() {
    const container = document.getElementById('reviews-grid-container');
    if (!container || typeof REVIEWS_DATA === 'undefined') return;

    container.innerHTML = REVIEWS_DATA.map(review => {
      const stars = '★'.repeat(review.rating || 5);
      const avatar = review.avatar || (review.clientName ? review.clientName.substring(0, 2).toUpperCase() : 'CL');

      return `
        <div class="review-card">
          <div class="review-header">
            <div class="stars-row" style="font-size: 16px;">${stars}</div>
            <span class="badge badge-success" style="font-size: 10px;">Verified Client</span>
          </div>
          <p class="review-quote">"${escapeHtml(review.comment)}"</p>
          <div class="review-author" style="margin-top: auto;">
            <div class="author-avatar">${avatar}</div>
            <div class="author-info">
              <span class="author-name">${escapeHtml(review.clientName)}</span>
              <span class="author-location">${escapeHtml(review.country || '')} • ${escapeHtml(review.role || 'Client')}</span>
              ${review.serviceUsed ? `<span style="font-size: 10px; color: var(--accent-cyan); font-family: var(--font-mono); margin-top: 2px;">${escapeHtml(review.serviceUsed)}</span>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  return {
    init,
    renderHomeSections,
    renderProductsPage,
    renderServicesPage,
    renderPortfolioPage,
    renderReviewsPage
  };
})();

// Auto-run when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    ContentRenderer.init();
  });
}
