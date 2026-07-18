/**
 * Firebase Configuration
 * File konfigurasi untuk Firebase Admin SDK
 * 
 * PERHATIAN: 
 * - JANGAN mengisi credential di file ini
 * - Gunakan environment variable untuk menyimpan credential
 * - Developer backend yang akan mengisi konfigurasi
 */

const admin = require('firebase-admin');

// Firebase configuration from environment variables
const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  clientId: process.env.FIREBASE_CLIENT_ID,
  authUri: process.env.FIREBASE_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
  tokenUri: process.env.FIREBASE_TOKEN_URI || 'https://oauth2.googleapis.com/token',
};

// Initialize Firebase Admin SDK
let auth;
let db;

try {
  if (firebaseConfig.projectId && firebaseConfig.privateKey && firebaseConfig.clientEmail) {
    admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig)
    });
    auth = admin.auth();
    db = admin.firestore();
  } else {
    console.warn('Firebase Admin SDK not initialized. Missing required environment variables.');
  }
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error.message);
}

module.exports = {
  firebaseConfig,
  auth,
  db,
  admin
};