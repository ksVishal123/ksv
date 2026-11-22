/* ==========================================================================
   ROYAL GOLD & DIAMONDS - Firebase Storage & Asset Management Service
   ========================================================================== */

class StorageService {
  constructor() {}

  isStorageActive() {
    return window.FIREBASE_MODE === 'LIVE' && window.firebaseStorage !== null;
  }

  // Upload Product Image (handles real Firebase Cloud Storage with local base64 fallback)
  async uploadProductImage(file, onProgress = null) {
    if (!file) {
      throw new Error("No file provided for upload.");
    }

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      throw new Error("Invalid format. Please upload JPG, PNG or WEBP jewellery photos.");
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Image size exceeds 5MB limit. Please upload an optimized image.");
    }

    // 1. Try Firebase Cloud Storage if active
    if (this.isStorageActive()) {
      try {
        const cleanName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const storageRef = window.firebaseStorage.ref(`products/${cleanName}`);
        const uploadTask = storageRef.put(file);

        return new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              if (onProgress) onProgress(progress);
            },
            (error) => {
              console.warn("Firebase Storage upload error, falling back to data URL:", error);
              // Fallback to Base64
              this.convertToBase64(file).then(resolve).catch(reject);
            },
            async () => {
              const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
              resolve(downloadURL);
            }
          );
        });
      } catch (err) {
        console.warn("Storage exception, using data URL fallback:", err);
      }
    }

    // 2. Base64 Local Data URL fallback (Zero cloud dependency)
    return this.convertToBase64(file, onProgress);
  }

  convertToBase64(file, onProgress = null) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      if (onProgress) onProgress(50);
      reader.onload = () => {
        if (onProgress) onProgress(100);
        resolve(reader.result);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }
}

window.storageService = new StorageService();
