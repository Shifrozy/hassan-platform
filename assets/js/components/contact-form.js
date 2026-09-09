/**
 * ============================================================================
 * Contact Form & Inquiry Validation Handler
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
});

function initContactForm() {
  const contactForm = document.getElementById('main-contact-form');
  if (!contactForm) return;

  const submitBtn = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // 1. Anti-Spam Honeypot Verification
    const honeypot = contactForm.querySelector('input[name="_trading_hp_check"]');
    if (honeypot && honeypot.value !== '') {
      console.warn('Bot submission blocked via honeypot.');
      return;
    }

    // 2. Validate Required Fields
    const nameInput = contactForm.querySelector('#contact-name');
    const emailInput = contactForm.querySelector('#contact-email');
    const projectTypeInput = contactForm.querySelector('#contact-project-type');
    const messageInput = contactForm.querySelector('#contact-message');

    if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
      if (window.showToast) {
        window.showToast('Please fill in all required fields.', 'error');
      }
      return;
    }

    // 3. Validate Email Format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      if (window.showToast) {
        window.showToast('Please enter a valid email address.', 'error');
      }
      return;
    }

    // 4. Visual Loading State
    const originalBtnHtml = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Transmitting Specification...</span>`;

    // Simulate reliable async delivery (Ready for Phase 2 backend endpoint)
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;

      const clientName = nameInput.value.trim();
      const pType = projectTypeInput ? projectTypeInput.value : 'Custom Trading System';

      // Reset form
      contactForm.reset();

      // Show comprehensive success toast
      if (window.showToast) {
        window.showToast(`Thank you ${clientName}! Your project brief for "${pType}" has been logged. I will review your requirements and respond within 4 hours.`, 'success', 7000);
      }
    }, 900);
  });
}
