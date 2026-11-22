/* ==========================================================================
   ROYAL GOLD & DIAMONDS - Home Page Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', async () => {
  initHeroCarousel();
  await loadHomeCategories();
  await loadFeaturedJewellery();
  await loadNewArrivals();
  initNewsletter();
});

// 1. Hero Carousel Controller
function initHeroCarousel() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  let currentSlide = 0;
  let slideInterval = null;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentSlide = index;
  }

  function nextSlide() {
    let next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  function startAutoSlide() {
    stopAutoSlide();
    slideInterval = setInterval(nextSlide, 6000);
  }

  function stopAutoSlide() {
    if (slideInterval) clearInterval(slideInterval);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      showSlide(i);
      startAutoSlide();
    });
  });

  const prevBtn = document.getElementById('hero-prev-btn');
  const nextBtn = document.getElementById('hero-next-btn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      let prev = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(prev);
      startAutoSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoSlide();
    });
  }

  startAutoSlide();
}

// 2. Load Home Categories
async function loadHomeCategories() {
  const container = document.getElementById('home-categories-grid');
  if (!container) return;

  const categories = await window.dbService.getCategories();

  container.innerHTML = categories.slice(0, 6).map(cat => `
    <a href="shop.html?category=${cat.id}" class="category-card luxury-card shimmer-hover" style="display: block; position: relative; border-radius: var(--radius-md); overflow: hidden; height: 320px; text-decoration: none;">
      <img src="${cat.image}" alt="${cat.name}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease;">
      <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(10,10,10,0.1) 0%, rgba(10,10,10,0.85) 100%);"></div>
      <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 1.5rem; text-align: center;">
        <span class="badge-gold" style="margin-bottom: 0.5rem; font-size: 0.68rem;"><i class="fas ${cat.icon}"></i> Certified</span>
        <h3 style="font-family: var(--font-royal); font-size: 1.25rem; color: #fff; margin-bottom: 0.25rem;">${cat.name}</h3>
        <span style="font-size: 0.8rem; color: var(--gold-light); font-family: var(--font-royal); letter-spacing: 0.05em;">Explore Collection <i class="fas fa-arrow-right" style="font-size: 0.7rem; margin-left: 4px;"></i></span>
      </div>
    </a>
  `).join('');
}

// 3. Load Featured Royal Jewellery
async function loadFeaturedJewellery() {
  const container = document.getElementById('featured-products-grid');
  if (!container) return;

  const products = await window.dbService.getProducts({ sort: 'popular' });
  const featured = products.slice(0, 4);

  renderProductCards(container, featured);
}

// 4. Load New Arrivals
async function loadNewArrivals() {
  const container = document.getElementById('new-arrivals-grid');
  if (!container) return;

  const products = await window.dbService.getProducts({ sort: 'newest' });
  const newItems = products.slice(0, 4);

  renderProductCards(container, newItems);
}

// Reusable Product Card Renderer
function renderProductCards(container, products) {
  if (!products || products.length === 0) {
    container.innerHTML = `<div class="empty-state"><p>No items found.</p></div>`;
    return;
  }

  container.innerHTML = products.map(product => {
    const isWishlisted = window.stateManager.isInWishlist(product.id);
    return `
      <div class="product-card">
        <div class="product-image-box shimmer-hover">
          <img src="${product.images[0]}" alt="${product.name}" class="product-image">
          
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
            <span class="rating-count">(${product.reviewCount || 12})</span>
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

// 5. Newsletter Subscription
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('newsletter-email');
    const email = input.value.trim();

    if (!email || !email.includes('@')) {
      window.showToast("Validation Error", "Please enter a valid email address.", "danger");
      return;
    }

    // Success response with discount code
    window.showToast(
      "Royal Welcome Gift!", 
      "Thank you for joining our royal circle. Use promo code ROYAL10 for 10% off your purchase!", 
      "success"
    );
    input.value = '';
  });
}
