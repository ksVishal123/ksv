/* ==========================================================================
   ROYAL GOLD & DIAMONDS - UI Utilities, Toast Notifications & Formatters
   ========================================================================== */

// 1. Currency Formatter (Indian Rupee INR formatting)
function formatINR(amount) {
  if (isNaN(amount) || amount === null || amount === undefined) return "₹0";
  const num = Number(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
}

// 2. Date Formatter
function formatDate(dateInput) {
  if (!dateInput) return "N/A";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return dateInput;
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

// 3. Render Star Rating
function renderStars(rating = 5) {
  const fullStars = Math.floor(rating);
  const hasHalf = (rating - fullStars) >= 0.5;
  let html = '';
  for (let i = 0; i < fullStars; i++) {
    html += '<i class="fas fa-star"></i>';
  }
  if (hasHalf) {
    html += '<i class="fas fa-star-half-alt"></i>';
  }
  const remaining = 5 - fullStars - (hasHalf ? 1 : 0);
  for (let i = 0; i < remaining; i++) {
    html += '<i class="far fa-star"></i>';
  }
  return html;
}

// 4. Toast Notification System
function showToast(title, message, type = 'gold') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type === 'success' ? 'success' : type === 'danger' || type === 'error' ? 'danger' : type === 'info' ? 'info' : 'gold'}`;
  
  let iconClass = 'fa-crown';
  if (type === 'success') iconClass = 'fa-check-circle';
  else if (type === 'danger' || type === 'error') iconClass = 'fa-exclamation-circle';
  else if (type === 'info') iconClass = 'fa-info-circle';

  toast.innerHTML = `
    <i class="fas ${iconClass} toast-icon"></i>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 4000);
}

// 5. Modal Management
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Setup Backdrop Click-to-Close
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Setup Mobile Drawer
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileBackdrop = document.getElementById('mobile-drawer-backdrop');
  const mobileClose = document.getElementById('mobile-drawer-close');

  if (mobileToggle && mobileDrawer && mobileBackdrop) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('active');
      mobileBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    const closeDrawer = () => {
      mobileDrawer.classList.remove('active');
      mobileBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (mobileClose) mobileClose.addEventListener('click', closeDrawer);
    mobileBackdrop.addEventListener('click', closeDrawer);
  }

  // Live gold rate ticker population
  updateGoldRateDisplay();
});

// 6. Update Live Gold Rate Display
function updateGoldRateDisplay() {
  const rate22kEls = document.querySelectorAll('.live-rate-22k');
  const rate24kEls = document.querySelectorAll('.live-rate-24k');
  const rateSilverEls = document.querySelectorAll('.live-rate-silver');

  const rates = window.LIVE_GOLD_RATES || { gold22k: 6850, gold24k: 7470, silver10g: 890 };

  rate22kEls.forEach(el => el.textContent = `₹${rates.gold22k.toLocaleString('en-IN')}/gm`);
  rate24kEls.forEach(el => el.textContent = `₹${rates.gold24k.toLocaleString('en-IN')}/gm`);
  rateSilverEls.forEach(el => el.textContent = `₹${rates.silver10g.toLocaleString('en-IN')}/10gm`);
}

// 7. Quick View Modal Renderer
async function openQuickView(productId) {
  const product = await window.dbService.getProductById(productId);
  if (!product) {
    showToast("Product Error", "Unable to load jewellery details.", "danger");
    return;
  }

  let quickModal = document.getElementById('quick-view-modal');
  if (!quickModal) {
    const modalHtml = `
      <div id="quick-view-modal" class="modal-backdrop">
        <div class="modal-box" style="max-width: 850px;">
          <div class="modal-header">
            <h3 class="modal-title" id="quick-view-title">Product Details</h3>
            <button class="modal-close-btn" onclick="closeModal('quick-view-modal')"><i class="fas fa-times"></i></button>
          </div>
          <div class="modal-body" id="quick-view-body">
            <!-- Dynamic content -->
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    quickModal = document.getElementById('quick-view-modal');
  }

  const bodyEl = document.getElementById('quick-view-body');
  bodyEl.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start;">
      <div>
        <div style="border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--gold-border);">
          <img src="${product.images[0]}" alt="${product.name}" style="width: 100%; height: 350px; object-fit: cover;">
        </div>
        <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
          ${product.images.map((img, i) => `
            <img src="${img}" style="width: 65px; height: 65px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid ${i === 0 ? 'var(--gold-primary)' : 'rgba(255,255,255,0.1)'}; cursor: pointer;">
          `).join('')}
        </div>
      </div>
      <div>
        <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
          <span class="badge-hallmark"><i class="fas fa-certificate"></i> ${product.hallmark}</span>
          <span class="badge-gold">${product.metal}</span>
        </div>
        <h3 style="font-family: var(--font-royal); font-size: 1.25rem; margin-bottom: 0.5rem; color: #fff;">${product.name}</h3>
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
          <div class="stars">${renderStars(product.rating)}</div>
          <span style="color: var(--text-muted); font-size: 0.8rem;">(${product.reviewCount || 0} reviews)</span>
        </div>
        <div style="margin-bottom: 1.25rem;">
          <span style="font-family: var(--font-royal); font-size: 1.6rem; font-weight: 700; color: var(--gold-bright);">${formatINR(product.price)}</span>
          ${product.mrp ? `<span style="text-decoration: line-through; color: var(--text-muted); font-size: 0.95rem; margin-left: 0.5rem;">${formatINR(product.mrp)}</span>` : ''}
        </div>
        <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 1.25rem; line-height: 1.6;">${product.description}</p>
        
        <div style="background: var(--bg-tertiary); padding: 0.85rem; border-radius: var(--radius-sm); margin-bottom: 1.5rem; font-size: 0.82rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
            <span style="color: var(--text-muted);">Gross Weight:</span>
            <span style="color: #fff; font-weight: 600;">${product.grossWeight}g</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">Net Gold Weight:</span>
            <span style="color: #fff; font-weight: 600;">${product.netGoldWeight}g</span>
          </div>
        </div>

        <div style="display: flex; gap: 0.75rem;">
          <button class="btn btn-primary" style="flex: 1;" onclick="window.stateManager.addToCart('${product.id}'); closeModal('quick-view-modal');">
            <i class="fas fa-shopping-bag"></i> Add to Cart
          </button>
          <a href="product-details.html?id=${product.id}" class="btn btn-outline" style="flex: 1;">
            View Full Specs
          </a>
        </div>
      </div>
    </div>
  `;

  openModal('quick-view-modal');
}

// 8. Global Search Overlay Toggle
function toggleSearchOverlay(show = true) {
  let searchBackdrop = document.getElementById('search-overlay');
  if (!searchBackdrop) return;
  if (show) {
    searchBackdrop.classList.add('active');
    document.getElementById('search-overlay-input')?.focus();
  } else {
    searchBackdrop.classList.remove('active');
  }
}

// Export UI functions
window.formatINR = formatINR;
window.formatDate = formatDate;
window.renderStars = renderStars;
window.showToast = showToast;
window.openModal = openModal;
window.closeModal = closeModal;
window.openQuickView = openQuickView;
window.toggleSearchOverlay = toggleSearchOverlay;
