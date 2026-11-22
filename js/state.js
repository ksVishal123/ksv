/* ==========================================================================
   ROYAL GOLD & DIAMONDS - Client State Manager (Cart, Wishlist & Coupons)
   ========================================================================== */

class StateManager {
  constructor() {
    this.cartKey = 'rgd_shopping_cart';
    this.wishlistKey = 'rgd_wishlist_items';
    this.couponKey = 'rgd_active_coupon';

    this.activeCoupon = null;
    this.coupons = {
      'ROYAL10': { type: 'percent', value: 10, description: '10% Off Royal Privilege Discount' },
      'BRIDAL2026': { type: 'flat', value: 15000, description: '₹15,000 Off Wedding & Bridal Jewellery' },
      'DIAMOND5K': { type: 'flat', value: 5000, description: '₹5,000 Off Certified Solitaires' }
    };

    this.init();
  }

  init() {
    const savedCoupon = localStorage.getItem(this.couponKey);
    if (savedCoupon && this.coupons[savedCoupon]) {
      this.activeCoupon = { code: savedCoupon, ...this.coupons[savedCoupon] };
    }
    this.updateBadges();
  }

  // --------------------------------------------------------------------------
  // CART OPERATIONS
  // --------------------------------------------------------------------------
  getCart() {
    return JSON.parse(localStorage.getItem(this.cartKey) || '[]');
  }

  saveCart(cart) {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    this.updateBadges();
  }

  async addToCart(productId, quantity = 1, options = {}) {
    const product = await window.dbService.getProductById(productId);
    if (!product) {
      window.showToast("Product Error", "Jewellery piece could not be found.", "danger");
      return false;
    }

    const cart = this.getCart();
    const existingIndex = cart.findIndex(item => 
      item.productId === productId && 
      (!options.size || item.size === options.size) &&
      (!options.metal || item.metal === options.metal)
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        mrp: product.mrp || product.price,
        image: product.images[0],
        metal: options.metal || product.metal,
        purity: product.purity,
        hallmark: product.hallmark,
        size: options.size || (product.sizes ? product.sizes[0] : 'Standard'),
        quantity: quantity,
        grossWeight: product.grossWeight,
        netGoldWeight: product.netGoldWeight
      });
    }

    this.saveCart(cart);
    window.showToast("Added to Royal Cart", `${product.name} has been added.`, "success");
    return true;
  }

  updateQuantity(productId, quantity, size = null) {
    let cart = this.getCart();
    const index = cart.findIndex(item => item.productId === productId && (!size || item.size === size));
    
    if (index > -1) {
      if (quantity <= 0) {
        cart.splice(index, 1);
        window.showToast("Item Removed", "Jewellery piece removed from cart.", "info");
      } else {
        cart[index].quantity = quantity;
      }
      this.saveCart(cart);
    }
  }

  removeFromCart(productId, size = null) {
    let cart = this.getCart();
    cart = cart.filter(item => !(item.productId === productId && (!size || item.size === size)));
    this.saveCart(cart);
    window.showToast("Item Removed", "Removed from your bag.", "info");
  }

  clearCart() {
    localStorage.removeItem(this.cartKey);
    localStorage.removeItem(this.couponKey);
    this.activeCoupon = null;
    this.updateBadges();
  }

  // Cart Totals with Indian Jewellery 3% GST
  getCartTotals() {
    const cart = this.getCart();
    let subtotal = 0;
    let totalItems = 0;

    cart.forEach(item => {
      subtotal += item.price * item.quantity;
      totalItems += item.quantity;
    });

    // Discount
    let discount = 0;
    if (this.activeCoupon && subtotal > 0) {
      if (this.activeCoupon.type === 'percent') {
        discount = Math.round((subtotal * this.activeCoupon.value) / 100);
      } else if (this.activeCoupon.type === 'flat') {
        discount = Math.min(this.activeCoupon.value, subtotal);
      }
    }

    const discountedSubtotal = Math.max(0, subtotal - discount);

    // 3% Indian GST on Precious Gold/Diamond Jewellery
    const gstAmount = Math.round(discountedSubtotal * 0.03);

    // Insured Courier Shipping (Free above ₹10,000)
    const shippingFee = 0;

    const grandTotal = discountedSubtotal + gstAmount + shippingFee;

    return {
      subtotal,
      totalItems,
      discount,
      activeCoupon: this.activeCoupon,
      gstAmount,
      shippingFee,
      grandTotal
    };
  }

  applyCoupon(code) {
    const upper = (code || '').trim().toUpperCase();
    if (!upper) {
      return { success: false, message: "Please enter a coupon code." };
    }

    if (this.coupons[upper]) {
      this.activeCoupon = { code: upper, ...this.coupons[upper] };
      localStorage.setItem(this.couponKey, upper);
      return { success: true, coupon: this.activeCoupon };
    }

    return { success: false, message: "Invalid promo code. Try 'ROYAL10' or 'BRIDAL2026'." };
  }

  removeCoupon() {
    this.activeCoupon = null;
    localStorage.removeItem(this.couponKey);
  }

  // --------------------------------------------------------------------------
  // WISHLIST OPERATIONS
  // --------------------------------------------------------------------------
  getWishlist() {
    return JSON.parse(localStorage.getItem(this.wishlistKey) || '[]');
  }

  saveWishlist(list) {
    localStorage.setItem(this.wishlistKey, JSON.stringify(list));
    this.updateBadges();
  }

  async toggleWishlist(productId) {
    let wishlist = this.getWishlist();
    const index = wishlist.indexOf(productId);

    if (index > -1) {
      wishlist.splice(index, 1);
      this.saveWishlist(wishlist);
      window.showToast("Removed from Wishlist", "Item removed from your favorites.", "info");
      this.updateWishlistButtons(productId, false);
      return false;
    } else {
      wishlist.push(productId);
      this.saveWishlist(wishlist);
      const product = await window.dbService.getProductById(productId);
      window.showToast("Added to Wishlist", `${product ? product.name : 'Item'} saved to your royal wishlist.`, "success");
      this.updateWishlistButtons(productId, true);
      return true;
    }
  }

  isInWishlist(productId) {
    const wishlist = this.getWishlist();
    return wishlist.includes(productId);
  }

  async moveWishlistToCart(productId) {
    await this.addToCart(productId);
    let wishlist = this.getWishlist();
    wishlist = wishlist.filter(id => id !== productId);
    this.saveWishlist(wishlist);
  }

  // --------------------------------------------------------------------------
  // UI BADGE SYNC
  // --------------------------------------------------------------------------
  updateBadges() {
    const cart = this.getCart();
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const wishlist = this.getWishlist();
    const wishlistCount = wishlist.length;

    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = cartCount;
      el.style.display = cartCount > 0 ? 'flex' : 'none';
    });

    document.querySelectorAll('.wishlist-count').forEach(el => {
      el.textContent = wishlistCount;
      el.style.display = wishlistCount > 0 ? 'flex' : 'none';
    });
  }

  updateWishlistButtons(productId, isActive) {
    document.querySelectorAll(`[data-wishlist-id="${productId}"]`).forEach(btn => {
      if (isActive) {
        btn.classList.add('active');
        btn.innerHTML = '<i class="fas fa-heart"></i>';
      } else {
        btn.classList.remove('active');
        btn.innerHTML = '<i class="far fa-heart"></i>';
      }
    });
  }
}

window.stateManager = new StateManager();
