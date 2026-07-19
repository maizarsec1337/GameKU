# Dokumentasi Frontend Authentication - GameKU

## Status Implementasi Frontend

Frontend sudah memiliki struktur autentikasi yang lengkap dan siap untuk backend JWT Authentication.

## Struktur Frontend yang Sudah Siap

### 1. frontend/src/services/authAPI.js
**Status:** ✅ Sudah diupdate
**Keterangan:** API service untuk semua endpoint autentikasi
**Endpoint yang tersedia:**
- `register(data)` - POST /api/auth/register
- `login(data)` - POST /api/auth/login
- `googleLogin()` - GET /api/auth/google (redirect)
- `googleCallback()` - GET /api/auth/google/callback
- `logout()` - POST /api/auth/logout
- `me()` - GET /api/auth/me
- `forgotPassword(data)` - POST /api/auth/forgot-password
- `resetPassword(data)` - POST /api/auth/reset-password
- `registerReseller(data)` - POST /api/auth/reseller
- `getResellerStatus()` - GET /api/auth/reseller/status

### 2. frontend/src/context/AuthContext.jsx
**Status:** ✅ Sudah dibuat
**Keterangan:** Context untuk manajemen state autentikasi
**Fitur yang tersedia:**
- State management untuk user, loading, error
- Method login, register, googleLogin, logout, checkAuth
- Menggunakan pure backend JWT (tidak menggunakan Firebase Client SDK lagi)

### 3. frontend/src/components/RouteProtection.jsx
**Status:** ✅ Sudah dibuat
**Keterangan:** Komponen untuk proteksi route
**Komponen yang tersedia:**
- `ProtectedRoute` - Route yang memerlukan autentikasi
- `GuestRoute` - Route untuk guest (login, register)
- `AdminRoute` - Route khusus admin
- `ResellerRoute` - Route khusus reseller
- `UserRoute` - Route khusus user biasa

### 4. frontend/src/pages/Login.jsx
**Status:** ✅ Sudah diupdate
**Fitur:**
- Form login dengan email/password
- Validasi form
- Error handling
- Google OAuth redirect button (menggunakan backend redirect)
- Loading state

### 5. frontend/src/pages/Register.jsx
**Status:** ✅ Sudah diupdate
**Fitur:**
- Form register lengkap
- Google OAuth redirect button (menggunakan backend redirect)
- Validasi form
- Error handling
- Loading state

### 6. frontend/src/pages/Profile.jsx
**Status:** ✅ Sudah diupdate
**Fitur:**
- Menampilkan data user
- Reseller registration form
- Logout functionality
- Loading state

### 7. frontend/src/main.jsx
**Status:** ✅ Sudah diupdate
**Keterangan:** Sudah menambahkan AuthProvider wrapper

## Alur Autentikasi (Diperbarui)

### Login dengan Google Flow

1. **Frontend:** User klik tombol "Masuk dengan Google"
2. **Frontend:** Redirect ke `/api/auth/google` (backend)
3. **Backend:** Redirect ke Google OAuth (atau buat mock user jika DEV_MODE)
4. **Google:** Tampilkan halaman login
5. **Google:** Redirect ke `/api/auth/google/callback` dengan kode otorisasi
6. **Backend:** 
   - Exchange kode ke token
   - Verifikasi token Google
   - Cari/buat user di MongoDB
   - Generate JWT token
   - Redirect ke frontend dengan token di URL parameter
7. **Frontend:** Login.jsx menangkap token dari URL
8. **Frontend:** Simpan token ke localStorage
9. **Frontend:** Panggil `/api/auth/me` untuk dapat data user
10. **Frontend:** Update state user di context
11. **Frontend:** Redirect ke dashboard sesuai role

## Perubahan yang Dilakukan

### ✅ Frontend (authContext.jsx)
- Menghapus Firebase Client SDK (`onAuthStateChanged`)
- Menggunakan backend `/api/auth/me` untuk cek status login
- `googleLogin()` redirect ke backend `/api/auth/google`

### ✅ Frontend (Login.jsx, Register.jsx)
- Menghapus Firebase popup (`signInWithPopup`)
- Menggunakan redirect ke backend Google OAuth
- Menangkap token dari URL parameter setelah callback

### ✅ Frontend (package.json)
- Menghapus dependency `firebase` (tidak diperlukan lagi)

### ✅ Backend (authController.js)
- Menghapus Firebase Admin SDK dependency untuk register/login
- Menggunakan MongoDB + bcrypt untuk autentikasi email/password
- Google OAuth menggunakan flow redirect (bukan Firebase ID token)
- Dev mode support untuk Google OAuth mock

### ✅ Backend (.env)
- Menambahkan placeholder untuk Google OAuth credentials
- `DEV_MODE=true` untuk development mode

### ✅ Backend (User.js)
- Menambahkan field `password` untuk bcrypt hash

## Konfigurasi yang Diperlukan

### Backend (.env) - untuk Production
```
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
```

### Frontend (.env)
```
VITE_API_URL=/api
```

## Yang Tidak Perlu Diubah Lagi

Semua file di atas sudah siap untuk digunakan. Frontend tidak perlu menambah atau mengubah:
- Tidak perlu Firebase SDK
- Tidak perlu Firebase API Key
- Tidak perlu credential
- Tidak perlu token management langsung

Semua autentikasi akan dihandle melalui backend API.