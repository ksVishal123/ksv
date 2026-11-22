/* ==========================================================================
   ROYAL GOLD & DIAMONDS - Authentication Service (Firebase Auth + Demo Role Management)
   ========================================================================== */

class AuthService {
  constructor() {
    this.sessionKey = 'rgd_active_user';
    this.usersKey = 'rgd_local_users';
    this.currentUser = null;
    this.initUsers();
    this.initSession();
    this.listenToAuthChanges();
  }

  initUsers() {
    if (!localStorage.getItem(this.usersKey)) {
      const defaultUsers = [
        {
          uid: 'usr_admin_01',
          fullName: 'Royal Administrator',
          email: 'admin@royalgold.com',
          password: 'RoyalAdmin@2026',
          role: 'admin',
          phone: '+91 99000 11223'
        },
        {
          uid: 'usr_cust_01',
          fullName: 'Aarav Sharma',
          email: 'customer@royalgold.com',
          password: 'Customer@2026',
          role: 'customer',
          phone: '+91 98765 43210'
        }
      ];
      localStorage.setItem(this.usersKey, JSON.stringify(defaultUsers));
    }
  }

  initSession() {
    const saved = localStorage.getItem(this.sessionKey);
    if (saved) {
      try {
        this.currentUser = JSON.parse(saved);
      } catch (e) {
        this.currentUser = null;
      }
    }
  }

  isLiveAuth() {
    return window.FIREBASE_MODE === 'LIVE' && window.firebaseAuth !== null;
  }

  listenToAuthChanges() {
    if (this.isLiveAuth()) {
      window.firebaseAuth.onAuthStateChanged(async (user) => {
        if (user) {
          // Fetch role from Firestore
          let role = 'customer';
          try {
            const userDoc = await window.firestoreDb.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
              role = userDoc.data().role || 'customer';
            }
          } catch (e) {
            console.warn("Could not fetch user role from firestore:", e);
          }

          this.currentUser = {
            uid: user.uid,
            email: user.email,
            fullName: user.displayName || user.email.split('@')[0],
            role: role
          };
          localStorage.setItem(this.sessionKey, JSON.stringify(this.currentUser));
        } else {
          // If no firebase user and we were in live mode, clear
          if (this.currentUser && !this.currentUser.isDemo) {
            this.currentUser = null;
            localStorage.removeItem(this.sessionKey);
          }
        }
        this.updateHeaderUI();
      });
    } else {
      this.updateHeaderUI();
    }
  }

  // 1. REGISTER
  async register(fullName, email, password, phone = '') {
    if (this.isLiveAuth()) {
      try {
        const userCredential = await window.firebaseAuth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        await user.updateProfile({ displayName: fullName });

        // Save to Firestore
        const userData = {
          uid: user.uid,
          fullName,
          email,
          phone,
          role: 'customer',
          createdAt: new Date().toISOString()
        };
        await window.firestoreDb.collection('users').doc(user.uid).set(userData);

        this.currentUser = userData;
        localStorage.setItem(this.sessionKey, JSON.stringify(this.currentUser));
        this.updateHeaderUI();
        return { success: true, user: this.currentUser };
      } catch (err) {
        return { success: false, message: err.message };
      }
    }

    // Demo Mode Registration
    const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: "An account with this email address already exists." };
    }

    const newUser = {
      uid: `usr_${Date.now()}`,
      fullName,
      email,
      password,
      phone,
      role: 'customer',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(this.usersKey, JSON.stringify(users));

    this.currentUser = newUser;
    localStorage.setItem(this.sessionKey, JSON.stringify(this.currentUser));
    this.updateHeaderUI();
    return { success: true, user: this.currentUser };
  }

  // 2. LOGIN
  async login(email, password) {
    if (this.isLiveAuth()) {
      try {
        const cred = await window.firebaseAuth.signInWithEmailAndPassword(email, password);
        let role = 'customer';
        try {
          const doc = await window.firestoreDb.collection('users').doc(cred.user.uid).get();
          if (doc.exists) role = doc.data().role || 'customer';
        } catch (e) {}

        this.currentUser = {
          uid: cred.user.uid,
          email: cred.user.email,
          fullName: cred.user.displayName || cred.user.email.split('@')[0],
          role: role
        };
        localStorage.setItem(this.sessionKey, JSON.stringify(this.currentUser));
        this.updateHeaderUI();
        return { success: true, user: this.currentUser };
      } catch (err) {
        return { success: false, message: err.message };
      }
    }

    // Demo Mode Login
    const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (user) {
      this.currentUser = { ...user };
      delete this.currentUser.password;
      localStorage.setItem(this.sessionKey, JSON.stringify(this.currentUser));
      this.updateHeaderUI();
      return { success: true, user: this.currentUser };
    }

    return { success: false, message: "Invalid email or password. Please verify credentials." };
  }

  // 3. LOGOUT
  async logout() {
    if (this.isLiveAuth()) {
      try {
        await window.firebaseAuth.signOut();
      } catch (e) {}
    }
    this.currentUser = null;
    localStorage.removeItem(this.sessionKey);
    this.updateHeaderUI();
    return true;
  }

  // 4. QUICK SWITCH FOR COLLEGE DEMO EVALUATION
  switchDemoUser(role = 'admin') {
    if (role === 'admin') {
      this.currentUser = {
        uid: 'usr_admin_01',
        fullName: 'Royal Administrator',
        email: 'admin@royalgold.com',
        role: 'admin',
        isDemo: true
      };
    } else {
      this.currentUser = {
        uid: 'usr_cust_01',
        fullName: 'Aarav Sharma',
        email: 'customer@royalgold.com',
        role: 'customer',
        isDemo: true
      };
    }
    localStorage.setItem(this.sessionKey, JSON.stringify(this.currentUser));
    this.updateHeaderUI();
    window.showToast("Demo Profile Switched", `Active Session: ${this.currentUser.fullName} (${this.currentUser.role.toUpperCase()})`, "success");
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isAdmin() {
    return this.currentUser && this.currentUser.role === 'admin';
  }

  // Update Header UI dynamically across any page
  updateHeaderUI() {
    const userDropdown = document.getElementById('account-dropdown-menu');
    const headerUserIcon = document.getElementById('header-user-btn');

    if (!userDropdown) return;

    if (this.currentUser) {
      userDropdown.innerHTML = `
        <div class="dropdown-header">
          <div class="dropdown-user-name">${this.currentUser.fullName}</div>
          <div class="dropdown-user-email">${this.currentUser.email}</div>
          <div style="margin-top: 4px;">
            <span class="badge-gold" style="font-size: 0.65rem;">${this.currentUser.role.toUpperCase()}</span>
          </div>
        </div>
        ${this.isAdmin() ? `
          <a href="admin.html" class="dropdown-item">
            <i class="fas fa-crown"></i> Admin Dashboard
          </a>
        ` : ''}
        <a href="orders.html" class="dropdown-item">
          <i class="fas fa-box-open"></i> My Orders
        </a>
        <a href="wishlist.html" class="dropdown-item">
          <i class="fas fa-heart"></i> My Wishlist
        </a>
        <div class="dropdown-divider"></div>
        <button class="dropdown-item" style="width: 100%; text-align: left; background: none; border: none; cursor: pointer;" onclick="window.authService.logout().then(() => { window.showToast('Logged Out', 'You have been signed out safely.', 'info'); window.location.reload(); });">
          <i class="fas fa-sign-out-alt"></i> Sign Out
        </button>
      `;
    } else {
      userDropdown.innerHTML = `
        <div class="dropdown-header">
          <div class="dropdown-user-name">Welcome, Guest</div>
          <div class="dropdown-user-email">Sign in to access royal privileges</div>
        </div>
        <a href="auth.html?mode=login" class="dropdown-item">
          <i class="fas fa-sign-in-alt"></i> Sign In
        </a>
        <a href="auth.html?mode=register" class="dropdown-item">
          <i class="fas fa-user-plus"></i> Create Account
        </a>
        <div class="dropdown-divider"></div>
        <div style="padding: 0.5rem 1.25rem;">
          <div style="font-size: 0.72rem; color: var(--gold-light); margin-bottom: 0.4rem; font-family: var(--font-royal);">Quick Demo Switch:</div>
          <div style="display: flex; gap: 0.4rem;">
            <button class="btn btn-sm btn-outline" style="flex: 1; font-size: 0.65rem; padding: 0.3rem;" onclick="window.authService.switchDemoUser('admin')">Admin</button>
            <button class="btn btn-sm btn-secondary" style="flex: 1; font-size: 0.65rem; padding: 0.3rem;" onclick="window.authService.switchDemoUser('customer')">Customer</button>
          </div>
        </div>
      `;
    }
  }
}

window.authService = new AuthService();
