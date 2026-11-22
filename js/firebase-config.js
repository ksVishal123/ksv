/* ==========================================================================
   ROYAL GOLD & DIAMONDS - Firebase Configuration & Dual-Mode Engine
   Seamlessly operates in LIVE Firebase mode or PERSISTENT Demo Mode
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. FIREBASE CONFIGURATION
// Replace the placeholder values below with your real Firebase Project keys
// from the Firebase Console (https://console.firebase.google.com):
// --------------------------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyDEMO-KEY-ROYAL-GOLD-2026-JEWEL",
  authDomain: "royal-gold-and-diamonds.firebaseapp.com",
  projectId: "royal-gold-and-diamonds",
  storageBucket: "royal-gold-and-diamonds.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Check if credentials are real or placeholder demo
const isDemoConfig = () => {
  return (
    !firebaseConfig.apiKey ||
    firebaseConfig.apiKey.includes("DEMO-KEY") ||
    firebaseConfig.apiKey === "YOUR_API_KEY_HERE"
  );
};

let firebaseApp = null;
let firebaseAuth = null;
let firestoreDb = null;
let firebaseStorage = null;

// Initialize Firebase if CDN is loaded and keys are not dummy
try {
  if (typeof firebase !== 'undefined') {
    if (!isDemoConfig()) {
      firebaseApp = firebase.initializeApp(firebaseConfig);
      firebaseAuth = firebase.auth();
      firestoreDb = firebase.firestore();
      firebaseStorage = firebase.storage();
      window.FIREBASE_MODE = "LIVE";
      console.log("%c[ROYAL GOLD] Connected to live Firebase Services", "color: #D4AF37; font-weight: bold;");
    } else {
      window.FIREBASE_MODE = "DEMO";
      console.log("%c[ROYAL GOLD] Running in Smart Demo / Local Storage Mode (Ready for evaluation & offline presentation)", "color: #F3E5AB; font-weight: bold;");
    }
  } else {
    window.FIREBASE_MODE = "DEMO";
  }
} catch (error) {
  console.warn("[ROYAL GOLD] Firebase initialization notice:", error.message);
  window.FIREBASE_MODE = "DEMO";
}

window.firebaseConfig = firebaseConfig;
window.firebaseAuth = firebaseAuth;
window.firestoreDb = firestoreDb;
window.firebaseStorage = firebaseStorage;
