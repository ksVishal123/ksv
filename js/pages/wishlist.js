/* ==========================================================================
   ROYAL GOLD & DIAMONDS - Wishlist Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', async () => {
  await renderWishlist();
});

async function renderWishlist() {
  const container = document.getElementById('wishlist-grid');
  const emptyState = document.getElementById('wishlist-empty-state');
  const actionsBar = document.getElementById('wishlist-actions-bar');
  const countBadge = document.getElementById('wishlist-count-badge');

  if (!container) return;

  const wishlistIds = window.stateManager.getWishlist();

  if (wishlistIds.length === 0) {
    if (container) container.style.display = 'none';
    if (actionsBar) actionsBar.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (container) container.style.display = 'grid';
  if (actionsBar) actionsBar.style.display = 'flex';
  if (emptyState) emptyState.style.display = 'none';

  if (countBadge) {
    countBadge.textContent = `${wishlistIds.length} saved piece${wishlistIds.length > 1 ? 's' : ''}`;
  }

  // Load product details for each wishlist ID
  const products = [];
  for (const id of wishlistIds) {
    const p = await window.dbService.getProductById(id);
    if (p) products.push(p);
  }

  container.innerHTML = products.map(product => `
    <div class="product-card">
      <div class="product-image-box shimmer-hover">
        <img src="${product.images[0]}" alt="${product.name}" class="product-image">
        
        <div class="product-badges">
          <span class="badge-hallmark">${product.hallmark.split('&')[0]}</span>
        </div>

        <button class="product-wishlist-btn active" onclick="removeFromWishlist('${product.id}')" title="Remove from Wishlist">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>

      <div class="product-info">
        <div class="product-meta">
          <span class="product-category">${product.categoryName || product.category}</span>
          <span class="product-weight">${product.grossWeight}g</span>
        </div>

        <h3 class="product-title">
          <a href="product-details.html?id=${product.id}">${product.name}</a>
        </h3>

        <div class="product-price-box">
          <span class="product-price">${window.formatINR(product.price)}</span>
          <span style="font-size: 0.72rem; color: var(--gold-light); font-weight: 600;">${product.purity}</span>
        </div>

        <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
          <button class="btn btn-primary btn-sm btn-block" onclick="moveItemToCart('${product.id}')">
            <i class="fas fa-shopping-bag"></i> Move to Bag
          </button>
          <a href="product-details.html?id=${product.id}" class="btn btn-secondary btn-sm" title="View Details">
            <i class="fas fa-eye"></i>
          </a>
        </div>
      </div>
    </div>
  `).join('');
}

async function moveItemToCart(productId) {
  await window.stateManager.moveWishlistToCart(productId);
  window.showToast("Moved to Bag", "Piece transferred from wishlist to your bag.", "success");
  await renderWishlist();
}

async function removeFromWishlist(productId) {
  window.stateManager.toggleWishlist(productId);
  await renderWishlist();
}

async function moveAllToCart() {
  const wishlistIds = window.stateManager.getWishlist();
  for (const id of wishlistIds) {
    await window.stateManager.addToCart(id);
  }
  window.stateManager.saveWishlist([]);
  window.showToast("All Moved to Bag", "All saved pieces have been transferred to your bag.", "success");
  await renderWishlist();
}

window.moveItemToCart = moveItemToCart;
window.removeFromWishlist = removeFromWishlist;
window.moveAllToCart = moveAllToCart;
window.renderWishlist = renderWishlist;
