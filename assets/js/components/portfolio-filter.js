/**
 * ============================================================================
 * Portfolio Filter & Dynamic Case Study Inspector
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initPortfolioFilter();
  initCaseStudyModal();
});

function initPortfolioFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn[data-filter]');
  const portfolioItems = document.querySelectorAll('.project-card[data-category]');

  if (!filterButtons.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active button state
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter project cards
      portfolioItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (filter === 'all' || itemCat === filter) {
          item.style.display = 'flex';
          item.style.animation = 'slideInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

function initCaseStudyModal() {
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-project-id]');
    if (!trigger) return;

    const projectId = trigger.getAttribute('data-project-id');
    if (typeof PORTFOLIO_DATA !== 'undefined') {
      const project = PORTFOLIO_DATA.find(p => p.id === projectId);
      if (project) {
        openCaseStudyModal(project);
      }
    }
  });

  if (!document.getElementById('project-modal')) {
    const modalHtml = `
      <div id="project-modal" class="modal-overlay">
        <div class="modal-container">
          <div class="modal-header">
            <h3 id="proj-modal-title" class="modal-title">Case Study Details</h3>
            <button type="button" class="modal-close" onclick="closeProjectModal()">&times;</button>
          </div>
          <div id="proj-modal-body" class="modal-body">
            <!-- Dynamic Content -->
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="closeProjectModal()">Close</button>
            <a href="contact.html" class="btn btn-primary">Inquire About Similar System</a>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }
}

function openCaseStudyModal(project) {
  const modal = document.getElementById('project-modal');
  const title = document.getElementById('proj-modal-title');
  const body = document.getElementById('proj-modal-body');

  if (!modal || !project) return;

  title.textContent = project.title;

  const metricsHtml = project.metrics.map(m => `
    <div style="background: var(--bg-primary); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
      <div style="font-size: 11px; color: var(--text-muted);">${m.label}</div>
      <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 700; color: var(--accent-green);">${m.value}</div>
    </div>
  `).join('');

  const featuresHtml = project.features.map(f => `
    <li style="font-size: 13px; color: var(--text-secondary); margin-bottom: 6px;">
      <span style="color: var(--accent-cyan);">▹</span> ${f}
    </li>
  `).join('');

  const techBadges = project.technologies.map(t => `
    <span class="badge badge-cyan">${t}</span>
  `).join(' ');

  body.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 10px;">
        <span class="badge badge-mt5">${project.categoryLabel}</span>
        <span class="badge badge-success">${project.status}</span>
      </div>
      <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.6;">${project.description}</p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 1.5rem;">
      ${metricsHtml}
    </div>

    <div style="background: var(--bg-tertiary); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 1.5rem;">
      <h4 style="font-size: 12px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 10px; font-family: var(--font-mono);">System Capabilities</h4>
      <ul style="list-style: none;">
        ${featuresHtml}
      </ul>
    </div>

    <div>
      <div style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px; font-family: var(--font-mono);">Technologies & Tools</div>
      <div style="display: flex; flex-wrap: wrap; gap: 6px;">
        ${techBadges}
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

window.closeProjectModal = function() {
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};
