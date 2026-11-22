/* ==========================================================================
   ROYAL GOLD & DIAMONDS - Collections & Categories Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', async () => {
  await renderCollectionsShowcase();
});

async function renderCollectionsShowcase() {
  const container = document.getElementById('categories-showcase-grid');
  if (!container) return;

  const categories = await window.dbService.getCategories();
  const allProducts = await window.dbService.getProducts();

  container.innerHTML = categories.map(cat => {
    const prods = allProducts.filter(p => p.category.toLowerCase() === cat.id.toLowerCase());
    const count = prods.length;
    const priceMin = prods.length > 0 ? Math.min(...prods.map(p => p.price)) : 45000;

    return `
      <div class="luxury-card shimmer-hover" style="border-radius: var(--radius-md); overflow: hidden; display: flex; flex-direction: column;">
        <div style="position: relative; height: 280px; overflow: hidden;">
          <img src="${cat.image}" alt="${cat.name}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s ease;">
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(10,10,10,0.1) 0%, rgba(10,10,10,0.85) 100%);"></div>
          
          <div style="position: absolute; top: 1rem; left: 1rem;">
            <span class="badge-gold"><i class="fas ${cat.icon}"></i> Certified</span>
          </div>

          <div style="position: absolute; bottom: 1rem; left: 1rem; right: 1rem;">
            <h3 style="font-family: var(--font-royal); font-size: 1.4rem; color: #fff; margin-bottom: 0.25rem;">${cat.name}</h3>
            <span style="font-size: 0.82rem; color: var(--gold-light); font-family: var(--font-royal);">Starting from ${window.formatINR(priceMin)}</span>
          </div>
        </div>

        <div style="padding: 1.5rem; background: var(--bg-card); flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
          <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.25rem; line-height: 1.6;">
            Sculpted with authentic hallmarked purity, BIS certification and heirloom finish.
          </p>

          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed rgba(212, 175, 55, 0.2); padding-top: 1rem;">
            <span style="font-size: 0.8rem; color: var(--text-muted);">${count} Designs Available</span>
            <a href="shop.html?category=${cat.id}" class="btn btn-outline btn-sm">
              Explore Collection <i class="fas fa-arrow-right" style="margin-left: 4px;"></i>
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}
