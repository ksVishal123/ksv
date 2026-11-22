/* ==========================================================================
   ROYAL GOLD & DIAMONDS - Order History & GST Tax Invoice Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', async () => {
  renderProfileInfo();
  await loadOrdersList();
});

function renderProfileInfo() {
  const user = window.authService.getCurrentUser() || {
    fullName: "Royal Patron (Guest)",
    email: "customer@royalgold.com",
    role: "customer"
  };

  const nameEl = document.getElementById('profile-user-name');
  const emailEl = document.getElementById('profile-user-email');
  const roleEl = document.getElementById('profile-user-role');

  if (nameEl) nameEl.textContent = user.fullName;
  if (emailEl) emailEl.textContent = user.email;
  if (roleEl) roleEl.textContent = `${user.role.toUpperCase()} ACCOUNT`;
}

async function loadOrdersList() {
  const container = document.getElementById('orders-list-container');
  const emptyState = document.getElementById('orders-empty-state');
  const countBadge = document.getElementById('orders-count-badge');

  if (!container) return;

  const user = window.authService.getCurrentUser();
  const userId = user ? user.uid : null;
  const orders = await window.dbService.getOrders(userId);

  if (!orders || orders.length === 0) {
    if (container) container.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (container) container.style.display = 'flex';
  if (emptyState) emptyState.style.display = 'none';

  if (countBadge) {
    countBadge.textContent = `${orders.length} Order${orders.length > 1 ? 's' : ''}`;
  }

  container.innerHTML = orders.map(order => {
    let statusClass = 'badge-gold';
    if (order.orderStatus === 'Delivered') statusClass = 'badge-certified';
    else if (order.orderStatus === 'Shipped') statusClass = 'badge-info';
    else if (order.orderStatus === 'Cancelled') statusClass = 'badge-danger';

    return `
      <div class="luxury-card" style="padding: 1.75rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 1rem; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
          <div>
            <div style="font-family: var(--font-royal); font-size: 1.1rem; font-weight: 700; color: var(--gold-bright);">
              Order #${order.orderId}
            </div>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">
              Placed on ${window.formatDate(order.createdAt)} • Consignment: <strong style="color: var(--gold-light);">${order.trackingNumber || 'RGD-EXP-2026'}</strong>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span class="${statusClass}" style="font-size: 0.8rem; text-transform: uppercase;">
              <i class="fas fa-box"></i> ${order.orderStatus}
            </span>
            <button class="btn btn-outline btn-sm" onclick="openInvoiceModal('${order.orderId}')">
              <i class="fas fa-file-invoice"></i> View Tax Invoice
            </button>
          </div>
        </div>

        <!-- Items in this order -->
        <div style="display: flex; flex-direction: column; gap: 0.85rem; margin-bottom: 1.25rem;">
          ${(order.items || []).map(item => `
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
              <div style="display: flex; align-items: center; gap: 0.85rem;">
                <img src="${item.image}" alt="${item.name}" style="width: 55px; height: 55px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--gold-border);">
                <div>
                  <div style="font-size: 0.92rem; font-weight: 600; color: #fff;">${item.name}</div>
                  <div style="font-size: 0.78rem; color: var(--text-muted);">
                    Qty: ${item.quantity} • Size: ${item.size || 'Standard'} • ${item.purity || ''}
                  </div>
                </div>
              </div>
              <div style="font-family: var(--font-royal); font-weight: 700; color: var(--gold-bright); font-size: 0.95rem;">
                ${window.formatINR(item.price * item.quantity)}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Footer -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed rgba(212, 175, 55, 0.2); padding-top: 1rem; font-size: 0.88rem;">
          <div style="color: var(--text-muted);">
            Payment: <strong style="color: #fff;">${order.paymentMethod}</strong>
          </div>
          <div>
            Total Paid: <span style="font-family: var(--font-royal); font-size: 1.2rem; font-weight: 700; color: var(--gold-bright);">${window.formatINR(order.grandTotal)}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Generate & Display GST Tax Invoice
async function openInvoiceModal(orderId) {
  const orders = await window.dbService.getOrders();
  const order = orders.find(o => o.orderId === orderId);

  if (!order) {
    window.showToast("Error", "Order details could not be found.", "danger");
    return;
  }

  const invoiceContainer = document.getElementById('invoice-render-box');
  if (!invoiceContainer) return;

  const cgst = Math.round((order.gstAmount || 0) / 2);
  const sgst = Math.round((order.gstAmount || 0) / 2);

  invoiceContainer.innerHTML = `
    <div style="background: #fff; color: #111; padding: 2.5rem; border-radius: var(--radius-sm); font-family: 'Plus Jakarta Sans', sans-serif;">
      
      <!-- Invoice Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #D4AF37; padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
        <div>
          <h2 style="font-family: 'Cinzel', serif; font-size: 1.6rem; color: #0A0A0A; margin-bottom: 4px; font-weight: 800;">ROYAL GOLD &amp; DIAMONDS</h2>
          <div style="font-size: 0.78rem; color: #555;">House of BIS 916 Certified Fine Jewellery</div>
          <div style="font-size: 0.78rem; color: #555;">Flagship Atelier, Bandra West, Mumbai, MH - 400050</div>
          <div style="font-size: 0.78rem; color: #555;">GSTIN: <strong>27AABCR9812K1Z9</strong> • HSN Code: <strong>7113</strong></div>
          <div style="font-size: 0.78rem; color: #555;">BIS Hallmark Certification Reg: <strong>HM-IND-916-ROYAL</strong></div>
        </div>
        <div style="text-align: right;">
          <div style="font-family: 'Cinzel', serif; font-size: 1.25rem; font-weight: 700; color: #B38F4D;">TAX INVOICE</div>
          <div style="font-size: 0.82rem; margin-top: 4px;"><strong>Invoice No:</strong> INV-${order.orderId}</div>
          <div style="font-size: 0.82rem;"><strong>Date:</strong> ${window.formatDate(order.createdAt)}</div>
          <div style="font-size: 0.82rem;"><strong>Armoured Tracking:</strong> ${order.trackingNumber || 'N/A'}</div>
        </div>
      </div>

      <!-- Bill to -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 1.5rem; font-size: 0.85rem;">
        <div>
          <strong style="color: #0A0A0A; text-transform: uppercase; font-size: 0.78rem; letter-spacing: 0.05em;">Billed &amp; Shipped To:</strong>
          <div style="font-weight: 700; margin-top: 4px; color: #111;">${order.customerName}</div>
          <div style="color: #444;">${order.shippingAddress ? `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}` : 'Registered Address'}</div>
          <div style="color: #444;">Phone: ${order.customerPhone || 'N/A'}</div>
          <div style="color: #444;">Email: ${order.customerEmail}</div>
        </div>
        <div style="text-align: right;">
          <strong style="color: #0A0A0A; text-transform: uppercase; font-size: 0.78rem; letter-spacing: 0.05em;">Payment Details:</strong>
          <div style="margin-top: 4px; color: #111;">Method: <strong>${order.paymentMethod}</strong></div>
          <div style="color: #2ECC71; font-weight: 600;">Status: Verified &amp; Settled (Test Mode)</div>
          <div style="color: #555;">Purity Verification: 100% BIS Hallmarked</div>
        </div>
      </div>

      <!-- Items Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; font-size: 0.85rem;">
        <thead>
          <tr style="background: #f5f2eb; border-top: 1px solid #ddd; border-bottom: 2px solid #D4AF37; text-align: left;">
            <th style="padding: 8px 10px;">Sl.</th>
            <th style="padding: 8px 10px;">Description of Jewellery</th>
            <th style="padding: 8px 10px;">Purity / Hallmark</th>
            <th style="padding: 8px 10px; text-align: center;">Qty</th>
            <th style="padding: 8px 10px; text-align: right;">Rate (INR)</th>
            <th style="padding: 8px 10px; text-align: right;">Amount (INR)</th>
          </tr>
        </thead>
        <tbody>
          ${(order.items || []).map((it, idx) => `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px;">${idx + 1}</td>
              <td style="padding: 10px;"><strong>${it.name}</strong><br><span style="font-size: 0.75rem; color: #666;">Size: ${it.size || 'Standard'}</span></td>
              <td style="padding: 10px;">${it.purity || '22K'} (BIS Assayed)</td>
              <td style="padding: 10px; text-align: center;">${it.quantity}</td>
              <td style="padding: 10px; text-align: right;">${window.formatINR(it.price)}</td>
              <td style="padding: 10px; text-align: right; font-weight: 700;">${window.formatINR(it.price * it.quantity)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- Totals & Taxes Breakdown -->
      <div style="display: flex; justify-content: flex-end; margin-bottom: 2rem;">
        <div style="width: 320px; font-size: 0.85rem;">
          <div style="display: flex; justify-content: space-between; padding: 4px 0;">
            <span style="color: #555;">Precious Metal Subtotal:</span>
            <span>${window.formatINR(order.subtotal)}</span>
          </div>
          ${order.discount ? `
            <div style="display: flex; justify-content: space-between; padding: 4px 0; color: #27ae60;">
              <span>Royal Privilege Discount:</span>
              <span>- ${window.formatINR(order.discount)}</span>
            </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; padding: 4px 0; color: #555;">
            <span>CGST (1.5%):</span>
            <span>${window.formatINR(cgst)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 4px 0; color: #555;">
            <span>SGST (1.5%):</span>
            <span>${window.formatINR(sgst)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 4px 0; color: #555;">
            <span>Insured White-Glove Transit:</span>
            <span style="color: #27ae60; font-weight: 600;">FREE</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 10px 0 0; border-top: 2px solid #D4AF37; font-size: 1.15rem; font-weight: 800; color: #0A0A0A;">
            <span>Total Invoice Amount:</span>
            <span>${window.formatINR(order.grandTotal)}</span>
          </div>
        </div>
      </div>

      <!-- Legal Declaration -->
      <div style="border-top: 1px solid #ddd; padding-top: 1rem; font-size: 0.72rem; color: #777; line-height: 1.5;">
        <p><strong>Declaration:</strong> Certified that all gold jewellery mentioned in this tax invoice is hallmarked under BIS regulations with laser purity assaying. Certified natural diamonds adhere to Kimberley Process standards. This is a computer-generated tax invoice and requires no physical signature.</p>
      </div>

    </div>
  `;

  window.openModal('invoice-modal');
}

function printCurrentInvoice() {
  const content = document.getElementById('invoice-render-box').innerHTML;
  const printWindow = window.open('', '', 'height=750,width=900');
  printWindow.document.write('<html><head><title>Royal Gold GST Tax Invoice</title>');
  printWindow.document.write('<style>body { font-family: sans-serif; margin: 20px; }</style>');
  printWindow.document.write('</head><body>');
  printWindow.document.write(content);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 300);
}

window.openInvoiceModal = openInvoiceModal;
window.printCurrentInvoice = printCurrentInvoice;
