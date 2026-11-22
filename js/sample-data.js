/* ==========================================================================
   ROYAL GOLD & DIAMONDS - Sample Realistic Indian Jewellery Products
   All items BIS 916 Hallmarked or IGI/GIA Certified with INR Pricing
   ========================================================================== */

const SAMPLE_PRODUCTS = [
  {
    id: "rgd-101",
    name: "Kundan Royal Bridal Choker Necklace Set",
    category: "necklaces",
    categoryName: "Necklaces",
    metal: "22K Yellow Gold",
    purity: "22K",
    hallmark: "BIS 916 Hallmarked",
    grossWeight: 54.20,
    netGoldWeight: 46.80,
    diamondCarat: 0,
    diamondClarity: "Natural Uncut Polki & Kundan Stones",
    price: 368000,
    mrp: 410000,
    makingCharges: 32000,
    stock: 4,
    inStock: true,
    rating: 4.9,
    reviewCount: 42,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    description: "An opulent royal heirloom choker necklace crafted in 22 Karat certified yellow gold. Featuring hand-set uncut Polki stones, vibrant emerald bead drops, and intricate Meenakari enameling on the reverse side. Comes with matching jhumka earrings.",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800",
      "https://images.unsplash.com/photo-1611591475152-4c09a33a4042?q=80&w=800",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800"
    ],
    sizes: ["Adjustable Dori (14 - 18 inches)"],
    specifications: {
      "Purity": "22 Karat (91.6% Pure Gold)",
      "BIS Hallmark License": "HM-IND-916-ROYAL",
      "Gross Weight": "54.20 grams",
      "Net Gold Weight": "46.80 grams",
      "Stone Details": "Natural Polki Kundan & Emerald Drops",
      "Certification": "BIS Hallmarked & GJEPC Certified",
      "Occasion": "Bridal, Royal Wedding, Heritage Gala"
    }
  },
  {
    id: "rgd-102",
    name: "Imperial Solitaire Diamond Engagement Ring",
    category: "rings",
    categoryName: "Rings",
    metal: "18K White Gold",
    purity: "18K",
    hallmark: "BIS 750 & IGI Certified",
    grossWeight: 4.60,
    netGoldWeight: 4.15,
    diamondCarat: 1.05,
    diamondClarity: "VVS1 / Color E (Colorless)",
    price: 185000,
    mrp: 205000,
    makingCharges: 14000,
    stock: 9,
    inStock: true,
    rating: 5.0,
    reviewCount: 67,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: true,
    description: "A breathtaking 1.05 Carat round brilliant cut diamond prong-set in lustrous 18 Karat white gold. Accented with a hidden pavé halo underneath that captures light from every celestial angle.",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800"
    ],
    sizes: ["10", "12", "14 (Standard)", "16", "18"],
    specifications: {
      "Purity": "18 Karat (75.0% Pure Gold)",
      "Main Solitaire": "1.05 Carats",
      "Cut / Polish / Symmetry": "Triple Excellent (3EX)",
      "Clarity / Color": "VVS1 / E",
      "Certification": "IGI Antwerp Certified (Laser Inscribed)",
      "Gross Weight": "4.60 grams"
    }
  },
  {
    id: "rgd-103",
    name: "Traditional Lakshmi Temple Kada Bangle (Pair)",
    category: "bangles",
    categoryName: "Bangles & Bracelets",
    metal: "22K Antique Gold",
    purity: "22K",
    hallmark: "BIS 916 Hallmarked",
    grossWeight: 48.50,
    netGoldWeight: 47.90,
    diamondCarat: 0,
    diamondClarity: "Ruby & Potta Stone Accents",
    price: 335000,
    mrp: 360000,
    makingCharges: 28000,
    stock: 5,
    inStock: true,
    rating: 4.8,
    reviewCount: 29,
    isFeatured: true,
    isBestseller: false,
    isNewArrival: false,
    description: "Grand south Indian temple jewellery kadas featuring Goddess Lakshmi motifs hand-embossed by master artisans in antique finished 22K gold, embellished with pigeon-blood rubies.",
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800",
      "https://images.unsplash.com/photo-1611591475152-4c09a33a4042?q=80&w=800"
    ],
    sizes: ["2.4 (2-4/16 in)", "2.6 (2-6/16 in)", "2.8 (2-8/16 in)"],
    specifications: {
      "Purity": "22 Karat Antique Finish",
      "Gold Weight": "47.90 grams net",
      "Closure Type": "Screw Lock Openable Kada",
      "Certification": "BIS 916 Govt Approved Hallmarking"
    }
  },
  {
    id: "rgd-104",
    name: "Royal Peacock Emerald & Diamond Chandbali Earrings",
    category: "earrings",
    categoryName: "Earrings",
    metal: "18K Rose Gold",
    purity: "18K",
    hallmark: "BIS 750 & SGL Certified",
    grossWeight: 18.20,
    netGoldWeight: 14.80,
    diamondCarat: 1.80,
    diamondClarity: "VS-SI / G-H Color",
    price: 158000,
    mrp: 175000,
    makingCharges: 16500,
    stock: 7,
    inStock: true,
    rating: 4.9,
    reviewCount: 34,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: true,
    description: "Magnificent crescent moon chandbalis featuring dancing royal peacocks, natural Zambian emerald drops, and 188 sparkling round brilliant diamonds in 18 Karat rose gold.",
    images: [
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800"
    ],
    sizes: ["One Size"],
    specifications: {
      "Purity": "18 Karat Rose Gold (750)",
      "Diamond Weight": "1.80 cts (188 Diamonds)",
      "Emerald Weight": "4.20 cts Zambian Origin",
      "Earring Style": "Chandbali Danglers with Push-Back Lock"
    }
  },
  {
    id: "rgd-105",
    name: "Nawabi Heritage Floral Diamond Mangalsutra",
    category: "mangalsutras",
    categoryName: "Mangalsutras",
    metal: "18K Yellow Gold",
    purity: "18K",
    hallmark: "BIS 750 Certified",
    grossWeight: 11.40,
    netGoldWeight: 9.80,
    diamondCarat: 0.65,
    diamondClarity: "VVS / F-G Color",
    price: 94000,
    mrp: 105000,
    makingCharges: 8500,
    stock: 12,
    inStock: true,
    rating: 4.8,
    reviewCount: 51,
    isFeatured: false,
    isBestseller: true,
    isNewArrival: false,
    description: "A sacred union of heritage and contemporary luxury. Dual-strand auspicious black onyx beads gracefully supporting an 18 Karat gold floral pendant encrusted with brilliant cut diamonds.",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800"
    ],
    sizes: ["16 inches", "18 inches", "22 inches"],
    specifications: {
      "Purity": "18K Hallmarked Yellow Gold",
      "Chain Length": "18 inches with safety loop",
      "Diamonds": "0.65 Carat Natural Solitaire Quality",
      "Beads": "Traditional High-Luster Black Onyx Beads"
    }
  },
  {
    id: "rgd-106",
    name: "Maharaja Men's Lion Crest Diamond Signet Ring",
    category: "mens",
    categoryName: "Men's Collection",
    metal: "22K Solid Gold",
    purity: "22K",
    hallmark: "BIS 916 Certified",
    grossWeight: 16.50,
    netGoldWeight: 15.80,
    diamondCarat: 0.35,
    diamondClarity: "VS1 / G Color",
    price: 128000,
    mrp: 142000,
    makingCharges: 11000,
    stock: 6,
    inStock: true,
    rating: 4.9,
    reviewCount: 23,
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    description: "Symbolizing royalty and power, this heavy signet ring features a sculpted lion emblem with natural brilliant diamond eyes and high-polish 22K yellow gold shank.",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800"
    ],
    sizes: ["18", "20", "22 (Men's Standard)", "24"],
    specifications: {
      "Purity": "22 Karat (91.6% Pure Solid Gold)",
      "Net Weight": "15.80 grams",
      "Face Dimension": "18mm x 16mm Cushion",
      "Hallmark": "BIS 916 Stamped & Laser Marked"
    }
  },
  {
    id: "rgd-107",
    name: "Celestial Princess Cut Diamond Tennis Bracelet",
    category: "bangles",
    categoryName: "Bangles & Bracelets",
    metal: "18K White Gold",
    purity: "18K",
    hallmark: "BIS 750 & IGI Certified",
    grossWeight: 14.80,
    netGoldWeight: 11.20,
    diamondCarat: 3.50,
    diamondClarity: "VVS-VS / E-F Color",
    price: 295000,
    mrp: 325000,
    makingCharges: 22000,
    stock: 4,
    inStock: true,
    rating: 5.0,
    reviewCount: 19,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    description: "Fifty-two channel-set princess cut diamonds forming an unbroken ribbon of pure radiance in 18K white gold. Equipped with a dual safety clasp for lifelong security.",
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800"
    ],
    sizes: ["7.0 inches", "7.5 inches"],
    specifications: {
      "Purity": "18K White Gold (750)",
      "Total Diamond Weight": "3.50 Carats",
      "No. of Diamonds": "52 Princess Cut Diamonds",
      "Certification": "IGI Diamond Certificate Included"
    }
  },
  {
    id: "rgd-108",
    name: "Padmavati Royal Kasu Mala Long Necklace",
    category: "necklaces",
    categoryName: "Necklaces",
    metal: "22K Yellow Gold",
    purity: "22K",
    hallmark: "BIS 916 Hallmarked",
    grossWeight: 68.40,
    netGoldWeight: 68.00,
    diamondCarat: 0,
    diamondClarity: "Pure 22K Gold Kasu Coins with Ruby Eye",
    price: 498000,
    mrp: 540000,
    makingCharges: 39000,
    stock: 3,
    inStock: true,
    rating: 4.9,
    reviewCount: 31,
    isFeatured: false,
    isBestseller: false,
    isNewArrival: true,
    description: "A heritage South Indian bridal classic. Sixty-four embossed Goddess Lakshmi gold coins intricately linked along a floral spine with south sea pearl tassels.",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800",
      "https://images.unsplash.com/photo-1611591475152-4c09a33a4042?q=80&w=800"
    ],
    sizes: ["26 inches Long Haram"],
    specifications: {
      "Purity": "22 Karat 916 Hallmark",
      "Gold Weight": "68.00 grams",
      "Coin Count": "64 Lakshmi Kasu",
      "Certification": "Govt Assayed Hallmarking"
    }
  },
  {
    id: "rgd-109",
    name: "Radiant Solitaire Diamond Stud Earrings (1.5 Ct TW)",
    category: "earrings",
    categoryName: "Earrings",
    metal: "18K Yellow Gold",
    purity: "18K",
    hallmark: "BIS 750 & GIA Certified",
    grossWeight: 3.20,
    netGoldWeight: 2.90,
    diamondCarat: 1.50,
    diamondClarity: "VVS2 / F Color",
    price: 198000,
    mrp: 220000,
    makingCharges: 11000,
    stock: 10,
    inStock: true,
    rating: 4.9,
    reviewCount: 78,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    description: "Classic four-prong martini solitaire studs featuring 0.75ct each round brilliant cut diamonds (total 1.50 carats). Screw-back mechanism for maximum comfort and security.",
    images: [
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800"
    ],
    sizes: ["Standard"],
    specifications: {
      "Purity": "18K Yellow Gold",
      "Total Weight": "1.50 Carats (2 Stones)",
      "Cut Grade": "Excellent",
      "Certification": "GIA Certified Laser Inscribed"
    }
  },
  {
    id: "rgd-110",
    name: "Royal Rajputana Polki & Pearl Matha Patti",
    category: "bridal",
    categoryName: "Bridal Studio",
    metal: "22K Antique Gold",
    purity: "22K",
    hallmark: "BIS 916 Hallmarked",
    grossWeight: 38.60,
    netGoldWeight: 32.40,
    diamondCarat: 0,
    diamondClarity: "Syndicate Polki & Basra Seed Pearls",
    price: 265000,
    mrp: 290000,
    makingCharges: 25000,
    stock: 2,
    inStock: true,
    rating: 5.0,
    reviewCount: 16,
    isFeatured: false,
    isBestseller: false,
    isNewArrival: true,
    description: "A queen's crowning jewel. Elaborate multi-tiered forehead ornament set with syndicate uncut diamonds and strung with layers of miniature seed pearls.",
    images: [
      "https://images.unsplash.com/photo-1611591475152-4c09a33a4042?q=80&w=800",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800"
    ],
    sizes: ["Free Size (Adjustable Hooks)"],
    specifications: {
      "Purity": "22K Antique Finished Gold",
      "Stone Setting": "Jadau Kundan Handcraft",
      "Pearls": "Basra Type Natural Seed Pearls"
    }
  },
  {
    id: "rgd-111",
    name: "Eternity Diamond Band in Platinum 950",
    category: "rings",
    categoryName: "Rings",
    metal: "Platinum 950",
    purity: "95% Platinum",
    hallmark: "Pt 950 & IGI Certified",
    grossWeight: 5.80,
    netGoldWeight: 0,
    diamondCarat: 0.95,
    diamondClarity: "VVS / D-E Color",
    price: 115000,
    mrp: 130000,
    makingCharges: 12000,
    stock: 8,
    inStock: true,
    rating: 4.8,
    reviewCount: 39,
    isFeatured: false,
    isBestseller: true,
    isNewArrival: false,
    description: "A continuous loop of perfection. Round brilliant diamonds encircle pure 95% platinum, symbolizing an everlasting love and devotion.",
    images: [
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800"
    ],
    sizes: ["12", "14", "16", "18"],
    specifications: {
      "Metal": "Platinum 950 Hallmarked",
      "Total Carats": "0.95 Cts",
      "Diamond Color": "D-E (Highest White Color Grade)",
      "Style": "Shared Prong Full Eternity"
    }
  },
  {
    id: "rgd-112",
    name: "Classic Solid Gold Sovereign Curb Chain (24-inch)",
    category: "mens",
    categoryName: "Men's Collection",
    metal: "22K Solid Yellow Gold",
    purity: "22K",
    hallmark: "BIS 916 Hallmarked",
    grossWeight: 32.50,
    netGoldWeight: 32.50,
    diamondCarat: 0,
    diamondClarity: "No Stones - 100% Solid Gold",
    price: 242000,
    mrp: 260000,
    makingCharges: 19500,
    stock: 5,
    inStock: true,
    rating: 4.9,
    reviewCount: 44,
    isFeatured: false,
    isBestseller: true,
    isNewArrival: false,
    description: "Command respect with this bold, heavyweight diamond-cut curb chain. Meticulously machine-linked and hand-finished in pure 22K yellow gold with heavy lobster clasp.",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800"
    ],
    sizes: ["22 inches", "24 inches (Standard)", "26 inches"],
    specifications: {
      "Purity": "22 Karat 916",
      "Weight": "32.50 grams Solid",
      "Chain Width": "4.5 mm",
      "Clasp": "Heavy-Duty Lobster Clasp with Hallmark Tag"
    }
  }
];

const SAMPLE_CATEGORIES = [
  { id: "necklaces", name: "Necklaces & Chokers", icon: "fa-gem", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800", count: 28 },
  { id: "rings", name: "Rings & Solitaires", icon: "fa-ring", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800", count: 45 },
  { id: "earrings", name: "Earrings & Jhumkas", icon: "fa-star", image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800", count: 34 },
  { id: "bangles", name: "Bangles & Bracelets", icon: "fa-circle-notch", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800", count: 22 },
  { id: "bridal", name: "Bridal Studio", icon: "fa-crown", image: "https://images.unsplash.com/photo-1611591475152-4c09a33a4042?q=80&w=800", count: 18 },
  { id: "mangalsutras", name: "Mangalsutras", icon: "fa-heart", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800", count: 16 },
  { id: "mens", name: "Men's Regal Line", icon: "fa-user-tie", image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800", count: 14 }
];

const LIVE_GOLD_RATES = {
  gold22k: 6850, // INR per gram
  gold24k: 7470, // INR per gram
  silver10g: 890, // INR per 10 grams
  change22k: "+₹35 (0.5%)",
  lastUpdated: "Today, 10:00 AM IST"
};

// Export to window for vanilla JS accessibility
window.SAMPLE_PRODUCTS = SAMPLE_PRODUCTS;
window.SAMPLE_CATEGORIES = SAMPLE_CATEGORIES;
window.LIVE_GOLD_RATES = LIVE_GOLD_RATES;
