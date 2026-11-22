/* ==========================================================================
   ROYAL GOLD & DIAMONDS - Checkout & Test Payment Simulator Controller
   Clearly Labelled Demo Mode Payment Processing with Mock OTP Verification
   ========================================================================== */

let selectedPaymentMethod = 'razorpay_test';

document.addEventListener('DOMContentLoaded', () => {
  verifyCartNotEmpty();
  prefillCustomerDetails();
  renderCheckoutOrderSummary();
  setupPaymentMethodSelection();
  setupCheckoutForm();
});

function verifyCartNotEmpty() {
  const cart = window.stateManager.getCart();
  if (cart.length === 0) {
    window.showToast("Bag is Empty", "Please add items to your royal bag before proceeding to checkout.", "warning");
    setTimeout(() => {
      window.location.href = 'shop.html';
    }, 1500);
  }
}

function prefillCustomerDetails() {
  const user = window.authService.getCurrentUser();
  if (user) {
    if (document.getElementById('shipping-name')) document.getElementById('shipping-name').value = user.fullName || '';
    if (document.getElementById('shipping-email')) document.getElementById('shipping-email').value = user.email || '';
    if (document.getElementById('shipping-phone') && user.phone) document.getElementById('shipping-phone').value = user.phone;
  }
}

function renderCheckoutOrderSummary() {
  const itemsContainer = document.getElementById('checkout-items-list');
  const totals = window.stateManager.getCartTotals();
  const cart = window.stateManager.getCart();

  if (!itemsContainer) return;

  itemsContainer.innerHTML = cart.map(item => `
    <div style="display: flex; gap: 0.75rem; align-items: center; margin-bottom: 0.75rem; padding-bottom: 0.75rem; border-bottom: 1px dashed rgba(255,255,255,0.08);">
      <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--gold-border);">
      <div style="flex: 1; font-size: 0.85rem;">
        <div style="color: #fff; font-weight: 600; line-height: 1.3;">${item.name}</div>
        <div style="color: var(--text-muted); font-size: 0.75rem;">Qty: ${item.quantity} • Size: ${item.size}</div>
      </div>
      <div style="font-family: var(--font-royal); font-weight: 700; color: var(--gold-bright); font-size: 0.9rem;">
        ${window.formatINR(item.price * item.quantity)}
      </div>
    </div>
  `).join('');

  document.getElementById('checkout-subtotal').textContent = window.formatINR(totals.subtotal);
  
  if (totals.discount > 0) {
    document.getElementById('checkout-discount-row').style.display = 'flex';
    document.getElementById('checkout-discount').textContent = `- ${window.formatINR(totals.discount)}`;
  } else {
    document.getElementById('checkout-discount-row').style.display = 'none';
  }

  document.getElementById('checkout-gst').textContent = window.formatINR(totals.gstAmount);
  document.getElementById('checkout-grand-total').textContent = window.formatINR(totals.grandTotal);
}

function setupPaymentMethodSelection() {
  const methodRadios = document.querySelectorAll('input[name="payment-method-radio"]');
  const cardDetailsWrap = document.getElementById('test-card-details-box');
  const upiDetailsWrap = document.getElementById('test-upi-details-box');

  methodRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      selectedPaymentMethod = e.target.value;
      if (cardDetailsWrap) cardDetailsWrap.style.display = (selectedPaymentMethod === 'card_test') ? 'block' : 'none';
      if (upiDetailsWrap) upiDetailsWrap.style.display = (selectedPaymentMethod === 'upi_test') ? 'block' : 'none';
    });
  });
}

function setupCheckoutForm() {
  const form = document.getElementById('checkout-shipping-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Validate Fields
    const fullName = document.getElementById('shipping-name').value.trim();
    const email = document.getElementById('shipping-email').value.trim();
    const phone = document.getElementById('shipping-phone').value.trim();
    const street = document.getElementById('shipping-address').value.trim();
    const city = document.getElementById('shipping-city').value.trim();
    const state = document.getElementById('shipping-state').value.trim();
    const pincode = document.getElementById('shipping-pincode').value.trim();

    if (!fullName || !email || !phone || !street || !city || !state || !pincode) {
      window.showToast("Validation Error", "Please fill in all mandatory shipping fields.", "danger");
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      window.showToast("Invalid PIN Code", "Please enter a valid 6-digit Indian PIN code.", "danger");
      return;
    }

    // 2. Open Test Payment Simulation / Mock OTP Modal
    openPaymentSimulationModal({
      fullName, email, phone, street, city, state, pincode
    });
  });
}

function openPaymentSimulationModal(shippingDetails) {
  const modal = document.getElementById('test-payment-modal');
  const totals = window.stateManager.getCartTotals();
  
  document.getElementById('modal-payable-amount').textContent = window.formatINR(totals.grandTotal);
  window.currentCheckoutShipping = shippingDetails;

  window.openModal('test-payment-modal');
}

// Execute Demo Payment
async function processDemoPayment() {
  const submitBtn = document.getElementById('btn-confirm-demo-payment');
  const statusEl = document.getElementById('payment-processing-status');

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authorizing Test Transaction...';
  statusEl.style.display = 'block';
  statusEl.innerHTML = `<span style="color: var(--gold-light);"><i class="fas fa-shield-alt"></i> Communicating with Sandbox Gateway... (Simulated Test Mode)</span>`;

  // Realistic mock delay
  setTimeout(async () => {
    try {
      const user = window.authService.getCurrentUser() || { uid: `guest_${Date.now()}` };
      const totals = window.stateManager.getCartTotals();
      const cart = window.stateManager.getCart();

      const orderData = {
        userId: user.uid,
        customerName: window.currentCheckoutShipping.fullName,
        customerEmail: window.currentCheckoutShipping.email,
        customerPhone: window.currentCheckoutShipping.phone,
        shippingAddress: {
          fullName: window.currentCheckoutShipping.fullName,
          street: window.currentCheckoutShipping.street,
          city: window.currentCheckoutShipping.city,
          state: window.currentCheckoutShipping.state,
          pincode: window.currentCheckoutShipping.pincode,
          country: "India"
        },
        items: cart,
        subtotal: totals.subtotal,
        discount: totals.discount,
        gstAmount: totals.gstAmount,
        shippingFee: totals.shippingFee,
        grandTotal: totals.grandTotal,
        paymentMethod: `Demo Test Mode (${selectedPaymentMethod.replace('_', ' ').toUpperCase()})`,
        paymentStatus: "Paid (Test Sandbox Simulation)",
        orderStatus: "Placed",
        trackingNumber: `RGD-ARM-${Math.floor(100000 + Math.random() * 900000)}`
      };

      const placedOrder = await window.dbService.createOrder(orderData);

      // Clear cart
      window.stateManager.clearCart();

      // Close payment modal
      window.closeModal('test-payment-modal');

      // Show Order Success Modal
      showOrderSuccessModal(placedOrder);

    } catch (err) {
      statusEl.innerHTML = `<span style="color: #E74C3C;">Payment error: ${err.message}</span>`;
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Retry Test Payment';
    }
  }, 2000);
}

function showOrderSuccessModal(order) {
  const successModal = document.getElementById('order-success-modal');
  document.getElementById('success-order-id').textContent = order.orderId;
  document.getElementById('success-order-amount').textContent = window.formatINR(order.grandTotal);
  document.getElementById('success-customer-email').textContent = order.customerEmail;
  document.getElementById('success-tracking-id').textContent = order.trackingNumber;

  window.openModal('order-success-modal');
}

window.processDemoPayment = processDemoPayment;
