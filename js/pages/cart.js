/* ==========================================================================
   ROYAL GOLD & DIAMONDS - Cart Controller
   Quantity Manipulation, 3% Indian Jewellery GST, Coupon Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  setupCouponForm();
});

function renderCart() {
  const container = document.getElementById('cart-items-container');
  const emptyState = document.getElementById('cart-empty-state');
  const cartLayout = document.getElementById('cart-content-layout');
  const itemsCountBadge = document.getElementById('cart-total-items-badge');

  if (!container) return;

  const cart = window.stateManager.getCart();
  const totals = window.stateManager.getCartTotals();

  if (cart.length === 0) {
    if (cartLayout) cartLayout.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (cartLayout) cartLayout.style.display = 'grid';
  if (emptyState) emptyState.style.display = 'none';

  if (itemsCountBadge) {
    itemsCountBadge.textContent = `${totals.totalItems} item${totals.totalItems > 1 ? 's' : ''}`;
  }

  // Render items table
  container.innerHTML = cart.map(item => `
    <tr>
      <td style="display: flex; align-items: center; gap: 1rem; padding: 1rem 0;">
        <img src="${item.image}" alt="${item.name}" style="width: 75px; height: 75px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--gold-border);">
        <div>
          <h4 style="font-size: 0.95rem; margin-bottom: 0.25rem;">
            <a href="product-details.html?id=${item.productId}" style="color: #fff;">${item.name}</a>
          </h4>
          <div style="font-size: 0.78rem; color: var(--gold-light);">
            ${item.purity} • ${item.metal}
          </div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">
            Size: <strong>${item.size}</strong> ${item.grossWeight ? `• ${item.grossWeight}g` : ''}
          </div>
        </div>
      </td>
      <td style="font-family: var(--font-royal); font-weight: 600; color: var(--ivory-primary);">
        ${window.formatINR(item.price)}
      </td>
      <td>
        <div class="qty-selector" style="display: inline-flex;">
          <button class="qty-btn" onclick="updateItemQuantity('${item.productId}', ${item.quantity - 1}, '${item.size}')"><i class="fas fa-minus"></i></button>
          <span style="padding: 0 0.8rem; font-weight: 700; color: #fff;">${item.quantity}</span>
          <button class="qty-btn" onclick="updateItemQuantity('${item.productId}', ${item.quantity + 1}, '${item.size}')"><i class="fas fa-plus"></i></button>
        </div>
      </td>
      <td style="font-family: var(--font-royal); font-weight: 700; color: var(--gold-bright);">
        ${window.formatINR(item.price * item.quantity)}
      </td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="removeItem('${item.productId}', '${item.size}')" title="Remove Item" style="color: #E74C3C; border-color: rgba(231, 76, 60, 0.3);">
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    </tr>
  `).join('');

  // Update Summary Card
  document.getElementById('summary-subtotal').textContent = window.formatINR(totals.subtotal);
  
  const discountRow = document.getElementById('summary-discount-row');
  if (totals.discount > 0) {
    discountRow.style.display = 'flex';
    document.getElementById('summary-discount').textContent = `- ${window.formatINR(totals.discount)}`;
    document.getElementById('summary-discount-desc').textContent = totals.activeCoupon ? `(${totals.activeCoupon.code})` : '';
  } else {
    discountRow.style.display = 'none';
  }

  document.getElementById('summary-gst').textContent = window.formatINR(totals.gstAmount);
  document.getElementById('summary-grand-total').textContent = window.formatINR(totals.grandTotal);
}

function updateItemQuantity(productId, newQty, size) {
  window.stateManager.updateQuantity(productId, newQty, size);
  renderCart();
}

function removeItem(productId, size) {
  window.stateManager.removeFromCart(productId, size);
  renderCart();
}

function setupCouponForm() {
  const form = document.getElementById('coupon-form');
  const input = document.getElementById('coupon-input');
  const feedback = document.getElementById('coupon-feedback');

  if (!form || !input) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = input.value.trim();
    const res = window.stateManager.applyCoupon(code);

    if (res.success) {
      feedback.innerHTML = `<span style="color: #2ECC71;"><i class="fas fa-check-circle"></i> ${res.coupon.description} Applied!</span>`;
      window.showToast("Privilege Applied", res.coupon.description, "success");
      renderCart();
    } else {
      feedback.innerHTML = `<span style="color: #E74C3C;"><i class="fas fa-times-circle"></i> ${res.message}</span>`;
      window.showToast("Coupon Error", res.message, "danger");
    }
  });
}

window.updateItemQuantity = updateItemQuantity;
window.removeItem = removeItem;
window.renderCart = renderCart;
