# Panduan Implementasi Firebase Authentication - Backend

## Status Implementasi

Semua file di folder `backend/src/` berisi placeholder/TODO yang perlu diisi oleh developer backend.

## Struktur File yang Perlu Diimplementasikan

### 1. backend/src/config/firebase.js
**Status:** Placeholder - perlu diisi
**Keterangan:** Konfigurasi inisialisasi Firebase Admin SDK
**Yang perlu dikerjakan:**
- Import Firebase Admin SDK
- Inisialisasi Firebase Admin dengan credential dari environment variable
- Export auth, db, admin objects

### 2. backend/src/auth/firebaseAuth.js
**Status:** Placeholder - perlu diimplementasikan
**Keterangan:** Service inti untuk Firebase Authentication
**Yang perlu dikerjakan:**
- Implementasi Firebase Authentication untuk email/password
- Verifikasi Firebase ID Token
- Membuat session menggunakan HttpOnly Cookie
- Sinkronisasi User ke Database
- Refresh Session
- Logout

### 3. backend/src/auth/firebaseProvider.js
**Status:** Placeholder - perlu diimplementasikan
**Keterangan:** Service untuk OAuth Provider (Google, dll)
**Yang perlu dikerjakan:**
- Google OAuth Flow (initiate & callback)
- Provider OAuth lainnya
- Forgot Password via Firebase
- Email Verification

### 4. backend/src/services/authService.js
**Status:** Placeholder - perlu diimplementasikan
**Keterangan:** Service layer untuk business logic auth
**Yang perlu dikerjakan:**
- Implementasi semua fungsi register, login, logout
- Verifikasi token
- Kelola session
- Handle reseller registration

### 5. backend/src/middleware/authMiddleware.js
**Status:** Placeholder - perlu diimplementasikan
**Keterangan:** Middleware untuk route protection
**Yang perlu dikerjakan:**
- Verifikasi Firebase ID Token
- Extract token dari header/cookie
- Attach user info ke request object
- Refresh token middleware

### 6. backend/src/middleware/roleMiddleware.js
**Status:** Placeholder - perlu diimplementasikan
**Keterangan:** Middleware untuk role-based access
**Yang perlu dikerjakan:**
- Middleware Admin (role: admin, super_admin)
- Middleware Seller (role: reseller)
- Middleware User (role: user)
- Middleware Super Admin (role: super_admin)
- Middleware Role dinamis

### 7. backend/src/utils/tokenHelper.js
**Status:** Placeholder - perlu diimplementasikan
**Keterangan:** Utility untuk manipulasi token
**Yang perlu dikerjakan:**
- Verifikasi token
- Generate JWT token
- Generate refresh token
- Set/clear cookie
- Decode token

### 8. backend/src/controllers/authController.js
**Status:** Placeholder - perlu diimplementasikan
**Keterangan:** Controller untuk endpoint auth
**Yang perlu dikerjakan:**
- Import service yang sudah diimplementasikan
- Hubungkan route ke service
- Handle error dengan baik

### 9. backend/src/routes/authRoutes.js
**Status:** Placeholder - perlu diimplementasikan
**Keterangan:** Route definition untuk auth API
**Yang perlu dikerjakan:**
- Import middleware authMiddleware
- Terapkan middleware pada route yang memerlukan proteksi

## Environment Variables yang Diperlukan

 developer backend perlu menyiapkan:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_PRIVATE_KEY_ID`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_CLIENT_ID`
- `FIREBASE_DATABASE_URL` (jika menggunakan Firestore)

## Endpoint API yang Harus Diimplementasikan

| Method | Endpoint | Keterangan | Middleware |
|--------|----------|------------|------------|
| POST | /api/auth/register | Register user | - |
| POST | /api/auth/login | Login user | - |
| GET | /api/auth/google | Google OAuth redirect | - |
| GET | /api/auth/google/callback | Google OAuth callback | - |
| POST | /api/auth/logout | Logout user | authMiddleware |
| GET | /api/auth/me | Get current user | authMiddleware |
| POST | /api/auth/forgot-password | Send reset email | - |
| POST | /api/auth/reset-password | Reset password | - |
| POST | /api/auth/reseller | Register reseller | authMiddleware |
| GET | /api/auth/reseller/status | Get reseller status | authMiddleware |

## Catatan Penting

1. JANGAN menyimpan credential di kode
2. Gunakan environment variable untuk semua konfigurasi Firebase
3. Firebase SDK hanya di backend, bukan di frontend
4. Frontend hanya memanggil endpoint backend untuk autentikasi