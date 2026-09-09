/**
 * ============================================================================
 * Product Modal & Checkout Drawer Component
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initProductModals();
});

function initProductModals() {
  // Delegate click on product cards or detail buttons
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-product-id]');
    if (!trigger) return;

    const productId = trigger.getAttribute('data-product-id');
    const action = trigger.getAttribute('data-action') || 'view';

    if (typeof PRODUCTS_DATA !== 'undefined') {
      const product = PRODUCTS_DATA.find(p => p.id === productId);
      if (product) {
        if (action === 'buy') {
          openCheckoutModal(product);
        } else {
          openProductDetailModal(product);
        }
      }
    }
  });

  createModalContainers();
}

function createModalContainers() {
  if (document.getElementById('product-modal')) return;

  const modalHtml = `
    <div id="product-modal" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3 id="pm-title" class="modal-title">Product Details</h3>
          <button type="button" class="modal-close" onclick="closeProductModal()">&times;</button>
        </div>
        <div id="pm-body" class="modal-body">
          <!-- Dynamic Content -->
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="closeProductModal()">Close</button>
          <button type="button" id="pm-buy-btn" class="btn btn-profit">Proceed to Purchase</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function openProductDetailModal(product) {
  const modal = document.getElementById('product-modal');
  const title = document.getElementById('pm-title');
  const body = document.getElementById('pm-body');
  const buyBtn = document.getElementById('pm-buy-btn');

  if (!modal || !product) return;

  title.textContent = product.name;
  
  const featuresList = product.features.map(f => `
    <li class="product-feature-item" style="font-size: 13px; margin-bottom: 6px;">
      <span class="feature-check">✓</span> ${f}
    </li>
  `).join('');

  const changelogList = product.changelog ? product.changelog.map(c => `
    <li style="font-size: 12px; color: var(--text-muted); margin-bottom: 4px;">• ${c}</li>
  `).join('') : '';

  body.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
        <span class="badge ${product.platformBadge}">${product.platform}</span>
        <span class="badge badge-cyan">${product.version}</span>
        <span class="badge badge-success">${product.billingType}</span>
      </div>
      <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.6;">${product.shortDesc}</p>
    </div>

    <div style="background: var(--bg-tertiary); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 1.5rem;">
      <h4 style="font-size: 13px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 10px; font-family: var(--font-mono);">Key Capabilities</h4>
      <ul style="list-style: none;">
        ${featuresList}
      </ul>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 1.5rem;">
      <div style="background: var(--bg-primary); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
        <div style="font-size: 11px; color: var(--text-muted);">Recommended Pair(s)</div>
        <div style="font-family: var(--font-mono); font-size: 13px; color: var(--accent-cyan); font-weight: 600;">${product.supportedPairs.join(', ')}</div>
      </div>
      <div style="background: var(--bg-primary); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
        <div style="font-size: 11px; color: var(--text-muted);">Recommended Timeframe</div>
        <div style="font-family: var(--font-mono); font-size: 13px; color: var(--accent-green); font-weight: 600;">${product.recommendedTimeframe}</div>
      </div>
    </div>

    ${changelogList ? `
      <div>
        <h4 style="font-size: 12px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px; font-family: var(--font-mono);">Recent Updates</h4>
        <ul style="list-style: none; padding-left: 4px;">
          ${changelogList}
        </ul>
      </div>
    ` : ''}
  `;

  buyBtn.textContent = `Get Access (${product.priceFormatted})`;
  buyBtn.onclick = () => {
    openCheckoutModal(product);
  };

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function openCheckoutModal(product) {
  const modal = document.getElementById('product-modal');
  const title = document.getElementById('pm-title');
  const body = document.getElementById('pm-body');
  const buyBtn = document.getElementById('pm-buy-btn');

  if (!modal || !product) return;

  title.textContent = `Get Access: ${product.name}`;

  body.innerHTML = `
    <div style="background: var(--bg-tertiary); padding: 18px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span style="font-weight: 700; color: var(--text-primary); font-size: 16px;">${product.name}</span>
        <span style="font-family: var(--font-mono); font-size: 20px; font-weight: 800; color: var(--accent-cyan);">${product.priceFormatted}</span>
      </div>
      <p style="font-size: 12px; color: var(--text-muted); margin: 0;">Includes lifetime product license, standard presets, and 30-day technical support.</p>
    </div>

    <form id="product-checkout-form" onsubmit="handleProductInquiry(event, '${product.name}', '${product.priceFormatted}')">
      <div class="form-group">
        <label class="form-label">Your Full Name <span class="required">*</span></label>
        <input type="text" id="chk-name" class="form-input" placeholder="e.g. John Alexander" required />
      </div>

      <div class="form-group">
        <label class="form-label">Email Address (For License & Files Delivery) <span class="required">*</span></label>
        <input type="email" id="chk-email" class="form-input" placeholder="e.g. trader@domain.com" required />
      </div>

      <div class="form-group">
        <label class="form-label">Preferred Platform / Account Details</label>
        <input type="text" id="chk-platform" class="form-input" placeholder="e.g. MT5 Standard / FTMO / IBKR" />
      </div>

      <div class="form-group">
        <label class="form-label">Optional Notes or Preset Requirements</label>
        <textarea id="chk-notes" class="form-textarea" style="min-height: 80px;" placeholder="Specify any custom broker settings, pairs, or setup assistance needed..."></textarea>
      </div>

      <p style="font-size: 11px; color: var(--text-muted); line-height: 1.4;">
        🔒 <strong>Phase 1 Direct Delivery:</strong> Submitting this request sends an instant encrypted confirmation. You will receive direct invoice payment options (Card, Stripe, PayPal, USDT/Crypto) and file delivery within 2 hours.
      </p>
    </form>
  `;

  buyBtn.textContent = `Confirm & Request License`;
  buyBtn.onclick = () => {
    const form = document.getElementById('product-checkout-form');
    if (form) {
      form.requestSubmit();
    }
  };

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

window.closeProductModal = function() {
  const modal = document.getElementById('product-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

window.handleProductInquiry = function(e, productName, price) {
  e.preventDefault();
  const name = document.getElementById('chk-name').value;
  const email = document.getElementById('chk-email').value;

  closeProductModal();
  
  if (window.showToast) {
    window.showToast(`Thank you ${name}! License request for ${productName} (${price}) received. Check ${email} for instant setup instructions.`, 'success', 6000);
  }
};
