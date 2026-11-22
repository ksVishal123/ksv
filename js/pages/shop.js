/* ==========================================================================
   ROYAL GOLD & DIAMONDS - Shop Catalogue Controller
   Filtering, Sorting, Real-time Search, Purity & Price Controls
   ========================================================================== */

let currentFilters = {
  category: 'all',
  metal: 'all',
  minPrice: 0,
  maxPrice: 600000,
  inStockOnly: false,
  search: '',
  sort: 'popular'
};

document.addEventListener('DOMContentLoaded', async () => {
  parseUrlParams();
  setupFilterEventListeners();
  await loadCategoriesIntoSidebar();
  await applyFiltersAndRender();
});

// 1. Read URL query parameters
function parseUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  
  if (urlParams.has('category')) {
    currentFilters.category = urlParams.get('category').toLowerCase();
  }
  if (urlParams.has('search')) {
    currentFilters.search = urlParams.get('search');
    const searchInput = document.getElementById('shop-search-input');
    if (searchInput) searchInput.value = currentFilters.search;
  }
  if (urlParams.has('metal')) {
    currentFilters.metal = urlParams.get('metal');
  }
  if (urlParams.has('sort')) {
    currentFilters.sort = urlParams.get('sort');
    const sortSelect = document.getElementById('shop-sort-select');
    if (sortSelect) sortSelect.value = currentFilters.sort;
  }
}

// 2. Setup Filter Event Listeners
function setupFilterEventListeners() {
  // Search input
  const searchInput = document.getElementById('shop-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentFilters.search = e.target.value.trim();
      applyFiltersAndRender();
    });
  }

  // Sort selector
  const sortSelect = document.getElementById('shop-sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentFilters.sort = e.target.value;
      applyFiltersAndRender();
    });
  }

  // Price range slider
  const priceSlider = document.getElementById('price-range-slider');
  const priceDisplay = document.getElementById('price-slider-value');
  if (priceSlider && priceDisplay) {
    priceSlider.addEventListener('input', (e) => {
      currentFilters.maxPrice = Number(e.target.value);
      priceDisplay.textContent = window.formatINR(currentFilters.maxPrice);
      applyFiltersAndRender();
    });
  }

  // In Stock Only checkbox
  const inStockCheck = document.getElementById('in-stock-only-check');
  if (inStockCheck) {
    inStockCheck.addEventListener('change', (e) => {
      currentFilters.inStockOnly = e.target.checked;
      applyFiltersAndRender();
    });
  }

  // Metal Filter radio/buttons
  document.querySelectorAll('input[name="metal-filter"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      currentFilters.metal = e.target.value;
      applyFiltersAndRender();
    });
  });

  // Mobile Filter Drawer toggle
  const mobileFilterBtn = document.getElementById('mobile-filter-toggle-btn');
  const sidebar = document.getElementById('shop-sidebar');
  const sidebarClose = document.getElementById('sidebar-close-btn');

  if (mobileFilterBtn && sidebar) {
    mobileFilterBtn.addEventListener('click', () => {
      sidebar.classList.add('mobile-active');
    });
  }

  if (sidebarClose && sidebar) {
    sidebarClose.addEventListener('click', () => {
      sidebar.classList.remove('mobile-active');
    });
  }
}

// 3. Load Categories into Sidebar
async function loadCategoriesIntoSidebar() {
  const container = document.getElementById('sidebar-categories-list');
  if (!container) return;

  const categories = await window.dbService.getCategories();
  const allProducts = await window.dbService.getProducts();

  let html = `
    <li>
      <button class="filter-category-btn ${currentFilters.category === 'all' ? 'active' : ''}" onclick="selectCategoryFilter('all')">
        <span><i class="fas fa-th-large" style="width: 18px;"></i> All Collections</span>
        <span class="count-tag">${allProducts.length}</span>
      </button>
    </li>
  `;

  categories.forEach(cat => {
    const count = allProducts.filter(p => p.category.toLowerCase() === cat.id.toLowerCase()).length;
    const isActive = currentFilters.category === cat.id.toLowerCase();
    html += `
      <li>
        <button class="filter-category-btn ${isActive ? 'active' : ''}" onclick="selectCategoryFilter('${cat.id}')">
          <span><i class="fas ${cat.icon}" style="width: 18px;"></i> ${cat.name}</span>
          <span class="count-tag">${count}</span>
        </button>
      </li>
    `;
  });

  container.innerHTML = html;
}

function selectCategoryFilter(catId) {
  currentFilters.category = catId;
  document.querySelectorAll('.filter-category-btn').forEach(btn => btn.classList.remove('active'));
  loadCategoriesIntoSidebar();
  applyFiltersAndRender();

  // Close mobile sidebar if open
  document.getElementById('shop-sidebar')?.classList.remove('mobile-active');
}

// 4. Apply Filters & Render
async function applyFiltersAndRender() {
  const grid = document.getElementById('shop-products-grid');
  const countEl = document.getElementById('shop-products-count');
  const activeChipsContainer = document.getElementById('active-filter-chips');

  if (!grid) return;

  // Render Skeleton Placeholders
  grid.innerHTML = Array(6).fill(0).map(() => `
    <div class="product-card">
      <div class="skeleton" style="height: 280px; width: 100%;"></div>
      <div style="padding: 1.25rem;">
        <div class="skeleton" style="height: 14px; width: 40%; margin-bottom: 0.5rem;"></div>
        <div class="skeleton" style="height: 20px; width: 85%; margin-bottom: 0.75rem;"></div>
        <div class="skeleton" style="height: 18px; width: 50%;"></div>
      </div>
    </div>
  `).join('');

  const products = await window.dbService.getProducts(currentFilters);

  if (countEl) {
    countEl.textContent = `Showing ${products.length} precious creations`;
  }

  // Update active chips
  renderFilterChips(activeChipsContainer);

  if (products.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <i class="fas fa-gem empty-state-icon"></i>
        <h3 class="empty-state-title">No Matching Jewellery Pieces</h3>
        <p class="empty-state-text">We couldn't find any items matching your selected criteria. Try adjusting your filters or price range.</p>
        <button class="btn btn-outline" onclick="resetAllFilters()"><i class="fas fa-undo"></i> Reset All Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = products.map(product => {
    const isWishlisted = window.stateManager.isInWishlist(product.id);
    return `
      <div class="product-card">
        <div class="product-image-box shimmer-hover">
          <img src="${product.images[0]}" alt="${product.name}" class="product-image" loading="lazy">
          
          <div class="product-badges">
            <span class="badge-hallmark"><i class="fas fa-shield-alt"></i> ${product.hallmark.split('&')[0]}</span>
            ${product.isBestseller ? `<span class="badge-gold"><i class="fas fa-crown"></i> Bestseller</span>` : ''}
            ${product.isNewArrival ? `<span class="badge-certified"><i class="fas fa-sparkles"></i> New</span>` : ''}
          </div>

          <button class="product-wishlist-btn ${isWishlisted ? 'active' : ''}" 
                  data-wishlist-id="${product.id}" 
                  onclick="window.stateManager.toggleWishlist('${product.id}')"
                  title="Save to Wishlist">
            <i class="${isWishlisted ? 'fas' : 'far'} fa-heart"></i>
          </button>

          <button class="btn btn-outline btn-sm product-quick-view" onclick="openQuickView('${product.id}')">
            <i class="fas fa-eye"></i> Quick View
          </button>
        </div>

        <div class="product-info">
          <div class="product-meta">
            <span class="product-category">${product.categoryName || product.category}</span>
            <span class="product-weight">${product.grossWeight}g Gross</span>
          </div>

          <h3 class="product-title">
            <a href="product-details.html?id=${product.id}">${product.name}</a>
          </h3>

          <div class="product-rating">
            <div class="stars">${window.renderStars(product.rating)}</div>
            <span class="rating-count">(${product.reviewCount || 10})</span>
          </div>

          <div class="product-price-box">
            <div>
              <span class="product-price">${window.formatINR(product.price)}</span>
              ${product.mrp ? `<span class="product-mrp">${window.formatINR(product.mrp)}</span>` : ''}
            </div>
            <span style="font-size: 0.72rem; color: var(--gold-light); font-weight: 600;">${product.purity}</span>
          </div>

          <div class="product-actions">
            <button class="btn btn-primary btn-add-cart" onclick="window.stateManager.addToCart('${product.id}')">
              <i class="fas fa-shopping-bag"></i> Add to Cart
            </button>
            <a href="product-details.html?id=${product.id}" class="btn btn-secondary btn-sm" title="View Full Details">
              <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// 5. Active Filter Chips
function renderFilterChips(container) {
  if (!container) return;

  const chips = [];

  if (currentFilters.category !== 'all') {
    chips.push({
      label: `Category: ${currentFilters.category.toUpperCase()}`,
      onRemove: () => { currentFilters.category = 'all'; selectCategoryFilter('all'); }
    });
  }

  if (currentFilters.metal !== 'all') {
    chips.push({
      label: `Metal: ${currentFilters.metal}`,
      onRemove: () => {
        currentFilters.metal = 'all';
        const allRadio = document.querySelector('input[name="metal-filter"][value="all"]');
        if (allRadio) allRadio.checked = true;
        applyFiltersAndRender();
      }
    });
  }

  if (currentFilters.maxPrice < 600000) {
    chips.push({
      label: `Max: ${window.formatINR(currentFilters.maxPrice)}`,
      onRemove: () => {
        currentFilters.maxPrice = 600000;
        const slider = document.getElementById('price-range-slider');
        if (slider) slider.value = 600000;
        document.getElementById('price-slider-value').textContent = '₹6,00,000';
        applyFiltersAndRender();
      }
    });
  }

  if (currentFilters.search) {
    chips.push({
      label: `Search: "${currentFilters.search}"`,
      onRemove: () => {
        currentFilters.search = '';
        const searchInput = document.getElementById('shop-search-input');
        if (searchInput) searchInput.value = '';
        applyFiltersAndRender();
      }
    });
  }

  if (currentFilters.inStockOnly) {
    chips.push({
      label: `In Stock Only`,
      onRemove: () => {
        currentFilters.inStockOnly = false;
        const inStockCheck = document.getElementById('in-stock-only-check');
        if (inStockCheck) inStockCheck.checked = false;
        applyFiltersAndRender();
      }
    });
  }

  if (chips.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
      <span style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-royal);">Active Filters:</span>
      ${chips.map((c, i) => `
        <span class="badge-gold" style="cursor: pointer; display: inline-flex; align-items: center; gap: 6px;" onclick="window.removeFilterChip(${i})">
          ${c.label} <i class="fas fa-times"></i>
        </span>
      `).join('')}
      <button class="btn btn-sm btn-outline" style="font-size: 0.7rem; padding: 0.25rem 0.65rem;" onclick="resetAllFilters()">Clear All</button>
    </div>
  `;

  window._activeFilterChips = chips;
}

window.removeFilterChip = function(index) {
  if (window._activeFilterChips && window._activeFilterChips[index]) {
    window._activeFilterChips[index].onRemove();
  }
};

function resetAllFilters() {
  currentFilters = {
    category: 'all',
    metal: 'all',
    minPrice: 0,
    maxPrice: 600000,
    inStockOnly: false,
    search: '',
    sort: 'popular'
  };

  const searchInput = document.getElementById('shop-search-input');
  if (searchInput) searchInput.value = '';

  const sortSelect = document.getElementById('shop-sort-select');
  if (sortSelect) sortSelect.value = 'popular';

  const slider = document.getElementById('price-range-slider');
  if (slider) slider.value = 600000;
  const priceDisplay = document.getElementById('price-slider-value');
  if (priceDisplay) priceDisplay.textContent = '₹6,00,000';

  const inStockCheck = document.getElementById('in-stock-only-check');
  if (inStockCheck) inStockCheck.checked = false;

  const allMetal = document.querySelector('input[name="metal-filter"][value="all"]');
  if (allMetal) allMetal.checked = true;

  loadCategoriesIntoSidebar();
  applyFiltersAndRender();
}

window.selectCategoryFilter = selectCategoryFilter;
window.resetAllFilters = resetAllFilters;
