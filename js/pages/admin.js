/* ==========================================================================
   ROYAL GOLD & DIAMONDS - Admin Dashboard Controller
   Role-Based Protection, Analytics KPIs, Product CRUD, Order Status Management
   ========================================================================== */

let allProducts = [];
let allOrders = [];
let editingProductId = null;
let currentUploadedImageUrl = '';

document.addEventListener('DOMContentLoaded', async () => {
  checkAdminAccess();
  setupProductForm();
  setupImageUploadHandler();
  await refreshDashboard();
});

// 1. Check Admin Access
function checkAdminAccess() {
  const user = window.authService.getCurrentUser();
  const authGate = document.getElementById('admin-auth-gate');
  const mainDashboard = document.getElementById('admin-main-view');

  if (user && user.role === 'admin') {
    if (authGate) authGate.style.display = 'none';
    if (mainDashboard) mainDashboard.style.display = 'block';
  } else {
    if (authGate) authGate.style.display = 'block';
    if (mainDashboard) mainDashboard.style.display = 'none';
  }
}

function unlockAdminAccess() {
  window.authService.switchDemoUser('admin');
  checkAdminAccess();
  refreshDashboard();
}

// 2. Refresh Dashboard Data & Metrics
async function refreshDashboard() {
  allProducts = await window.dbService.getProducts();
  allOrders = await window.dbService.getOrders();

  renderKPICards();
  renderProductsTable();
  renderOrdersTable();
}

// 3. Render KPI Analytics Cards
function renderKPICards() {
  let totalRevenue = 0;
  allOrders.forEach(o => {
    if (o.orderStatus !== 'Cancelled') {
      totalRevenue += (o.grandTotal || 0);
    }
  });

  const revenueEl = document.getElementById('kpi-total-revenue');
  const ordersEl = document.getElementById('kpi-total-orders');
  const productsEl = document.getElementById('kpi-total-products');
  const dbModeEl = document.getElementById('kpi-db-mode');

  if (revenueEl) revenueEl.textContent = window.formatINR(totalRevenue);
  if (ordersEl) ordersEl.textContent = allOrders.length;
  if (productsEl) productsEl.textContent = allProducts.length;
  if (dbModeEl) {
    dbModeEl.textContent = window.FIREBASE_MODE === 'LIVE' ? 'Cloud Firestore (Live)' : 'Smart Local DB (Offline Ready)';
    dbModeEl.className = window.FIREBASE_MODE === 'LIVE' ? 'badge-certified' : 'badge-gold';
  }
}

// 4. Products Table
function renderProductsTable(filterText = '') {
  const container = document.getElementById('admin-products-table-body');
  if (!container) return;

  let filtered = allProducts;
  if (filterText.trim()) {
    const q = filterText.toLowerCase();
    filtered = allProducts.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }

  container.innerHTML = filtered.map(prod => `
    <tr>
      <td style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 0.5rem;">
        <img src="${prod.images ? prod.images[0] : 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=200'}" alt="${prod.name}" style="width: 44px; height: 44px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--gold-border);">
        <div>
          <div style="font-weight: 600; color: #fff; font-size: 0.9rem;">${prod.name}</div>
          <div style="font-size: 0.75rem; color: var(--gold-light);">${prod.purity} • ${prod.metal}</div>
        </div>
      </td>
      <td style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase;">${prod.category}</td>
      <td style="font-family: var(--font-royal); font-weight: 700; color: var(--gold-bright); font-size: 0.9rem;">${window.formatINR(prod.price)}</td>
      <td style="font-size: 0.85rem;">
        <span class="${prod.stock > 0 ? 'badge-certified' : 'badge-danger'}">
          ${prod.stock} in stock
        </span>
      </td>
      <td>
        <div class="d-flex gap-1">
          <button class="btn btn-secondary btn-sm" onclick="openEditProductModal('${prod.id}')" title="Edit Creation">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-secondary btn-sm" style="color: #E74C3C;" onclick="confirmDeleteProduct('${prod.id}', '${prod.name.replace(/'/g, "\\'")}')" title="Delete Creation">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// 5. Orders Table & Status Management
function renderOrdersTable() {
  const container = document.getElementById('admin-orders-table-body');
  if (!container) return;

  container.innerHTML = allOrders.map(order => `
    <tr>
      <td style="font-family: var(--font-royal); font-weight: 700; color: var(--gold-bright); font-size: 0.88rem;">
        ${order.orderId}
      </td>
      <td>
        <div style="font-weight: 600; color: #fff; font-size: 0.88rem;">${order.customerName}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted);">${order.customerEmail}</div>
      </td>
      <td style="font-size: 0.82rem; color: var(--text-muted);">
        ${window.formatDate(order.createdAt)}
      </td>
      <td style="font-family: var(--font-royal); font-weight: 700; color: #fff;">
        ${window.formatINR(order.grandTotal)}
      </td>
      <td>
        <select class="form-control" style="width: auto; padding: 0.35rem 1.8rem 0.35rem 0.65rem; font-size: 0.8rem; font-weight: 600;" onchange="handleOrderStatusChange('${order.orderId}', this.value)">
          <option value="Placed" ${order.orderStatus === 'Placed' ? 'selected' : ''}>Placed</option>
          <option value="Confirmed" ${order.orderStatus === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
          <option value="Shipped" ${order.orderStatus === 'Shipped' ? 'selected' : ''}>Shipped</option>
          <option value="Delivered" ${order.orderStatus === 'Delivered' ? 'selected' : ''}>Delivered</option>
          <option value="Cancelled" ${order.orderStatus === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="window.openInvoiceModal('${order.orderId}')">
          <i class="fas fa-print"></i> Invoice
        </button>
      </td>
    </tr>
  `).join('');
}

async function handleOrderStatusChange(orderId, newStatus) {
  await window.dbService.updateOrderStatus(orderId, newStatus);
  window.showToast("Status Updated", `Order #${orderId} marked as ${newStatus}.`, "success");
  await refreshDashboard();
}

// 6. Product Creation & Editing Modals
function openAddProductModal() {
  editingProductId = null;
  currentUploadedImageUrl = '';
  document.getElementById('product-modal-title').textContent = 'Add New Royal Jewellery';
  document.getElementById('product-crud-form').reset();
  document.getElementById('image-upload-preview').style.display = 'none';
  window.openModal('product-crud-modal');
}

function openEditProductModal(productId) {
  editingProductId = productId;
  const p = allProducts.find(item => item.id === productId);
  if (!p) return;

  document.getElementById('product-modal-title').textContent = `Edit: ${p.name}`;
  document.getElementById('crud-name').value = p.name;
  document.getElementById('crud-category').value = p.category;
  document.getElementById('crud-metal').value = p.metal;
  document.getElementById('crud-purity').value = p.purity;
  document.getElementById('crud-gross-weight').value = p.grossWeight || '';
  document.getElementById('crud-net-weight').value = p.netGoldWeight || '';
  document.getElementById('crud-price').value = p.price;
  document.getElementById('crud-mrp').value = p.mrp || p.price;
  document.getElementById('crud-stock').value = p.stock;
  document.getElementById('crud-description').value = p.description || '';
  document.getElementById('crud-hallmark').value = p.hallmark || 'BIS 916 Hallmarked';

  currentUploadedImageUrl = (p.images && p.images.length > 0) ? p.images[0] : '';
  const preview = document.getElementById('image-upload-preview');
  if (currentUploadedImageUrl) {
    preview.src = currentUploadedImageUrl;
    preview.style.display = 'block';
  } else {
    preview.style.display = 'none';
  }

  window.openModal('product-crud-modal');
}

// 7. Setup Image Upload (Firebase Cloud Storage with Base64 fallback)
function setupImageUploadHandler() {
  const fileInput = document.getElementById('crud-image-file');
  const preview = document.getElementById('image-upload-preview');
  const statusEl = document.getElementById('image-upload-status');

  if (!fileInput) return;

  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    statusEl.innerHTML = '<span style="color: var(--gold-light);"><i class="fas fa-spinner fa-spin"></i> Uploading to Firebase Storage...</span>';

    try {
      const downloadURL = await window.storageService.uploadProductImage(file, (progress) => {
        statusEl.innerHTML = `<span style="color: var(--gold-light);">Uploading: ${Math.round(progress)}%</span>`;
      });

      currentUploadedImageUrl = downloadURL;
      preview.src = downloadURL;
      preview.style.display = 'block';
      statusEl.innerHTML = '<span style="color: #2ECC71;"><i class="fas fa-check-circle"></i> Asset Stored Successfully!</span>';
    } catch (err) {
      statusEl.innerHTML = `<span style="color: #E74C3C;">${err.message}</span>`;
    }
  });
}

// 8. Save / Update Product
function setupProductForm() {
  const form = document.getElementById('product-crud-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('crud-name').value.trim();
    const category = document.getElementById('crud-category').value;
    const metal = document.getElementById('crud-metal').value.trim();
    const purity = document.getElementById('crud-purity').value.trim();
    const grossWeight = parseFloat(document.getElementById('crud-gross-weight').value) || 0;
    const netGoldWeight = parseFloat(document.getElementById('crud-net-weight').value) || 0;
    const price = parseInt(document.getElementById('crud-price').value) || 0;
    const mrp = parseInt(document.getElementById('crud-mrp').value) || price;
    const stock = parseInt(document.getElementById('crud-stock').value) || 1;
    const description = document.getElementById('crud-description').value.trim();
    const hallmark = document.getElementById('crud-hallmark').value.trim();

    const image = currentUploadedImageUrl || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800';

    const productPayload = {
      name,
      category,
      categoryName: category.charAt(0).toUpperCase() + category.slice(1),
      metal,
      purity,
      hallmark,
      grossWeight,
      netGoldWeight,
      price,
      mrp,
      stock,
      description,
      images: [image],
      inStock: stock > 0
    };

    if (editingProductId) {
      await window.dbService.updateProduct(editingProductId, productPayload);
      window.showToast("Product Updated", `${name} updated in the royal catalogue.`, "success");
    } else {
      await window.dbService.createProduct(productPayload);
      window.showToast("Product Added", `${name} listed into the royal catalogue.`, "success");
    }

    window.closeModal('product-crud-modal');
    await refreshDashboard();
  });
}

// 9. Confirm Delete Product
async function confirmDeleteProduct(productId, productName) {
  if (confirm(`Are you certain you wish to delete "${productName}" from the catalogue?`)) {
    await window.dbService.deleteProduct(productId);
    window.showToast("Product Removed", `"${productName}" was removed.`, "info");
    await refreshDashboard();
  }
}

// 10. 1-Click Seed Sample Data to Cloud Firestore
async function seedSampleDataToFirestore() {
  const btn = document.getElementById('btn-seed-firestore');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Seeding Firestore...';

  const result = await window.dbService.seedFirestore();
  if (result.success) {
    window.showToast("Cloud Seeding Complete", `Successfully populated ${result.count} jewellery pieces to Firestore!`, "success");
  } else {
    window.showToast("Seeding Notice", result.message, "info");
  }

  btn.disabled = false;
  btn.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Seed Sample Products to Firestore';
  await refreshDashboard();
}

window.unlockAdminAccess = unlockAdminAccess;
window.openAddProductModal = openAddProductModal;
window.openEditProductModal = openEditProductModal;
window.confirmDeleteProduct = confirmDeleteProduct;
window.handleOrderStatusChange = handleOrderStatusChange;
window.seedSampleDataToFirestore = seedSampleDataToFirestore;
