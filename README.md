# ROYAL GOLD & DIAMONDS 💎👑
### Premium Luxury Jewellery E-Commerce Web Application
**College Software Project Demonstration Edition**

---

## 🏛️ Executive Overview
**ROYAL GOLD & DIAMONDS** is a high-end luxury fine jewellery e-commerce platform built specifically for college project examinations, software engineering evaluations, and commercial demonstrations. 

Designed with an opulent **Obsidian Onyx, Champagne Gold, and Ivory** aesthetic, it features authentic Indian jewellery specifications: **100% BIS 916 & 750 Hallmarked Gold**, **IGI/GIA Certified Solitaire Diamonds**, transparent pricing (Bullion Value + Making Charges + 3% Indian Jewellery GST), live bullion rates ticker, and a complete administrative suite with role-based access control.

---

## ✨ Key Features & Modules

### 1. 👑 Sovereign Storefront & UX
- **Live Gold & Bullion Ticker**: Real-time display for 22K Gold, 24K Gold, and Silver rates across the top banner.
- **Majestic Hero Slider**: Showcasing Bridal Heirlooms, Certified Solitaires, and Antique Temple Jewellery with smooth animations.
- **Micro-Interactions**: Gold light reflections (shimmer hover effect), animated cart/wishlist counters, floating alerts, and skeleton loaders.
- **100% Mobile Responsive**: Dedicated mobile drawer navigation, responsive bottom bar, and fluid typography.

### 2. 💎 Comprehensive Jewellery Catalogue (`shop.html`)
- **Real-Time Search**: Instant search filtering by jewellery name, purity, stone, or style.
- **Multi-Faceted Sidebar Filters**:
  - Category selector with dynamic item counts.
  - Metal & Purity (22K Yellow/Antique Gold, 18K White Gold, 18K Rose Gold, Platinum 950).
  - Price Range Slider (₹10,000 to ₹6,00,000+).
  - "In Stock Only" toggle.
- **Dynamic Sorting**: Popularity, Price (Low to High), Price (High to Low), Customer Rating, and Newest Arrivals.
- **Active Filter Chips**: 1-click removal of individual active filters or "Clear All".

### 3. 🔍 Product Details & Customizer (`product-details.html`)
- **Interactive HD Gallery**: High-resolution thumbnail switcher and zoom lens effect.
- **BIS Hallmark Verification**: Purity tags, Gross Weight (g), Net Gold Weight (g), Diamond Carats/Clarity.
- **Transparent Price Breakdown**: Net Bullion Value, Artisan Making Charges, and Statutory 3% GST.
- **Interactive Sizing & Size Guide**: Indian standard ring and bangle size selector with a modal sizing chart.
- **Pincode Delivery Estimator**: Real-time courier transit calculator (FedEx / BlueDart Insured).
- **Verified Buyer Reviews**: Customer reviews list and interactive submission form.

### 4. 🛍️ Bag & Statutory Tax Calculations (`cart.html`)
- **Quantity Manipulation**: Increment, decrement, and item removal.
- **Indian Jewellery 3% GST**: Automatic statutory tax calculation.
- **Royal Privilege Promo Engine**:
  - `ROYAL10`: 10% Royal Privilege Discount.
  - `BRIDAL2026`: ₹15,000 Wedding Trousseau Discount.
  - `DIAMOND5K`: ₹5,000 Solitaire Discount.
- **Free Insured Transit**: Complimentary armoured white-glove courier calculation.

### 5. 💳 Checkout & Simulated Payment Gateway (`checkout.html`)
- **Clearly Labelled Sandbox / Test Mode**: Explicitly marked as a test simulation for college demonstration.
- **Payment Modes Supported**:
  - Razorpay / Stripe Sandbox Simulator
  - Test Credit/Debit Card (`4242 4242 4242 4242`)
  - Simulated UPI / QR Code (`royalgold@okhdfcbank`)
  - Showroom Pay / High-Value Cash on Delivery
- **Simulated 3D-Secure Bank OTP**: Interactive OTP modal (mock code `999999`) with simulated bank authorization.
- **Order Placement**: Automatically generates a unique Order ID (`RGD-2026-XXXXX`) and consignment tracking number.

### 6. 📜 Orders & Official GST Tax Invoices (`orders.html`)
- **Order Tracking Timeline**: Real-time status badges (`Placed`, `Confirmed`, `Shipped`, `Delivered`).
- **GST-Compliant Tax Invoice**: Official printable invoice featuring:
  - GSTIN (`27AABCR9812K1Z9`) and HSN Code `7113`.
  - BIS Hallmark Registration (`HM-IND-916-ROYAL`).
  - Itemized weight, bullion rate, making charges, CGST (1.5%), and SGST (1.5%).
  - 1-Click Print & PDF generation (`window.print()`).

### 7. 🛡️ Role-Based Admin Dashboard (`admin.html`)
- **RBAC Security Gate**: Access restricted to users with `role: "admin"` (with a convenient 1-click evaluation access button for examiners).
- **Executive KPI Cards**: Total Settled Revenue (INR), Total Orders, Total Products in Store, Assaying Purity.
- **Product Management (CRUD)**:
  - Add New Jewellery modal with gross weight, net weight, price in INR, and image upload.
  - Edit existing jewellery specifications and pricing.
  - Delete jewellery pieces with confirmation safety modal.
- **Firebase Cloud Storage**: File upload for product photos with Base64 Data URL local fallback.
- **Order Management**: Change live status (`Placed` -> `Confirmed` -> `Shipped` -> `Delivered` -> `Cancelled`).
- **1-Click Cloud Firestore Seeder**: Populate your Firebase Cloud database with 12+ luxury items in one click.

---

## 🗂️ Project Directory Structure

```
royal-gold-and-diamonds/
├── index.html                   # Majestic Home page with hero carousel & curated collections
├── shop.html                    # Jewellery catalogue with search, sidebar filters & sorting
├── categories.html              # Collections & Bridal Studio showcase
├── product-details.html         # HD gallery, BIS specs, transparent price breakup & reviews
├── cart.html                    # Shopping bag, coupon engine, 3% Indian GST calculation
├── wishlist.html                # Saved royal favourites with move-to-bag workflow
├── checkout.html                # Multi-step checkout with simulated payment gateway & mock OTP
├── orders.html                  # Order history ledger & printable GST tax invoices
├── auth.html                    # Luxury login & registration with demo evaluator credentials
├── contact.html                 # VIP Bridal Suite booking & Flagship Showroom locator
├── admin.html                   # Admin dashboard (KPIs, Product CRUD, Order fulfillment)
│
├── css/
│   ├── main.css                 # Base resets, variables, typography, flex/grid utilities
│   ├── theme.css                # Obsidian & Gold palette, shimmer animations, badges
│   ├── components.css           # Header, navbar, cards, forms, modals, toasts, tables
│   └── responsive.css           # Mobile drawer, bottom bar, tablet & phone layouts
│
├── js/
│   ├── sample-data.js           # 12+ BIS Hallmarked Indian jewellery items with HD assets
│   ├── firebase-config.js       # Firebase configuration with seamless local fallback
│   ├── ui.js                    # Toast alert notifications, INR formatters, modals
│   ├── db.js                    # Database service (Cloud Firestore + local storage fallback)
│   ├── auth.js                  # Authentication service (Firebase Auth + demo accounts)
│   ├── storage.js               # Firebase Cloud Storage with data URL fallback
│   ├── state.js                 # Cart & Wishlist persistence, coupon codes, live bullion rates
│   │
│   └── pages/                   # Modular Page Controllers
│       ├── home.js              # Hero carousel, featured items, newsletter
│       ├── shop.js              # Real-time search, filters, price slider, sorting
│       ├── product-details.js   # Image switcher, customizer, pincode checker
│       ├── cart.js              # Quantity manipulation, coupon discount, GST
│       ├── wishlist.js          # Saved items grid, move-all-to-bag
│       ├── checkout.js          # Shipping form validation, test gateway, order creation
│       ├── orders.js            # Orders ledger, printable GST tax invoice generator
│       ├── auth.js              # Sign in/up form validation, password toggle
│       ├── contact.js           # VIP consultation booking, bespoke inquiry
│       └── admin.js             # Analytics KPIs, Product CRUD modals, status updater
│
├── firestore.rules              # Cloud Firestore security rules with Role-Based Access Control
└── README.md                    # Project documentation & run guide
```

---

## 🚀 How to Run the Website Locally

### Method 1: VS Code Live Server (Recommended)
1. Open the `royal-gold-and-diamonds` folder in **Visual Studio Code**.
2. Right-click `index.html` and click **"Open with Live Server"**.
3. The project will open at `http://127.0.0.1:5500/index.html`.

### Method 2: Python Local HTTP Server
Run the following command in PowerShell / Terminal:
```bash
cd royal-gold-and-diamonds
python -m http.server 8000
```
Open your browser and navigate to: `http://localhost:8000`.

### Method 3: Direct Browser Launch
You can double-click `index.html` directly to open it in Chrome, Edge, Safari, or Firefox.

---

## 🔑 Demo Evaluator Credentials
For quick evaluation without manual signup:

| Account Type | Email Address | Password | Role / Access |
|---|---|---|---|
| **Administrator** | `admin@royalgold.com` | `RoyalAdmin@2026` | Full Admin Dashboard (`admin.html`), Product CRUD, Order Status |
| **Customer** | `customer@royalgold.com` | `Customer@2026` | Customer account, Order History, Wishlist |

*(Note: On both `auth.html` and `admin.html`, 1-Click quick buttons are provided to instantly log in as Admin or Customer).*

---

## ☁️ Firebase Cloud Setup (Optional)
The application works **100% out-of-the-box in Smart Demo / Local Storage Mode** even without Firebase keys. 

To link your own live Firebase project:
1. Visit [Firebase Console](https://console.firebase.google.com/) and create a project named `royal-gold-and-diamonds`.
2. Enable **Authentication** (Email/Password & Google).
3. Enable **Cloud Firestore** in test or production mode (copy the rules from `firestore.rules`).
4. Enable **Firebase Cloud Storage**.
5. Copy your Firebase Web App configuration keys into `js/firebase-config.js`:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef"
};
```
6. Open `admin.html` and click **"Seed Sample Products to Firestore"** to automatically populate your cloud database with all 12+ jewellery creations!

---

## 🌐 GitHub & Deployment Instructions

### Repository Link
- GitHub Account: `https://github.com/ksVishal123`
- Repository: `https://github.com/ksVishal123/royal-gold-and-diamonds`

### Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit: Complete Royal Gold & Diamonds luxury jewellery e-commerce platform"
git branch -M main
git remote add origin https://github.com/ksVishal123/royal-gold-and-diamonds.git
git push -u origin main
```

### Enable Free GitHub Pages Live Demo:
1. Go to your repository on GitHub: `https://github.com/ksVishal123/royal-gold-and-diamonds`.
2. Click **Settings** > **Pages** (under Code and automation).
3. Under **Branch**, select `main` and folder `/ (root)`. Click **Save**.
4. In 1–2 minutes, your live website will be accessible at:
   `https://ksvishal123.github.io/royal-gold-and-diamonds/`
