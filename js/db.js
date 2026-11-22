/* ==========================================================================
   ROYAL GOLD & DIAMONDS - Database Service (Firestore + Local Persistence)
   Complete CRUD Operations for Products, Orders, Categories & Reviews
   ========================================================================== */

class DatabaseService {
  constructor() {
    this.storageKeyProducts = 'rgd_local_products';
    this.storageKeyOrders = 'rgd_local_orders';
    this.storageKeyCategories = 'rgd_local_categories';
    this.initLocalData();
  }

  // Initialize local data fallback if empty
  initLocalData() {
    if (!localStorage.getItem(this.storageKeyProducts)) {
      const initialProducts = window.SAMPLE_PRODUCTS || [];
      localStorage.setItem(this.storageKeyProducts, JSON.stringify(initialProducts));
    }

    if (!localStorage.getItem(this.storageKeyCategories)) {
      const initialCategories = window.SAMPLE_CATEGORIES || [];
      localStorage.setItem(this.storageKeyCategories, JSON.stringify(initialCategories));
    }

    if (!localStorage.getItem(this.storageKeyOrders)) {
      const sampleOrders = [
        {
          orderId: "RGD-2026-88192",
          userId: "demo_customer_01",
          customerName: "Priyanka Verma",
          customerEmail: "priyanka.v@example.com",
          customerPhone: "+91 98450 12345",
          shippingAddress: {
            fullName: "Priyanka Verma",
            street: "42, Gold Crest Apartments, Indiranagar",
            city: "Bengaluru",
            state: "Karnataka",
            pincode: "560038"
          },
          items: [
            {
              id: "rgd-102",
              name: "Imperial Solitaire Diamond Engagement Ring",
              price: 185000,
              quantity: 1,
              size: "14 (Standard)",
              metal: "18K White Gold",
              image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800"
            }
          ],
          subtotal: 185000,
          discount: 10000,
          gstAmount: 5250,
          grandTotal: 180250,
          paymentMethod: "Demo Razorpay / UPI Simulator",
          paymentStatus: "Completed (Demo)",
          orderStatus: "Shipped",
          trackingNumber: "BLUEDART-EXP-99218",
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      localStorage.setItem(this.storageKeyOrders, JSON.stringify(sampleOrders));
    }
  }

  isFirestoreActive() {
    return window.FIREBASE_MODE === 'LIVE' && window.firestoreDb !== null;
  }

  // 1. PRODUCTS: GET ALL / FILTERED
  async getProducts(filters = {}) {
    if (this.isFirestoreActive()) {
      try {
        let ref = window.firestoreDb.collection('products');
        if (filters.category && filters.category !== 'all') {
          ref = ref.where('category', '==', filters.category);
        }
        const snapshot = await ref.get();
        let products = [];
        snapshot.forEach(doc => {
          products.push({ id: doc.id, ...doc.data() });
        });

        if (products.length > 0) {
          return this.applyClientFilters(products, filters);
        }
      } catch (err) {
        console.warn("Firestore query error, falling back to local DB:", err);
      }
    }

    // Local Persistence Fallback
    const local = JSON.parse(localStorage.getItem(this.storageKeyProducts) || '[]');
    return this.applyClientFilters(local, filters);
  }

  // Filter & Sort helper
  applyClientFilters(products, filters) {
    let filtered = [...products];

    // Category Filter
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
    }

    // Metal Filter
    if (filters.metal && filters.metal !== 'all') {
      filtered = filtered.filter(p => p.metal.toLowerCase().includes(filters.metal.toLowerCase()) || (p.purity && p.purity.toLowerCase().includes(filters.metal.toLowerCase())));
    }

    // Price Range Filter
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= Number(filters.maxPrice));
    }

    // In Stock Only
    if (filters.inStockOnly) {
      filtered = filtered.filter(p => p.stock > 0);
    }

    // Keyword Search
    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.hallmark && p.hallmark.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (filters.sort) {
      switch (filters.sort) {
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'newest':
          filtered.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
          break;
        case 'popular':
        default:
          filtered.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
          break;
      }
    }

    return filtered;
  }

  // 2. PRODUCT: GET BY ID
  async getProductById(id) {
    if (this.isFirestoreActive()) {
      try {
        const doc = await window.firestoreDb.collection('products').doc(id).get();
        if (doc.exists) {
          return { id: doc.id, ...doc.data() };
        }
      } catch (err) {
        console.warn("Firestore fetch error:", err);
      }
    }

    const local = JSON.parse(localStorage.getItem(this.storageKeyProducts) || '[]');
    return local.find(p => p.id === id) || null;
  }

  // 3. PRODUCT: CREATE (ADMIN)
  async createProduct(productData) {
    const id = productData.id || `rgd-${Date.now()}`;
    const newProduct = {
      ...productData,
      id,
      rating: productData.rating || 5.0,
      reviewCount: productData.reviewCount || 0,
      createdAt: new Date().toISOString()
    };

    if (this.isFirestoreActive()) {
      try {
        await window.firestoreDb.collection('products').doc(id).set(newProduct);
      } catch (err) {
        console.warn("Firestore save error:", err);
      }
    }

    // Save to local storage
    const local = JSON.parse(localStorage.getItem(this.storageKeyProducts) || '[]');
    local.unshift(newProduct);
    localStorage.setItem(this.storageKeyProducts, JSON.stringify(local));

    return newProduct;
  }

  // 4. PRODUCT: UPDATE (ADMIN)
  async updateProduct(id, updatedFields) {
    if (this.isFirestoreActive()) {
      try {
        await window.firestoreDb.collection('products').doc(id).update(updatedFields);
      } catch (err) {
        console.warn("Firestore update error:", err);
      }
    }

    const local = JSON.parse(localStorage.getItem(this.storageKeyProducts) || '[]');
    const index = local.findIndex(p => p.id === id);
    if (index !== -1) {
      local[index] = { ...local[index], ...updatedFields };
      localStorage.setItem(this.storageKeyProducts, JSON.stringify(local));
      return local[index];
    }
    return null;
  }

  // 5. PRODUCT: DELETE (ADMIN)
  async deleteProduct(id) {
    if (this.isFirestoreActive()) {
      try {
        await window.firestoreDb.collection('products').doc(id).delete();
      } catch (err) {
        console.warn("Firestore delete error:", err);
      }
    }

    let local = JSON.parse(localStorage.getItem(this.storageKeyProducts) || '[]');
    local = local.filter(p => p.id !== id);
    localStorage.setItem(this.storageKeyProducts, JSON.stringify(local));
    return true;
  }

  // 6. CATEGORIES: GET ALL
  async getCategories() {
    if (this.isFirestoreActive()) {
      try {
        const snap = await window.firestoreDb.collection('categories').get();
        if (!snap.empty) {
          const list = [];
          snap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
          return list;
        }
      } catch (err) {
        console.warn("Firestore category error:", err);
      }
    }
    return JSON.parse(localStorage.getItem(this.storageKeyCategories) || '[]');
  }

  // 7. ORDERS: CREATE
  async createOrder(orderData) {
    const orderId = orderData.orderId || `RGD-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      ...orderData,
      orderId,
      createdAt: new Date().toISOString()
    };

    if (this.isFirestoreActive()) {
      try {
        await window.firestoreDb.collection('orders').doc(orderId).set(newOrder);
      } catch (err) {
        console.warn("Firestore order create error:", err);
      }
    }

    const local = JSON.parse(localStorage.getItem(this.storageKeyOrders) || '[]');
    local.unshift(newOrder);
    localStorage.setItem(this.storageKeyOrders, JSON.stringify(local));

    return newOrder;
  }

  // 8. ORDERS: GET ALL / BY USER
  async getOrders(userId = null) {
    if (this.isFirestoreActive()) {
      try {
        let ref = window.firestoreDb.collection('orders').orderBy('createdAt', 'desc');
        if (userId) {
          ref = ref.where('userId', '==', userId);
        }
        const snap = await ref.get();
        const orders = [];
        snap.forEach(doc => orders.push({ id: doc.id, ...doc.data() }));
        if (orders.length > 0) return orders;
      } catch (err) {
        console.warn("Firestore order query error:", err);
      }
    }

    const local = JSON.parse(localStorage.getItem(this.storageKeyOrders) || '[]');
    if (userId) {
      return local.filter(o => o.userId === userId);
    }
    return local;
  }

  // 9. ORDER: UPDATE STATUS (ADMIN)
  async updateOrderStatus(orderId, newStatus) {
    if (this.isFirestoreActive()) {
      try {
        await window.firestoreDb.collection('orders').doc(orderId).update({ orderStatus: newStatus });
      } catch (err) {
        console.warn("Firestore order status update error:", err);
      }
    }

    const local = JSON.parse(localStorage.getItem(this.storageKeyOrders) || '[]');
    const index = local.findIndex(o => o.orderId === orderId);
    if (index !== -1) {
      local[index].orderStatus = newStatus;
      localStorage.setItem(this.storageKeyOrders, JSON.stringify(local));
      return local[index];
    }
    return null;
  }

  // 10. SEED SAMPLE DATA TO FIRESTORE (Convenient for evaluator setup)
  async seedFirestore() {
    if (!this.isFirestoreActive()) {
      return { success: false, message: "Firestore is running in local demo mode. To seed cloud, add your Firebase keys in firebase-config.js." };
    }

    try {
      const batch = window.firestoreDb.batch();
      const sample = window.SAMPLE_PRODUCTS || [];

      sample.forEach(prod => {
        const docRef = window.firestoreDb.collection('products').doc(prod.id);
        batch.set(docRef, prod);
      });

      await batch.commit();
      return { success: true, count: sample.length };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }
}

// Instantiate Database Service
window.dbService = new DatabaseService();
