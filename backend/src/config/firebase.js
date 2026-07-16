/**
 * Firebase Configuration
 * File konfigurasi untuk Firebase Admin SDK
 * 
 * PERHATIAN: 
 * - JANGAN mengisi credential di file ini
 * - Gunakan environment variable untuk menyimpan credential
 * - Developer backend yang akan mengisi konfigurasi
 */

// TODO:
// Import Firebase Admin SDK

// TODO:
// Inisialisasi Firebase Admin dengan credential.

// TODO:
// Setup Firebase Admin SDK dengan environment variable.

// TODO:
// Konfigurasi Firebase Authentication.

// Konstanta Firebase (placeholder)
const firebaseConfig = {
  // TODO: Isi dengan environment variable
  // projectId: process.env.FIREBASE_PROJECT_ID,
  // privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
  // privateKey: process.env.FIREBASE_PRIVATE_KEY,
  // clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // clientId: process.env.FIREBASE_CLIENT_ID,
  // authUri: 'https://accounts.google.com/o/oauth2/auth',
  // tokenUri: 'https://oauth2.googleapis.com/token',
};

// TODO:
// Inisialisasi Firebase Admin App
// admin.initializeApp({
//   credential: admin.credential.cert(firebaseConfig)
// });

// TODO:
// Export Firebase Auth & Admin
// const auth = admin.auth();
// const db = admin.firestore();

// Placeholder exports
const auth = null;
const db = null;
const admin = null;

module.exports = {
  firebaseConfig,
  auth,
  db,
  admin
};