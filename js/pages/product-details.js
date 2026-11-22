/* ==========================================================================
   ROYAL GOLD & DIAMONDS - Product Details & Customizer Controller
   ========================================================================== */

let currentProduct = null;
let selectedSize = '';
let selectedMetal = '';
let selectedQty = 1;

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || 'rgd-101';

  await loadProductDetails(productId);
});

async function loadProductDetails(productId) {
  currentProduct = await window.dbService.getProductById(productId);

  if (!currentProduct) {
    document.getElementById('product-details-container').innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle empty-state-icon"></i>
        <h2 class="empty-state-title">Jewellery Piece Not Found</h2>
        <p class="empty-state-text">The requested item may have been archived or is temporarily unavailable.</p>
        <a href="shop.html" class="btn btn-primary"><i class="fas fa-arrow-left"></i> Return to Catalogue</a>
      </div>
    `;
    return;
  }

  // Set page title
  document.title = `${currentProduct.name} — ROYAL GOLD & DIAMONDS`;

  // Default selections
  selectedSize = currentProduct.sizes ? currentProduct.sizes[0] : 'Standard';
  selectedMetal = currentProduct.metal;
  selectedQty = 1;

  // Render Breadcrumb
  document.getElementById('breadcrumb-product-name').textContent = currentProduct.name;
  document.getElementById('breadcrumb-category-link').textContent = currentProduct.categoryName || currentProduct.category;
  document.getElementById('breadcrumb-category-link').href = `shop.html?category=${currentProduct.category}`;

  // Render Gallery
  renderGallery(currentProduct.images);

  // Render Product Meta & Pricing
  renderProductInfo(currentProduct);

  // Render Specs Table
  renderSpecifications(currentProduct);

  // Render Related Products
  renderRelatedProducts(currentProduct);

  // Setup Pincode Checker
  setupPincodeChecker();

  // Setup Review Form
  setupReviewForm();
}

function renderGallery(images = []) {
  const mainImg = document.getElementById('main-gallery-image');
  const thumbsContainer = document.getElementById('gallery-thumbnails');

  if (!images || images.length === 0) return;

  mainImg.src = images[0];
  mainImg.alt = currentProduct.name;

  thumbsContainer.innerHTML = images.map((img, i) => `
    <div class="gallery-thumb-item ${i === 0 ? 'active' : ''}" onclick="switchGalleryImage('${img}', this)">
      <img src="${img}" alt="Jewellery thumbnail ${i+1}">
    </div>
  `).join('');
}

function switchGalleryImage(src, element) {
  const mainImg = document.getElementById('main-gallery-image');
  mainImg.src = src;
  document.querySelectorAll('.gallery-thumb-item').forEach(el => el.classList.remove('active'));
  element.classList.add('active');
}

function renderProductInfo(product) {
  document.getElementById('product-hallmark-badge').innerHTML = `<i class="fas fa-certificate"></i> ${product.hallmark}`;
  document.getElementById('product-purity-tag').textContent = product.purity;
  document.getElementById('product-title-heading').textContent = product.name;
  document.getElementById('product-sku').textContent = `SKU: ${product.id.toUpperCase()}`;

  // Ratings
  document.getElementById('product-stars-container').innerHTML = window.renderStars(product.rating || 5);
  document.getElementById('product-reviews-label').textContent = `(${product.reviewCount || 18} Verified Buyer Reviews)`;

  // Pricing
  document.getElementById('product-final-price').textContent = window.formatINR(product.price);
  if (product.mrp && product.mrp > product.price) {
    const mrpEl = document.getElementById('product-mrp-price');
    mrpEl.textContent = window.formatINR(product.mrp);
    mrpEl.style.display = 'inline';
    const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
    document.getElementById('product-discount-tag').textContent = `${discount}% OFF`;
    document.getElementById('product-discount-tag').style.display = 'inline-block';
  }

  // Price breakdown
  const makingCharge = product.makingCharges || Math.round(product.price * 0.08);
  const estimatedGold = product.price - makingCharge;
  const gstAmount = Math.round(product.price * 0.03);

  document.getElementById('breakdown-gold-val').textContent = window.formatINR(estimatedGold);
  document.getElementById('breakdown-making-val').textContent = window.formatINR(makingCharge);
  document.getElementById('breakdown-gst-val').textContent = window.formatINR(gstAmount);

  // Description
  document.getElementById('product-description-text').textContent = product.description;

  // Stock status
  const stockEl = document.getElementById('product-stock-badge');
  if (product.stock > 0) {
    stockEl.innerHTML = `<i class="fas fa-check-circle" style="color: #2ECC71;"></i> In Stock (${product.stock} items available)`;
  } else {
    stockEl.innerHTML = `<i class="fas fa-clock" style="color: #E74C3C;"></i> Made to Order (10-12 Days)`;
  }

  // Size Options
  const sizeContainer = document.getElementById('size-options-container');
  if (product.sizes && product.sizes.length > 0) {
    document.getElementById('size-selector-group').style.display = 'block';
    sizeContainer.innerHTML = product.sizes.map((s, i) => `
      <button class="size-btn ${i === 0 ? 'active' : ''}" onclick="selectProductSize('${s}', this)">${s}</button>
    `).join('');
  } else {
    document.getElementById('size-selector-group').style.display = 'none';
  }

  // Wishlist Button state
  const isWishlisted = window.stateManager.isInWishlist(product.id);
  const wishBtn = document.getElementById('btn-details-wishlist');
  if (isWishlisted) {
    wishBtn.classList.add('active');
    wishBtn.innerHTML = '<i class="fas fa-heart" style="color: #ff4757;"></i> Wishlisted';
  }
}

function selectProductSize(size, el) {
  selectedSize = size;
  document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
  el.classList.add('active');
}

function changeQty(delta) {
  const input = document.getElementById('product-qty-input');
  let val = parseInt(input.value) + delta;
  if (val < 1) val = 1;
  if (currentProduct && val > currentProduct.stock) val = currentProduct.stock;
  input.value = val;
  selectedQty = val;
}

// Add to Cart
function handleAddToCart() {
  if (!currentProduct) return;
  window.stateManager.addToCart(currentProduct.id, selectedQty, {
    size: selectedSize,
    metal: selectedMetal
  });
}

// Buy Now (Adds to cart & redirects to checkout)
function handleBuyNow() {
  if (!currentProduct) return;
  window.stateManager.addToCart(currentProduct.id, selectedQty, {
    size: selectedSize,
    metal: selectedMetal
  });
  window.location.href = 'checkout.html';
}

// Toggle Wishlist on Details page
function handleToggleWishlist() {
  if (!currentProduct) return;
  const wishBtn = document.getElementById('btn-details-wishlist');
  const nowActive = window.stateManager.toggleWishlist(currentProduct.id);
  
  if (nowActive) {
    wishBtn.classList.add('active');
    wishBtn.innerHTML = '<i class="fas fa-heart" style="color: #ff4757;"></i> Wishlisted';
  } else {
    wishBtn.classList.remove('active');
    wishBtn.innerHTML = '<i class="far fa-heart"></i> Add to Wishlist';
  }
}

// Render Specifications Table
function renderSpecifications(product) {
  const container = document.getElementById('specs-table-container');
  if (!container) return;

  const defaultSpecs = {
    "Purity": product.purity || "22 Karat (91.6% Pure Gold)",
    "BIS Hallmark": product.hallmark,
    "Gross Weight": `${product.grossWeight} grams`,
    "Net Gold Weight": `${product.netGoldWeight} grams`,
    "Diamond Details": product.diamondCarat > 0 ? `${product.diamondCarat} cts • ${product.diamondClarity}` : "Natural Stones",
    "Metal Color": product.metal,
    "Certification": "Govt Approved BIS Hallmark & SGL/IGI",
    "Gender / Category": product.categoryName || product.category,
    "Packaging": "Tamper-Evident Insured Royal Velvet Casket"
  };

  const specs = product.specifications || defaultSpecs;

  container.innerHTML = `
    <table class="specs-table">
      <tbody>
        ${Object.entries(specs).map(([key, val]) => `
          <tr>
            <td class="specs-key">${key}</td>
            <td class="specs-val">${val}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// Render Related Products
async function renderRelatedProducts(product) {
  const container = document.getElementById('related-products-grid');
  if (!container) return;

  const all = await window.dbService.getProducts({ category: product.category });
  const related = all.filter(p => p.id !== product.id).slice(0, 4);

  if (related.length === 0) {
    const popular = await window.dbService.getProducts({ sort: 'popular' });
    const fallback = popular.filter(p => p.id !== product.id).slice(0, 4);
    renderCards(container, fallback);
  } else {
    renderCards(container, related);
  }
}

function renderCards(container, products) {
  container.innerHTML = products.map(prod => `
    <div class="product-card">
      <div class="product-image-box">
        <img src="${prod.images[0]}" alt="${prod.name}" class="product-image">
        <div class="product-badges">
          <span class="badge-hallmark">${prod.hallmark.split('&')[0]}</span>
        </div>
      </div>
      <div class="product-info">
        <h4 class="product-title"><a href="product-details.html?id=${prod.id}">${prod.name}</a></h4>
        <div class="product-price-box">
          <span class="product-price">${window.formatINR(prod.price)}</span>
          <span style="font-size: 0.75rem; color: var(--gold-light);">${prod.purity}</span>
        </div>
        <div style="margin-top: 0.75rem;">
          <a href="product-details.html?id=${prod.id}" class="btn btn-outline btn-sm btn-block">View Creation</a>
        </div>
      </div>
    </div>
  `).join('');
}

// Pincode Delivery Estimator
function setupPincodeChecker() {
  const btn = document.getElementById('btn-check-pincode');
  const input = document.getElementById('pincode-input');
  const result = document.getElementById('pincode-result');

  if (!btn || !input) return;

  btn.addEventListener('click', () => {
    const pin = input.value.trim();
    if (!/^\d{6}$/.test(pin)) {
      result.innerHTML = `<span style="color: #E74C3C;"><i class="fas fa-exclamation-circle"></i> Please enter a valid 6-digit Indian PIN code.</span>`;
      return;
    }

    const estimatedDays = (pin.startsWith('40') || pin.startsWith('11') || pin.startsWith('56')) ? 2 : 4;
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + estimatedDays);

    result.innerHTML = `
      <div style="color: #2ECC71; font-size: 0.85rem; margin-top: 0.5rem;">
        <i class="fas fa-shield-alt"></i> Available for <strong>Express Insured Delivery</strong> by <strong>${window.formatDate(deliveryDate)}</strong>. Free White-Glove Shipping.
      </div>
    `;
  });
}

// Customer Review Form
function setupReviewForm() {
  const form = document.getElementById('write-review-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('review-author').value.trim();
    const comment = document.getElementById('review-comment').value.trim();

    if (!name || !comment) {
      window.showToast("Review Incomplete", "Please share your name and your thoughts.", "danger");
      return;
    }

    const reviewsContainer = document.getElementById('customer-reviews-list');
    const newReviewHtml = `
      <div class="luxury-card" style="padding: 1.5rem; margin-bottom: 1rem;">
        <div class="stars" style="margin-bottom: 0.5rem;"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
        <p style="font-size: 0.9rem; color: var(--ivory-primary); margin-bottom: 0.75rem;">"${comment}"</p>
        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted);">
          <span><strong>${name}</strong> (Verified Royal Customer)</span>
          <span>Just now</span>
        </div>
      </div>
    `;

    reviewsContainer.insertAdjacentHTML('afterbegin', newReviewHtml);
    window.showToast("Review Received", "Thank you for reviewing this royal creation!", "success");
    form.reset();
  });
}

window.switchGalleryImage = switchGalleryImage;
window.selectProductSize = selectProductSize;
window.changeQty = changeQty;
window.handleAddToCart = handleAddToCart;
window.handleBuyNow = handleBuyNow;
window.handleToggleWishlist = handleToggleWishlist;
